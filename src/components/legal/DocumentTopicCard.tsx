import { Link } from "react-router-dom";
import { cn } from "@jokuh/gooey";

export function DocumentTopicCard({
  to,
  title,
  description,
  selected,
}: {
  to: string;
  title: string;
  description?: string;
  selected?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-[160px] flex-col justify-between rounded-[24px] border px-5 py-5 font-sans transition-colors",
        selected
          ? "border-[var(--color-blue-4)] bg-white/[0.04] shadow-[inset_0_0_0_1px_var(--color-blue-4)] light:bg-white"
          : "border-light-space/[0.08] bg-white/[0.02] hover:border-light-space/[0.14] hover:bg-white/[0.04] light:border-black/[0.08] light:bg-zinc-50 light:hover:border-black/[0.14] light:hover:bg-zinc-100",
      )}
    >
      <div>
        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">{title}</h3>
        {description ? (
          <p className="mt-2 text-[13px] leading-[1.55] text-light-space/58 light:text-zinc-600">{description}</p>
        ) : null}
      </div>
      <span className="text-[12px] font-medium text-[var(--color-blue-4)]">Open</span>
    </Link>
  );
}
