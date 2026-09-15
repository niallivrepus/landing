import { ArrowRight } from "lucide-react";
import { SiteLink } from "../SiteLink";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { ShippedRibbon } from "./ShippedRibbon";
import { ShippedLiveBadge } from "./ShippedWeekEntry";
import {
  formatShippedRange,
  getShippedHref,
  getShippedRibbon,
  isShippedWeekInProgress,
  SHIPPED_WEEKS,
} from "../../data/shipped";

const HOME_RIBBON_WEEKS = 16;

/**
 * **Purpose:** Home-page band for the latest Shipped week — headline, what's in it, and the last few months of pace.
 * **Connects to:** `/shipped` build log; sits above the Newsroom rail in `Home.tsx`.
 */
export function ShippedStrip() {
  const latest = SHIPPED_WEEKS[0];
  if (!latest) return null;
  const bars = getShippedRibbon().slice(-HOME_RIBBON_WEEKS);
  const live = isShippedWeekInProgress(latest);

  return (
    <section aria-labelledby="shipped-strip-title" className="bg-dark-space px-0 pt-16 light:bg-white md:px-8 md:pt-20">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="grid gap-8 rounded-[28px] border border-light-space/[0.08] bg-white/[0.03] p-6 light:border-black/[0.06] light:bg-section-grey-light md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/46 light:text-zinc-500">
                Shipped · Week {latest.week} · {formatShippedRange(latest)}
              </p>
              {live ? <ShippedLiveBadge /> : null}
            </div>
            <h2
              id="shipped-strip-title"
              className="mt-3 font-sans text-[1.6rem] font-semibold leading-[1.1] text-balance text-light-space light:text-zinc-950 md:text-[2rem]"
            >
              <SiteLink href={getShippedHref(latest)} className="transition-colors hover:text-light-space/80 light:hover:text-zinc-700">
                {latest.headline}
              </SiteLink>
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {latest.items.slice(0, 4).map((item) => (
                <li
                  key={item.title}
                  className="rounded-full border border-light-space/[0.12] px-3 py-1.5 font-sans text-[13px] text-light-space/80 light:border-black/[0.1] light:text-zinc-700"
                >
                  {item.title}
                </li>
              ))}
            </ul>
            <SiteLink
              href="/shipped"
              className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-light-space transition-colors hover:text-light-space/80 light:text-zinc-950 light:hover:text-zinc-700"
            >
              Every week since day one
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </SiteLink>
          </div>
          <ShippedRibbon bars={bars} hrefFor={(slug) => `/shipped/${slug}`} className="h-28 md:h-32" showLabels={false} />
        </div>
      </div>
    </section>
  );
}
