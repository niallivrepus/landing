import mediumPayload from "./medium-feed.json";

/** Fallback when feed items omit `cardGradient` */
export const DEFAULT_NEWS_CARD_GRADIENT =
  "linear-gradient(135deg, #0a0a0c 0%, #1e293b 38%, #334155 100%)";

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&w=800&h=800&fit=crop&q=85`;

/** Dark / glass / minimal tech art for cards without a specific `cardImage`. */
export const NEWS_CARD_ART_ROTATION: readonly string[] = [
  "/news-cards/sphere.png",
  u("photo-1634017839464-5c339ebe3cb4"),
  u("photo-1557672172-298e090bd0f1"),
  u("photo-1550745165-9bc0b252726f"),
  u("photo-1620641788421-7a1c342ea42e"),
  u("photo-1451187580459-43490279c0fa"),
  u("photo-1534796636912-3b95b3ab5986"),
];

function cardImageForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % NEWS_CARD_ART_ROTATION.length;
  return NEWS_CARD_ART_ROTATION[idx]!;
}

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
  /** Optional cover art (local `/…` or URL). Falls back to `cardGradient` if missing or broken. */
  cardImage?: string;
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
    cardImage?: string;
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
    cardImage: entry.cardImage?.trim() || cardImageForId(entry.id),
    externalUrl: entry.url,
  };
}

const STATIC_NEWS_ITEMS: NewsItem[] = [
  {
    id: "lab-treasury-api-grid",
    title: "Treasury loops, inference reinvestment, and the API grid",
    excerpt:
      "How we think about metering, multi-provider routes, and fee decomposition when the prompt bar initiates paid model work.",
    category: "Engineering",
    topics: ["API Platform", "Pods"],
    publishedAt: "2026-03-26",
    readMinutes: 11,
    cardGradient: "linear-gradient(155deg, #020617 0%, #0c4a6e 40%, #164e63 100%)",
    cardImage: u("photo-1558494949-ef010cbdcc31"),
    internalHref: "/stories/treasury-inference-api-grid",
  },
  {
    id: "lab-transcript-spine",
    title: "From subtitles to spine: structured hooks in live transcription",
    excerpt:
      "Goal markers, diarization-aware spans, and why highlighted cue bubbles are more than chrome—they are machine-readable session memory.",
    category: "Product",
    topics: ["Blurbs", "API Platform"],
    publishedAt: "2026-03-25",
    readMinutes: 9,
    cardGradient: "linear-gradient(148deg, #020617 0%, #1e1b4b 45%, #312e81 100%)",
    cardImage: u("photo-1516321318423-f06f85e504b3"),
    internalHref: "/stories/live-transcript-hooks-spine",
  },
  {
    id: "lab-gooey-island",
    title: "Shipping Gooey as an island: tokens, merges, and designer handoff",
    excerpt:
      "The four-layer token pipeline only holds if the demo shell stays isolated—PR hygiene, imports, and why “only apps/gooey” is a release strategy.",
    category: "Engineering",
    topics: ["Blurbs", "API Platform"],
    publishedAt: "2026-03-24",
    readMinutes: 10,
    cardGradient: "linear-gradient(152deg, #020617 0%, #422006 38%, #1c1917 100%)",
    cardImage: u("photo-1555066931-4365d14bab8c"),
    internalHref: "/stories/gooey-island-merge-hygiene",
  },
  {
    id: "introducing-jokuh-cortex",
    title: "Introducing Jokuh Cortex",
    excerpt: "Designed for professional work — benchmarks, latency sweeps, and pilot stories.",
    category: "Product",
    topics: ["API Platform", "Pods"],
    publishedAt: "2026-03-05",
    readMinutes: 14,
    cardGradient: "linear-gradient(160deg, #020617 0%, #0f172a 45%, #1e3a5f 100%)",
    cardImage: "/news-cards/sphere.png",
    internalHref: "/journal/introducing-jokuh-cortex",
  },
  {
    id: "1",
    title: "Jokuh Spine: tighter sync for multi-pod sessions",
    excerpt: "Lower latency handoff when you move between pods on desktop and web.",
    category: "Product",
    topics: ["Pods", "API Platform"],
    publishedAt: "2026-03-18",
    readMinutes: 4,
    cardGradient: "linear-gradient(145deg, #020617 0%, #1e1b4b 50%, #312e81 100%)",
    cardImage: u("photo-1451187580459-43490279c0fa"),
    internalHref: "/spine",
  },
  {
    id: "2",
    title: "Waitlist update: regional rollout next quarter",
    category: "Company",
    topics: ["Community", "Events"],
    publishedAt: "2026-03-02",
    readMinutes: 3,
    cardGradient: "linear-gradient(135deg, #020617 0%, #0c4a6e 55%, #164e63 100%)",
    cardImage: u("photo-1557672172-298e090bd0f1"),
    internalHref: "/waitlist",
  },
  {
    id: "3",
    title: "Gooey 0.9: accessible focus rings and motion prefs",
    excerpt: "Respects reduced motion and improves keyboard navigation across primitives.",
    category: "Engineering",
    topics: ["Blurbs", "API Platform"],
    publishedAt: "2026-02-20",
    readMinutes: 6,
    cardGradient: "linear-gradient(150deg, #020617 0%, #1e293b 40%, #334155 100%)",
    cardImage: u("photo-1634017839464-5c339ebe3cb4"),
    internalHref: "/journal",
  },
  {
    id: "4",
    title: "Responsible use guidelines for V1llains lab",
    category: "Safety",
    topics: ["Safety", "Community"],
    publishedAt: "2026-02-05",
    readMinutes: 5,
    cardGradient: "linear-gradient(135deg, #020617 0%, #14532d 42%, #0f172a 100%)",
    cardImage: u("photo-1620641788421-7a1c342ea42e"),
    internalHref: "/ecosystem/v1llains",
  },
  {
    id: "5",
    title: "Blurbs composer: markdown tables and paste cleanup",
    category: "Product",
    topics: ["Blurbs"],
    publishedAt: "2026-01-28",
    readMinutes: 2,
    cardGradient: "linear-gradient(140deg, #020617 0%, #312e81 50%, #1e1b4b 100%)",
    cardImage: u("photo-1534796636912-3b95b3ab5986"),
    internalHref: "/blurbs",
  },
  {
    id: "6",
    title: "Open office hours: identity & claim flow",
    category: "Community",
    topics: ["Events", "Community"],
    publishedAt: "2026-01-12",
    readMinutes: 1,
    cardGradient: "linear-gradient(135deg, #020617 0%, #1e293b 55%, #0f172a 100%)",
    cardImage: "/news-cards/sphere.png",
    internalHref: "/platform/identity",
  },
  {
    id: "7",
    title: "Hiring: design systems and realtime infra",
    category: "Company",
    topics: ["Culture & careers"],
    publishedAt: "2025-11-30",
    readMinutes: 2,
    cardGradient: "linear-gradient(145deg, #020617 0%, #422006 35%, #1c1917 100%)",
    cardImage: u("photo-1550745165-9bc0b252726f"),
    internalHref: "/journal",
  },
  {
    id: "8",
    title: "Pod encryption at rest: what changed",
    category: "Engineering",
    topics: ["Pods", "Safety"],
    publishedAt: "2025-10-08",
    readMinutes: 7,
    cardGradient: "linear-gradient(135deg, #020617 0%, #172554 50%, #0c4a6e 100%)",
    cardImage: u("photo-1451187580459-43490279c0fa"),
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
