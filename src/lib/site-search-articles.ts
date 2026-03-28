import { formatNewsDate, getNewsHref, type NewsItem, NEWS_ITEMS } from "../data/news";
import { HOME_STORIES, type HomeStory } from "../data/home-stories";
import { PRODUCT_IDS, type ProductId, PRODUCTS } from "../data/products";
import { STORY_DETAILS } from "../data/stories-detail";

export type SiteArticleHit = {
  href: string;
  title: string;
  snippet: string;
  /** e.g. "Newsroom · Mar 5, 2026" or "Product" */
  meta: string;
  image?: string;
  external: boolean;
  /** ISO date for tie-break sort */
  publishedAt?: string;
};

type CorpusEntry = {
  hit: SiteArticleHit;
  searchText: string;
};

const STOP = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "as",
  "by",
  "with",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "what",
  "which",
  "who",
  "how",
  "when",
  "where",
  "why",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "we",
  "our",
  "you",
  "your",
  "me",
  "my",
  "they",
  "them",
  "about",
  "into",
  "through",
  "over",
  "after",
  "before",
  "between",
  "under",
  "again",
  "here",
  "there",
  "all",
  "each",
  "few",
  "more",
  "most",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "tell",
  "jokuh",
]);

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function hrefForNews(n: NewsItem): { href: string; external: boolean } {
  if (n.internalHref) return { href: getNewsHref(n), external: false };
  if (n.externalUrl) return { href: n.externalUrl, external: true };
  return { href: "/newsroom", external: false };
}

function newsToHit(n: NewsItem): SiteArticleHit {
  const { href, external } = hrefForNews(n);
  const dateLabel = formatNewsDate(n.publishedAt);
  const meta = external ? `Article · ${dateLabel}` : `Newsroom · ${dateLabel}`;
  return {
    href,
    title: n.title,
    snippet:
      n.excerpt?.trim() ||
      `${n.category}${n.topics.length ? ` · ${n.topics.join(", ")}` : ""} · ${n.readMinutes} min read`,
    meta,
    image: n.cardImage,
    external,
    publishedAt: n.publishedAt,
  };
}

function storyToHit(story: HomeStory): SiteArticleHit {
  const detail = STORY_DETAILS[story.slug];
  const metaLine = detail?.metaLine
    ?.split("·")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");

  return {
    href: story.href,
    title: detail?.title ?? story.title,
    snippet: detail?.dek ?? `Story from the Jokuh editorial archive.`,
    meta: metaLine ? `Story · ${metaLine}` : "Story",
    image: story.image,
    external: false,
  };
}

function productToHit(id: ProductId): SiteArticleHit {
  const p = PRODUCTS[id];
  return {
    href: `/${id}`,
    title: p.title,
    snippet: p.summary,
    meta: "Product",
    external: false,
  };
}

const CURATED: SiteArticleHit[] = [
  {
    href: "/stories",
    title: "Stories",
    snippet: "Human-centered stories from teams, makers, and operators using Jokuh.",
    meta: "Stories",
    external: false,
  },
  {
    href: "/newsroom",
    title: "Newsroom",
    snippet: "Corporate, engineering, and product updates from Jokuh.",
    meta: "Newsroom",
    external: false,
  },
  {
    href: "/about",
    title: "About Jokuh",
    snippet: "Mission, team, and how we think about ambient intelligence.",
    meta: "Company",
    external: false,
  },
  {
    href: "/developers/docs",
    title: "Developer documentation",
    snippet: "Quickstart, cookbook, and guides for building on Jokuh.",
    meta: "Developers",
    external: false,
  },
  {
    href: "/waitlist",
    title: "Waitlist",
    snippet: "Request early access and regional rollout updates.",
    meta: "Page",
    external: false,
  },
  {
    href: "/#prompt",
    title: "Prompt bar",
    snippet: "The command surface that ties pods, blurbs, and inference together.",
    meta: "Product",
    external: false,
  },
  {
    href: "/careers",
    title: "Careers",
    snippet: "Open roles across design systems, realtime infra, and product.",
    meta: "Company",
    external: false,
  },
];

function entryForHit(hit: SiteArticleHit, searchText?: string): CorpusEntry {
  return { hit, searchText: searchText ?? `${hit.title} ${hit.snippet} ${hit.meta}` };
}

