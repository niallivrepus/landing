import { Link } from "react-router-dom";
import { JokuhMark } from "./JokuhMark";
import { cn } from "@jokuh/gooey";

export function DocumentTopicCard({
  to,
  title,
  selected,
}: {
  to: string;
  title: string;
  selected?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-[140px] flex-col items-center justify-center gap-4 rounded-[2px] border bg-white/[0.04] px-4 py-6 font-sans transition-colors light:border-black/10 light:bg-white light:shadow-sm light:hover:bg-zinc-50",
        selected
          ? "border-[var(--color-blue-4)] shadow-[inset_0_0_0_1px_var(--color-blue-4)]"
          : "border-light-glass-20 hover:border-light-glass-40 hover:bg-white/[0.06] light:hover:border-black/18",
      )}
    >
      <JokuhMark className="h-8 w-[52px] shrink-0 text-light-space" />
      <span className="max-w-[140px] text-center text-[12px] leading-snug text-light-space/60">{title}</span>
    </Link>
  );
}
