import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { appWindow } from "@tauri-apps/api/window";
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
} from "react-icons/vsc";
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { TitlebarButton } from "./Button";
import { SourceSheet } from "../SourceSheet";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { currentSongAtom } from "@/atoms/player";

export function Titlebar() {
  const currentSong = useAtomValue(currentSongAtom);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const unlisten = appWindow.onResized(async () => {
      setIsMaximized(await appWindow.isMaximized());
      setIsFullscreen(await appWindow.isFullscreen());
    });

    return () => {
      (async () => (await unlisten)())();
    };
  }, []);

  return (
    <div className="flex relative group flex-col justify-center">
      <div
        data-tauri-drag-region
        className="absolute inset-0 bg-gradient-to-b to-transparent from-gray-600/50 opacity-50 group-hover:opacity-100 transition-all duration-500"
      />
      <div className="flex w-full items-center">
        <span className="text-sm">{currentSong?.title} / {currentSong?.album} / {currentSong?.artists?.join(', ')}</span>
        <div className="z-10 flex ml-auto shrink-0 items-start">
          <TitlebarButton
            onClick={() => appWindow.setFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <LuMinimize /> : <LuMaximize />}
          </TitlebarButton>
          <TitlebarButton onClick={() => appWindow.minimize()}>
            <VscChromeMinimize />
          </TitlebarButton>
          <TitlebarButton onClick={() => appWindow.toggleMaximize()}>
            {isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
          </TitlebarButton>
          <TitlebarButton
            className="hover:bg-red-500"
            onClick={() => appWindow.close()}
          >
            <VscChromeClose />
          </TitlebarButton>
        </div>
      </div>
      <SourceSheet>
        <Button variant={null} className="z-10 w-full">
          <ChevronDown className="scale-x-150" />
        </Button>
      </SourceSheet>
    </div>
  );
}
