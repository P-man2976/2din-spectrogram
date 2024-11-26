import { useRef } from "react";
import { cn } from "@/lib/utils";

export function SongInfo({
  title,
  artist,
  album
}: {
  title?: string;
  artist?: string;
  album?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const albumRef = useRef<HTMLSpanElement>(null);
  const artistRef = useRef<HTMLSpanElement>(null);

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
        style={{ animationDuration: `${title?.length}s` }}
      >
        {title}
      </h2>
      <span
        ref={albumRef}
        className={cn("text-sm text-gray-400 whitespace-nowrap w-fit", {
          "animate-scroll":
            (albumRef.current?.clientWidth ?? 0) >
            (containerRef.current?.clientWidth ?? 0),
        })}
        style={{ animationDuration: `${album?.length ?? 0}s` }}
      >
        {album}
      </span>
      <span
        ref={artistRef}
        className={cn("text-sm text-gray-400", {
          "animate-scroll":
            (artistRef.current?.clientWidth ?? 0) >
            (containerRef.current?.clientWidth ?? 0),
        })}
      >
        {artist}
      </span>
    </div>
  );
}
