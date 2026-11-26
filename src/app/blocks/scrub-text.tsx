import { cn } from "@/app/lib/cn";
import * as React from "react";

type ScrubTextProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  text: string | string[];
  as?:
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "blockquote"
    | "div"
    | "span";
  split?: "word" | "line";
  tokenClassName?: string;
  colorFrom?: string;
  blend?: number;
  rangeStart?: string;
  rangeEnd?: string;
};

// Start state only where view timelines run, and only once mounted below the fold: other browsers, crawlers,
// reduced motion and text on screen at load get the final text, and the first paint creates no animations.
const SCRUB =
  "motion-safe:supports-[animation-timeline:view()]:data-scrub:*:animate-in motion-safe:supports-[animation-timeline:view()]:data-scrub:*:fill-mode-both motion-safe:supports-[animation-timeline:view()]:data-scrub:*:ease-linear motion-safe:supports-[animation-timeline:view()]:data-scrub:*:[animation-timeline:var(--scrub-timeline)] motion-safe:supports-[animation-timeline:view()]:data-scrub:*:[animation-range:cover_calc(var(--scrub-start)+var(--scrub-step)*var(--i))_cover_calc(var(--scrub-start)+var(--scrub-step)*(var(--i)+var(--scrub-blend)))]";
const COLOR =
  " motion-safe:supports-[animation-timeline:view()]:data-scrub:*:[animation-name:enter,scrub-text-color]";

function ScrubText({
  text,
  as: Tag = "p",
  split = "word",
  tokenClassName,
  colorFrom,
  blend: requestedBlend = 1,
  rangeStart = "20vh",
  rangeEnd = "calc(100% - 50vh)",
  style,
  ...props
}: ScrubTextProps) {
  const timeline = "--scrub-" + React.useId().replace(/[^\w-]/g, "");
  const tokensRef = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const tokens = tokensRef.current;
    if (!tokens || tokens.getBoundingClientRect().top < window.innerHeight) return;
    // The view timeline follows the nearest scroll container; one that can't scroll (an overflow-hidden
    // wrapper) would freeze the text part-way, so keep the final text there.
    let box = tokens.parentElement;
    while (box && box !== document.body) {
      const { overflowX, overflowY } = getComputedStyle(box);
      if (!/^(visible|clip)$/.test(overflowX) || !/^(visible|clip)$/.test(overflowY)) {
        if (!/auto|scroll/.test(overflowY) || box.scrollHeight <= box.clientHeight) return;
        break;
      }
      box = box.parentElement;
    }
    // Creating scroll-driven animations is a long task; do it just before the text comes into view, not at load.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        tokens.dataset.scrub = "";
      },
      { rootMargin: "0px 0px 25% 0px" },
    );
    observer.observe(tokens);
    return () => observer.disconnect();
  }, []);
  const lines = (Array.isArray(text) ? text : [text]).filter(
    (line) => typeof line === "string" && line.trim(),
  );
  // Whitespace only: locale segmenters differ between server and browser and would break hydration.
  const tokens = lines.map((line) =>
    split === "line" ? [line] : line.split(/\s+/).filter(Boolean),
  );
  const count = tokens.reduce((sum, line) => sum + line.length, 0);
  if (!count) return null;
  const blend = Number.isFinite(requestedBlend)
    ? Math.max(requestedBlend, 0.001)
    : 1;
  const tokenClass = cn(
    split === "line" ? "block" : "inline-block",
    tokenClassName ?? (colorFrom ? undefined : "fade-in-50"),
  );
  let index = 0;
  return (
    <Tag
      data-slot="scrub-text"
      {...props}
      style={
        {
          viewTimelineName: timeline,
          "--scrub-timeline": timeline,
          "--scrub-start": rangeStart,
          "--scrub-step": `calc((${rangeEnd} - ${rangeStart}) / ${count + blend - 1})`,
          "--scrub-blend": blend,
          "--scrub-from": colorFrom,
          "--n": count,
          ...style,
        } as React.CSSProperties
      }
    >
      {colorFrom && (
        <style>
          {"@keyframes scrub-text-color{from{color:var(--scrub-from)}}"}
        </style>
      )}
      <span className="sr-only">{lines.join(" ")}</span>
      <span
        ref={tokensRef}
        aria-hidden="true"
        className={colorFrom ? SCRUB + COLOR : SCRUB}
      >
        {tokens.map((line, l) => (
          <React.Fragment key={l}>
            {l > 0 && split === "word" && <br />}
            {line.map((token, t) => (
              <React.Fragment key={t}>
                {t > 0 && " "}
                <span
                  className={tokenClass}
                  style={{ "--i": index++ } as React.CSSProperties}
                >
                  {token}
                </span>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
}

export { ScrubText };
export type { ScrubTextProps };
