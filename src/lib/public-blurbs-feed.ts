/**
 * **Purpose:** Read-only public Blurbs feed for the marketing site — no signed-in session required.
 * **Data path:** GET `/api/public-blurbs-feed` (server proxies `blurbs-sitemap` + `get_public_blurb_share`; browser cannot call sitemap Edge due to missing CORS).
 * **Connects to:** `PublicBlurbsFeed`, `BlurbsImmersiveShell`, `public-blurbs-feed-service.ts`.
 */

export {
  formatBlurbRelativeTime,
  LANDING_PUBLIC_BLURBS_FALLBACK,
  parsePublicBlurbSitemap,
  type PublicBlurbFeedItem,
  type PublicBlurbsFeedResult,
} from "../../public-blurbs-feed-shared";

import {
  LANDING_PUBLIC_BLURBS_FALLBACK,
  type PublicBlurbsFeedResult,
} from "../../public-blurbs-feed-shared";

const PUBLIC_BLURBS_FEED_ENDPOINT =
  (import.meta.env.VITE_PUBLIC_BLURBS_FEED_ENDPOINT as string | undefined)?.trim() ||
  "/api/public-blurbs-feed";

/** **Fetches** recent public blurbs via same-origin API route (server-side sitemap + RPC). */
export async function fetchPublicBlurbsFeed(limit = 24): Promise<PublicBlurbsFeedResult> {
  try {
    const url = `${PUBLIC_BLURBS_FEED_ENDPOINT}?limit=${encodeURIComponent(String(limit))}`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`feed ${response.status}`);
    }
    const result = (await response.json()) as PublicBlurbsFeedResult;
    if (result.source === "fallback" && import.meta.env.DEV && result.error) {
      console.warn("[public-blurbs-feed]", result.error);
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    if (import.meta.env.DEV) {
      console.warn("[public-blurbs-feed] using bundled samples:", message);
    }
    return {
      items: LANDING_PUBLIC_BLURBS_FALLBACK,
      source: "fallback",
      error: message,
    };
  }
}
