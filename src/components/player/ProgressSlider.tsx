import { audioElementAtom } from "@/atoms/audio";
import { progressAtom } from "@/atoms/player";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { Slider } from "../ui/slider";
import { formatTime } from "@/lib/time";

export function ProgressSlider() {
  const audioElement = useAtomValue(audioElementAtom);
  const [progress, setProgress] = useAtom(progressAtom);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(audioElement.currentTime);
    }, 200);

    return () => {
      clearInterval(progressInterval);
    };
  }, [audioElement, setProgress]);

  return (
    <div className="space-y-2">
      <Slider
        className="shadow-lg"
        min={0}
        max={audioElement.duration}
        value={[progress]}
        onValueChange={([val]) => (audioElement.currentTime = val)}
      />
      <div className="flex justify-between text-gray-400">
        <span>{formatTime(progress)}</span>
        <span>
          {audioElement.duration ? formatTime(audioElement.duration) : "-:--"}
        </span>
      </div>
    </div>
  );
}
