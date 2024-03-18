import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { audioElementAtom, audioMotionAnalyzerAtom } from "../atoms/audio";
import {
  queueAtom,
  historyAtom,
  currentSongAtom,
  isPlayingAtom,
  currentSrcAtom,
  progressAtom,
} from "@/atoms/player";

export const usePlayer = () => {
  const [currentSrc, setCurrentSrc] = useAtom(currentSrcAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [currentSong, setCurrentSong] = useAtom(currentSongAtom);
  const [queue, setQueue] = useAtom(queueAtom);
  const [history, setHistory] = useAtom(historyAtom);
  const audioElement = useAtomValue(audioElementAtom);
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);

  const play = useCallback(
    async (pos?: number) => {
      if (pos) audioElement.currentTime = pos;
      await audioElement.play();
      audioMotionAnalyzer.start();
      setIsPlaying(true);
    },
    [audioMotionAnalyzer, audioElement, setIsPlaying]
  );

  const pause = useCallback(() => {
    audioElement.pause();
    audioMotionAnalyzer.stop();
    setIsPlaying(false);
  }, [audioMotionAnalyzer, audioElement, setIsPlaying]);

  const stop = useCallback(() => {
    audioElement.pause();
    setIsPlaying(false);
    setCurrentSrc("off");
  }, [audioElement, setIsPlaying, setCurrentSrc]);

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

  const skipTo = useCallback(
    (targetId: string) => {
      const targetIndex = queue.findIndex(({ id }) => id === targetId);

      if (targetIndex === -1) throw Error("Target song not found");
      const [target, ...newQueue] = queue.slice(targetIndex);

      setHistory((prev) => (currentSong ? [...prev, currentSong] : prev));
      setCurrentSong(target);
      setQueue(newQueue);
    },
    [currentSong, queue, setHistory, setCurrentSong, setQueue]
  );

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

export const useMediaSession = ({
  title,
  artist,
  album,
  artwork,
}: {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
}) => {
  const progress = useAtomValue(progressAtom);
  const audioElement = useAtomValue(audioElementAtom);
  const isPlaying = useAtomValue(isPlayingAtom);

  const { play, pause, next, prev } = usePlayer();

  useEffect(() => {
    if (!isNaN(audioElement.duration) && audioElement.duration !== Infinity)
      navigator.mediaSession.setPositionState({
        duration: audioElement.duration,
        playbackRate: 1,
        position: progress,
      });
  }, [audioElement, progress]);

  useEffect(() => {
    navigator.mediaSession.setActionHandler("play", async () => {
      await play();
      // navigator.mediaSession.playbackState = "playing";
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      pause();
      // navigator.mediaSession.playbackState = "paused";
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
    navigator.mediaSession.setActionHandler("previoustrack", () => prev());

    return () => {
      navigator.mediaSession.playbackState = "none";
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [audioElement, play, pause, next, prev]);

  useEffect(() => {
    console.log(`ispla: ${isPlaying}`, navigator.mediaSession.playbackState);
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  useEffect(() => {
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork: artwork
        ? [
            {
              src: artwork,
            },
          ]
        : undefined,
    });
  }, [title, artist, album, artwork]);
};
