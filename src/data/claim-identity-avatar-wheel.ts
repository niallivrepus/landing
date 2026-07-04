/**
 * **Purpose:** Avatar roster for the claim-identity overlay PillWheel — Agents of Chaos first, aliens fill the ring.
 * **Connects to:** `ClaimIdentityAvatarBackground`, `profile-demo-identity.ts`.
 * **Assets:** `public/images/agents-of-chaos/*.png`, `public/aliens/alien-*.jpg`.
 */

import { PROFILE_DEMO_MOCK_NETWORK } from "../lib/profile-demo-identity";

const ALIEN_COUNT = 152;

export type ClaimIdentityWheelAvatar = {
  src: string;
  alt: string;
  originColor?: "aether" | "flame" | "solar" | "life" | "fruta" | "insight" | "spirit";
};

const ORIGIN_CYCLE: ClaimIdentityWheelAvatar["originColor"][] = [
  "aether",
  "life",
  "solar",
  "flame",
  "spirit",
  "fruta",
  "insight",
];

/** Eight founding Agents of Chaos portraits — always represented in the wheel. */
export const CLAIM_IDENTITY_AGENT_AVATARS: ClaimIdentityWheelAvatar[] =
  PROFILE_DEMO_MOCK_NETWORK.map((peer, index) => ({
    src: peer.avatarUrl ?? "",
    alt: peer.displayName,
    originColor: ORIGIN_CYCLE[index % ORIGIN_CYCLE.length],
  }));

const ALIEN_AVATARS: ClaimIdentityWheelAvatar[] = Array.from({ length: ALIEN_COUNT }, (_, i) => ({
  src: `/aliens/alien-${String(i + 1).padStart(4, "0")}.jpg`,
  alt: "Community member",
  originColor: ORIGIN_CYCLE[i % ORIGIN_CYCLE.length],
}));

/** PillWheel needs ~72 slots — repeat agents + diverse aliens for a full celebratory ring. */
export function buildClaimIdentityWheelAvatars(slotCount = 72): ClaimIdentityWheelAvatar[] {
  const pool: ClaimIdentityWheelAvatar[] = [];
  while (pool.length < slotCount) {
    pool.push(...CLAIM_IDENTITY_AGENT_AVATARS, ...ALIEN_AVATARS);
  }
  return pool.slice(0, slotCount);
}
