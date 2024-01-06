import { atom } from "jotai";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import { atomWithRefresh } from "../lib/atomWithRefresh";

export const audioFileAtom = atom<File | null>(null);

export const audioContextAtom = atom(new AudioContext());
export const audioBufferSourceAtom = atomWithRefresh(
  (get) => new AudioBufferSourceNode(get(audioContextAtom))
);
export const audioMotionAnalyzerAtom = atom(
  (get) =>
    new AudioMotionAnalyzer(undefined, {
      useCanvas: false,
      audioCtx: get(audioContextAtom),
      source: get(audioBufferSourceAtom),
      minDecibels: -70,
      maxDecibels: -20,
      minFreq: 32,
      maxFreq: 22000,
      mode: 8, // Half octave bands
      ansiBands: true,
      weightingFilter: 'A',
    })
);
