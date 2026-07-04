/**
 * **Purpose:** Static mood pill catalog for landing Spine demos — parity `spine-day-mood-catalog.ts`.
 * **Connects to:** `LandingSpineEmotionPill`, `LandingSpineTodayBriefPreview`.
 */

export type LandingSpineMoodId =
  | "angry"
  | "sad"
  | "anxious"
  | "cheerful"
  | "playful"
  | "calm"
  | "jolly"
  | "loved";

export type LandingSpineMoodDefinition = {
  id: LandingSpineMoodId;
  label: string;
  emoji: string;
  iconKey: "head" | "scissors" | "pulse" | "palette" | "star" | "group" | "target" | "heartCluster";
  borderColor: string;
  fillColor: string;
};

export const LANDING_SPINE_MOODS_LEFT: LandingSpineMoodId[] = [
  "angry",
  "sad",
  "anxious",
  "cheerful",
];

export const LANDING_SPINE_MOODS_RIGHT: LandingSpineMoodId[] = [
  "playful",
  "calm",
  "jolly",
  "loved",
];

export const LANDING_SPINE_MOOD_DEFINITIONS: Record<
  LandingSpineMoodId,
  LandingSpineMoodDefinition
> = {
  angry: {
    id: "angry",
    label: "Angry",
    emoji: "😤",
    iconKey: "head",
    borderColor: "var(--color-origin-fruta-1)",
    fillColor: "#200400",
  },
  sad: {
    id: "sad",
    label: "Sad",
    emoji: "😢",
    iconKey: "scissors",
    borderColor: "var(--color-origin-flame-1)",
    fillColor: "#240b00",
  },
  anxious: {
    id: "anxious",
    label: "Anxious",
    emoji: "😰",
    iconKey: "pulse",
    borderColor: "var(--color-origin-insight-1)",
    fillColor: "#141026",
  },
  cheerful: {
    id: "cheerful",
    label: "Cheerful",
    emoji: "😊",
    iconKey: "palette",
    borderColor: "var(--color-origin-solar-1)",
    fillColor: "#673f00",
  },
  playful: {
    id: "playful",
    label: "Playful",
    emoji: "😜",
    iconKey: "star",
    borderColor: "var(--color-origin-life-1)",
    fillColor: "#032200",
  },
  calm: {
    id: "calm",
    label: "Calm",
    emoji: "😌",
    iconKey: "group",
    borderColor: "var(--color-origin-aether-1)",
    fillColor: "#001534",
  },
  jolly: {
    id: "jolly",
    label: "Jolly",
    emoji: "🤩",
    iconKey: "target",
    borderColor: "var(--color-origin-insight-1)",
    fillColor: "#30005f",
  },
  loved: {
    id: "loved",
    label: "Loved",
    emoji: "🥰",
    iconKey: "heartCluster",
    borderColor: "var(--color-origin-spirit-1)",
    fillColor: "#2a0027",
  },
};
