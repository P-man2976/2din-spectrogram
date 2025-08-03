import { SelectedFile } from "@/types/explorer";
import { atom } from "jotai";

export const explorerPathAtom = atom((get) =>
  get(explorerAddressHistoryAtom).at(-1)
);

export const explorerAddressHistoryAtom = atom<string[]>([]);
export const explorerAddressQueueAtom = atom<string[]>([]);

export const explorerSelectedFilesAtom = atom<SelectedFile[]>([]);

export const explorerBookmarkFoldersAtom = atom<string[]>([]);
