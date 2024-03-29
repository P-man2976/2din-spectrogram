import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAtom } from "jotai";
import { queueAtom } from "@/atoms/player";
import { Song } from "@/types/player";
import { usePlayer } from "@/hooks/player";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { toFullWidth } from "@/lib/utils";

export function QueueSheet({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useAtom(queueAtom);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="max-w-md sm:min-w-96 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-xl">再生待ち</h3>
          <Reorder.Group
            as="div"
            className=""
            layoutScroll
            axis="y"
            values={queue}
            onReorder={(songs) => {
              console.log(songs);
              setQueue(songs);
            }}
          >
            {queue.map((song) => (
              <QueueSong key={song.id} song={song} />
            ))}
          </Reorder.Group>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function QueueSong({ song }: { song: Song }) {
  const { id, filename, title, album, artwork } = song;
  const controls = useDragControls();
  const { skipTo } = usePlayer();

  return (
    <Reorder.Item
      as="div"
      value={song}
      dragListener={false}
      dragControls={controls}
    >
      <div className="flex items-center gap-4 first:rounded-t-lg last:rounded-b-lg pr-4 py-2">
        <GripVertical
          className="text-gray-400 hover:cursor-move touch-none"
          size={20}
          onPointerDown={(e) => controls.start(e)}
        />
        {artwork ? (
          <img src={artwork} className="h-12 rounded-md" />
        ) : (
          <div className="size-12 rounded-md bg-gray-500/50 shrink-0"></div>
        )}
        <div
          className="flex flex-col w-full overflow-hidden hover:cursor-pointer"
          onClick={() => skipTo(id)}
        >
          <span className=" text-lg whitespace-nowrap">
            {toFullWidth(title ?? filename)}
          </span>
          <span className="text-gray-400 whitespace-nowrap min-w-full w-fit animate-scroll">
            {toFullWidth(album)}
          </span>
        </div>
      </div>
    </Reorder.Item>
  );
}
