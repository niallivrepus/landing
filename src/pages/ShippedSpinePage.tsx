import { cn, useTheme } from "@jokuh/gooey";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useCallback, useMemo, useState, type ReactNode } from "react";
import { SiteLink } from "../components/SiteLink";
import { ShippedMemorySheet, type ShippedMemorySheetState } from "../components/shipped/spine/ShippedMemorySheet";
import { shippedAreaVisual } from "../components/shipped/spine/shipped-spine-tones";
import { MarketingPageFrame } from "../components/system";
import { CONTENT_SHELL_WIDE } from "../components/system/shells";
import {
  formatShippedMonth,
  getShippedCommits,
  getShippedMonthCommits,
  getShippedMonthKeys,
  getShippedPeriodName,
  getShippedYearCommits,
  isShippedMonthPost,
  isShippedWeekInProgress,
  SHIPPED_SINCE,
  SHIPPED_TOTAL_COMMITS,
  SHIPPED_WEEKS,
  type ShippedWeek,
} from "../data/shipped";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

/** The month the current Jokuh line (supervillain → jokuh-live) began; earlier months are the older codebase. */
const CURRENT_LINE_START = "2025-06";

type SpineMonth = {
  key: string;
  year: number;
  name: string;
  commits: number;
  recap?: ShippedWeek;
  weeks: ShippedWeek[];
};

const monthShort = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const weekdayShort = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
const dayNumber = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" });
const todayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });

function buildMonths(): SpineMonth[] {
  return getShippedMonthKeys().map((key) => ({
    key,
    year: Number(key.slice(0, 4)),
    name: monthShort.format(new Date(`${key}-01T00:00:00Z`)),
    commits: getShippedMonthCommits(key),
    recap: SHIPPED_WEEKS.find(
      (post) => isShippedMonthPost(post) && post.start.slice(0, 7) <= key && post.end.slice(0, 7) >= key,
    ),
    weeks: SHIPPED_WEEKS.filter((post) => !isShippedMonthPost(post) && post.publishedAt.slice(0, 7) === key),
  }));
}

/** Solid pill fills so the cord doesn't show through. */
const PILL = "bg-[#141416] ring-1 ring-white/[0.07] light:bg-[#f2f2f4] light:ring-black/[0.06]";
const PILL_OPEN = "bg-[#26262a] ring-white/[0.14] light:bg-[#e6e6ea] light:ring-black/[0.1]";

function Reveal({ open, children }: { open: boolean; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="reveal"
          className="w-full overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-3 py-3">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function YearRule({ year }: { year: number }) {
  return (
    <div className="relative z-[1] flex w-full items-center gap-3 py-2" role="separator" aria-label={String(year)}>
      <span className="h-px flex-1 bg-white/[0.12] light:bg-black/[0.1]" />
      <span className="rounded-full bg-dark-space px-2 font-sans text-[11px] font-medium tabular-nums tracking-[0.08em] text-white/45 light:bg-white light:text-zinc-500">
        {year} · {getShippedYearCommits(year).toLocaleString("en-US")} commits
      </span>
      <span className="h-px flex-1 bg-white/[0.12] light:bg-black/[0.1]" />
    </div>
  );
}

function MemoryChip({ area, title, onOpen }: { area: string; title: string; onOpen: () => void }) {
  const visual = shippedAreaVisual(area);
  const Icon = visual.icon;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative z-[1] inline-flex h-10 max-w-full items-center gap-2 rounded-full border-2 border-white/[0.1] bg-[#29292b] py-0 pl-[3px] pr-3.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform hover:-translate-y-px active:translate-y-0",
        "light:border-black/[0.08] light:bg-white light:shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
      )}
    >
      <span
        aria-hidden
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: visual.background, color: visual.ink }}
      >
        <Icon className="size-4" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 truncate font-sans text-[13px] font-medium text-white/90 light:text-zinc-900">{title}</span>
    </button>
  );
}

