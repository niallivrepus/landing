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

/**
 * **APP_STORE_URL:** set this to the public App Store link the day Jokuh is listed. While it is empty, iPhone / iPad
 * "Get it" buttons fall back to the public TestFlight invite below (and the Get Jokuh sheet shows the two TestFlight
 * steps). After changing it, re-run `scripts/generate-iphone-qr.mjs` so the desktop QR points at the new link.
 */
export const APP_STORE_URL = "";

/** **Returns** where an iPhone / iPad should go to install Jokuh: the App Store once listed, else TestFlight. */
export function resolveIphoneInstallUrl(): string {
  return APP_STORE_URL || TESTFLIGHT_JOIN_URL;
}

/**
 * "Start on the web": the signed-out web app. The landing → web app prompt handoff (another builder) will define
 * extra params here; until then it is the plain origin.
 */
export function resolveWebStartUrl(): string {
  return resolveWebAppOrigin();
}

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
