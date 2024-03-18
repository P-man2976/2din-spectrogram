import { currentSrcAtom } from "@/atoms/player";
import { useAtomValue } from "jotai";
import { LuMusic, LuRadioTower } from "react-icons/lu";

export function CoverImage({ src }: {src?: string}) {
  const currentSrc = useAtomValue(currentSrcAtom);

  return (
    <div className="size-20 shrink-0 text-2xl rounded-md shadow-lg grid place-content-center bg-gray-500/50">
      {src ? (
        <img
          className="h-20 grow-0 rounded-md shadow-lg shrink-0"
          src={src}
        />
      ) : (
        currentSrc === 'file' ? <LuMusic /> : <LuRadioTower />
      )}
    </div>
  );
}
