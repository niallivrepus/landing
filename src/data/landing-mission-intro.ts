/**
 * **Purpose:** Full-screen cinematic mission statement before the home hero.
 * **Connects to:** `MissionIntroOverlay` (avatar inserts after `00` on the OO line),
 * `landing-hero-copy.ts`, `mission-intro-storage.ts`.
 */

/** Canonical mission statement — same idea as the homepage privacy sentence. */
export const LANDING_MISSION_STATEMENT =
  "Jokuh is a private workspace with your own AI, OO, that remembers your calls, chats, and files — without giving that context to anyone else.";

/**
 * Left-aligned title-card lines — private-workspace voice, not “social OS” / superapp.
 * The OO line must contain `00` so `MissionIntroOverlay` can insert the avatar.
 */
export const LANDING_MISSION_INTRO_LINES = [
  "Jokuh is a private workspace",
  "with your own AI, 00,",
  "that remembers your calls, chats, and files —",
  "without giving that context to anyone else.",
] as const;

/** Line that includes `00` — avatar renders inline immediately after those digits. */
export const LANDING_MISSION_OO_LINE_INDEX = 1;

/** Character index just after `00` on the OO line (insert avatar here). */
export const LANDING_MISSION_OO_AVATAR_AT =
  LANDING_MISSION_INTRO_LINES[LANDING_MISSION_OO_LINE_INDEX]!.indexOf("00") + 2;

/** Index of the closing lock-line (last beat before hold + fade). */
export const LANDING_MISSION_INTRO_LOCK_LINE = LANDING_MISSION_INTRO_LINES.length - 1;

/** Pause after the full statement locks before fading into the home hero (spec P2: ~400ms). */
export const LANDING_MISSION_INTRO_HOLD_MS = 400;

/** Fade-out duration once the overlay dismisses into the landing page. */
export const LANDING_MISSION_INTRO_FADE_MS = 400;
