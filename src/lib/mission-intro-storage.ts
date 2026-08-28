/**
 * **Purpose:** Force/skip helpers for the homepage mission scramble intro.
 * Plays once per browser session, then skips so return visits land on the hero.
 * **Connects to:** `MissionIntroOverlay`, `LandingImmersiveShell`, Playwright `primeCookieConsent`.
 */

const STORAGE_KEY = "jokuh.missionIntro.seen";

/**
 * Query helpers: `?intro=1` forces play; `?intro=0` skips for this load.
 * Default skips when this session already saw the intro.
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
  return hasSeenMissionIntro() ? "skip" : "default";
}

/** True when this session already played (or tests primed) the mission intro. */
export function hasSeenMissionIntro(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Marks intro played so the next homepage load in this session skips the overlay. */
export function markMissionIntroSeen(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode / blocked storage — non-fatal */
  }
}
