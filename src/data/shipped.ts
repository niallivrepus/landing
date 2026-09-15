import activity from "./shipped-activity.json";
import shippedPayload from "./shipped.json";

/**
 * **Purpose:** The "Shipped" build log — weekly posts from March 2026, monthly recaps from June 2025,
 * and commit counts back to the first Jokuh commit (December 2023).
 * **Connects to:** `ShippedPage` (`/shipped`, `/shipped/:slug`), `ShippedStrip` on Home,
 * `scripts/generate-rss.mjs` (reads the JSON directly), `scripts/draft-shipped-week.mjs` (drafts new weeks),
 * `scripts/count-shipped-activity.mjs` (refreshes `shipped-activity.json`, the only source of commit counts).
 * Week numbers count from Week 1 = 2025-06-02 (the first week of the current Jokuh line).
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
  /** "week" posts cover one ISO week; "month" posts are recaps of a month (or a few quiet months). */
  kind?: "week" | "month";
  week?: number;
  /** Month posts only: "October 2025", "Summer 2025". */
  label?: string;
  start: string;
  end: string;
  publishedAt: string;
  commits?: number;
  headline: string;
  dek: string;
  items: ShippedItem[];
  draft?: boolean;
};

export type ShippedBar = {
  key: string;
  label: string;
  commits: number;
  slug?: string;
};

export const SHIPPED_PLATFORMS: ShippedPlatform[] = ["iOS", "Mac", "Web", "Android"];

const WEEKLY: Record<string, number> = activity.weekly;
const MONTHLY: Record<string, number> = activity.monthly;

/** First commit date across every Jokuh repo. */
export const SHIPPED_SINCE: string = activity.since;
export const SHIPPED_TOTAL_COMMITS: number = activity.total;

/** Newest first. */
export const SHIPPED_WEEKS: ShippedWeek[] = (shippedPayload.weeks as ShippedWeek[])
  .filter((post) => !post.draft)
  .sort((a, b) => b.start.localeCompare(a.start));

export const SHIPPED_TOTAL_UPDATES = SHIPPED_WEEKS.reduce((sum, post) => sum + post.items.length, 0);

const DAY_MS = 86_400_000;

function utcDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

export function isShippedMonthPost(post: Pick<ShippedWeek, "kind">) {
  return post.kind === "month";
}

