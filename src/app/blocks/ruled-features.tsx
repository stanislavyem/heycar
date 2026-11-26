import { SiteLink } from "@/app/ui/site-link";
import { cn } from "@/app/lib/cn";
import { ArrowRight } from "lucide-react";
import * as React from "react";

type RuledFeature = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  cta?: { label: string; href: string; newTab?: boolean };
};

type RuledFeaturesProps = Omit<React.ComponentProps<"div">, "children"> & {
  items: RuledFeature[];
  columns?: 2 | 3 | 4;
  numbered?: boolean;
  crosshairs?: boolean;
};

const COLUMNS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" };
const SM_SPAN = ["sm:col-span-1", "sm:col-span-2"];
const LG_SPAN = ["lg:col-span-1", "lg:col-span-2", "lg:col-span-3", "lg:col-span-4"];

// The last item runs to the row's end, so no row is left half ruled.
const extra = (count: number, cols: number) => (count % cols ? cols - (count % cols) : 0);
// A crossing is marked only where four cells meet, never on the outer frame.
const inner = (index: number, count: number, cols: number) =>
  index % cols !== cols - 1 && index + cols + 1 < count;

function RuledFeatures({ items, columns = 3, numbered, crosshairs, className, ...props }: RuledFeaturesProps) {
  if (items.length === 0) return null;
  return (
    <div data-slot="ruled-features" className={cn("overflow-hidden border-y", className)} {...props}>
      <div className={cn("-mr-px -mb-px grid grid-cols-1", COLUMNS[columns])}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const cross = [inner(index, items.length, 2), inner(index, items.length, columns)];
          // A cell left spanning most of the row sets its text beside its heading instead of leaving the rest empty.
          const row = last && extra(items.length, columns) >= 2;
          return (
            <div
              key={`${item.title}-${index}`}
              data-slot="ruled-features-item"
              className={cn(
                "group/item relative flex flex-col items-start border-r border-b px-6 pt-8 pb-10 md:px-8 md:pt-10 md:pb-12",
                last && [SM_SPAN[extra(items.length, 2)], LG_SPAN[extra(items.length, columns)]],
                row && "lg:flex-row lg:items-end lg:justify-between lg:gap-16"
              )}
            >
              {item.cta && (
                <span
                  aria-hidden
                  className="absolute -top-px start-0 h-0.5 w-full origin-left scale-x-0 rtl:origin-right bg-primary transition-transform duration-500 ease-out group-hover/item:scale-x-100 group-has-focus-visible/item:scale-x-100"
                />
              )}
              {crosshairs && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -end-[6px] -bottom-[6px] z-10 hidden size-[11px] before:absolute before:top-0 before:left-1/2 before:h-full before:w-px before:-translate-x-1/2 before:bg-foreground/60 after:absolute after:top-1/2 after:left-0 after:h-px after:w-full after:-translate-y-1/2 after:bg-foreground/60",
                    cross[0] && "sm:block",
                    cross[1] ? "lg:block" : "lg:hidden"
                  )}
                />
              )}
              <div className={cn("flex w-full flex-col items-start", row && "lg:w-auto")}>
                {(item.icon || numbered) && (
                  <div
                    className={cn(
                      "mb-10 flex w-full items-start justify-between gap-4 md:mb-14",
                      row && "lg:mb-6",
                      last && extra(items.length, 2) > 0 && "sm:justify-start sm:gap-6",
                      last && (extra(items.length, columns) > 0 ? "lg:justify-start lg:gap-6" : "lg:justify-between lg:gap-4")
                    )}
                  >
                    {numbered && (
                      <span
                        aria-hidden
                        className="font-display text-4xl leading-none tracking-tight text-muted-foreground/60 tabular-nums transition-colors duration-300 group-hover/item:text-primary group-has-focus-visible/item:text-primary md:text-5xl"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    )}
                    {item.icon && (
                      <span aria-hidden className="text-primary [&_svg]:size-7 [&_svg]:stroke-[1.25]">
                        {item.icon}
                      </span>
                    )}
                  </div>
                )}
                <h3 className={cn("leading-tight", columns === 4 ? "text-xl" : "text-xl md:text-2xl", row && "lg:text-2xl")}>
                  {item.title}
                </h3>
              </div>
              <div className={cn("flex grow flex-col items-start", row && "lg:max-w-md lg:grow-0")}>
                {item.description && (
                  <p className={cn("mt-3 max-w-[38ch] text-base leading-relaxed text-muted-foreground", row && "lg:mt-0")}>
                    {item.description}
                  </p>
                )}
                {item.cta && (
                  <SiteLink
                    href={item.cta.href}
                    target={item.cta.newTab ? "_blank" : undefined}
                    rel={item.cta.newTab ? "noopener noreferrer" : undefined}
                    className={cn("mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-foreground underline decoration-current/30 underline-offset-4 outline-none after:absolute after:inset-0 focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50 focus-visible:after:ring-inset", row && "lg:pt-4")}
                  >
                    {item.cta.label}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover/item:translate-x-1 rtl:rotate-180 rtl:group-hover/item:-translate-x-1" />
                  </SiteLink>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { RuledFeatures };
export type { RuledFeature, RuledFeaturesProps };
