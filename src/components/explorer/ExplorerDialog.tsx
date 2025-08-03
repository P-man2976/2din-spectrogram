import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { FileEntries } from "./FileEntries";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import mime from "mime/lite";
import { explorerSelectedFilesAtom } from "@/atoms/explorer";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  audioDir,
  basename,
  desktopDir,
  documentDir,
  downloadDir,
  homeDir,
  join,
  pictureDir,
  videoDir,
} from "@tauri-apps/api/path";
import { Address } from "./Address";
import { useAddress } from "@/hooks/explorer";
import { Button } from "../ui/button";
import { readDir } from "@tauri-apps/plugin-fs";
import { audioElementAtom } from "@/atoms/audio";
import { queueAtom } from "@/atoms/player";
import { convertFileSrc } from "@tauri-apps/api/core";
import { fetchFromUrl } from "music-metadata-browser";
import {
  LuDownload,
  LuFileText,
  LuFilm,
  LuHome,
  LuImage,
  LuLoader2,
  LuMonitor,
  LuMusic,
} from "react-icons/lu";
import { SelectedFile } from "@/types/explorer";

export function ExplorerDialog({ children }: { children: ReactNode }) {
  const audioElement = useAtomValue(audioElementAtom);
  const [selected, setSelected] = useAtom(explorerSelectedFilesAtom);
  const setQueue = useSetAtom(queueAtom);
  const { path, push } = useAddress();

  const { data: libraryDir } = useQuery({
    queryKey: ["explorer", "library"],
    queryFn: async () => {
      return [
        {
          icon: <LuHome />,
          name: "ホーム",
          path: await homeDir(),
        },
        {
          icon: <LuMonitor />,
          name: "デスクトップ",
          path: await desktopDir(),
        },
        {
          icon: <LuDownload />,
          name: "ダウンロード",
          path: await downloadDir(),
        },
        {
          icon: <LuFileText />,
          name: "ドキュメント",
          path: await documentDir(),
        },
        {
          icon: <LuImage />,
          name: "ピクチャ",
          path: await pictureDir(),
        },
        {
          icon: <LuFilm />,
          name: "ビデオ",
          path: await videoDir(),
        },
        {
          icon: <LuMusic />,
          name: "ミュージック",
          path: await audioDir(),
        },
      ];
    },
  });

  const loadFiles = async (files: SelectedFile[]): Promise<string[]> => {
    return (
      await Promise.all(
        files.map(async (file) => {
          if (file.isDirectory) {
            return await loadFiles(
              await Promise.all(
                (
                  await readDir(file.path)
                ).map(async (child) => ({
                  ...child,
                  path: await join(file.path, child.name),
                }))
              )
            );
          } else if (file.isFile) {
            return file.path ?? [];
          }
          return [];
        })
      )
    ).flat();
  };

  const queueFiles = async (path: string) => {
    if (!audioElement.canPlayType(mime.getType(path) ?? "")) return;

    const url = convertFileSrc(path);

    const {
      common: { title, track, album, artists, genre, date, year, picture },
      format: { duration },
    } = await fetchFromUrl(url);

    const song = {
      id: crypto.randomUUID(),
      path,
      url,
      filename: await basename(path),
      title,
      track,
      album,
      artists,
      genre,
      date,
      year,
      duration,
      artwork: picture?.[0]
        ? URL.createObjectURL(
            new Blob([picture[0].data], {
              type: picture[0].format,
            })
          )
        : undefined,
    };

    setQueue((prev) => [...prev, song]);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (files: SelectedFile[]) => {
      const loadedFiles = await loadFiles(files);

      console.log(`[Explorer] Loaded ${loadedFiles.length} files`);

      for (const file of loadedFiles) {
        await queueFiles(file);
      }

      setSelected([]);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col h-[calc(100dvh_-_8rem)] max-w-screen-md">
        <Address />
        <div className="flex gap-1 overflow-auto h-full">
          <div className="basis-1/4 w-full">
            {libraryDir?.map(({ icon, name, path }) => (
              <div
                key={path}
                className="flex px-4 py-2 items-center gap-2 rounded-md hover:bg-gray-500/30 hover:cursor-pointer"
                onClick={() => push(path)}
              >
                {icon}
                {name}
              </div>
            ))}
          </div>
          <div className="self-stretch border border-gray-700" />
          <div className="w-full basis-3/4 overflow-auto">
            <FileEntries path={path ?? "/"} />
          </div>
        </div>
        <Button
          disabled={isPending || !selected.length}
          className="w-full"
          onClick={() => mutate(selected)}
        >
          {isPending ? (
            <LuLoader2 className="animate-spin" />
          ) : (
            `選択したファイルを読み込む`
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
