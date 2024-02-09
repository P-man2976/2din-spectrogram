import { useAtom, useAtomValue } from "jotai";
import { audioMotionAnalyzerAtom } from "../../atoms/audio";
import { Slider } from "../ui/slider";
import { SliderProps } from "@radix-ui/react-slider";
import { volumeAtom } from "@/atoms/player";
import { useEffect } from "react";

export function VolumeSlider(props: SliderProps) {
  const audioMotionAnalyzer = useAtomValue(audioMotionAnalyzerAtom);
  const [volume, setVolume] = useAtom(volumeAtom);

  useEffect(() => {
    audioMotionAnalyzer.volume = volume / 100;
  }, [audioMotionAnalyzer, volume]);

  return (
    <Slider
      min={0}
      max={100}
      value={[volume]}
      onValueChange={([vol]) => setVolume(vol)}
      {...props}
    />
  );
}
