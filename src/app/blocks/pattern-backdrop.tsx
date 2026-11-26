import { cn } from "@/app/lib/cn";
import * as React from "react";

type PatternBackdropProps = Omit<React.ComponentProps<"div">, "children" | "ref"> & {
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer";
  pattern?: "grid" | "dots";
  size?: number;
  fade?: "edges" | "center" | "top" | "bottom" | "none";
  glow?: boolean;
  glowColor?: string;
  glowRadius?: number;
};

const PATTERN = {
  grid: "bg-[linear-gradient(to_right,var(--pattern-ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--pattern-ink)_1px,transparent_1px)]",
  dots: "bg-[radial-gradient(circle_at_center,var(--pattern-ink)_var(--pattern-dot),transparent_calc(var(--pattern-dot)+0.5px))]",
};

const INK = {
  grid: "[--pattern-ink:color-mix(in_oklab,var(--foreground)_10%,transparent)]",
  dots: "[--pattern-ink:color-mix(in_oklab,var(--foreground)_24%,transparent)] [--pattern-dot:1px]",
};

const FADE = {
  edges: "[mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]",
  center: "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_85%)]",
  top: "[mask-image:linear-gradient(to_top,black_15%,transparent_90%)]",
  bottom: "[mask-image:linear-gradient(to_bottom,black_15%,transparent_90%)]",
  none: "",
};

function PatternBackdrop({
  children,
  as = "div",
  pattern = "grid",
  size: requestedSize,
  fade = "edges",
  glow = false,
  glowColor = "var(--primary)",
  glowRadius = 220,
  className,
  ...props
}: PatternBackdropProps) {
  const Tag = as as "div";
  const ref = React.useRef<HTMLDivElement>(null);
  const glowRef = React.useRef<HTMLDivElement>(null);
  const fallback = pattern === "grid" ? 40 : 22;
  const size =
    requestedSize && Number.isFinite(requestedSize) && requestedSize > 3
      ? requestedSize
      : fallback;

  React.useEffect(() => {
    const root = ref.current;
    const layer = glowRef.current;
    if (!root || !layer || !glow) return;
    let frame = 0;
    let point = { x: 0, y: 0 };
    const write = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      layer.style.setProperty("--pattern-x", `${Math.round(point.x - rect.left)}px`);
      layer.style.setProperty("--pattern-y", `${Math.round(point.y - rect.top)}px`);
      layer.setAttribute("data-pattern-active", "");
    };
    const onMove = (event: PointerEvent) => {
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      layer.removeAttribute("data-pattern-active");
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerdown", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointercancel", onLeave);
    return () => {
      onLeave();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerdown", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointercancel", onLeave);
    };
  }, [glow]);

  const tile = { backgroundSize: `${size}px ${size}px` };
  return (
    <Tag
      ref={ref}
      data-slot="pattern-backdrop"
      className={cn("relative isolate", className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", FADE[fade])}
      >
        <div
          className={cn("absolute inset-0 bg-center", PATTERN[pattern], INK[pattern])}
          style={tile}
        />
        {glow && (
          <div
            ref={glowRef}
            className={cn(
              "absolute inset-0 bg-center opacity-0 transition-opacity duration-500 data-[pattern-active]:opacity-100 motion-reduce:transition-none [--pattern-dot:1.5px] [mask-image:radial-gradient(circle_var(--pattern-glow)_at_var(--pattern-x,50%)_var(--pattern-y,50%),black,transparent)]",
              PATTERN[pattern],
            )}
            style={
              {
                ...tile,
                "--pattern-ink": `color-mix(in oklab, ${glowColor} 60%, transparent)`,
                "--pattern-glow": `${glowRadius}px`,
              } as React.CSSProperties
            }
          />
        )}
      </div>
      {children}
    </Tag>
  );
}

export { PatternBackdrop };
export type { PatternBackdropProps };
