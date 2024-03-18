import { currentRadioAtom, customFrequencyAreaAtom } from "@/atoms/radio";
import { cn } from "@/lib/utils";
import { useRadikoM3u8Url } from "@/services/radiko";
import { useRadioFrequencies } from "@/services/radio";
import { useAtom } from "jotai";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";

export function RadioStation({ name, id, logo }: RadikoStation) {
  const [currentRadio, setCurrentRadio] = useAtom(currentRadioAtom);
  const [customFreqList, setCustomFreqList] = useAtom(customFrequencyAreaAtom);

  const {
    data: m3u8,
    error: m3u8Error,
  } = useRadikoM3u8Url(id);
  const { data: frequencies } = useRadioFrequencies();

  const customFreq = customFreqList.find((station) => station.id === id);

  const station = frequencies?.[id];
  const type = customFreq?.type ?? station?.type ?? "FM";
  const frequency =
    customFreq?.freq ??
    (station
      ? station.type === "AM"
        ? station.frequencies_am.find((area) => area.primary)?.frequency
        : station.frequencies_fm.find((area) => area.primary)?.frequency
      : undefined);

  const isSelected = currentRadio?.name === name;

  if (m3u8Error) return <div>{m3u8Error.message}</div>;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild> 
        <button
          className={cn(
            "flex gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-500/50 transition-all",
            isSelected && "bg-gray-500/30 border"
          )}
          onClick={() =>
            setCurrentRadio({
              type,
              frequency,
              name,
              source: "radiko",
              url: m3u8,
            })
          }
        >
          <div
            className={cn(
              "w-24 p-2 rounded-md shadow-md",
              isSelected ? "bg-gray-300" : "bg-gray-500/50"
            )}
          >
            <img src={logo?.[0]} className="" />
          </div>
          <div className="flex flex-col justify-center">
            {station && (
              <span className="text-gray-300">
                {frequency}
                {type === "AM" ? "kHz" : "MHz"}
              </span>
            )}
            <span className="text-lg ">{name}</span>
          </div>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="min-w-[12rem]">
        <ContextMenuCheckboxItem>お気に入り</ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>周波数</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuRadioGroup
              value={`${type}-${frequency}`}
              onValueChange={(area) => {
                const [type, freq] = area.split("-") as [RadioType, string];
                setCustomFreqList((stations) =>
                  stations.find((station) => station.id === id)
                    ? [
                        ...stations.filter((station) => station.id !== id),
                        { id, type, freq: Number(freq) },
                      ]
                    : [...stations, { id, type, freq: Number(freq) }]
                );

                if (isSelected)
                  setCurrentRadio({
                    type,
                    frequency: Number(freq),
                    name,
                    source: "radiko",
                    url: m3u8,
                  });
              }}
            >
              {station?.frequencies_fm?.map((area) => (
                <ContextMenuRadioItem
                  key={area.area.toString()}
                  value={`FM-${area.frequency.toString()}`}
                >
                  {area.frequency} ({area.area.join(",")})
                </ContextMenuRadioItem>
              ))}
              {station?.frequencies_am?.map((area) => (
                <ContextMenuRadioItem
                  key={area.area.toString()}
                  value={`AM-${area.frequency.toString()}`}
                >
                  {area.frequency} ({area.area.join(",")})
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}