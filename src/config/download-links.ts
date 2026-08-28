/**
 * **Purpose:** Canonical outbound URLs for the `/download` page (Mac dmg, TestFlight, web app).
 * **Connects to:** `DownloadImmersiveShell`, `brand-taxonomy.ts` platform availability,
 * `ProductCenteredShowcase` Join Beta CTAs.
 *
 * **Mac direct download:** Default href is same-origin `/downloads/Jokuh.dmg`. Docker bakes the
 * notarized GitHub Release asset into the image; if the file is missing the Node server 302s to
 * that release so the page never links at github.com. Override with `VITE_MACOS_DOWNLOAD_URL`.
 */

const DEFAULT_MACOS_RELEASE_URL = "/downloads/Jokuh.dmg";
const DEFAULT_WEB_APP_ORIGIN = "https://app.jokuh.com";

/** Public Jokuh iOS / iPadOS TestFlight invite — used by “Download beta” / mobile access CTAs. */
export const TESTFLIGHT_JOIN_URL = "https://testflight.apple.com/join/tjudrA2u";

/** **Returns** the public HTTPS URL for the official macOS `.dmg` (Developer ID + notarized). */
export function resolveMacDownloadUrl(): string {
  const configured = (import.meta.env.VITE_MACOS_DOWNLOAD_URL as string | undefined)?.trim();
  if (configured) {
    return configured;
  }
  return DEFAULT_MACOS_RELEASE_URL;
}

/** **Returns** the signed-in product web app origin for Windows/Linux/browser users. */
export function resolveWebAppOrigin(): string {
  const configured = (import.meta.env.VITE_ORIGIN_APP as string | undefined)?.trim();
  return (configured || DEFAULT_WEB_APP_ORIGIN).replace(/\/$/, "");
}

/** @deprecated Prefer `TESTFLIGHT_JOIN_URL` — kept for any mail-based early-access references. */
export const EARLY_ACCESS_EMAIL =
  "mailto:sean@sierri.com?subject=Jokuh%20early%20access";
