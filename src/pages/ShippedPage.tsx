import { useTheme, cn } from "@jokuh/gooey";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import { SiteLink } from "../components/SiteLink";
import { ShippedRibbon } from "../components/shipped/ShippedRibbon";
import { ShippedWeekEntry } from "../components/shipped/ShippedWeekEntry";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import {
  formatShippedMonth,
  getShippedHref,
  getShippedMonthlyBars,
  getShippedPeriodName,
  getShippedWeek,
  SHIPPED_SINCE,
  SHIPPED_TOTAL_COMMITS,
  SHIPPED_TOTAL_UPDATES,
  SHIPPED_WEEKS,
} from "../data/shipped";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <dt className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-light-space/46 light:text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-[1.75rem] font-semibold tabular-nums leading-none text-light-space light:text-zinc-950 md:text-[2rem]">
        {value}
      </dd>
    </div>
  );
}

/** `/shipped` — the build log, newest post first. */
export function ShippedPage() {
  useDocumentTitle("Shipped · Jokuh");
  const { resolvedTheme } = useTheme();
  const bars = getShippedMonthlyBars();
  const since = formatShippedMonth(SHIPPED_SINCE);

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
      mainClassName={cn(CONTENT_SHELL_WIDE, "pb-24 pt-24 md:pt-28")}
    >
      <header className="grid gap-10 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16 md:pb-16">
        <div>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/46 light:text-zinc-500">
            Build log
          </p>
          <h1 className="mt-3 font-sans text-[2.5rem] font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-[3.25rem] md:leading-[1.05]">
            Shipped
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-[15px] leading-7 text-light-space/60 light:text-zinc-600 md:text-[16px]">
            Every commit since {since}, and what it added up to. Straight from the commit log: a post every week,
            and monthly recaps before that.
          </p>
          <SiteLink
            href="/shipped/spine"
            className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-light-space transition-colors hover:text-light-space/80 light:text-zinc-950 light:hover:text-zinc-700"
          >
            See it as a Spine
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </SiteLink>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
            <Stat value={SHIPPED_SINCE.slice(0, 4)} label="Since" />
            <Stat value={SHIPPED_TOTAL_COMMITS.toLocaleString("en-US")} label="Commits" />
            <Stat value={SHIPPED_TOTAL_UPDATES} label="Updates" />
            <Stat value={4} label="Platforms" />
          </dl>
        </div>
        <ShippedRibbon
          bars={bars}
          hrefFor={(slug) => `#${slug}`}
          className="h-36 md:h-44"
          leftLabel={since}
          rightLabel="Now"
          ariaLabel="Commits per month"
        />
      </header>

      <ol className="space-y-14 md:space-y-20">
        {SHIPPED_WEEKS.map((week) => (
          <li key={week.slug} id={week.slug} className="scroll-mt-24">
            <ShippedWeekEntry week={week} />
          </li>
        ))}
      </ol>
    </MarketingPageFrame>
  );
}

function WeekNavLink({ slug, direction }: { slug?: string; direction: "newer" | "older" }) {
  const week = getShippedWeek(slug);
  if (!week) return <span />;
  const Icon = direction === "older" ? ArrowLeft : ArrowRight;

  return (
    <SiteLink
      href={getShippedHref(week)}
      className={cn(
        "group flex max-w-[48%] flex-col gap-1 font-sans no-underline",
        direction === "newer" && "items-end text-right",
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-light-space/46 light:text-zinc-500">
        {direction === "older" ? <Icon className="size-3.5" strokeWidth={1.75} /> : null}
        {getShippedPeriodName(week)}
        {direction === "newer" ? <Icon className="size-3.5" strokeWidth={1.75} /> : null}
      </span>
      <span className="text-[15px] font-semibold text-light-space transition-colors group-hover:text-light-space/80 light:text-zinc-950 light:group-hover:text-zinc-700">
        {week.headline}
      </span>
    </SiteLink>
  );
}

/** `/shipped/:slug` — one post on its own, for sharing. */
export function ShippedWeekPage() {
  const { slug } = useParams<{ slug: string }>();
  const week = getShippedWeek(slug);
  const { resolvedTheme } = useTheme();
  useDocumentTitle(week ? `${getShippedPeriodName(week)}: ${week.headline} · Jokuh` : "Shipped · Jokuh");

  if (!week) return <Navigate to="/shipped" replace />;

  const index = SHIPPED_WEEKS.indexOf(week);
  const newer = SHIPPED_WEEKS[index - 1];
  const older = SHIPPED_WEEKS[index + 1];

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
      mainClassName={cn(CONTENT_SHELL_WIDE, "pb-24 pt-24 md:pt-28")}
    >
      <SiteLink
        href="/shipped"
        className="mb-8 inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-light-space/70 transition-colors hover:text-light-space light:text-zinc-600 light:hover:text-zinc-950"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        Every week
      </SiteLink>

      <ShippedWeekEntry week={week} linkHeadline={false} />

      <nav
        aria-label="More posts"
        className="mt-16 flex items-start justify-between gap-6 border-t border-light-space/[0.1] pt-8 light:border-black/[0.08]"
      >
        <WeekNavLink slug={older?.slug} direction="older" />
        <WeekNavLink slug={newer?.slug} direction="newer" />
      </nav>
    </MarketingPageFrame>
  );
}
