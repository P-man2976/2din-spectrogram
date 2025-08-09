import { audioElementAtom } from "@/atoms/audio";
import Hls from "hls.js";
import { useAtomValue } from "jotai";
import { usePlayer } from "./player";
import { hlsAtom } from "@/atoms/hls";
import { useCallback } from "react";

export const useHLS = () => {
  const hls = useAtomValue(hlsAtom);
  const audioElement = useAtomValue(audioElementAtom);
  const { play } = usePlayer();

  const onAttached = useCallback(() => {
    console.log("[HLS] media attached");
    play();
  }, [play]);

  const onDetached = useCallback(() => {
    console.log("[HLS] media detached");
  }, []);

  const load = useCallback(
    (source: string) => {
      console.log("[HLS] loading source:", source);

      hls.on(Hls.Events.MEDIA_ATTACHED, onAttached);
      hls.on(Hls.Events.MEDIA_DETACHED, onDetached);

      hls.loadSource(source);
      hls.attachMedia(audioElement);
    },
    [hls, audioElement, onAttached, onDetached]
  );

  const unLoad = useCallback(() => {
    hls.stopLoad();
    hls.detachMedia();
    hls.off(Hls.Events.MEDIA_ATTACHED, onAttached);
    hls.off(Hls.Events.MEDIA_DETACHED, onDetached);
  }, [hls, onAttached, onDetached]);

  return { load, unLoad };
};