/** "2026-W38" for a Monday (or any day) in that ISO week. */
function isoWeekKeyOf(date: Date) {
  const thursday = new Date(date.getTime() + (3 - ((date.getUTCDay() + 6) % 7)) * DAY_MS);
  const year = thursday.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const week1Monday = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * DAY_MS;
  const week = Math.round((thursday.getTime() - week1Monday) / (7 * DAY_MS)) + 1;
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** "2025-06" … "2025-08" inclusive. */
function monthKeysBetween(startMonth: string, endMonth: string) {
  const keys: string[] = [];
  let [year, month] = startMonth.split("-").map(Number);
  const [endYear, endMonthNumber] = endMonth.split("-").map(Number);
  while (year < endYear || (year === endYear && month <= endMonthNumber)) {
    keys.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return keys;
}

/** Commits in the post's period, from `shipped-activity.json` (every Jokuh repo, deduped). */
export function getShippedCommits(post: ShippedWeek) {
  if (isShippedMonthPost(post)) {
    return monthKeysBetween(post.start.slice(0, 7), post.end.slice(0, 7)).reduce(
      (sum, key) => sum + (MONTHLY[key] ?? 0),
      0,
    );
  }
  return WEEKLY[isoWeekKeyOf(utcDate(post.start))] ?? post.commits ?? 0;
}

export function getShippedWeek(slug: string | undefined) {
  if (!slug) return undefined;
  return SHIPPED_WEEKS.find((post) => post.slug === slug.toLowerCase());
}

export function getShippedHref(post: Pick<ShippedWeek, "slug">) {
  return `/shipped/${post.slug}`;
}

/** True while the period's last day hasn't passed yet — the post is still filling in. */
export function isShippedWeekInProgress(post: Pick<ShippedWeek, "end">, now = new Date()) {
  return now.getTime() < utcDate(post.end).getTime() + DAY_MS;
}

const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const dayOnly = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" });
const monthShort = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const monthLong = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** "Week 68" or "October 2025". */
export function getShippedPeriodName(post: ShippedWeek) {
  if (isShippedMonthPost(post)) return post.label ?? monthLong.format(utcDate(post.start));
  return `Week ${post.week}`;
}

/** Big header text: the week number, or "Oct" / "Jun–Aug" for recaps. */
export function getShippedPeriodMark(post: ShippedWeek) {
  if (!isShippedMonthPost(post)) return String(post.week);
  const start = monthShort.format(utcDate(post.start));
  const end = monthShort.format(utcDate(post.end));
  return start === end ? start : `${start}–${end}`;
}

/** "Sep 7 – 13", "Aug 31 – Sep 6", or "2025" for recaps. */
export function formatShippedRange(post: ShippedWeek) {
  const start = utcDate(post.start);
  const end = utcDate(post.end);
  if (isShippedMonthPost(post)) return String(start.getUTCFullYear());
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  return `${monthDay.format(start)} – ${sameMonth ? dayOnly.format(end) : monthDay.format(end)}`;
}

export function formatShippedMonth(iso: string) {
  return monthYear.format(utcDate(iso));
}

function postCovering(startIso: string, endIso: string) {
  return [...SHIPPED_WEEKS]
    .reverse()
    .find((post) => post.start <= endIso && post.end >= startIso);
}

export function getShippedMonthCommits(monthKey: string) {
  return MONTHLY[monthKey] ?? 0;
}

export function getShippedYearCommits(year: number) {
  return Object.entries(MONTHLY).reduce((sum, [key, count]) => (key.startsWith(`${year}-`) ? sum + count : sum), 0);
}

/** Every month from the first commit to the newest counted month, newest first ("2026-09", …, "2023-12"). */
export function getShippedMonthKeys() {
  const lastMonth = Object.keys(MONTHLY).sort().pop() ?? SHIPPED_SINCE.slice(0, 7);
  return monthKeysBetween(SHIPPED_SINCE.slice(0, 7), lastMonth).reverse();
}

/** One bar per month since the first commit, oldest first; each links to the earliest post covering it. */
export function getShippedMonthlyBars(): ShippedBar[] {
  const lastMonth = Object.keys(MONTHLY).sort().pop() ?? SHIPPED_SINCE.slice(0, 7);
  return monthKeysBetween(SHIPPED_SINCE.slice(0, 7), lastMonth).map((key) => {
    const [year, month] = key.split("-").map(Number);
    const monthEnd = new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
    const commits = MONTHLY[key] ?? 0;
    return {
      key,
      label: `${formatShippedMonth(`${key}-01`)}, ${commits.toLocaleString("en-US")} ${commits === 1 ? "commit" : "commits"}`,
      commits,
      slug: postCovering(`${key}-01`, monthEnd)?.slug,
    };
  });
}

/** The last `count` ISO weeks up to the newest weekly post, oldest first. */
export function getShippedWeeklyBars(count: number): ShippedBar[] {
  const latest = SHIPPED_WEEKS.find((post) => !isShippedMonthPost(post));
  if (!latest) return [];
  const latestMonday = utcDate(latest.start).getTime();

  return Array.from({ length: count }, (_, index) => {
    const monday = new Date(latestMonday - (count - 1 - index) * 7 * DAY_MS);
    const key = isoWeekKeyOf(monday);
    const startIso = monday.toISOString().slice(0, 10);
    const commits = WEEKLY[key] ?? 0;
    const post = SHIPPED_WEEKS.find((candidate) => !isShippedMonthPost(candidate) && candidate.start === startIso);
    return {
      key,
      label: `Week of ${monthDay.format(monday)}, ${commits} ${commits === 1 ? "commit" : "commits"}`,
      commits,
      slug: post?.slug,
    };
  });
}
