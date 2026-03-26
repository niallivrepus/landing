import { formatNewsDate, getNewsHref, type NewsItem, NEWS_ITEMS } from "../data/news";
import { PRODUCT_IDS, type ProductId, PRODUCTS } from "../data/products";

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

function buildCorpus(): SiteArticleHit[] {
  const fromNews = NEWS_ITEMS.map(newsToHit);
  const seen = new Set(fromNews.map((h) => h.href));
  const fromProducts: SiteArticleHit[] = [];
  for (const id of PRODUCT_IDS) {
    const hit = productToHit(id);
    if (seen.has(hit.href)) continue;
    seen.add(hit.href);
    fromProducts.push(hit);
  }
  const curatedFiltered = CURATED.filter((c) => {
    if (seen.has(c.href)) return false;
    seen.add(c.href);
    return true;
  });
  return [...fromNews, ...fromProducts, ...curatedFiltered];
}

const CORPUS = buildCorpus();

function scoreHit(hit: SiteArticleHit, tokens: string[], newsBoost: string): number {
  const title = hit.title.toLowerCase();
  const snip = hit.snippet.toLowerCase();
  const href = hit.href.toLowerCase();
  const boost = newsBoost.toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (title.includes(t)) s += 5;
    if (snip.includes(t)) s += 2;
    if (href.includes(t)) s += 2;
    if (boost.includes(t)) s += 1;
  }
  return s;
}

function newsBoostString(n: NewsItem): string {
  return `${n.category} ${n.topics.join(" ")} ${n.title} ${n.excerpt ?? ""}`;
}

/** Rank real on-site (and linked) content for the query. */
export function rankSiteArticles(query: string, limit = 8): SiteArticleHit[] {
  const tokens = tokenize(query);
  const newsByHref = new Map<string, NewsItem>();
  for (const n of NEWS_ITEMS) {
    const { href } = hrefForNews(n);
    newsByHref.set(href, n);
  }

  const scored = CORPUS.map((hit) => {
    const n = newsByHref.get(hit.href);
    const boost = n ? newsBoostString(n) : `${hit.title} ${hit.snippet}`;
    const sc = tokens.length === 0 ? 0 : scoreHit(hit, tokens, boost);
    return { hit, sc };
  });

  scored.sort((a, b) => {
    if (b.sc !== a.sc) return b.sc - a.sc;
    const da = a.hit.publishedAt ? new Date(a.hit.publishedAt + "T12:00:00").getTime() : 0;
    const db = b.hit.publishedAt ? new Date(b.hit.publishedAt + "T12:00:00").getTime() : 0;
    return db - da;
  });

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
