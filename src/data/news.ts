import mediumPayload from "./medium-feed.json";

/** Fallback when feed items omit `cardGradient` */
export const DEFAULT_NEWS_CARD_GRADIENT =
  "linear-gradient(135deg, #64748b 0%, #94a3b8 45%, #cbd5e1 100%)";

export type NewsCategory =
  | "Company"
  | "Product"
  | "Engineering"
  | "Safety"
  | "Community";

export const NEWS_CATEGORIES: (NewsCategory | "All")[] = [
  "Company",
  "Product",
  "Engineering",
  "Safety",
  "Community",
  "All",
];

export const NEWS_FILTER_TOPICS = [
  "Pods",
  "Blurbs",
  "API Platform",
  "Community",
  "Culture & careers",
  "Events",
  "Safety",
] as const;

export type NewsTopic = (typeof NEWS_FILTER_TOPICS)[number];

export type NewsItem = {
  id: string;
  title: string;
  excerpt?: string;
  category: NewsCategory;
  topics: NewsTopic[];
  publishedAt: string;
  readMinutes: number;
  cardGradient: string;
  /** Opens in new tab — Medium or other off-site posts */
  externalUrl?: string;
  /** On-site path for announcements that are not on Medium */
  internalHref?: string;
};

type MediumFeedFile = {
  feedUrl: string | null;
  syncedAt: string | null;
  items: Array<{
    id: string;
    title: string;
    excerpt?: string;
    publishedAt: string;
    url: string;
    readMinutes: number;
    cardGradient?: string;
  }>;
};

const mediumFile = mediumPayload as MediumFeedFile;

function mediumToNewsItem(entry: MediumFeedFile["items"][number]): NewsItem {
  return {
    id: `medium-${entry.id}`,
    title: entry.title,
    excerpt: entry.excerpt,
    category: "Company",
    topics: ["Community"],
    publishedAt: entry.publishedAt,
    readMinutes: entry.readMinutes,
    cardGradient: entry.cardGradient?.trim() || DEFAULT_NEWS_CARD_GRADIENT,
    externalUrl: entry.url,
  };
}

const STATIC_NEWS_ITEMS: NewsItem[] = [
  {
    id: "1",
    title: "Jokuh Spine: tighter sync for multi-pod sessions",
    excerpt: "Lower latency handoff when you move between pods on desktop and web.",
    category: "Product",
    topics: ["Pods", "API Platform"],
    publishedAt: "2026-03-18",
    readMinutes: 4,
    cardGradient: "linear-gradient(135deg, #6b5cff 0%, #c4b5fd 45%, #fde68a 100%)",
    internalHref: "/spine",
  },
  {
    id: "2",
    title: "Waitlist update: regional rollout next quarter",
    category: "Company",
    topics: ["Community", "Events"],
    publishedAt: "2026-03-02",
    readMinutes: 3,
    cardGradient: "linear-gradient(145deg, #f472b6 0%, #fb923c 50%, #38bdf8 100%)",
    internalHref: "/#start",
  },
  {
    id: "3",
    title: "Gooey 0.9: accessible focus rings and motion prefs",
    excerpt: "Respects reduced motion and improves keyboard navigation across primitives.",
    category: "Engineering",
    topics: ["Blurbs", "API Platform"],
    publishedAt: "2026-02-20",
    readMinutes: 6,
    cardGradient: "linear-gradient(160deg, #22d3ee 0%, #818cf8 55%, #e9d5ff 100%)",
    internalHref: "/#journal",
  },
  {
    id: "4",
    title: "Responsible use guidelines for V1llains lab",
    category: "Safety",
    topics: ["Safety", "Community"],
    publishedAt: "2026-02-05",
    readMinutes: 5,
    cardGradient: "linear-gradient(135deg, #34d399 0%, #2dd4bf 50%, #a78bfa 100%)",
    internalHref: "/#identity",
  },
  {
    id: "5",
    title: "Blurbs composer: markdown tables and paste cleanup",
    category: "Product",
    topics: ["Blurbs"],
    publishedAt: "2026-01-28",
    readMinutes: 2,
    cardGradient: "linear-gradient(120deg, #fcd34d 0%, #f97316 40%, #7c3aed 100%)",
    internalHref: "/blurbs",
  },
  {
    id: "6",
    title: "Open office hours: identity & claim flow",
    category: "Community",
    topics: ["Events", "Community"],
    publishedAt: "2026-01-12",
    readMinutes: 1,
    cardGradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 40%, #c084fc 100%)",
    internalHref: "/#identity",
  },
  {
    id: "7",
    title: "Hiring: design systems and realtime infra",
    category: "Company",
    topics: ["Culture & careers"],
    publishedAt: "2025-11-30",
    readMinutes: 2,
    cardGradient: "linear-gradient(145deg, #ec4899 0%, #8b5cf6 100%)",
    internalHref: "/news",
  },
  {
    id: "8",
    title: "Pod encryption at rest: what changed",
    category: "Engineering",
    topics: ["Pods", "Safety"],
    publishedAt: "2025-10-08",
    readMinutes: 7,
    cardGradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    internalHref: "/pods",
  },
];

function mergeNews(): NewsItem[] {
  const mediumItems = mediumFile.items.map((e) => mediumToNewsItem(e));
  const byUrl = new Map<string, NewsItem>();
  for (const m of mediumItems) {
    if (m.externalUrl) byUrl.set(m.externalUrl, m);
  }
  const merged: NewsItem[] = [...mediumItems];
  for (const s of STATIC_NEWS_ITEMS) {
    if (s.externalUrl && byUrl.has(s.externalUrl)) continue;
    merged.push(s);
  }
  merged.sort((a, b) => {
    const ta = new Date(a.publishedAt + "T12:00:00").getTime();
    const tb = new Date(b.publishedAt + "T12:00:00").getTime();
    return tb - ta;
  });
  return merged;
}

export const NEWS_ITEMS: NewsItem[] = mergeNews();

const yearSet = new Set<number>();
for (const n of NEWS_ITEMS) {
  yearSet.add(new Date(n.publishedAt + "T12:00:00").getFullYear());
}
export const NEWS_FILTER_YEARS = [...yearSet].sort((a, b) => b - a);

export function formatNewsDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
