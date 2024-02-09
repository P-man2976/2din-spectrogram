import { atom, getDefaultStore } from "jotai";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import { currentSongAtom, isPlayingAtom } from "./player";

const store = getDefaultStore();

export const audioElementAtom = atom(
  (get) => new Audio(get(currentSongAtom)?.url)
);

store.sub(audioElementAtom, () => {
  store.get(audioElementAtom).crossOrigin = "anonymous";
});

export const audioContextAtom = atom(new AudioContext());

export const audioMotionAnalyzerAtom = atom(
  (get) =>
    new AudioMotionAnalyzer(undefined, {
      useCanvas: false,
      audioCtx: get(audioContextAtom),
      // source: get(audioElementAtom),
      minDecibels: -70,
      maxDecibels: -20,
      minFreq: 32,
      maxFreq: 22000,
      mode: 8, // Half octave bands
      ansiBands: true,
      weightingFilter: "A",
    })
);

store.sub(audioElementAtom, () => {
  const audioElement = store.get(audioElementAtom);
  const audioMotionAnalyzer = store.get(audioMotionAnalyzerAtom);
  const isPlaying = store.get(isPlayingAtom);

  audioMotionAnalyzer.disconnectInput();
  audioMotionAnalyzer.connectInput(audioElement);

  if (isPlaying) {
    audioElement.play();
  } else {
    audioElement.pause();
  }
});
