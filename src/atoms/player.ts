import { formatTime } from "@/lib/time";
import { Song, Source } from "@/types/player";
import { atom } from "jotai";

export const isPlayingAtom = atom(false);

export const currentSrcAtom = atom<Source>("file");

export const currentSongAtom = atom<Song | null>(null);
export const queueAtom = atom<Song[]>([]);
export const historyAtom = atom<Song[]>([]);

export const progressAtom = atom(0);
export const progressStrAtom = atom((get) => formatTime(get(progressAtom)));

export const volumeAtom = atom(100);
