import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";
import { formatShippedMonth, type ShippedRibbonBar } from "../../data/shipped";

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
 * **Purpose:** Commit-activity ribbon — one bar per week since week 1, height = commits that week.
 * Quiet weeks render as a stub so the gaps read honestly. The newest bar glows Jokuh orange.
 * **Connects to:** `getShippedRibbon()`; used on `/shipped` (hash links) and the Home strip (detail links).
 */
export function ShippedRibbon({
  bars,
  hrefFor,
  className,
  showLabels = true,
}: {
  bars: ShippedRibbonBar[];
  hrefFor: (slug: string) => string;
  className?: string;
  showLabels?: boolean;
}) {
  if (bars.length === 0) return null;
  const max = Math.max(...bars.map((bar) => bar.commits), 1);
  const latest = bars[bars.length - 1];
  const first = bars[0];

  return (
    <figure className={cn("w-full", className)}>
      <style>{RIBBON_KEYFRAMES}</style>
      <div className="flex h-full items-end gap-[3px] sm:gap-1" role="list" aria-label="Commits per week">
        {bars.map((bar, index) => {
          const isLatest = bar === latest;
          const height = bar.commits > 0 ? Math.max(8, Math.round((bar.commits / max) * 100)) : 3;
          const barClass = cn(
            "shipped-bar block w-full origin-bottom rounded-[3px] transition-colors",
            isLatest
              ? "bg-[var(--color-orange-5,#ff6a1a)]"
              : bar.slug
                ? "bg-light-space/28 group-hover:bg-light-space/70 light:bg-zinc-300 light:group-hover:bg-zinc-700"
                : "bg-light-space/10 light:bg-zinc-200",
          );
          const style = {
            height: `${height}%`,
            animation: `shipped-bar-grow 640ms cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 22}ms both`,
          };
          const label = `Week ${bar.week}, ${bar.commits} ${bar.commits === 1 ? "commit" : "commits"}`;

          return (
            <div key={bar.week} role="listitem" className="flex h-full min-w-[6px] flex-1 items-end">
              {bar.slug ? (
                <SiteLink
                  href={hrefFor(bar.slug)}
                  aria-label={label}
                  title={label}
                  className="group flex h-full w-full items-end"
                >
                  <span className={barClass} style={style} />
                </SiteLink>
              ) : (
                <span className="flex h-full w-full items-end" title={label}>
                  <span className={barClass} style={style} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      {showLabels ? (
        <figcaption className="mt-3 flex items-center justify-between font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-light-space/42 light:text-zinc-500">
          <span>
            Week {first.week} · {formatShippedMonth(first.start)}
          </span>
          <span className="text-light-space/72 light:text-zinc-800">Week {latest.week} · Now</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
