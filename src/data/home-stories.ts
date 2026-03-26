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
    slug: "treasury-inference-api-grid",
    image: STORY_CARD_IMAGE_BY_SLUG["treasury-inference-api-grid"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["treasury-inference-api-grid"],
    title: "Treasury loops and the API grid",
  },
  {
    slug: "live-transcript-hooks-spine",
    image: STORY_CARD_IMAGE_BY_SLUG["live-transcript-hooks-spine"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["live-transcript-hooks-spine"],
    title: "Live transcript hooks on the spine",
  },
  {
    slug: "gooey-island-merge-hygiene",
    image: STORY_CARD_IMAGE_BY_SLUG["gooey-island-merge-hygiene"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["gooey-island-merge-hygiene"],
    title: "The Gooey app as a design island",
  },
  {
    slug: "salvage-yard-nevada",
    image: STORY_CARD_IMAGE_BY_SLUG["salvage-yard-nevada"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["salvage-yard-nevada"],
    title: "A salvage yard in Nevada",
  },
  {
    slug: "seed-farm-south-carolina",
    image: STORY_CARD_IMAGE_BY_SLUG["seed-farm-south-carolina"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["seed-farm-south-carolina"],
    title: "A seed farm in South Carolina",
  },
  {
    slug: "tamale-shop-california",
    image: STORY_CARD_IMAGE_BY_SLUG["tamale-shop-california"],
    imageFallback: STORY_CARD_IMAGE_FALLBACK_BY_SLUG["tamale-shop-california"],
    title: "A tamale shop in California",
  },
] as const;

export const HOME_STORIES: HomeStory[] = RAW_STORIES.map((s) => ({
  ...s,
  href: `/stories/${s.slug}`,
}));
