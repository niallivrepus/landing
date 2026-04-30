import { STORY_CARD_IMAGE_BY_SLUG, STORY_CARD_IMAGE_FALLBACK_BY_SLUG } from "./editorial-art";

/** Homepage Stories: square tiles + one title each. */
export type HomeStory = {
  slug: string;
  href: string;
  image: string;
  /** Shown if primary `image` fails to load (e.g. removed from CDN). */
  imageFallback?: string;
  title: string;
};

const RAW_STORIES = [
  {
    slug: "made-from-memory",
    image: STORY_CARD_IMAGE_BY_SLUG["made-from-memory"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["made-from-memory"],
    title: "Made from Memory",
  },
  {
    slug: "aaron-liebowitz-psychotherapy-nyc",
    image: STORY_CARD_IMAGE_BY_SLUG["aaron-liebowitz-psychotherapy-nyc"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["aaron-liebowitz-psychotherapy-nyc"],
    title: "A psychotherapy practice in New York",
  },
  {
    slug: "tomas-aldaz",
    image: STORY_CARD_IMAGE_BY_SLUG["tomas-aldaz"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["tomas-aldaz"],
    title: "A regenerative grain cooperative in the High Plains",
  },
] as const;

export const HOME_STORIES: HomeStory[] = RAW_STORIES.map((s) => ({
  ...s,
  href: `/stories/${s.slug}`,
}));