function buildCorpus(): CorpusEntry[] {
  const fromNews = NEWS_ITEMS.map((item) =>
    entryForHit(newsToHit(item), `${item.title} ${item.excerpt ?? ""} ${item.category} ${item.topics.join(" ")}`),
  );
  const seen = new Set(fromNews.map((entry) => entry.hit.href));
  const fromStories: CorpusEntry[] = [];
  for (const story of HOME_STORIES) {
    const hit = storyToHit(story);
    if (seen.has(hit.href)) continue;
    seen.add(hit.href);
    const detail = STORY_DETAILS[story.slug];
    fromStories.push(
      entryForHit(
        hit,
        `${hit.title} ${detail?.dek ?? ""} ${detail?.metaLine ?? ""} ${story.title}`,
      ),
    );
  }
  const fromProducts: CorpusEntry[] = [];
  for (const id of PRODUCT_IDS) {
    const hit = productToHit(id);
    if (seen.has(hit.href)) continue;
    seen.add(hit.href);
    fromProducts.push(entryForHit(hit));
  }
  const curatedFiltered = CURATED.flatMap((c) => {
    if (seen.has(c.href)) return [];
    seen.add(c.href);
    return [entryForHit(c)];
  });
  return [...fromNews, ...fromStories, ...fromProducts, ...curatedFiltered];
}

const CORPUS = buildCorpus();

function scoreEntry(entry: CorpusEntry, query: string, tokens: string[]): number {
  const loweredQuery = query.toLowerCase();
  const title = entry.hit.title.toLowerCase();
  const snip = entry.hit.snippet.toLowerCase();
  const href = entry.hit.href.toLowerCase();
  const boost = entry.searchText.toLowerCase();
  let s = 0;

  if (loweredQuery.length >= 2) {
    if (title === loweredQuery) s += 140;
    if (title.startsWith(loweredQuery)) s += 64;
    if (title.split(/\s+/).some((word) => word.startsWith(loweredQuery))) s += 28;
    if (href.includes(loweredQuery)) s += 16;
    if (snip.includes(loweredQuery)) s += 10;
    if (boost.includes(loweredQuery)) s += 12;
  }

  for (const t of tokens) {
    if (title.includes(t)) s += 5;
    if (snip.includes(t)) s += 2;
    if (href.includes(t)) s += 2;
    if (boost.includes(t)) s += 1;
  }
  return s;
}

function rankCorpus(query: string) {
  const trimmed = query.trim();
  const tokens = tokenize(trimmed);
  const scored = CORPUS.map((entry) => ({
    hit: entry.hit,
    sc: trimmed.length === 0 ? 0 : scoreEntry(entry, trimmed, tokens),
  }));

  scored.sort((a, b) => {
    if (b.sc !== a.sc) return b.sc - a.sc;
    const da = a.hit.publishedAt ? new Date(a.hit.publishedAt + "T12:00:00").getTime() : 0;
    const db = b.hit.publishedAt ? new Date(b.hit.publishedAt + "T12:00:00").getTime() : 0;
    return db - da;
  });

  return scored;
}

/** Rank real on-site (and linked) content for the query. */
export function rankSiteArticles(query: string, limit = 8): SiteArticleHit[] {
  const scored = rankCorpus(query);

  const positive = scored.filter((x) => x.sc > 0).map((x) => x.hit);
  const seenHref = new Set<string>();
  const deduped: SiteArticleHit[] = [];
  for (const h of positive) {
    if (seenHref.has(h.href)) continue;
    seenHref.add(h.href);
    deduped.push(h);
    if (deduped.length >= limit) return deduped;
  }
  for (const x of scored.map((s) => s.hit)) {
    if (seenHref.has(x.href)) continue;
    seenHref.add(x.href);
    deduped.push(x);
    if (deduped.length >= limit) break;
  }
  return deduped;
}

export function suggestSiteArticles(query: string, limit = 6): SiteArticleHit[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const seenHref = new Set<string>();
  const matches: SiteArticleHit[] = [];
  for (const { hit, sc } of rankCorpus(trimmed)) {
    if (sc <= 0 || seenHref.has(hit.href)) continue;
    seenHref.add(hit.href);
    matches.push(hit);
    if (matches.length >= limit) break;
  }
  return matches;
}
