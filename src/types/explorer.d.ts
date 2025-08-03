import { DirEntry } from "@tauri-apps/plugin-fs";

export type SelectedFile = DirEntry & { path: string };