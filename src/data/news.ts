import mediumPayload from "./medium-feed.json";
import { JOURNAL_NEWS_ART_ROTATION } from "./editorial-art";

/** Fallback when feed items omit `cardGradient` */
export const DEFAULT_NEWS_CARD_GRADIENT =
  "linear-gradient(135deg, #0a0a0c 0%, #1e293b 38%, #334155 100%)";

function cardImageForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % JOURNAL_NEWS_ART_ROTATION.length;
  return JOURNAL_NEWS_ART_ROTATION[idx]!;
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
  /** Canonical slug for on-site newsroom articles. */
  slug?: string;
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

function newsroomPath(slug: string) {
  return `/newsroom/${slug}`;
}

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
    cardImage: cardImageForId(entry.id),
    externalUrl: entry.url,
  };
}

const STATIC_NEWS_ITEMS: NewsItem[] = [
  {
    id: "introducing-jokuh-cortex",
    title: "Introducing Jokuh Cortex",
    excerpt: "Designed for professional work — benchmarks, latency sweeps, and pilot stories.",
    category: "Product",
    topics: ["API Platform", "Pods"],
    publishedAt: "2026-03-05",
    readMinutes: 14,
    cardGradient: "linear-gradient(160deg, #020617 0%, #0f172a 45%, #1e3a5f 100%)",
    cardImage: "/journal-art/news-prism-fold.png",
    slug: "introducing-jokuh-cortex",
    internalHref: newsroomPath("introducing-jokuh-cortex"),
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
    cardImage: "/journal-art/news-blue-lens.png",
    slug: "jokuh-spine-tighter-sync",
    internalHref: newsroomPath("jokuh-spine-tighter-sync"),
  },
  {
    id: "2",
    title: "Waitlist update: regional rollout next quarter",
    excerpt: "We are sequencing the next invite wave by region, support coverage, and onboarding readiness.",
    category: "Company",
    topics: ["Community", "Events"],
    publishedAt: "2026-03-02",
    readMinutes: 3,
    cardGradient: "linear-gradient(135deg, #020617 0%, #0c4a6e 55%, #164e63 100%)",
    cardImage: "/journal-art/news-coral-wash.png",
    slug: "waitlist-regional-rollout-next-quarter",
    internalHref: newsroomPath("waitlist-regional-rollout-next-quarter"),
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
    cardImage: "/journal-art/news-orb-violet.png",
    slug: "gooey-accessible-focus-rings-motion-prefs",
    internalHref: newsroomPath("gooey-accessible-focus-rings-motion-prefs"),
  },
  {
    id: "4",
    title: "Responsible use guidelines for V1llains lab",
    excerpt: "We tightened sandbox language, escalation rules, and disclosure expectations for experimental agents.",
    category: "Safety",
    topics: ["Safety", "Community"],
    publishedAt: "2026-02-05",
    readMinutes: 5,
    cardGradient: "linear-gradient(135deg, #020617 0%, #14532d 42%, #0f172a 100%)",
    cardImage: "/journal-art/news-green-flow.png",
    slug: "responsible-use-guidelines-v1llains-lab",
    internalHref: newsroomPath("responsible-use-guidelines-v1llains-lab"),
  },
  {
    id: "5",
    title: "Blurbs composer: markdown tables and paste cleanup",
    excerpt: "Composer paste now normalizes tables, strips inline cruft, and keeps formatting safer across exports.",
    category: "Product",
    topics: ["Blurbs"],
    publishedAt: "2026-01-28",
    readMinutes: 2,
    cardGradient: "linear-gradient(140deg, #020617 0%, #312e81 50%, #1e1b4b 100%)",
    cardImage: "/journal-art/news-glass-ribbon.png",
    slug: "blurbs-composer-markdown-tables-paste-cleanup",
    internalHref: newsroomPath("blurbs-composer-markdown-tables-paste-cleanup"),
  },
  {
    id: "6",
    title: "Open office hours: identity & claim flow",
    excerpt: "We are opening product office hours around identity verification, claims, and account portability.",
    category: "Community",
    topics: ["Events", "Community"],
    publishedAt: "2026-01-12",
    readMinutes: 1,
    cardGradient: "linear-gradient(135deg, #020617 0%, #1e293b 55%, #0f172a 100%)",
    cardImage: "/journal-art/news-sunburst.png",
    slug: "open-office-hours-identity-claim-flow",
    internalHref: newsroomPath("open-office-hours-identity-claim-flow"),
  },
  {
    id: "7",
    title: "Hiring: design systems and realtime infra",
    excerpt: "We are growing the teams behind Gooey, realtime transcription, and the infra that keeps them reliable.",
    category: "Company",
    topics: ["Culture & careers"],
    publishedAt: "2025-11-30",
    readMinutes: 2,
    cardGradient: "linear-gradient(145deg, #020617 0%, #422006 35%, #1c1917 100%)",
    cardImage: "/journal-art/news-blue-berries.png",
    slug: "hiring-design-systems-realtime-infra",
    internalHref: newsroomPath("hiring-design-systems-realtime-infra"),
  },
  {
    id: "8",
    title: "Pod encryption at rest: what changed",
    excerpt: "We rotated key handling, narrowed access paths, and tightened how encrypted pod state moves through storage.",
    category: "Engineering",
    topics: ["Pods", "Safety"],
    publishedAt: "2025-10-08",
    readMinutes: 7,
    cardGradient: "linear-gradient(135deg, #020617 0%, #172554 50%, #0c4a6e 100%)",
    cardImage: "/journal-art/news-blue-lens.png",
    slug: "pod-encryption-at-rest-what-changed",
    internalHref: newsroomPath("pod-encryption-at-rest-what-changed"),
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

export function getNewsHref(item: NewsItem) {
  return item.externalUrl ?? item.internalHref ?? "/newsroom";
}
