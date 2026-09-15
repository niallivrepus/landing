#!/usr/bin/env node
/**
 * **Purpose:** Refresh the commit counts behind jokuh.com/shipped.
 *
 *   node scripts/count-shipped-activity.mjs
 *
 * `src/data/shipped-activity.json` keeps a `frozen` block — weekly/monthly counts from the finished repos
 * (skeleton, supervillain, gooey, the old jokuh repo), baked once because their history never changes.
 * This script adds the repos still in use (jokuh-live and this landing repo, `main` only, no merges),
 * dedupes by hash and by author+time+subject, and writes the combined `weekly`, `monthly` and `total`.
 * Weeks are ISO weeks (`2026-W38`) and months `2026-09`, both in the author's timezone, same as `frozen`.
 * Repo path: `JOKUH_LIVE_REPO` (default ~/jokuh-live).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = join(root, "src/data/shipped-activity.json");

const LIVE_REPOS = [
  { name: "jokuh-live", path: (process.env.JOKUH_LIVE_REPO || join(homedir(), "jokuh-live")).replace(/^~/, homedir()) },
  { name: "landing", path: root },
];

function liveRows({ path }) {
  const out = execFileSync(
    "git",
    ["-C", path, "log", "main", "--no-merges", "--pretty=format:%H%x1f%an%x1f%at%x1f%ad%x1f%s", "--date=format:%G-W%V/%Y-%m"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  return out ? out.split("\n").map((line) => line.split("\x1f")) : [];
}

const payload = JSON.parse(readFileSync(dataPath, "utf8"));
const weekly = { ...payload.frozen.weekly };
const monthly = { ...payload.frozen.monthly };
let total = payload.frozen.total;

const seenHash = new Set();
const seenKey = new Set();
for (const repo of LIVE_REPOS) {
  for (const [hash, author, at, bucket, subject] of liveRows(repo)) {
    const key = `${author}|${at}|${subject}`;
    if (seenHash.has(hash) || seenKey.has(key)) continue;
    seenHash.add(hash);
    seenKey.add(key);
    const [week, month] = bucket.split("/");
    weekly[week] = (weekly[week] ?? 0) + 1;
    monthly[month] = (monthly[month] ?? 0) + 1;
    total += 1;
  }
}

const sortKeys = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
payload.total = total;
payload.updatedAt = new Date().toISOString().slice(0, 10);
payload.weekly = sortKeys(weekly);
payload.monthly = sortKeys(monthly);
writeFileSync(dataPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`shipped-activity: ${total} commits since ${payload.since} (${seenHash.size} from live repos).`);
