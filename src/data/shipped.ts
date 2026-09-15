import shippedPayload from "./shipped.json";

/**
 * **Purpose:** Weekly "Shipped" build log — one post per active week, backdated from the jokuh-live
 * commit history (week 1 = the week of the first commit, 2026-03-23).
 * **Connects to:** `ShippedPage` (`/shipped`, `/shipped/:slug`), `ShippedStrip` on Home,
 * `scripts/generate-rss.mjs` (reads the JSON directly), `scripts/draft-shipped-week.mjs` (drafts new weeks).
 * Entries with `draft: true` are hidden from the site and RSS until the copy is approved.
 */

export type ShippedPlatform = "iOS" | "Mac" | "Web" | "Android";

export type ShippedItem = {
  area: string;
  title: string;
  body: string;
  platforms: ShippedPlatform[];
};

export type ShippedWeek = {
  slug: string;
  week: number;
  start: string;
  end: string;
  publishedAt: string;
  commits: number;
  headline: string;
  dek: string;
  items: ShippedItem[];
  draft?: boolean;
};

export type ShippedRibbonBar = {
  week: number;
  start: string;
  commits: number;
  slug?: string;
};

export const SHIPPED_PLATFORMS: ShippedPlatform[] = ["iOS", "Mac", "Web", "Android"];

/** Newest first. */
export const SHIPPED_WEEKS: ShippedWeek[] = (shippedPayload.weeks as ShippedWeek[])
  .filter((week) => !week.draft)
  .sort((a, b) => b.start.localeCompare(a.start));

export const SHIPPED_TOTAL_COMMITS = SHIPPED_WEEKS.reduce((sum, week) => sum + week.commits, 0);

export const SHIPPED_TOTAL_UPDATES = SHIPPED_WEEKS.reduce((sum, week) => sum + week.items.length, 0);

const DAY_MS = 86_400_000;

function utcDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

function isoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** Every week from week 1 to the latest post, quiet weeks included, oldest first. */
export function getShippedRibbon(): ShippedRibbonBar[] {
  const latest = SHIPPED_WEEKS[0];
  if (!latest) return [];
  const bySlugWeek = new Map(SHIPPED_WEEKS.map((week) => [week.week, week]));
  const first = utcDate(shippedPayload.firstWeekStart);

  return Array.from({ length: latest.week }, (_, index) => {
    const number = index + 1;
    const post = bySlugWeek.get(number);
    return {
      week: number,
      start: post?.start ?? isoDay(new Date(first.getTime() + index * 7 * DAY_MS)),
      commits: post?.commits ?? 0,
      slug: post?.slug,
    };
  });
}

export function getShippedWeek(slug: string | undefined) {
  if (!slug) return undefined;
  return SHIPPED_WEEKS.find((week) => week.slug === slug.toLowerCase());
}

export function getShippedHref(week: Pick<ShippedWeek, "slug">) {
  return `/shipped/${week.slug}`;
}

/** True while the week's Sunday hasn't passed yet — the post is still filling in. */
export function isShippedWeekInProgress(week: Pick<ShippedWeek, "end">, now = new Date()) {
  return now.getTime() < utcDate(week.end).getTime() + DAY_MS;
}

const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const dayOnly = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** "Sep 7 – 13" or "Aug 31 – Sep 6". */
export function formatShippedRange(week: Pick<ShippedWeek, "start" | "end">) {
  const start = utcDate(week.start);
  const end = utcDate(week.end);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  return `${monthDay.format(start)} – ${sameMonth ? dayOnly.format(end) : monthDay.format(end)}`;
}

export function formatShippedMonth(iso: string) {
  return monthYear.format(utcDate(iso));
}
