/**
 * **Purpose:** Optional force/skip helpers for the homepage mission scramble intro.
 * Default is to play on every homepage visit (marketing moment).
 * **Connects to:** `MissionIntroOverlay`, `LandingImmersiveShell`.
 */

const STORAGE_KEY = "jokuh.missionIntro.seen";

/**
 * Query helpers: `?intro=1` forces play; `?intro=0` skips for this load.
 * Cleared `seen` flag is retained for analytics / optional experiments.
 */
export function resolveMissionIntroForce(): "play" | "skip" | "default" {
  if (typeof window === "undefined") return "default";
  const raw = new URLSearchParams(window.location.search).get("intro");
  if (raw === "1" || raw === "true") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return "play";
  }
  if (raw === "0" || raw === "false") return "skip";
  return "default";
}

/** Marks intro played — retained for analytics; default gating still plays every visit. */
export function markMissionIntroSeen(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode / blocked storage — non-fatal */
  }
}
