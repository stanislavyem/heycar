import { ScrubText } from "@/app/blocks/scrub-text";
import { cn } from "@/app/lib/cn";
import * as React from "react";

type TextRevealProps = React.ComponentProps<"div"> & {
  lines: string[];
  as?: "h1" | "h2" | "h3" | "h4";
  eyebrow?: string;
};

function TextReveal({
  lines,
  as = "h2",
  eyebrow,
  className,
  ...props
}: TextRevealProps) {
  const validLines = lines?.filter((line) => line && line.trim()) ?? [];
  if (validLines.length === 0) return null;

  return (
    <div data-slot="text-reveal" className={cn(className)} {...props}>
      {eyebrow && (
        <p
          data-slot="text-reveal-eyebrow"
          className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-primary"
        >
          {eyebrow}
        </p>
      )}
      {/* Unrevealed words stay at 50% so they still meet large-text contrast (AA 3:1). */}
      <ScrubText
        data-slot="text-reveal-heading"
        as={as}
        text={validLines}
        tokenClassName="fade-in-50"
        blend={4}
        rangeStart="15vh"
        rangeEnd="85vh"
        className="font-display font-bold leading-tight tracking-tight text-[clamp(1.75rem,5vw,4rem)]"
      />
    </div>
  );
}

export { TextReveal };
export type { TextRevealProps };
