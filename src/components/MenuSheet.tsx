import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { VolumeSlider } from "./player/VolumeSlider";
import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { LuSettings } from "react-icons/lu";
import { SettingsDialog } from "./settings/SettingsDlalog";

export function MenuSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-fit" side="left">
        <div className="h-full flex items-center">
          <div className="flex flex-col items-center h-4/5 gap-4">
            <VolumeSlider orientation="vertical" />
            <Volume2 />
            <SettingsDialog>
              <Button size="icon">
                <LuSettings />
              </Button>
            </SettingsDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
