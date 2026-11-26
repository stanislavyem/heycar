import { Button } from "@/app/ui/button";
import { cn } from "@/app/lib/cn";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import * as React from "react";

type FileDropProps = Omit<
  React.ComponentProps<"input">,
  "type" | "title" | "children" | "value" | "defaultValue"
> & {
  title: React.ReactNode;
  hint?: React.ReactNode;
  removeLabel: string;
  maxSize?: number;
  tooLargeLabel?: string;
  wrongTypeLabel?: string;
  onFilesChange?: (files: File[]) => void;
};

type Refused = { file: File; reason: string };

const keyOf = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

function accepts(file: File, accept?: string) {
  const rules = (accept ?? "")
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) =>
    rule.startsWith(".")
      ? name.endsWith(rule)
      : rule.endsWith("/*")
        ? type.startsWith(rule.slice(0, -1))
        : type === rule,
  );
}

function formatSize(bytes: number) {
  const [value, unit] =
    bytes >= 1024 * 1024 ? [bytes / (1024 * 1024), "megabyte"] : [bytes / 1024, "kilobyte"];
  const options = {
    style: "unit",
    unit,
    unitDisplay: "short",
    maximumFractionDigits: value < 10 ? 1 : 0,
  } as const;
  try {
    return new Intl.NumberFormat(document.documentElement.lang || undefined, options).format(value);
  } catch {
    return new Intl.NumberFormat(undefined, options).format(value);
  }
}