function DayPill({
  week,
  open,
  onToggle,
}: {
  week: ShippedWeek;
  open: boolean;
  onToggle: () => void;
}) {
  const date = new Date(`${week.publishedAt}T00:00:00Z`);
  const live = isShippedWeekInProgress(week);
  return (
    <div className="relative z-[1] flex items-center gap-2">
      {live ? (
        <span className="rounded-full bg-[var(--color-orange-5,#ff6a1a)] px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-black">
          Now
        </span>
      ) : null}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${getShippedPeriodName(week)}: ${week.headline}`}
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-full px-[7px] font-sans transition-colors",
          open ? PILL_OPEN : PILL,
        )}
      >
        <span className="text-[9px] font-medium uppercase tracking-[0.06em] text-white/55 light:text-zinc-500">
          {weekdayShort.format(date)}
        </span>
        <span aria-hidden className="flex h-7 w-1.5 items-center justify-center">
          <span
            className={cn(
              "size-1.5 rounded-full",
              live ? "bg-[var(--color-orange-5,#ff6a1a)]" : open ? "bg-white light:bg-zinc-900" : "bg-white/40 light:bg-zinc-400",
            )}
          />
        </span>
        <span className={cn("text-[12px] tabular-nums text-white/90 light:text-zinc-900", live && "font-bold")}>
          {dayNumber.format(date)}
        </span>
      </button>
    </div>
  );
}

function RecapCapsule({ post, onOpen }: { post: ShippedWeek; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "relative z-[1] w-full max-w-[300px] rounded-[22px] p-4 text-left transition-transform hover:-translate-y-px",
        "bg-[linear-gradient(160deg,#1d1330,#141416_60%)] ring-1 ring-[#b200ff]/30 light:bg-[linear-gradient(160deg,#f3eaff,#ffffff_60%)] light:ring-[#7700ff]/20",
      )}
    >
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c78bff] light:text-[#7700ff]">
        Month in review · {post.label}
      </p>
      <p className="mt-1.5 font-sans text-[15px] font-semibold leading-snug text-white light:text-zinc-950">{post.headline}</p>
      <p className="mt-1 font-sans text-[12px] tabular-nums text-white/50 light:text-zinc-500">
        {post.items.length} updates · {getShippedCommits(post).toLocaleString("en-US")} commits
      </p>
    </button>
  );
}

function QuietNote({ month }: { month: SpineMonth }) {
  const text =
    month.commits === 0
      ? "A quiet month"
      : month.key < CURRENT_LINE_START
        ? `${month.commits.toLocaleString("en-US")} commits in the earlier Jokuh codebase`
        : `${month.commits.toLocaleString("en-US")} commits, no write-up`;
  return (
    <p className={cn("relative z-[1] rounded-full px-3 py-1 font-sans text-[12px] text-white/50 light:text-zinc-500", PILL)}>
      {text}
    </p>
  );
}

/**
 * **Purpose:** `/shipped/spine` — Jokuh's own build history laid out like the Spine in the app: year rules,
 * month capsules, day pills on a centre cord, memory chips that open the app's memory sheet. Newest first,
 * so scrolling down goes back in time.
 * **Connects to:** `data/shipped.ts` (posts + commit counts), `ShippedMemorySheet`, list view at `/shipped`.
 */
export function ShippedSpinePage() {
  useDocumentTitle("Our Spine · Jokuh");
  const { resolvedTheme } = useTheme();
  const months = useMemo(buildMonths, []);
  const latestWeek = SHIPPED_WEEKS.find((post) => !isShippedMonthPost(post));
  const [openMonth, setOpenMonth] = useState<string | null>(months[0]?.key ?? null);
  const [openDay, setOpenDay] = useState<string | null>(latestWeek?.slug ?? null);
  const [sheet, setSheet] = useState<ShippedMemorySheetState>(null);
  const closeSheet = useCallback(() => setSheet(null), []);
  const selectItem = useCallback(
    (itemIndex: number | null) => setSheet((current) => (current ? { ...current, itemIndex } : current)),
    [],
  );

  return (
    <MarketingPageFrame
      withAntialiased
      withFontSans
      theme={resolvedTheme === "light" ? "light" : "dark"}
      mainClassName={cn(CONTENT_SHELL_WIDE, "pb-24 pt-24 md:pt-28")}
    >
      <header className="mx-auto max-w-xl text-center">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-light-space/46 light:text-zinc-500">
          Build log
        </p>
        <h1 className="mt-3 font-sans text-[2.5rem] font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-[3.25rem] md:leading-[1.05]">
          Our Spine
        </h1>
        <p className="mt-4 text-pretty text-[15px] leading-7 text-light-space/60 light:text-zinc-600 md:text-[16px]">
          Everything we've built, kept the way Jokuh keeps your days. Open a month, pick a day, tap a memory.{" "}
          {SHIPPED_TOTAL_COMMITS.toLocaleString("en-US")} commits since {formatShippedMonth(SHIPPED_SINCE)}.
        </p>
        <SiteLink
          href="/shipped"
          className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-light-space transition-colors hover:text-light-space/80 light:text-zinc-950 light:hover:text-zinc-700"
        >
          Prefer a list? Shipped
          <ArrowRight className="size-4" strokeWidth={1.75} />
        </SiteLink>
      </header>

      <div className="relative mx-auto mt-12 flex w-full max-w-[360px] flex-col items-center gap-3 md:mt-16">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 top-0 w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,106,26,0.7),rgba(255,255,255,0.12)_12%,rgba(255,255,255,0.06))] light:bg-[linear-gradient(180deg,rgba(255,106,26,0.7),rgba(0,0,0,0.1)_12%,rgba(0,0,0,0.05))]"
        />

        <p className={cn("relative z-[1] inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-sans text-[12px] font-medium text-white/85 light:text-zinc-800", PILL)}>
          <span className="size-1.5 rounded-full bg-[var(--color-orange-5,#ff6a1a)]" aria-hidden />
          Now · {todayLabel.format(new Date())}
        </p>

        {months.map((month, index) => {
          const open = openMonth === month.key;
          const showYear = index === 0 || months[index - 1].year !== month.year;
          const hasPosts = Boolean(month.recap) || month.weeks.length > 0;
          return (
            <Fragment key={month.key}>
              {showYear ? <YearRule year={month.year} /> : null}
              <section aria-label={`${month.name} ${month.year}`} className="flex w-full flex-col items-center">
                <button
                  type="button"
                  onClick={() => setOpenMonth(open ? null : month.key)}
                  aria-expanded={open}
                  className={cn(
                    "relative z-[1] inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 font-sans text-[14px] transition-colors",
                    open ? PILL_OPEN : PILL,
                    open || index === 0 ? "text-white/92 light:text-zinc-950" : "text-white/55 light:text-zinc-500",
                  )}
                >
                  <span className="font-medium">{month.name}</span>
                  <span className="text-[11px] tabular-nums opacity-60">{month.commits.toLocaleString("en-US")}</span>
                  {hasPosts ? (
                    <span aria-hidden className="size-1 rounded-full bg-current opacity-60" />
                  ) : null}
                </button>

                <Reveal open={open}>
                  {month.recap ? <RecapCapsule post={month.recap} onOpen={() => setSheet({ post: month.recap!, itemIndex: null })} /> : null}
                  {month.weeks.map((week) => {
                    const dayOpen = openDay === week.slug;
                    return (
                      <div key={week.slug} className="flex w-full flex-col items-center">
                        <DayPill week={week} open={dayOpen} onToggle={() => setOpenDay(dayOpen ? null : week.slug)} />
                        <Reveal open={dayOpen}>
                          <button
                            type="button"
                            onClick={() => setSheet({ post: week, itemIndex: null })}
                            className={cn(
                              "relative z-[1] max-w-full rounded-full px-3 py-1 text-center font-sans text-[12px] text-white/70 transition-colors hover:text-white light:text-zinc-600 light:hover:text-zinc-950",
                              PILL,
                            )}
                          >
                            {getShippedPeriodName(week)} · <span className="font-semibold">{week.headline}</span>
                          </button>
                          {week.items.map((item, itemIndex) => (
                            <MemoryChip
                              key={item.title}
                              area={item.area}
                              title={item.title}
                              onOpen={() => setSheet({ post: week, itemIndex })}
                            />
                          ))}
                        </Reveal>
                      </div>
                    );
                  })}
                  {!hasPosts ? <QuietNote month={month} /> : null}
                </Reveal>
              </section>
            </Fragment>
          );
        })}

        <p className={cn("relative z-[1] mt-2 rounded-full px-3 py-1.5 font-sans text-[12px] text-white/55 light:text-zinc-500", PILL)}>
          First commit · {formatShippedMonth(SHIPPED_SINCE)}
        </p>
      </div>

      <ShippedMemorySheet state={sheet} onClose={closeSheet} onSelectItem={selectItem} />
    </MarketingPageFrame>
  );
}
