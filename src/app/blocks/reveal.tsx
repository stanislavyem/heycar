import { cn } from "@/app/lib/cn";
import * as React from "react";

type RevealProps = Omit<React.ComponentProps<"div">, "ref">;

function Reveal({ className, children, ...props }: RevealProps) {
  return (
    <div
      data-slot="reveal"
      className={cn(
        "motion-safe:animate-[reveal-in_700ms_ease-out_both] motion-safe:[animation-timeline:view()] motion-safe:[animation-range:entry_10%_entry_min(100%,40vh)]",
        className,
      )}
      {...props}
    >
      <style>
        {
          "@keyframes reveal-in{from{opacity:0;transform:translateY(var(--reveal-y,2rem)) scale(var(--reveal-scale,1))}}"
        }
      </style>
      {children}
    </div>
  );
}

export { Reveal };
export type { RevealProps };
