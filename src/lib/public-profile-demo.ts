/**
 * **Purpose:** Client fetch for the marketing profile pod demo — real account via server proxy.
 * **Data path:** GET `/api/public-profile-demo` → `peek_public_profile` + network preview.
 * **Connects to:** `ProfilePodPanel`, `ProfileImmersiveShell`, `public-profile-service.ts`.
 */

export {
  formatConnectionCountLabel,
  LANDING_PROFILE_DEMO_FALLBACK,
  PROFILE_DEMO_USERNAME,
  type ProfileDemoNetworkPeer,
  type PublicProfileDemoData,
  type PublicProfileDemoResult,
} from "../../public-profile-demo-shared";

import {
  LANDING_PROFILE_DEMO_FALLBACK,
  type PublicProfileDemoResult,
} from "../../public-profile-demo-shared";

const PUBLIC_PROFILE_DEMO_ENDPOINT =
  (import.meta.env.VITE_PUBLIC_PROFILE_DEMO_ENDPOINT as string | undefined)?.trim() ||
  "/api/public-profile-demo";

/** **Fetches** one real profile + network preview for the landing profile pod. */
export async function fetchPublicProfileDemo(
  username?: string,
): Promise<PublicProfileDemoResult> {
  try {
    const query = username?.trim() ? `?username=${encodeURIComponent(username.trim())}` : "";
    const response = await fetch(`${PUBLIC_PROFILE_DEMO_ENDPOINT}${query}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`profile demo ${response.status}`);
    }
    const result = (await response.json()) as PublicProfileDemoResult;
    if (result.source === "fallback" && import.meta.env.DEV && result.error) {
      console.warn("[public-profile-demo]", result.error);
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    if (import.meta.env.DEV) {
      console.warn("[public-profile-demo] using bundled fallback:", message);
    }
    return {
      profile: { ...LANDING_PROFILE_DEMO_FALLBACK },
      source: "fallback",
      error: message,
    };
  }
}
