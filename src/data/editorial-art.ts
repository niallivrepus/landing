export const JOURNAL_NEWS_ART_ROTATION: readonly string[] = [
  "/journal-art/news-sunburst.png",
  "/journal-art/news-orb-violet.png",
  "/journal-art/news-glass-ribbon.png",
  "/journal-art/news-blue-lens.png",
  "/journal-art/news-green-flow.png",
  "/journal-art/news-coral-wash.png",
  "/journal-art/news-blue-berries.png",
  "/journal-art/news-prism-fold.png",
];

const marenCard = "/story-art/maren-workspace.png";
const marenCardFallback = "/story-art/maren-portrait.png";

export const STORY_CARD_IMAGE_BY_SLUG: Record<string, string> = {
  "made-from-memory": marenCard,
  "made-from-memory-ii": marenCard,
  "aaron-liebowitz-psychotherapy-nyc": "/story-art/aaron-nyc-waterfront-skyline.avif",
  "tomas-aldaz": "/story-art/tomas-aldaz-field-notes.png",
};

export const STORY_CARD_IMAGE_FALLBACK_BY_SLUG: Record<string, string> = {
  "made-from-memory": marenCardFallback,
  "made-from-memory-ii": marenCardFallback,
  "aaron-liebowitz-psychotherapy-nyc": "/story-art/aaron-nyc-writing.png",
  "tomas-aldaz": "/story-art/tomas-aldaz-portrait.png",
};
