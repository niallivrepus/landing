/**
 * **Purpose:** Shared types for the marketing `/profile` demo — real app profile pod data shape.
 * **Connects to:** `public-profile-service.ts`, `ProfilePodPanel.tsx`, `peek_public_profile` RPC.
 * **Backend parity:** `frontend/src/utils/jokuh-public-profile-api.ts`, `ProfileNetworkStrip.tsx`.
 */

/** One network preview peer — mirrors `PeerNetworkPreviewPeer` (`jokuh-connections-api.ts`). */
export type ProfileDemoNetworkPeer = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

/** Normalized profile demo payload for the landing profile pod. */
export type PublicProfileDemoData = {
  accountId: string;
  username: string;
  displayName: string;
  biographyText: string;
  avatarUrl: string | null;
  identityPhotoMasked: boolean;
  activeProfileLiveSessionId: string | null;
  latestBlurbText: string | null;
  connectionCount: number;
  networkPeers: ProfileDemoNetworkPeer[];
};

export type PublicProfileDemoResult = {
  profile: PublicProfileDemoData | null;
  source: "live" | "fallback";
  error?: string;
};

/** Stable default demo user — real public account with profile photo (`peek_public_profile`). */
export const PROFILE_DEMO_USERNAME = "lord";

/** Curated public accounts for rotation when the primary demo user is unavailable. */
export const PROFILE_DEMO_USERNAME_POOL = [
  "lord",
  "inesngu",
  "luca62",
  "hugosc",
  "leilam",
] as const;

/** **Formats** roster-size copy for the profile **Network** strip (`profile-network-format.ts`). */
export function formatConnectionCountLabel(count: number): string {
  const n = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
  if (n === 1) return "1 connection";
  if (n < 1_000) return `${n} connections`;
  if (n < 1_000_000) {
    const k = n / 1000;
    const s = formatCompactUnit(k, "K");
    return `${s} connections`;
  }
  const m = n / 1_000_000;
  const s = formatCompactUnit(m, "M");
  return `${s} connections`;
}

function formatCompactUnit(value: number, suffix: string): string {
  const roundedTenth = Math.round(value * 10) / 10;
  if (Math.abs(roundedTenth - Math.round(roundedTenth)) < 0.001) {
    return `${Math.round(roundedTenth)}${suffix}`;
  }
  return `${roundedTenth.toFixed(1)}${suffix}`;
}

/** Bundled fallback when live fetch is unavailable — mirrors `peek_public_profile` shape for `lord`. */
export const LANDING_PROFILE_DEMO_FALLBACK: PublicProfileDemoData = {
  accountId: "db84c6e1-ebb4-41f9-a2f7-209039de32dc",
  username: PROFILE_DEMO_USERNAME,
  displayName: "Sean Rock",
  biographyText: "",
  avatarUrl: null,
  identityPhotoMasked: false,
  activeProfileLiveSessionId: null,
  latestBlurbText: null,
  connectionCount: 0,
  networkPeers: [],
};
