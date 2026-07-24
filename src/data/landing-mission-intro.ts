/**
 * **Purpose:** Full-screen cinematic mission statement before the home hero.
 * **Connects to:** `MissionIntroOverlay`, `landing-hero-copy.ts`, `mission-intro-storage.ts`.
 */

/** Canonical mission statement — sentence case for a11y and on-screen intro lines. */
export const LANDING_MISSION_STATEMENT =
  "Jokuh is the social operating system you use like a superapp, where every person has a confidential AI, 00, that understands your calls, chats, activity, and relationships, and helps you move through life with deep context. Your privacy, built in.";

/**
 * Left-aligned title-card lines — same sentence case as the home headline voice.
 * Final line is spaced as the closing beat.
 */
export const LANDING_MISSION_INTRO_LINES = [
  "Jokuh is the social operating system",
  "you use like a superapp,",
  "where every person has a confidential AI, 00,",
  "that understands your calls, chats,",
  "activity, and relationships,",
  "and helps you move through life with deep context.",
  "Your privacy, built in.",
] as const;

/** Line that includes `00` — avatar renders inline immediately after those digits. */
export const LANDING_MISSION_OO_LINE_INDEX = 2;

/** Character index just after `00` on the OO line (insert avatar here). */
export const LANDING_MISSION_OO_AVATAR_AT =
  LANDING_MISSION_INTRO_LINES[LANDING_MISSION_OO_LINE_INDEX]!.indexOf("00") + 2;

/** Index of the closing lock-line (“Your privacy, built in.”). */
export const LANDING_MISSION_INTRO_LOCK_LINE = LANDING_MISSION_INTRO_LINES.length - 1;

/** Pause after the full statement locks before fading into the home hero. */
export const LANDING_MISSION_INTRO_HOLD_MS = 1800;

/** Fade-out duration once the overlay dismisses into the landing page. */
export const LANDING_MISSION_INTRO_FADE_MS = 1100;
