#!/usr/bin/env node
/**
 * **Purpose:** Publish the latest weekly Shipped posts as `public/shipped-feed.json` so the Jokuh apps can
 * turn them into "Jokuh update" memories in each person's Spine (synthesized client-side, never stored).
 * **Connects to:** `src/data/shipped.json` (posts), `src/data/shipped-activity.json` (commit counts),
 * `server/static-middleware.ts` (serves this file with CORS for app.jokuh.com). Runs in every build.
 * Drafts and monthly recaps are left out; only the newest `FEED_WEEKS` weekly posts ship.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = (process.env.VITE_SITE_URL || process.env.SITE_URL || "https://www.jokuh.com").replace(/\/+$/, "");
const FEED_WEEKS = 12;
const DAY_MS = 86_400_000;

function isoWeekKey(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const thursday = new Date(date.getTime() + (3 - ((date.getUTCDay() + 6) % 7)) * DAY_MS);
  const year = thursday.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const week1Monday = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * DAY_MS;
  const week = Math.round((thursday.getTime() - week1Monday) / (7 * DAY_MS)) + 1;
  return `${year}-W${String(week).padStart(2, "0")}`;
}

const posts = JSON.parse(readFileSync(join(root, "src/data/shipped.json"), "utf8")).weeks;
const activity = JSON.parse(readFileSync(join(root, "src/data/shipped-activity.json"), "utf8"));

const weeks = posts
  .filter((post) => !post.draft && post.kind !== "month")
  .sort((a, b) => b.start.localeCompare(a.start))
  .slice(0, FEED_WEEKS)
  .map((post) => ({
    slug: post.slug,
    week: post.week,
    start: post.start,
    end: post.end,
    publishedAt: post.publishedAt,
    headline: post.headline,
    dek: post.dek,
    commits: activity.weekly?.[isoWeekKey(post.start)] ?? post.commits ?? 0,
    url: `${siteUrl}/shipped/${post.slug}`,
    items: post.items.map(({ area, title, body, platforms }) => ({ area, title, body, platforms })),
  }));

const feed = {
  version: 1,
  generatedAt: new Date().toISOString(),
  totalCommits: activity.total ?? null,
  since: activity.since ?? null,
  url: `${siteUrl}/shipped`,
  weeks,
};

writeFileSync(join(root, "public/shipped-feed.json"), `${JSON.stringify(feed, null, 2)}\n`, "utf8");
console.log(`Generated public/shipped-feed.json with ${weeks.length} weeks.`);
