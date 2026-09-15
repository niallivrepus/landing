#!/usr/bin/env node
/**
 * **Purpose:** Draft the next weekly "Shipped" post from the jokuh-live commit log.
 *
 *   node scripts/draft-shipped-week.mjs                 # last finished ISO week, print only
 *   node scripts/draft-shipped-week.mjs --week 2026-W38 # a specific week
 *   node scripts/draft-shipped-week.mjs --write         # add it to src/data/shipped.json as draft: true
 *
 * The draft lists user-facing commits (feat/design/perf, with fixes kept separately), collapses the
 * iOS/web/Android copies of one feature into a single item, and leaves `headline`/`dek` empty.
 * Drafts never render or reach RSS: rewrite the copy for people, not engineers, then delete `draft`.
 * Repo path: `--repo` or `JOKUH_LIVE_REPO` (default ~/jokuh-live).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "src/data/shipped.json");
const DAY_MS = 86_400_000;

const args = process.argv.slice(2);
const argValue = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const repo = (argValue("--repo") || process.env.JOKUH_LIVE_REPO || join(homedir(), "jokuh-live")).replace(/^~/, homedir());
const shouldWrite = args.includes("--write");

const SKIP_TYPES = new Set(["docs", "chore", "ci", "test", "build", "ops", "wip", "style", "refactor", "revert", "merge"]);
/** Internal or sensitive work that never goes in a public post. */
const SKIP_PATTERN = /security|e2ee key|rls|secret|ssrf|key leak|investor|pitch|dataroom|migration|typecheck|testflight|budget|ci\b|railway|xcode|pbxproj/i;
const ALL_PLATFORMS = ["iOS", "Mac", "Web", "Android"];

function isoWeekStart(year, week) {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const mondayOfWeek1 = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * DAY_MS;
  return new Date(mondayOfWeek1 + (week - 1) * 7 * DAY_MS);
}

function isoWeekOf(date) {
  const thursday = new Date(date.getTime() + (3 - ((date.getUTCDay() + 6) % 7)) * DAY_MS);
  const year = thursday.getUTCFullYear();
  const week = Math.round((thursday.getTime() - isoWeekStart(year, 1).getTime()) / (7 * DAY_MS)) + 1;
  return { year, week };
}

function resolveWeek() {
  const requested = argValue("--week");
  if (requested) {
    const match = requested.match(/^(\d{4})-?W(\d{1,2})$/i);
    if (!match) throw new Error(`--week must look like 2026-W38, got ${requested}`);
    return { year: Number(match[1]), week: Number(match[2]) };
  }
  const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`);
  return isoWeekOf(new Date(today.getTime() - 7 * DAY_MS));
}

function platformsFor(scope, subject) {
  const text = `${scope} ${subject}`.toLowerCase();
  if (/every platform|everywhere|swift\/web\/android|ios, web(,| and) android/.test(text)) return ALL_PLATFORMS;
  const found = new Set();
  if (/android/.test(text)) found.add("Android");
  if (/\bweb\b|web-/.test(text)) found.add("Web");
  if (/\b(ios|apple|swift)\b/.test(text)) found.add("iOS").add("Mac");
  if (/\bmac\b/.test(text)) found.add("Mac");
  // Unscoped commits in jokuh-live land Swift-first.
  return found.size > 0 ? ALL_PLATFORMS.filter((p) => found.has(p)) : ["iOS", "Mac"];
}

function areaFor(scope) {
  const area = scope.replace(/^(android|web|ios|apple|swift)-?/, "").split(/[,/]/)[0] || "Platform";
  return area.charAt(0).toUpperCase() + area.slice(1);
}

function normalizeSubject(subject) {
  return subject
    .replace(/\s*\((?:ios|web|android|swift|mac|ios\/mac|web, android)[^)]*\)\s*$/i, "")
    .replace(/,?\s*matching (ios|web|android)( and (ios|web|android))?$/i, "")
    .trim();
}

const { year, week: isoWeek } = resolveWeek();
const start = isoWeekStart(year, isoWeek);
const end = new Date(start.getTime() + 6 * DAY_MS);
const startIso = start.toISOString().slice(0, 10);
const endIso = end.toISOString().slice(0, 10);

const log = execFileSync(
  "git",
  ["-C", repo, "log", "--no-merges", `--since=${startIso}T00:00:00`, `--until=${endIso}T23:59:59`, "--pretty=format:%h%x09%s"],
  { encoding: "utf8" },
).trim();
const commits = log ? log.split("\n").map((line) => line.split("\t")) : [];

const features = new Map();
const fixes = new Map();
for (const [hash, subject] of commits) {
  const match = subject.match(/^(\w+)(?:\(([^)]*)\))?!?:\s*(.+)$/);
  const type = (match?.[1] ?? "feat").toLowerCase();
  const scope = match?.[2] ?? "";
  const text = match?.[3] ?? subject;
  if (SKIP_TYPES.has(type) || SKIP_PATTERN.test(`${scope} ${text}`)) continue;

  const bucket = type === "fix" ? fixes : features;
  const key = normalizeSubject(text).toLowerCase();
  const existing = bucket.get(key);
  const platforms = platformsFor(scope, text);
  if (existing) {
    existing.platforms = ALL_PLATFORMS.filter((p) => existing.platforms.includes(p) || platforms.includes(p));
    existing.commits.push(hash);
  } else {
    bucket.set(key, { area: areaFor(scope), title: normalizeSubject(text), body: "", platforms, commits: [hash] });
  }
}

const payload = JSON.parse(readFileSync(dataPath, "utf8"));
const firstWeekStart = new Date(`${payload.firstWeekStart}T00:00:00Z`);
const slug = `${year}-w${String(isoWeek).padStart(2, "0")}`;
const draft = {
  slug,
  week: Math.round((start.getTime() - firstWeekStart.getTime()) / (7 * DAY_MS)) + 1,
  start: startIso,
  end: endIso,
  publishedAt: endIso,
  commits: commits.length,
  headline: "",
  dek: "",
  draft: true,
  items: [...features.values()],
  candidateFixes: [...fixes.values()],
};

if (!shouldWrite) {
  console.log(JSON.stringify(draft, null, 2));
  console.error(`\n${commits.length} commits, ${features.size} feature candidates, ${fixes.size} fix candidates. Re-run with --write to add the draft.`);
  process.exit(0);
}

const existingIndex = payload.weeks.findIndex((week) => week.slug === slug);
if (existingIndex !== -1 && !payload.weeks[existingIndex].draft) {
  console.error(`${slug} is already published in shipped.json; not overwriting it.`);
  process.exit(1);
}
if (existingIndex !== -1) payload.weeks.splice(existingIndex, 1);
payload.weeks.push(draft);
payload.weeks.sort((a, b) => b.start.localeCompare(a.start));
writeFileSync(dataPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Added draft ${slug} (week ${draft.week}) with ${draft.items.length} items. Write the headline, dek and item copy, then delete "draft".`);
