import { ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { FileEntries } from "./FileEntries";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import mime from "mime/lite";
import { explorerSelectedFilesAtom } from "@/atoms/explorer";
import { useMutation } from "@tanstack/react-query";
import {
  audioDir,
  basename,
  desktopDir,
  documentDir,
  downloadDir,
  pictureDir,
  videoDir,
} from "@tauri-apps/api/path";
import { Address } from "./Address";
import { useAddress } from "@/hooks/explorer";
import { Button } from "../ui/button";
import { FileEntry, readDir } from "@tauri-apps/api/fs";
import { audioElementAtom } from "@/atoms/audio";
import { queueAtom } from "@/atoms/player";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { fetchFromUrl } from "music-metadata-browser";
import {
  LuDownload,
  LuFileText,
  LuFilm,
  LuImage,
  LuLoader2,
  LuMonitor,
  LuMusic,
} from "react-icons/lu";

const libraryDir = [
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

export function ExplorerDialog({ children }: { children: ReactNode }) {
  const audioElement = useAtomValue(audioElementAtom);
  const [selected, setSelected] = useAtom(explorerSelectedFilesAtom);
  const setQueue = useSetAtom(queueAtom);
  const { path, push } = useAddress();

  const asyncFileLoad = async (file: FileEntry) => {
    if (file.children) {
      for (const child of file.children) {
        await asyncFileLoad(child);
      }
    }

    if (!audioElement.canPlayType(mime.getType(file.path) ?? "")) return;

    const url = convertFileSrc(file.path);

    const {
      common: { title, track, album, artists, genre, date, year, picture },
      format: { duration }
    } = await fetchFromUrl(url);

    console.log(await fetchFromUrl(url));

    const song = {
      id: crypto.randomUUID(),
      path,
      url,
      filename: await basename(file.path),
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
      for (const file of files) {
        if (file.dir) {
          for (const child of await readDir(file.path, { recursive: true })) {
            await asyncFileLoad(child);
          }
        } else {
          await asyncFileLoad(file);
        }
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
            {libraryDir.map(({ icon, name, path }) => (
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
            <FileEntries path={path} />
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
