export type DeveloperBlogEntry = {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  publishedAt: string;
  readMinutes: number;
  href: string;
  image: string;
};

export const DEVELOPER_BLOG_ENTRIES: readonly DeveloperBlogEntry[] = [
  {
    id: "sdk-surface",
    title: "Build with one SDK surface, not three separate glue layers.",
    excerpt: "A cleaner read on how Jokuh keeps responses, tools, structured output, and streaming inside one production path.",
    tag: "SDK",
    publishedAt: "2026-03-28",
    readMinutes: 6,
    href: "/developers/sdk",
    image: "/journal-art/news-blue-lens.png",
  },
  {
    id: "quickstart-rhythm",
    title: "Quickstart should get you to a real response in minutes.",
    excerpt: "The shortest path from key creation to a live request, with less product chrome and fewer dead-end steps.",
    tag: "Guides",
    publishedAt: "2026-03-26",
    readMinutes: 4,
    href: "/developers/docs/quickstart",
    image: "/journal-art/news-orb-violet.png",
  },
  {
    id: "cookbook-patterns",
    title: "Cookbook patterns that stay usable after the demo.",
    excerpt: "Examples for tools, agents, memory, and structured outputs that can move into real product work.",
    tag: "Cookbook",
    publishedAt: "2026-03-24",
    readMinutes: 5,
    href: "/developers/docs/cookbook",
    image: "/journal-art/news-coral-wash.png",
  },
  {
    id: "learn-surface",
    title: "Learn should read like a developer hub, not a feed dump.",
    excerpt: "We trimmed the learning surface down to a calmer set of routes for docs, digests, and reference material.",
    tag: "Platform",
    publishedAt: "2026-03-21",
    readMinutes: 3,
    href: "/developers/learn",
    image: "/journal-art/news-sunburst.png",
  },
  {
    id: "models-context",
    title: "Choosing the right model starts with runtime constraints.",
    excerpt: "A practical way to think about speed, reasoning depth, and tooling fit before you ship the wrong default.",
    tag: "Models",
    publishedAt: "2026-03-18",
    readMinutes: 7,
    href: "/developers/docs/models",
    image: "/journal-art/news-prism-fold.png",
  },
  {
    id: "forum-feedback",
    title: "Why the forum matters more than another product changelog.",
    excerpt: "The developer forum is where integration friction surfaces first, which is why it belongs close to the SDK story.",
    tag: "Community",
    publishedAt: "2026-03-15",
    readMinutes: 3,
    href: "/developers/forum",
    image: "/journal-art/news-glass-ribbon.png",
  },
] as const;
