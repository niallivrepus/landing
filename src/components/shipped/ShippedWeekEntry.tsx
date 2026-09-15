import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";
import {
  formatShippedRange,
  getShippedCommits,
  getShippedHref,
  getShippedPeriodMark,
  isShippedMonthPost,
  isShippedWeekInProgress,
  SHIPPED_PLATFORMS,
  type ShippedPlatform,
  type ShippedWeek,
} from "../../data/shipped";

export function ShippedLiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-orange-5,#ff6a1a)_16%,transparent)] px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-orange-5,#ff6a1a)]">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      This week
    </span>
  );
}

export function PlatformChips({ platforms }: { platforms: ShippedPlatform[] }) {
  const everywhere = SHIPPED_PLATFORMS.every((platform) => platforms.includes(platform));
  const labels = everywhere ? ["Everywhere"] : SHIPPED_PLATFORMS.filter((platform) => platforms.includes(platform));

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Platforms">
      {labels.map((label) => (
        <li
          key={label}
          className={cn(
            "rounded-full px-2 py-0.5 font-sans text-[11px] font-medium",
            everywhere
              ? "bg-light-space text-dark-space light:bg-zinc-950 light:text-white"
              : "border border-light-space/[0.14] text-light-space/70 light:border-black/[0.12] light:text-zinc-600",
          )}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

/**
 * **Purpose:** One post of the build log — sticky period mark on the left (week number, or month for
 * recaps), headline + update cards on the right.
 * **Connects to:** `ShippedPage` list and detail views.
 */
export function ShippedWeekEntry({ week, linkHeadline = true }: { week: ShippedWeek; linkHeadline?: boolean }) {
  const month = isShippedMonthPost(week);
  const live = !month && isShippedWeekInProgress(week);
  const commits = getShippedCommits(week);

  return (
    <article className="grid gap-6 border-t border-light-space/[0.1] pt-8 light:border-black/[0.08] md:pt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
      <header className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/46 light:text-zinc-500">
          {month ? "Monthly recap" : "Week"}
        </p>
        <p
          className={cn(
            "font-sans font-semibold leading-none tabular-nums tracking-[-0.02em] text-light-space light:text-zinc-950",
            month ? "mt-1 text-[2.5rem] md:text-[3rem]" : "text-[3.5rem] md:text-[4.5rem]",
          )}
        >
          {getShippedPeriodMark(week)}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[13px] text-light-space/55 light:text-zinc-600">
          <span>{formatShippedRange(week)}</span>
          <span className="text-light-space/25 light:text-zinc-300" aria-hidden>
            ·
          </span>
          <span className="tabular-nums">
            {commits.toLocaleString("en-US")} {commits === 1 ? "commit" : "commits"}
          </span>
        </div>
        {live ? (
          <div className="mt-3">
            <ShippedLiveBadge />
          </div>
        ) : null}
      </header>

      <div className="min-w-0">
        <h2 className="font-sans text-[1.75rem] font-semibold leading-[1.08] tracking-[0em] text-balance text-light-space light:text-zinc-950 md:text-[2.25rem]">
          {linkHeadline ? (
            <SiteLink
              href={getShippedHref(week)}
              className="transition-colors hover:text-light-space/80 light:hover:text-zinc-700"
            >
              {week.headline}
            </SiteLink>
          ) : (
            week.headline
          )}
        </h2>
        <p className="mt-3 max-w-3xl text-pretty text-[15px] leading-7 text-light-space/60 light:text-zinc-600 md:text-[16px]">
          {week.dek}
        </p>

        <ul className="mt-7 grid gap-3 sm:grid-cols-2 md:gap-4">
          {week.items.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-3 rounded-[22px] border border-light-space/[0.08] bg-white/[0.03] p-5 light:border-black/[0.06] light:bg-section-grey-light"
            >
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-light-space/46 light:text-zinc-500">
                {item.area}
              </p>
              <h3 className="font-sans text-[1.05rem] font-semibold leading-[1.2] text-light-space light:text-zinc-950">
                {item.title}
              </h3>
              <p className="flex-1 text-pretty text-[14px] leading-6 text-light-space/62 light:text-zinc-600">
                {item.body}
              </p>
              <PlatformChips platforms={item.platforms} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
