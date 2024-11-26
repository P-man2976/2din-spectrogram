import { atom } from "jotai";

export const currentRadioAtom = atom<Radio | null>(null);

export const favoriteRadioAtom = atom<Radio[]>([]);

export const customFrequencyAreaAtom = atom<
  { id: string; type: RadioType; freq: number }[]
>([]);

export const radioStationSizeAtom = atom<"sm" | "lg">("lg");
