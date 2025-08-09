import { atom } from "jotai";
import AudioMotionAnalyzer from "audiomotion-analyzer";

export const audioElementAtom = atom(new Audio());

export const audioMotionAnalyzerAtom = atom((get) =>
  new AudioMotionAnalyzer(undefined, {
    useCanvas: false,
    source: get(audioElementAtom),
    minDecibels: -70,
    maxDecibels: -20,
    minFreq: 32,
    maxFreq: 22000,
    mode: 8, // Half octave bands
    ansiBands: true,
    weightingFilter: "A",
    holdFrames: 10,
    peakFallSpeed: 0.005,
  })
);

export const mediaStreamAtom = atom<MediaStream | null>(null);