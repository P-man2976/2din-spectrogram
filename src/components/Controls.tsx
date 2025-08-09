import { useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { audioElementAtom } from "@/atoms/audio";
import {
  currentSongAtom,
  currentSrcAtom,
  progressStrAtom,
} from "@/atoms/player";
import { currentRadioAtom } from "@/atoms/radio";
import { displayStringAtom } from "@/atoms/display";
import { useMediaSession, usePlayer } from "../hooks/player";
import { QueueSheet } from "./QueueSheet";
import { MenuSheet } from "./MenuSheet";
import { SidebarButton } from "./player/SidebarButton";
import { ProgressSlider } from "./player/ProgressSlider";
import { SongInfo } from "./player/SongInfo";
import { Titlebar } from "./titlebar/Titlebar";
import { CoverImage } from "./player/controls/CoverImage";
import { ControlButtons } from "./player/controls/Buttons";
import { toFullWidth } from "@/lib/utils";
import { useRadikoM3u8Url } from "@/services/radiko";
import { useHLS } from "@/hooks/hls";

export function Controls() {
  const audioElement = useAtomValue(audioElementAtom);
  const { next } = usePlayer();
  const currentSrc = useAtomValue(currentSrcAtom);
  const currentSong = useAtomValue(currentSongAtom);
  const currentRadio = useAtomValue(currentRadioAtom);
  const progressStr = useAtomValue(progressStrAtom);
  const setDisplayString = useSetAtom(displayStringAtom);

  const { load, unLoad } = useHLS();

  const { mutate } = useRadikoM3u8Url();

  const title = useMemo(() => {
    switch (currentSrc) {
      case "file":
        return currentSong?.title ?? "タイトル不明";
      case "radio":
        return currentRadio?.name ?? "局名不明";
      case "aux":
        return "外部入力";
      case "off":
        return "再生停止中";
      default:
        return "";
    }
  }, [currentSrc, currentSong, currentRadio]);

  const artist = useMemo(() => {
    switch (currentSrc) {
      case "file":
        return currentSong?.artists?.join(",");
      case "radio":
        return currentRadio?.frequency
          ? currentRadio.type === "AM"
            ? `${currentRadio.frequency}kHz`
            : `${currentRadio.frequency.toFixed(1)}MHz`
          : "周波数不明";
      case "aux":
        return "";
      case "off":
        return "";
      default:
        return "";
    }
  }, [currentSrc, currentSong, currentRadio]);

  const album = useMemo(() => {
    switch (currentSrc) {
      case "file":
        return currentSong?.album;
      case "radio":
        if (currentRadio?.source === "radiko") {
          return "Radiko";
        } else if (currentRadio?.source === "radiru") {
          return "NHKラジオ らじる★らじる";
        } else {
          return "";
        }
      case "aux":
        return "";
      case "off":
        return "";
      default:
        return "";
    }
  }, [currentSrc, currentSong, currentRadio]);

  const artwork = useMemo(() => {
    switch (currentSrc) {
      case "file":
        return currentSong?.artwork;
      case "radio":
        return currentRadio?.logo?.[0];
      default:
        return undefined;
    }
  }, [currentSrc, currentSong, currentRadio]);

  const imageSrc =
    currentSrc === "file" ? currentSong?.artwork : currentRadio?.logo?.[0];

  useMediaSession({ title, artist, album, artwork });

  useEffect(() => {
    let displayStr = "";

    switch (currentSrc) {
      case "file":
        displayStr = `CD-${
          currentSong?.track.no?.toString().padStart(2, "0") ?? 13
        }${progressStr.padStart(7, " ")}`;
        break;

      case "radio":
        displayStr =
          currentRadio?.type === "AM"
            ? `A1- ${
                currentRadio.frequency?.toString().padStart(4, " ") ?? "----"
              } kHz`
            : `F1- ${currentRadio?.frequency?.toFixed(1) ?? "--.-"} MHz`;
        break;

      case "aux":
        displayStr = "AUX Mode";
        break;

      case "off":
        displayStr = "ALL OFF";
        break;
      default:
        break;
    }

    setDisplayString(displayStr);
  }, [currentSrc, progressStr, currentSong, currentRadio, setDisplayString]);

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

  useEffect(() => {
    if (currentSrc === "radio" && currentRadio) {
      if (currentRadio.source === "radiko") {
        // m3u8 URLの期限切れを避けるために、毎回取得する
        mutate(currentRadio.id, {
          onSuccess: (m3u8) => {
            console.log("[HLS] Loaded new m3u8 URL:", m3u8);
            load(m3u8);
          },
        });
      } else if (currentRadio.source === "radiru") {
        load(currentRadio.url);
      }
    }
    return () => {
      unLoad();
    };
  }, [currentSrc, currentRadio, mutate, load, unLoad]);

  useEffect(() => {
    audioElement.crossOrigin = "anonymous";

    if (currentSrc === "file" && currentSong) {
      audioElement.src = currentSong.url;
      audioElement.load();
    }
  }, [audioElement, currentSrc, currentSong]);

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
          <CoverImage src={imageSrc} />
          <SongInfo
            title={toFullWidth(title)}
            artist={toFullWidth(artist)}
            album={toFullWidth(album)}
          />
          <ControlButtons />
        </div>
      </div>
    </div>
  );
}
