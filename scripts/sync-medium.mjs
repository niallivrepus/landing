#!/usr/bin/env node
/**
 * Fetches Medium RSS (public feed — no API key) and writes src/data/medium-feed.json.
 * Set MEDIUM_RSS_URL e.g. https://medium.com/feed/@your-publication
 */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/medium-feed.json");

const PRESETS = [
  "linear-gradient(160deg, #020617 0%, #0f172a 45%, #1e3a5f 100%)",
  "linear-gradient(145deg, #020617 0%, #1e1b4b 50%, #312e81 100%)",
  "linear-gradient(135deg, #020617 0%, #0c4a6e 55%, #164e63 100%)",
  "linear-gradient(150deg, #020617 0%, #1e293b 40%, #334155 100%)",
  "linear-gradient(135deg, #020617 0%, #172554 50%, #0c4a6e 100%)",
];

function stripHtml(html) {
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagInner(block, localName) {
  const re = new RegExp(`<${localName}[^>]*>([\\s\\S]*?)</${localName}>`, "i");
  const m = block.match(re);
  if (!m) return "";
  let s = m[1].trim();
  if (s.startsWith("<![CDATA[")) {
    const end = s.indexOf("]]>");
    s = end === -1 ? s : s.slice(9, end);
  }
  return s.trim();
}

function parseRssItems(xml) {
  const items = [];
  const itemRe = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title = stripHtml(tagInner(block, "title"));
    const link = stripHtml(tagInner(block, "link"));
    const pubDateRaw = stripHtml(tagInner(block, "pubDate"));
    const guid = stripHtml(tagInner(block, "guid"));
    const description = tagInner(block, "description");
    if (!title || !link) continue;
    const excerpt = stripHtml(description).slice(0, 280);
    const d = pubDateRaw ? new Date(pubDateRaw) : new Date();
    const publishedAt = Number.isNaN(d.getTime())
      ? new Date().toISOString().slice(0, 10)
      : d.toISOString().slice(0, 10);
    const words = stripHtml(description).split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.round(words / 220) || 4);
    const idBase = guid || link;
    const id = Buffer.from(idBase).toString("base64url").slice(0, 24);
    items.push({
      id,
      title,
      excerpt: excerpt || undefined,
      publishedAt,
      url: link,
      readMinutes,
      cardGradient: PRESETS[items.length % PRESETS.length],
    });
  }
  return items;
}

const url = process.env.MEDIUM_RSS_URL?.trim();
if (!url) {
  console.warn("sync-medium: MEDIUM_RSS_URL not set — leaving medium-feed.json unchanged.");
  process.exit(0);
}

const res = await fetch(url, {
  headers: { "User-Agent": "JokuhLandingMediumSync/1.0" },
});
if (!res.ok) {
  console.error("sync-medium: fetch failed", res.status, res.statusText);
  process.exit(1);
}
const xml = await res.text();
const items = parseRssItems(xml);

const payload = {
  feedUrl: url,
  syncedAt: new Date().toISOString(),
  items,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`sync-medium: wrote ${items.length} items to src/data/medium-feed.json`);
