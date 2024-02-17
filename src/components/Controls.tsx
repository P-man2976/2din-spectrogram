import { usePlayer } from "../hooks/player";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronLeft, ChevronRight, FastForward, Music } from "lucide-react";
import { audioElementAtom } from "@/atoms/audio";
import { currentSongAtom, progressStrAtom } from "@/atoms/player";
import { displayStringAtom } from "@/atoms/display";
import { QueueSheet } from "./QueueSheet";
import { MenuSheet } from "./MenuSheet";
import { SidebarButton } from "./player/SidebarButton";
import { ProgressSlider } from "./player/ProgressSlider";
import { Titlebar } from "./titlebar/Titlebar";
import { SongInfo } from "./player/SongInfo";

export function Controls() {
  const audioElement = useAtomValue(audioElementAtom);
  const { isPlaying, prev, next, play, pause } = usePlayer();
  const currentSong = useAtomValue(currentSongAtom);
  const progressStr = useAtomValue(progressStrAtom);
  const setDisplayString = useSetAtom(displayStringAtom);

  useEffect(() => {
    setDisplayString(
      currentSong
        ? `CD-${
            currentSong?.track.no?.toString().padStart(2, "0") ?? 13
          }   ${progressStr}`
        : "ALL OFF"
    );
  }, [progressStr, currentSong, setDisplayString]);

  useEffect(() => {
    const onEnded = () => {
      console.log("ended");

      next();
    };

    audioElement.addEventListener("ended", onEnded);

    return () => {
      audioElement.removeEventListener("ended", onEnded);
    };
  }, [audioElement, next]);

  return (
    <div className="absolute inset-0 flex flex-col gap-2 w-full">
      {/* Header */}
      <Titlebar />
      {/* Sidebar */}
      <div className="h-full flex items-center justify-between">
        <MenuSheet>
          <SidebarButton side="left">
            <ChevronRight className="scale-y-150" />
          </SidebarButton>
        </MenuSheet>
        <QueueSheet>
          <SidebarButton side="right">
            <ChevronLeft className="scale-y-150" />
          </SidebarButton>
        </QueueSheet>
      </div>
      {/* Footer */}
      <div className="flex flex-col gap-4 px-12 pb-8 pt-16 bg-gradient-to-t from-gray-500/50 to-transparent">
        <ProgressSlider />
        <div className="flex gap-8 items-center">
          {currentSong?.artwork ? (
            <img
              className="h-20 grow-0 rounded-md shadow-lg shrink-0"
              src={currentSong.artwork}
            />
          ) : (
            <div className="size-20 shrink-0 rounded-md shadow-lg grid place-content-center bg-gray-500/50">
              <Music />
            </div>
          )}
          <SongInfo song={currentSong} />
          <div className="flex gap-4 ml-auto shrink-0">
            <Button
              size="icon-lg"
              variant="ghost"
              className=" p-2 text-white"
              onClick={prev}
            >
              <FastForward className="rotate-180" />
            </Button>
            <Button
              size="icon-lg"
              variant="ghost"
              className=" p-2 text-white"
              onClick={async () => (isPlaying ? pause() : await play())}
            >
              {isPlaying ? (
                <IconPlayerPause size={36} />
              ) : (
                <IconPlayerPlay size={36} />
              )}
            </Button>
            <Button
              size="icon-lg"
              variant="ghost"
              className=" p-2 text-white"
              onClick={next}
            >
              <FastForward />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
