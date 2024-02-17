import { atom } from "jotai";
import { audioDir } from "@tauri-apps/api/path";

const audioPath = await audioDir();

export const explorerPathAtom = atom((get) =>
  get(explorerAddressHistoryAtom).at(-1)
);

export const explorerAddressHistoryAtom = atom([audioPath]);
export const explorerAddressQueueAtom = atom<string[]>([]);

export const explorerSelectedFilesAtom = atom<SelectedFile[]>([]);

export const explorerBookmarkFoldersAtom = atom<string[]>([])