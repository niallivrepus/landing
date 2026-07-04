import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const siteUrl = normalizeOrigin(
  process.env.VITE_SITE_URL || process.env.SITE_URL || process.env.URL || "https://www.jokuh.com",
);
const feedPath = "/rss.xml";

function normalizeOrigin(value) {
  return value.replace(/\/+$/, "");
}

function absoluteUrl(href) {
  if (/^https?:\/\//i.test(href)) return href;
  return `${siteUrl}${href.startsWith("/") ? href : `/${href}`}`;
}

function xmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripMarkdown(value) {
  return String(value ?? "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBlock(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return "";
  const assignmentIndex = source.indexOf("=", markerIndex);
  if (assignmentIndex === -1) return "";
  const arrayStart = source.indexOf("[", assignmentIndex);
  if (arrayStart === -1) return "";

  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = arrayStart; i < source.length; i += 1) {
    const char = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === "[") depth += 1;
    if (char === "]") depth -= 1;
    if (depth === 0) return source.slice(arrayStart + 1, i);
  }

  return "";
}

function extractObjectLiteral(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) return "";
  const assignmentIndex = source.indexOf("=", markerIndex);
  if (assignmentIndex === -1) return "";
  const objectStart = source.indexOf("{", assignmentIndex);
  if (objectStart === -1) return "";

  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = objectStart; i < source.length; i += 1) {
    const char = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(objectStart + 1, i);
  }

  return "";
}

function extractObjects(block) {
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = 0; i < block.length; i += 1) {
    const char = block[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        objects.push(block.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return objects;
}

function stringConstants(source) {
  const constants = new Map();
  const pattern = /const\s+([A-Za-z_$][\w$]*)\s*=\s*(["'`])([\s\S]*?)\2\s*;/g;
  for (const match of source.matchAll(pattern)) {
    constants.set(match[1], match[3]);
  }
  return constants;
}

function literalValue(value, constants = new Map()) {
  const trimmed = String(value ?? "").trim().replace(/,$/, "");
  const quoted = trimmed.match(/^(["'`])([\s\S]*?)\1$/);
  if (quoted) return quoted[2].replace(/\\(["'`])/g, "$1");
  return constants.get(trimmed);
}

function record(source, marker, constants = new Map()) {
  const objectLiteral = extractObjectLiteral(source, marker);
  const entries = new Map();
  const entryPattern = /(["'`])([^"'`]+)\1\s*:\s*([^,\n]+)/g;

  for (const match of objectLiteral.matchAll(entryPattern)) {
    const value = literalValue(match[3], constants);
    if (value) entries.set(match[2], value);
  }

  return entries;
}

function field(objectSource, name) {
  const match = objectSource.match(new RegExp(`${name}:\\s*(["'\`])([\\s\\S]*?)\\1`));
  return match?.[2]?.replace(/\\(["'`])/g, "$1");
}

function storyCardImages() {
  const artSource = readFileSync(join(root, "src/data/editorial-art.ts"), "utf8");
  return record(artSource, "STORY_CARD_IMAGE_BY_SLUG", stringConstants(artSource));
}

/**
 * Reads `NEWS_ITEM_IDS_PENDING_PARTNER_PERMISSION` from `news.ts` so RSS matches the public feed
 * (items withheld until partner/event clearance stay out of `public/rss.xml`).
 */
function pendingPartnerNewsIds(newsSource) {
  const inner = extractBlock(newsSource, "NEWS_ITEM_IDS_PENDING_PARTNER_PERMISSION");
  if (!inner) return new Set();
  const ids = [...inner.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  return new Set(ids);
}

function newsItems() {
  const newsSource = readFileSync(join(root, "src/data/news.ts"), "utf8");
  const pendingIds = pendingPartnerNewsIds(newsSource);
  const lockedImages = record(newsSource, "LOCKED_CARD_IMAGES_BY_NEWS_ID");
  const staticBlock = extractBlock(newsSource, "const STATIC_NEWS_ITEMS");
  const staticItems = extractObjects(staticBlock)
    .map((objectSource) => {
      const rawId = field(objectSource, "id");
      const slug = field(objectSource, "slug");
      if (pendingIds.has(rawId) || (slug && pendingIds.has(slug))) return null;

      const internalHref = field(objectSource, "internalHref");
      const externalUrl = field(objectSource, "externalUrl");
      const title = field(objectSource, "title");
      const publishedAt = field(objectSource, "publishedAt");

      if (!title || !publishedAt) return null;

      return {
        id: `news-${slug || rawId || title}`,
        title,
        description: field(objectSource, "excerpt") || "Latest update from Jokuh's newsroom.",
        category: field(objectSource, "category") || "Newsroom",
        publishedAt,
        url: externalUrl || internalHref || (slug ? `/newsroom/${slug}` : "/newsroom"),
        image: lockedImages.get(rawId) || field(objectSource, "cardImage") || field(objectSource, "cardOverlayImage"),
      };
    })
    .filter(Boolean);

  const mediumPayload = JSON.parse(readFileSync(join(root, "src/data/medium-feed.json"), "utf8"));
  const mediumItems = (mediumPayload.items || []).map((item) => ({
    id: `medium-${item.id}`,
    title: item.title,
    description: item.excerpt || "Latest update from Jokuh's newsroom.",
    category: "Newsroom",
    publishedAt: item.publishedAt,
    url: item.url,
    image: item.cardImage,
  }));

  const seenUrls = new Set(mediumItems.map((item) => item.url));
  return [...mediumItems, ...staticItems.filter((item) => !seenUrls.has(item.url))];
}

function storyItems() {
  const storiesSource = readFileSync(join(root, "src/data/stories-detail.ts"), "utf8");
  const imagesBySlug = storyCardImages();
  const storyPattern =
    /"([^"]+)":\s*\{[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?metaLine:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?dek:\s*"([^"]+)"/g;

  return [...storiesSource.matchAll(storyPattern)].map((match) => ({
    id: `story-${match[2]}`,
    title: match[4],
    description: match[5],
    category: "Stories",
    publishedAt: new Date(`${match[3].split(" · ")[0]} 12:00:00 UTC`).toISOString().slice(0, 10),
    url: `/stories/${match[2]}`,
    image: imagesBySlug.get(match[2]),
  }));
}

const items = [...newsItems(), ...storyItems()].sort(
  (a, b) => new Date(`${b.publishedAt}T12:00:00Z`) - new Date(`${a.publishedAt}T12:00:00Z`),
);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Jokuh newsroom and stories</title>
    <link>${xmlEscape(siteUrl)}</link>
    <atom:link href="${xmlEscape(absoluteUrl(feedPath))}" rel="self" type="application/rss+xml" />
    <description>Latest Jokuh newsroom articles and stories.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items
  .map((item) => {
    const url = absoluteUrl(item.url);
    return `    <item>
      <title>${xmlEscape(stripMarkdown(item.title))}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <description>${xmlEscape(stripMarkdown(item.description))}</description>
      <category>${xmlEscape(item.category)}</category>
      <pubDate>${new Date(`${item.publishedAt}T12:00:00Z`).toUTCString()}</pubDate>
${item.image ? `      <media:thumbnail url="${xmlEscape(absoluteUrl(item.image))}" />\n` : ""}    </item>`;
  })
  .join("\n")}
  </channel>
</rss>
`;

writeFileSync(join(root, "public/rss.xml"), rss, "utf8");
console.log(`Generated public/rss.xml with ${items.length} items.`);
