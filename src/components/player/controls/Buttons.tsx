import { audioElementAtom } from "@/atoms/audio";
import { currentSrcAtom, isPlayingAtom } from "@/atoms/player";
import { Button } from "@/components/ui/button";
import { usePlayer } from "@/hooks/player";
import { useAtomValue } from "jotai";
import { LuFastForward, LuMinus, LuPlus } from "react-icons/lu";
import { TbPlayerPause, TbPlayerPlay, TbPlayerStop } from "react-icons/tb";

export function ControlButtons() {
  const audioElement = useAtomValue(audioElementAtom);
  const currentSrc = useAtomValue(currentSrcAtom);
  const isPlaying = useAtomValue(isPlayingAtom);
  const { prev, pause, play, next } = usePlayer();

  return (
    <div className="flex gap-4 ml-auto shrink-0">
      <Button
        disabled={currentSrc === "aux"}
        size="icon-lg"
        variant="ghost"
        className=" p-2 text-white text-2xl"
        onClick={prev}
      >
        {currentSrc === "file" ? (
          <LuFastForward className="rotate-180" />
        ) : (
          <LuMinus />
        )}
      </Button>
      <Button
        disabled={currentSrc === "aux"}
        size="icon-lg"
        variant="ghost"
        className=" p-2 text-white text-4xl"
        onClick={async () =>
          isPlaying
            ? pause()
            : await play(
                currentSrc === "radio" ? audioElement.duration - 10 : undefined
              )
        }
      >
        {isPlaying ? (
          currentSrc === "radio" ? (
            <TbPlayerStop />
          ) : (
            <TbPlayerPause />
          )
        ) : (
          <TbPlayerPlay />
        )}
      </Button>
      <Button
        disabled={currentSrc === "aux"}
        size="icon-lg"
        variant="ghost"
        className=" p-2 text-white text-2xl"
        onClick={next}
      >
        {currentSrc === "file" ? <LuFastForward /> : <LuPlus />}
      </Button>
    </div>
  );
}
