import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import { audioElementAtom, audioMotionAnalyzerAtom } from "../atoms/audio";
import { queueAtom, historyAtom, currentSongAtom, isPlayingAtom } from "@/atoms/player";

export const usePlayer = () => {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [currentSong, setCurrentSong] = useAtom(currentSongAtom);
  const [queue, setQueue] = useAtom(queueAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const audioElement = useAtomValue(audioElementAtom);
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);

  const play = useCallback(async () => {
    await audioElement.play();
    audioMotionAnalyzer.start();
    setIsPlaying(true);
  }, [audioMotionAnalyzer, audioElement, setIsPlaying]);

  const pause = useCallback(() => {
    audioElement.pause();
    audioMotionAnalyzer.stop();
    setIsPlaying(false);
  }, [audioMotionAnalyzer, audioElement, setIsPlaying]);

  const stop = useCallback(() => {
    audioElement.pause();
    setIsPlaying(false);
  }, [audioElement, setIsPlaying]);

  const next = useCallback(() => {
    const [nextSong, ...newQueue] = queue;
    if (currentSong) setHistory((prev) => [...prev, currentSong]);
    setCurrentSong(nextSong ?? null);

    if (!queue.length) return stop();

    setQueue(newQueue);
    console.log("advancing to next, ", nextSong);
  }, [queue, setQueue, setHistory, setCurrentSong, currentSong, stop]);

  const prev = useCallback(() => {
    setCurrentSong(history.at(-1) ?? null);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setQueue((prev) => (currentSong ? [currentSong, ...prev] : prev));
  }, [setCurrentSong, setHistory, setQueue, currentSong, history]);

  const skipTo = useCallback((targetId: string) => {
    const targetIndex = queue.findIndex(({ id }) => id === targetId);

    if (targetIndex === -1) throw Error("Target song not found");
    const [target, ...newQueue] = queue.slice(targetIndex);

    setHistory((prev) => currentSong ? [...prev, currentSong] : prev);
    setCurrentSong(target);
    setQueue(newQueue);
  }, [currentSong, queue, setHistory, setCurrentSong, setQueue]);

  return {
    isPlaying,
    play,
    pause,
    stop,
    next,
    prev,
    skipTo,
  };
};
