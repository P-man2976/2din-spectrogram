import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMediaStream } from "@/hooks/mediastream";

export function ExternalInput() {
  const { connect } = useMediaStream();

  const { data } = useQuery({
    queryKey: ["source", "aux", "external"],
    queryFn: async () =>
      (await navigator.mediaDevices.enumerateDevices()).filter(
        (device) => device.kind === "audioinput"
      ),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full">マイク入力</Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuLabel>入力デバイスの選択</DropdownMenuLabel>
          {data?.map((device) => (
            <DropdownMenuItem
              key={device.deviceId}
              textValue={device.deviceId}
              onSelect={async () => {
                connect(
                  await navigator.mediaDevices.getUserMedia({
                    audio: {
                      deviceId: { exact: device.deviceId },
                      echoCancellation: false,
                      noiseSuppression: false,
                      autoGainControl: false,
                    },
                    video: false,
                  })
                );
              }}
            >
              {device.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
