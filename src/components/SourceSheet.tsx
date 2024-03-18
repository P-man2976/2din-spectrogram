import { ReactNode } from "react";
import { useAtom } from "jotai";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { FilePicker } from "./FilePicker";
import { ExplorerDialog } from "./explorer/ExplorerDialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useRadikoStationList } from "@/services/radiko";
import { RadioStation } from "./source/RadioStation";
import { currentSrcAtom } from "@/atoms/player";
import { useRadiruStationList } from "@/services/radiru";
import { RadiruStation } from "./source/RadiruStation";

export function SourceSheet({ children }: { children: ReactNode }) {
  const [currentSrc, setCurrentSrc] = useAtom(currentSrcAtom);

  const { data: radikoStationList } = useRadikoStationList();
  const { data: radiruStationList } = useRadiruStationList();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="top" className="max-h-[80vh] overflow-y-auto">
        <Tabs
          value={currentSrc}
          onValueChange={(value) => setCurrentSrc(value as "file" | "radio")}
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="file">ファイル</TabsTrigger>
            <TabsTrigger value="radio">ラジオ</TabsTrigger>
          </TabsList>
          <TabsContent className="py-4" value="file">
            <div className="flex w-full flex-col items-center gap-4">
              {/* <span className="text-xl">ファイルの読み込み</span> */}
              <div className="flex w-full h-12 gap-4 items-center">
                <FilePicker />
                <ExplorerDialog>
                  <Button className="w-full h-full">
                    組み込みのエクスプローラーから読み込み
                  </Button>
                </ExplorerDialog>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="radio">
            <div className="flex flex-col gap-4 max-h-full overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {radikoStationList?.map((station) => (
                  <RadioStation key={station.id} {...station} />
                ))}
                {radiruStationList?.map((station) => (
                  <RadiruStation key={station.areakey} {...station} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
