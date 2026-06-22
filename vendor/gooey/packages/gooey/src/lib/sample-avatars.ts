/** Sample avatar data for Gooey surfaces that need stable seeded people. */

export type SampleAvatar = {
  src: string;
  name: string;
  originColor: "aether" | "flame" | "solar" | "life" | "fruta" | "insight" | "spirit";
};

const ORIGIN_COLORS: SampleAvatar["originColor"][] = ["aether", "flame", "solar", "life", "fruta", "insight", "spirit"];

export const SAMPLE_AVATARS: SampleAvatar[] = Array.from({ length: 152 }, (_, index) => {
  const avatarNumber = index + 1;

  return {
    src: `/images/aliens/alien-${String(avatarNumber).padStart(4, "0")}.jpg`,
    name: `alien ${avatarNumber}`,
    originColor: ORIGIN_COLORS[index % ORIGIN_COLORS.length],
  };
});

/** 1-based index helper. wraps around for deterministic seeded data. */
export function sampleAvatar(n: number): SampleAvatar {
  return SAMPLE_AVATARS[((n - 1) % SAMPLE_AVATARS.length + SAMPLE_AVATARS.length) % SAMPLE_AVATARS.length];
}
