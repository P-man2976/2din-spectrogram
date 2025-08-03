import {
  currentRadioAtom,
  customFrequencyAreaAtom,
  radioStationSizeAtom,
} from "@/atoms/radio";
import { cn } from "@/lib/utils";
import { useRadioFrequencies } from "@/services/radio";
import { useAtom, useAtomValue } from "jotai";
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
import { Button } from "../ui/button";

export function RadioStation({ name, id, logo }: RadikoStation) {
  const [currentRadio, setCurrentRadio] = useAtom(currentRadioAtom);
  const [customFreqList, setCustomFreqList] = useAtom(customFrequencyAreaAtom);
  const size = useAtomValue(radioStationSizeAtom);

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

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "flex justify-start h-full gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-500/50 transition-all group",
            isSelected && "bg-gray-500/30 border"
          )}
          onClick={() =>
            setCurrentRadio({
              type,
              source: "radiko",
              id,
              frequency,
              name,
            })
          }
        >
          <div
            className={cn(
              "w-24 h-full grid place-content-center p-2 rounded-md shadow-md transition-all",
              isSelected
                ? "bg-gray-300"
                : "bg-gray-500/50 group-hover:bg-gray-400/50"
            )}
          >
            <img src={logo?.[0]} className="" />
          </div>
          {size == "lg" && (
            <div className="flex flex-col items-start">
              {station && (
                <span className="text-gray-300">
                  {frequency}
                  {type === "AM" ? "kHz" : "MHz"}
                </span>
              )}
              <span className="text-lg ">{name}</span>
            </div>
          )}
        </Button>
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
                    ...currentRadio,
                    frequency: Number(freq),
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
