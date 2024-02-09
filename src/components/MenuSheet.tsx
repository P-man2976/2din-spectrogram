import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { VolumeSlider } from "./player/VolumeSlider";
import { Volume2 } from "lucide-react";

export function MenuSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-fit" side="left">
        <div className="h-full flex items-center">
          <div className="flex flex-col h-4/5 gap-4">
            <VolumeSlider orientation="vertical" />
            <Volume2 />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
