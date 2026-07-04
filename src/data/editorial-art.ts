import { NEWS_ART_POOL } from "./news-art-manifest";

// Auto-synced from ~/Library/CloudStorage/Dropbox/Creation/Entities/Jokuh/News
// via `npm run sync:news-art`. Drop new images into that folder and re-run sync.
export const JOURNAL_NEWS_ART_ROTATION: readonly string[] = NEWS_ART_POOL;

const marenCard = "/story-art/maren-workspace.png";
const marenCardFallback = "/story-art/maren-portrait.png";

export const STORY_CARD_IMAGE_BY_SLUG: Record<string, string> = {
  "the-next-version-of-freedom": "/images/spine-freedom-flag.png",
  "made-from-memory": marenCard,
  "made-from-memory-ii": marenCard,
  "aaron-liebowitz-psychotherapy-nyc": "/story-art/aaron-nyc-card.png",
  "tomas-aldaz": "/story-art/tomas-aldaz-card.png",
};

export const STORY_CARD_IMAGE_FALLBACK_BY_SLUG: Record<string, string> = {
  "the-next-version-of-freedom": "/images/spine-freedom-flag.png",
  "made-from-memory": marenCardFallback,
  "made-from-memory-ii": marenCardFallback,
  "aaron-liebowitz-psychotherapy-nyc": "/story-art/aaron-nyc-writing.png",
  "tomas-aldaz": "/story-art/tomas-aldaz-portrait.png",
};
