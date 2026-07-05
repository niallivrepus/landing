/**
 * **Purpose:** Canonical outbound URLs for the `/download` page (Mac dmg, web app, early access).
 * **Connects to:** `DownloadImmersiveShell`, `brand-taxonomy.ts` platform availability.
 *
 * **Mac direct download:** Host `Jokuh.dmg` at `public/downloads/Jokuh.dmg` before deploy, or override
 * `VITE_MACOS_DOWNLOAD_URL` on Railway `www` to a CDN/object-storage URL (see jokuh-live
 * `docs/macos-direct-distribution.md`).
 */

const DEFAULT_MACOS_RELEASE_URL =
  "https://github.com/niallivrepus/landing/releases/download/macos-1.0.1/Jokuh.dmg";
const DEFAULT_WEB_APP_ORIGIN = "https://app.jokuh.com";

/** **Returns** the public HTTPS URL for the official macOS `.dmg` (Developer ID + notarized). */
export function resolveMacDownloadUrl(): string {
  const configured = (import.meta.env.VITE_MACOS_DOWNLOAD_URL as string | undefined)?.trim();
  if (configured) {
    return configured;
  }
  // Hosted GitHub Release asset (see jokuh-live `scripts/release-macos-direct.sh`).
  return DEFAULT_MACOS_RELEASE_URL;
}

/** **Returns** the signed-in product web app origin for Windows/Linux/browser users. */
export function resolveWebAppOrigin(): string {
  const configured = (import.meta.env.VITE_ORIGIN_APP as string | undefined)?.trim();
  return (configured || DEFAULT_WEB_APP_ORIGIN).replace(/\/$/, "");
}

export const EARLY_ACCESS_EMAIL =
  "mailto:sean@sierri.com?subject=Jokuh%20early%20access";
