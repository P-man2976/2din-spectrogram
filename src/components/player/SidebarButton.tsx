import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "../ui/button";

export const SidebarButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { side: 'top' | "left" | "right" }
>(({ side, children, className, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
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
          " absolute inset-0 opacity-0 from-gray-600/50 transition-all duration-500 group-hover:opacity-100",
          {
            "bg-[radial-gradient(80%_60%_at_top,_var(--tw-gradient-from),_transparent)]":
              side === "top",
            "bg-[radial-gradient(80%_60%_at_left,_var(--tw-gradient-from),_transparent)]":
              side === "left",
            "bg-[radial-gradient(80%_60%_at_right,_var(--tw-gradient-from),_transparent)]":
              side === "right",
          }
        )}
      />
      {children}
    </Button>
  );
});
