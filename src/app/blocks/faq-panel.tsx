import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/app/ui/accordion";
  import { cn } from "@/app/lib/cn";
  import { ArrowRight, Plus } from "lucide-react";
  import * as React from "react";
  
  type FaqPanelItem = { question: string; answer: React.ReactNode };
  
  type FaqPanelProps = Omit<React.ComponentProps<"div">, "children"> & {
    items: FaqPanelItem[];
    defaultOpen?: number;
    footer?: React.ReactNode;
  };
  
  // lg+: items become display:contents so every panel shares the right column; the last 1fr row takes a tall answer's slack.
  const SPLIT = [
    "lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[repeat(var(--rows),auto)_1fr] lg:gap-x-16 xl:gap-x-24",
    "lg:[&_[data-slot=accordion-content]]:[grid-area:1/2/-1/3] lg:[&_[data-slot=accordion-content]]:sticky lg:[&_[data-slot=accordion-content]]:top-24 lg:[&_[data-slot=accordion-content]]:self-start lg:[&_[data-slot=accordion-content]]:animate-none",
    "**:data-[slot=accordion-trigger-icon]:hidden",
  ];
  
  const two = (value: number) => String(value).padStart(2, "0");
  
  function FaqPanel({ items, defaultOpen = 0, footer, className, ...props }: FaqPanelProps) {
    const [open, setOpen] = React.useState(Math.min(Math.max(defaultOpen, 0), Math.max(items.length - 1, 0)));
  
    if (items.length === 0) return null;
  
    return (
      <div data-slot="faq-panel" className={cn("w-full", className)} {...props}>
        <Accordion
          value={[open]}
          onValueChange={(value) => value.length > 0 && setOpen(value[0])}
          style={{ "--rows": items.length + (footer ? 1 : 0) } as React.CSSProperties}
          className={cn("border-t border-foreground lg:border-t-0", SPLIT)}
        >
          {items.map((item, index) => (
            <AccordionItem key={index} value={index} className="border-b lg:contents">
              <AccordionTrigger
                className={cn(
                  "items-baseline gap-4 rounded-none py-5 text-base font-normal text-foreground/75 hover:text-foreground hover:no-underline aria-expanded:text-foreground md:text-lg lg:border-b-border",
                  index === 0 && "lg:border-t-foreground"
                )}
              >
                <span
                  aria-hidden
                  className="w-7 shrink-0 text-xs lining-nums tabular-nums transition-colors group-aria-expanded/accordion-trigger:text-primary"
                >
                  {two(index + 1)}
                </span>
                <span className="min-w-0 flex-1 text-pretty">{item.question}</span>
                <Plus
                  aria-hidden
                  className="size-4 shrink-0 self-center transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45 lg:hidden"
                />
                <ArrowRight
                  aria-hidden
                  className="hidden size-4 shrink-0 -translate-x-2 self-center text-primary opacity-0 transition-[opacity,transform] duration-300 group-aria-expanded/accordion-trigger:translate-x-0 group-aria-expanded/accordion-trigger:opacity-100 lg:block rtl:translate-x-2 rtl:rotate-180"
                />
              </AccordionTrigger>
              <AccordionContent className="pb-6 ps-11 lg:pb-0 lg:ps-0">
                <div className="text-base leading-relaxed text-muted-foreground lg:border-t lg:border-foreground lg:pt-5 lg:in-data-open:animate-in lg:in-data-open:fade-in lg:in-data-open:slide-in-from-bottom-2 lg:in-data-open:duration-500">
                  <p aria-hidden className="hidden font-sans text-xs tabular-nums text-muted-foreground lg:block">
                    {two(index + 1)} / {two(items.length)}
                  </p>
                  <p
                    aria-hidden
                    className="mt-4 mb-5 hidden max-w-xl font-display text-3xl leading-tight text-balance text-foreground lg:block xl:text-4xl"
                  >
                    {item.question}
                  </p>
                  <div className="max-w-xl lg:text-lg">{item.answer}</div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          {footer && (
            <div className="pt-6 text-sm text-muted-foreground lg:col-start-1">{footer}</div>
          )}
        </Accordion>
      </div>
    );
  }
  
  export { FaqPanel };
  export type { FaqPanelItem, FaqPanelProps };
  