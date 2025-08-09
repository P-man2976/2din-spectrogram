import { useAtom, useAtomValue } from "jotai";
import { audioMotionAnalyzerAtom } from "../../atoms/audio";
import { Slider } from "../ui/slider";
import { SliderProps } from "@radix-ui/react-slider";
import { currentSrcAtom, volumeAtom } from "@/atoms/player";
import { useEffect } from "react";

export function VolumeSlider(props: SliderProps) {
  const currentSrc = useAtomValue(currentSrcAtom);
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);
  const [volume, setVolume] = useAtom(volumeAtom);

  useEffect(() => {
    audioMotionAnalyzer.volume = currentSrc === "aux" ? 0 : volume / 100;
  }, [currentSrc, audioMotionAnalyzer, volume]);

  return (
    <Slider
      disabled={currentSrc === "aux"}
      min={0}
      max={100}
      value={[volume]}
      onValueChange={([vol]) => setVolume(vol)}
      {...props}
    />
  );
}
