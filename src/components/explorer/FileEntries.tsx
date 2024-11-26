import { audioElementAtom } from "@/atoms/audio";
import { useAddress } from "@/hooks/explorer";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FileEntry, readDir } from "@tauri-apps/api/fs";
import { useAtom, useAtomValue } from "jotai";
import { Folder } from "lucide-react";
import mime from "mime/lite";
import { useCallback, useMemo } from "react";
import { Checkbox } from "../ui/checkbox";
import { explorerSelectedFilesAtom } from "@/atoms/explorer";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";

export function FileEntries({ path }: { path: string }) {
  const { data } = useQuery({
    queryKey: ["explorer", path],
    queryFn: async () => await readDir(path, { recursive: false }),
  });

  const { data: rootdir } = useQuery({
    queryKey: ["explorer", "root"],
    queryFn: async () => await readDir("**", { recursive: false }),
  });

  console.log(rootdir);

  return (
    <div className="flex flex-col overflow-y-auto">
      {data?.map((file) => (
        <Entry key={file.path} {...file} />
      ))}
    </div>
  );
}

function Entry({ path, name, children }: FileEntry) {
  const audioElement = useAtomValue(audioElementAtom);
  const [selected, setSelected] = useAtom(explorerSelectedFilesAtom);
  const { push } = useAddress();

  const canPlay = useMemo(
    () => audioElement.canPlayType(mime.getType(path) ?? ""),
    [audioElement, path]
  );
  const isSelected = selected.some((file) => path.includes(file.path));
  const isDirectory = !!children;
  const isDisabled = !canPlay && !isDirectory;

  const toggleSelected = useCallback(() => {
    !isDisabled &&
      setSelected((prev) =>
        isSelected
          ? prev.filter((file) => file.path !== path)
          : [...prev, { path, dir: isDirectory }]
      );
  }, [setSelected, path, isDisabled, isSelected, isDirectory]);

  return (
    <ContextMenu>
      <ContextMenuTrigger disabled={!isDirectory}>
        <div
          className={cn(
            "flex gap-4 py-4 px-4 items-center rounded-md hover:bg-gray-500/30 hover:cursor-pointer",
            { "opacity-50 hover:cursor-not-allowed": isDisabled }
          )}
          onClick={() => (isDirectory ? push(path) : toggleSelected())}
        >
          <Checkbox
            disabled={isDisabled}
            checked={isSelected}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelected();
            }}
          />
          {isDirectory && <Folder className="text-gray-300" />}
          {name}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuCheckboxItem>Bookmark folder</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
