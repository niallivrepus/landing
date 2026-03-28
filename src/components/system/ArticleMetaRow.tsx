import { cn } from "@jokuh/gooey";

type ArticleMetaRowProps = {
  metaLine: string;
  align?: "center" | "start";
  size?: "default" | "compact";
  className?: string;
};

/** Parses "Date · A · B" into a bright date + muted segments (space-separated, no bullets). */
export function ArticleMetaRow({
  metaLine,
  align = "center",
  size = "default",
  className,
}: ArticleMetaRowProps) {
  const parts = metaLine.split(/\s*·\s*/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const date = parts[0]!;
  const tags = parts.slice(1);

  const row = cn(
    "flex flex-wrap items-baseline font-sans font-normal tracking-normal",
    align === "center" ? "justify-center text-center" : "justify-start text-left",
    size === "compact"
      ? "gap-x-3 gap-y-0.5 text-[11px] leading-snug text-light-space/42 light:text-zinc-500 md:text-[12px]"
      : "gap-x-5 gap-y-1 text-[13px] leading-[1.45] text-light-space/44 light:text-zinc-500 sm:gap-x-6 md:text-[0.9375rem]",
  );

  const dateCls =
    size === "compact"
      ? "text-light-space/90 light:text-zinc-800"
      : "text-light-space/95 light:text-zinc-950";

  return (
    <p className={cn(row, className)}>
      <span className={cn("shrink-0 tabular-nums", dateCls)}>{date}</span>
      {tags.map((tag, i) => (
        <span key={`${tag}-${i}`} className="shrink-0">
          {tag}
        </span>
      ))}
    </p>
  );
}
