import { open } from "@tauri-apps/api/dialog";
import { fetchFromUrl } from "music-metadata-browser";
import { Button } from "./ui/button";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useAtom, useSetAtom } from "jotai";
import { currentSongAtom, queueAtom } from "@/atoms/player";
import { displayStringAtom } from "@/atoms/display";
import { StepBack } from "lucide-react";
import { basename } from "@tauri-apps/api/path";

export function FilePicker() {
  const [currentSong, setCurrentSong] = useAtom(currentSongAtom);
  const setQueue = useSetAtom(queueAtom);
  const setDisplayString = useSetAtom(displayStringAtom);

  return (
    <Button
      className="p-4 w-4/5 max-w-screen-md gap-4"
      // variant='ghost'
      onClick={async () => {
        const selected = await open({
          multiple: true,
          filters: [
            {
              name: "Audio/*",
              extensions: [],
            },
          ],
        });
        if (Array.isArray(selected)) {
          // user selected multiple files

          setDisplayString("CD-01   LOAD");

          const songs = await Promise.all(
            selected
              .map(async (path) => {
                const url = convertFileSrc(path)

                const {
                  common: {
                    title,
                    track,
                    album,
                    artists,
                    genre,
                    date,
                    year,
                    picture,
                  },
                } = await fetchFromUrl(url);

                console.log(await fetchFromUrl(url));

                return {
                  id: crypto.randomUUID(),
                  path,
                  url,
                  filename: await basename(path),
                  title,
                  track,
                  album,
                  artists,
                  genre,
                  date,
                  year,
                  artwork: picture?.[0]
                    ? URL.createObjectURL(
                        new Blob([picture[0].data], { type: picture[0].format })
                      )
                    : undefined,
                };
              })
          );

          if (currentSong) {
            setQueue((prev) => [...prev, ...songs]);
          } else {
            const [current, ...queue] = songs;
            setCurrentSong(current);
            setQueue(queue);
          }

          // user selected a single file
          console.log("load finished", songs);
        } else if (selected === null) {
          // user cancelled the selection
        } else {
          // setQueue((prev) => [...prev, convertFileSrc(selected)]);
        }
      }}
    >
      <StepBack className="rotate-90" fill='white' />
      ファイルの読み込み
    </Button>
  );
}
