import { useMemo } from "react";
import {
  PROFILE_DEMO_CONNECTION_COUNT,
  PROFILE_DEMO_HERO_AGENT,
  PROFILE_DEMO_PLACEHOLDER,
  profileDemoNetworkPeers,
} from "../lib/profile-demo-identity";
import type { PublicProfileDemoData, PublicProfileDemoResult } from "../lib/public-profile-demo";

type UsePublicProfileDemoState = {
  profile: PublicProfileDemoData | null;
  loading: boolean;
  source: PublicProfileDemoResult["source"];
  error: string | null;
};

/** **Builds** static inspirational profile pod data — no live API fetch. */
function buildInspirationalProfileDemo(): PublicProfileDemoData {
  return {
    accountId: "profile-demo-placeholder",
    username: PROFILE_DEMO_PLACEHOLDER.handle.replace(/^@/, ""),
    displayName: PROFILE_DEMO_PLACEHOLDER.displayName,
    biographyText: "",
    avatarUrl: PROFILE_DEMO_HERO_AGENT.avatarPath,
    identityPhotoMasked: false,
    activeProfileLiveSessionId: null,
    latestBlurbText: null,
    connectionCount: PROFILE_DEMO_CONNECTION_COUNT,
    networkPeers: profileDemoNetworkPeers(),
  };
}

/**
 * **Purpose:** Supplies static inspirational profile pod data for the marketing `/profile` page.
 * **Connects to:** `profile-demo-identity.ts` — live `peek_public_profile` is intentionally bypassed.
 */
export function usePublicProfileDemo(): UsePublicProfileDemoState {
  const profile = useMemo(() => buildInspirationalProfileDemo(), []);

  return {
    profile,
    loading: false,
    source: "fallback",
    error: null,
  };
}
