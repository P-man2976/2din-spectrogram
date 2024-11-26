import { currentRadioAtom } from "@/atoms/radio";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { useMemo } from "react";

interface RadiruChannel {
  areajp: string;
  type: RadioType;
  label: string;
  name: string;
  url: string;
}

export function RadiruStation({ areajp, fmhls, r1hls, r2hls }: RadiruStation) {
  const channels = useMemo<RadiruChannel[]>(
    () => [
      {
        areajp,
        type: "AM",
        label: "第一",
        name: "ラジオ第一",
        url: r1hls,
      },
      {
        areajp,
        type: "AM",
        label: "第二",
        name: "ラジオ第二",
        url: r2hls,
      },
      {
        areajp,
        type: "FM",
        label: "ＦＭ",
        name: "NHK-FM",
        url: fmhls,
      },
    ],
    [areajp, r1hls, r2hls, fmhls]
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      {channels.map((channel) => (
        <RadiruChannel key={channel.name} {...channel} />
      ))}
    </div>
  );
}

function RadiruChannel({ areajp, type, label, name, url }: RadiruChannel) {
  const [currentRadio, setCurrentRadio] = useAtom(currentRadioAtom);

  const isSelected = currentRadio?.url === url;

  return (
    <button
      className={cn(
        "flex flex-col p-2 items-center justify-center rounded-lg cursor-pointer hover:bg-gray-500/50 transition-all",
        isSelected && "bg-gray-500/30 border"
      )}
      onClick={() =>
        setCurrentRadio({
          type,
          name,
          source: "radiru",
          url,
        })
      }
    >
      <span className="text-gray-300 text-sm">{areajp}</span>
      <span className="text-2xl">{label}</span>
    </button>
  );
}
