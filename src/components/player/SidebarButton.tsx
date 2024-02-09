import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "../ui/button";

export function SidebarButton({
  side,
  children,
  className,
  ...rest
}: ButtonProps & { side: "left" | "right" }) {
  return (
    <Button
      className={cn(
        "h-full group relative",
        { "pr-12": side === "left", "pl-12": side === "right" },
        className
      )}
      variant={null}
      {...rest}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-0 from-gray-500/50 transition-all duration-500",
          {
            "group-hover:opacity-100 bg-[radial-gradient(80%_60%_at_left,_var(--tw-gradient-from),_transparent)]":
              side === "left",
            "group-hover:opacity-100 bg-[radial-gradient(80%_60%_at_right,_var(--tw-gradient-from),_transparent)]":
              side === "right",
          }
        )}
      />
      {children}
    </Button>
  );
}
