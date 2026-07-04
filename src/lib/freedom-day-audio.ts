/** **Purpose:** Canonical identifiers for Sean Rock Independence Day audio essay. */
export const FREEDOM_DAY_STORY_SLUG = "the-next-version-of-freedom";

export const FREEDOM_DAY_AUDIO_SRC = "/audio/sean-rock-independence-day.mp3";

/**
 * **Purpose:** Detect whether a story audio block should trigger July 4 fireworks.
 * **Connects to:** `StoryAudioBlock`, `FreedomDayFireworksOverlay`, `spine-july4-memory.ts`.
 */
export function isFreedomDayAudio(src: string, storySlug?: string): boolean {
  if (storySlug === FREEDOM_DAY_STORY_SLUG) return true;

  const normalizedSrc = src.split("?")[0]?.split("#")[0] ?? src;
  return (
    normalizedSrc === FREEDOM_DAY_AUDIO_SRC ||
    normalizedSrc.endsWith("/sean-rock-independence-day.mp3")
  );
}
