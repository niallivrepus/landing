import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";
import type { ShippedBar } from "../../data/shipped";

const RIBBON_KEYFRAMES = `
@keyframes shipped-bar-grow {
  from { transform: scaleY(0.06); opacity: 0.25; }
  to { transform: scaleY(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .shipped-bar { animation: none !important; }
}
`;

/**
 * **Purpose:** Commit-activity ribbon — one bar per period, height = commits in it. Empty periods render
 * as a stub so gaps read honestly; the newest bar glows Jokuh orange. Bars with a post link to it.
 * **Connects to:** `getShippedMonthlyBars()` on `/shipped`, `getShippedWeeklyBars()` on the Home strip.
 */
export function ShippedRibbon({
  bars,
  hrefFor,
  className,
  leftLabel,
  rightLabel,
  ariaLabel = "Commits over time",
}: {
  bars: ShippedBar[];
  hrefFor: (slug: string) => string;
  className?: string;
  leftLabel?: string;
  rightLabel?: string;
  ariaLabel?: string;
}) {
  if (bars.length === 0) return null;
  const max = Math.max(...bars.map((bar) => bar.commits), 1);
  const latest = bars[bars.length - 1];
  const stagger = Math.min(22, 900 / bars.length);

  return (
    <figure className={cn("flex w-full flex-col", className)}>
      <style>{RIBBON_KEYFRAMES}</style>
      <div className="flex min-h-0 flex-1 items-end gap-[2px] sm:gap-1" role="list" aria-label={ariaLabel}>
        {bars.map((bar, index) => {
          const isLatest = bar === latest;
          const height = bar.commits > 0 ? Math.max(6, Math.round((bar.commits / max) * 100)) : 2;
          const barClass = cn(
            "shipped-bar block w-full origin-bottom rounded-[3px] transition-colors",
            isLatest
              ? "bg-[var(--color-orange-5,#ff6a1a)]"
              : bar.slug
                ? "bg-light-space/32 group-hover:bg-light-space/75 light:bg-zinc-300 light:group-hover:bg-zinc-700"
                : "bg-light-space/16 light:bg-zinc-200",
          );
          const style = {
            height: `${height}%`,
            animation: `shipped-bar-grow 640ms cubic-bezier(0.2, 0.8, 0.2, 1) ${Math.round(index * stagger)}ms both`,
          };

          return (
            <div key={bar.key} role="listitem" className="flex h-full min-w-0 flex-1 items-end">
              {bar.slug ? (
                <SiteLink
                  href={hrefFor(bar.slug)}
                  aria-label={bar.label}
                  title={bar.label}
                  className="group flex h-full w-full items-end"
                >
                  <span className={barClass} style={style} />
                </SiteLink>
              ) : (
                <span className="flex h-full w-full items-end" title={bar.label} aria-label={bar.label}>
                  <span className={barClass} style={style} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      {leftLabel || rightLabel ? (
        <figcaption className="mt-3 flex items-center justify-between font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-light-space/42 light:text-zinc-500">
          <span>{leftLabel}</span>
          <span className="text-light-space/72 light:text-zinc-800">{rightLabel}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
