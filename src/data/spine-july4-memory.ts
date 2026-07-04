import { STORY_DETAILS, type StoryDetail, type StorySection } from "./stories-detail";

/** **Purpose:** July 4, 2026 Independence Day memory surfaced on landing `/spine`. */
export const SPINE_JULY4_MEMORY_SLUG = "the-next-version-of-freedom";

export const SPINE_JULY4_MEMORY_DATE = {
  short: "Jul 4",
  full: "July 4, 2026",
} as const;

export const SPINE_JULY4_MEMORY_HOUR_ID = "h-july4-freedom";

export type SpineJuly4MemoryContent = {
  story: StoryDetail;
  hero: StoryDetail["heroGallery"][number];
  audio: Extract<StorySection, { kind: "audio" }>;
  poem: Extract<StorySection, { kind: "poem" }>;
};

/** **Purpose:** Pull Sean Rock essay fields from canonical story detail — no duplicated poem text. */
export function getSpineJuly4Memory(): SpineJuly4MemoryContent {
  const story = STORY_DETAILS[SPINE_JULY4_MEMORY_SLUG];
  const hero = story.heroGallery[0];
  const audio = story.sections.find((section): section is Extract<StorySection, { kind: "audio" }> => section.kind === "audio");
  const poem = story.sections.find((section): section is Extract<StorySection, { kind: "poem" }> => section.kind === "poem");

  if (!hero || !audio || !poem) {
    throw new Error("Spine July 4 memory is missing hero, audio, or poem sections.");
  }

  return { story, hero, audio, poem };
}
