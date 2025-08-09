import { Button } from "../ui/button";
import { useMediaStream } from "@/hooks/mediastream";

export function ScreenShare() {
  const { connect } = useMediaStream();

  return (
    <Button
      className="w-full"
      onClick={async () => {
        connect(
          await navigator.mediaDevices.getDisplayMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
            video: {
              displaySurface: "monitor",
            },
          })
        );
      }}
    >
      PC上の音声を共有
    </Button>
  );
}
