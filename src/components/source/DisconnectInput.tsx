import { Button } from "../ui/button";
import { useMediaStream } from "@/hooks/mediastream";

export function DisconnectInput() {
  const {disconnect} = useMediaStream();

  return (
    <Button
      className="w-full"
      variant="destructive"
      onClick={disconnect}
    >
      接続解除
    </Button>
  );
}
