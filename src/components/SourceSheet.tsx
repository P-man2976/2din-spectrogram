import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { FilePicker } from "./FilePicker";
import { ExplorerDialog } from "./explorer/ExplorerDialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function SourceSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="top">
        <Tabs defaultValue="file">
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
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
