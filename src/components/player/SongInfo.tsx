import { cn, toFullWidth } from "@/lib/utils";
import { Song } from "@/types/player";
import { useMemo, useRef } from "react";

export function SongInfo({ song }: { song: Song | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const albumRef = useRef<HTMLSpanElement>(null);
  const artistRef = useRef<HTMLSpanElement>(null);

  const songTitle = useMemo(
    () => toFullWidth(song?.title ?? song?.filename) ?? "再生停止中",
    [song]
  );
  const songAlbum = useMemo(() => toFullWidth(song?.album), [song]);
  const songArtist = useMemo(
    () => toFullWidth(song?.artists?.join(",")),
    [song]
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-1 grow-0 w-full overflow-hidden"
    >
      <h2
        ref={titleRef}
        className={cn("whitespace-nowrap w-fit text-xl", {
          "animate-scroll":
            (titleRef.current?.clientWidth ?? 0) >
            (containerRef.current?.clientWidth ?? 0),
        })}
        style={{ animationDuration: `${songTitle.length}s` }}
      >
        {songTitle}
      </h2>
      <span
        ref={albumRef}
        className={cn(
          "text-sm text-gray-400 whitespace-nowrap w-fit",
          {
            "animate-scroll":
              (albumRef.current?.clientWidth ?? 0) >
              (containerRef.current?.clientWidth ?? 0),
          }
        )}
        style={{ animationDuration: `${songAlbum?.length ?? 0}s` }}
      >
        {songAlbum}
      </span>
      <span
        ref={artistRef}
        className={cn("text-sm text-gray-400", {
          "animate-scroll":
            (artistRef.current?.clientWidth ?? 0) >
            (containerRef.current?.clientWidth ?? 0),
        })}
      >
        {songArtist}
      </span>
    </div>
  );
}
