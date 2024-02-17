import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "../ui/button";

export function TitlebarButton({ className, ...props }: ButtonProps) {
  return <Button className={cn("rounded-none w-14 text-lg bg-transparent", className)} {...props} />;
}