const FileDrop = React.forwardRef<HTMLInputElement, FileDropProps>(function FileDrop(
  {
    title,
    hint,
    removeLabel,
    maxSize,
    tooLargeLabel,
    wrongTypeLabel,
    onFilesChange,
    onChange,
    accept,
    multiple,
    className,
    "aria-describedby": describedBy,
    ...props
  },
  forwardedRef,
) {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [refused, setRefused] = React.useState<Refused[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const listRef = React.useRef<HTMLUListElement>(null);
  const focusRow = React.useRef<number | null>(null);

  // A removed row takes focus with it: hand it to the next remove button, or back to the input.
  React.useEffect(() => {
    if (focusRow.current === null) return;
    const buttons = listRef.current?.querySelectorAll("button") ?? [];
    (buttons[Math.min(focusRow.current, buttons.length - 1)] ?? inputRef.current)?.focus();
    focusRow.current = null;
  });

  // The native input stays the source of truth, so the files submit with any form.
  const commit = (next: File[]) => {
    const input = inputRef.current;
    if (input) {
      const transfer = new DataTransfer();
      for (const file of next) transfer.items.add(file);
      input.files = transfer.files;
    }
    setFiles(next);
    onFilesChange?.(next);
  };

  const take = (picked: File[]) => {
    const turnedAway: Refused[] = [];
    const kept = picked.filter((file) => {
      const reason = !accepts(file, accept)
        ? (wrongTypeLabel ?? "")
        : maxSize !== undefined && file.size > maxSize
          ? (tooLargeLabel ?? "")
          : null;
      if (reason !== null) turnedAway.push({ file, reason });
      return reason === null;
    });
    const known = new Set(files.map(keyOf));
    const next = multiple
      ? [...files, ...kept.filter((file) => !known.has(keyOf(file)))]
      : kept.length
        ? kept.slice(0, 1)
        : files;
    setRefused(turnedAway);
    commit(next);
  };
  const latest = React.useRef({ take, onFilesChange });
  latest.current = { take, onFilesChange };

  React.useEffect(() => {
    const input = inputRef.current;
    // A file picked before the page hydrated is already in the input: list it.
    if (input?.files?.length) latest.current.take(Array.from(input.files));
    const form = input?.form;
    if (!form) return;
    const onReset = () => {
      setFiles([]);
      setRefused([]);
      latest.current.onFilesChange?.([]);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDragging(false);
    take(Array.from(event.target.files ?? []));
    onChange?.(event);
  };

  const rows = [
    ...files.map((file) => ({ file, reason: null as string | null })),
    ...refused,
  ];

  return (
    <div data-slot="file-drop" className={cn("flex w-full flex-col gap-2 contain-inline-size", className)}>
      <div
        data-dragging={dragging || undefined}
        className="group/drop relative flex flex-col items-center gap-1 rounded-card border border-dashed border-input bg-muted/40 px-6 py-8 text-center transition-colors duration-200 hover:border-foreground/40 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 has-aria-invalid:border-destructive has-disabled:opacity-50 data-dragging:border-primary data-dragging:bg-primary/5"
      >
        <span aria-hidden="true" className="relative mb-3 size-11">
          <span className="absolute inset-0 rounded-lg border border-dashed border-foreground/30 opacity-0 transition-opacity duration-200 group-hover/drop:opacity-100 group-data-dragging/drop:border-primary group-data-dragging/drop:opacity-100" />
          <span className="absolute inset-0 grid place-items-center rounded-lg border bg-background text-foreground shadow-sm transition-transform duration-300 ease-out group-hover/drop:translate-x-1.5 group-hover/drop:-translate-y-1.5 group-data-dragging/drop:translate-x-2 group-data-dragging/drop:-translate-y-2 group-data-dragging/drop:text-primary motion-reduce:translate-none! rtl:group-hover/drop:-translate-x-1.5 rtl:group-data-dragging/drop:-translate-x-2">
            <Upload className="size-4" />
          </span>
        </span>
        <span id={`${id}-title`} className="text-sm font-medium text-foreground">
          {title}
        </span>
        {hint && (
          <span id={`${id}-hint`} className="max-w-prose text-sm text-muted-foreground">
            {hint}
          </span>
        )}
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-labelledby={
            props["aria-label"] || props["aria-labelledby"] ? undefined : `${id}-title`
          }
          aria-describedby={cn(hint && `${id}-hint`, describedBy) || undefined}
          onChange={handleChange}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={() => setDragging(false)}
          // With scripting off the native control shows, since nothing else can list the chosen files.
          className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed noscript:static noscript:mt-3 noscript:size-auto noscript:max-w-full noscript:text-sm noscript:opacity-100"
          {...props}
        />
      </div>
      {rows.length > 0 && (
        <ul ref={listRef} data-slot="file-drop-list" className="flex flex-col gap-2">
          {rows.map(({ file, reason }, row) => {
            const Icon = file.type.startsWith("image/") ? ImageIcon : FileText;
            return (
              <li
                key={`${reason === null ? "kept" : "refused"}:${keyOf(file)}`}
                data-refused={reason !== null || undefined}
                className="flex animate-in items-center gap-3 rounded-input border bg-background py-2 ps-3 pe-1.5 text-sm duration-300 fade-in-0 slide-in-from-top-1 data-refused:border-destructive/40 data-refused:text-destructive motion-reduce:animate-none"
              >
                <Icon aria-hidden="true" className="size-4 shrink-0 opacity-60" />
                <span className="flex min-w-0 flex-1 flex-col gap-x-3 sm:flex-row sm:items-center">
                  <span className="truncate font-medium sm:flex-1">
                    <bdi>{file.name}</bdi>
                  </span>
                  <span
                    role={reason === null ? undefined : "alert"}
                    className="text-xs tabular-nums opacity-70 sm:shrink-0"
                  >
                    <bdi>{formatSize(file.size)}</bdi>
                    {reason && ` · ${reason}`}
                  </span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${removeLabel} ${file.name}`}
                  onClick={() => {
                    focusRow.current = row;
                    if (reason === null) commit(files.filter((kept) => kept !== file));
                    else setRefused(refused.filter((entry) => entry.file !== file));
                  }}
                  className="size-8 text-current opacity-70 hover:bg-foreground/10 hover:text-current hover:opacity-100 dark:hover:bg-foreground/10"
                >
                  <X aria-hidden="true" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

export { FileDrop };
export type { FileDropProps };
