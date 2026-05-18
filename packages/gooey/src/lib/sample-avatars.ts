/**
 * Sample avatar data for the Gooey showcase app.
 * Uses local villain images from /images/villains/.
 */

export type SampleAvatar = {
  src: string;
  name: string;
  originColor: "aether" | "flame" | "solar" | "life" | "fruta" | "insight" | "spirit";
};

export const SAMPLE_AVATARS: SampleAvatar[] = [
  { src: "/images/villains/villain-1.png", name: "Villain 1", originColor: "aether" },
  { src: "/images/villains/villain-2.png", name: "Villain 2", originColor: "flame" },
  { src: "/images/villains/villain-3.png", name: "Villain 3", originColor: "solar" },
  { src: "/images/villains/villain-4.png", name: "Villain 4", originColor: "life" },
  { src: "/images/villains/villain-5.png", name: "Villain 5", originColor: "fruta" },
  { src: "/images/villains/villain-6.png", name: "Villain 6", originColor: "insight" },
  { src: "/images/villains/villain-7.png", name: "Villain 7", originColor: "spirit" },
  { src: "/images/villains/villain-1.png", name: "Villain 8", originColor: "aether" },
  { src: "/images/villains/villain-2.png", name: "Villain 9", originColor: "flame" },
  { src: "/images/villains/villain-3.png", name: "Villain 10", originColor: "solar" },
];

/** 1-based index helper (matches the old villain-N.png numbering). Wraps around. */
export function sampleAvatar(n: number): SampleAvatar {
  return SAMPLE_AVATARS[((n - 1) % SAMPLE_AVATARS.length + SAMPLE_AVATARS.length) % SAMPLE_AVATARS.length];
}
