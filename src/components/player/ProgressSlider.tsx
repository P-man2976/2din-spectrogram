import { audioElementAtom } from "@/atoms/audio";
import { currentSrcAtom, progressAtom } from "@/atoms/player";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { Slider } from "../ui/slider";
import { formatTime } from "@/lib/time";

export function ProgressSlider() {
  const currentSrc = useAtomValue(currentSrcAtom);
  const audioElement = useAtomValue(audioElementAtom);
  const [progress, setProgress] = useAtom(progressAtom);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (currentSrc === "file") {
        setProgress(audioElement.currentTime);
      }
    }, 200);

    return () => {
      clearInterval(progressInterval);
    };
  }, [currentSrc, audioElement, setProgress]);

  return (
    <div className="space-y-2">
      {currentSrc === "file" ? (
        <>
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
              {audioElement.duration
                ? formatTime(audioElement.duration)
                : "-:--"}
            </span>
          </div>
        </>
      ) : (
        <div className="w-full relative mb-4">
          <div className="rounded-full w-full h-2 bg-gray-500 shadow-lg relative [mask-image:linear-gradient(to_right,_black,_rgba(0,0,0,60%),_transparent,_transparent,_rgba(0,0,0,60%),_black)]"/>
          <span className="absolute left-1/2 top-1/2 text-lg -translate-x-1/2 -translate-y-1/2">ＬＩＶＥ</span>
        </div>
      )}
    </div>
  );
}
