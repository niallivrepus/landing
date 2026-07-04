/**
 * **Purpose:** Inspirational identity preview for the marketing `/profile` pod — not a real user.
 * **Connects to:** `ProfilePodPanel`, `ProfileNetworkStripPanel`.
 * **Assets:** Agents of Chaos founding cohort portraits (`public/images/agents-of-chaos/`).
 */

import type { ProfileDemoNetworkPeer } from "./public-profile-demo";

const AGENT_AVATAR_BASE = "/images/agents-of-chaos";

/** One mock network peer — extends strip shape with optional presence hint for future UI. */
export type ProfileDemoIdentityPeer = ProfileDemoNetworkPeer & {
  /** Optional presence label (not rendered on landing strip today). */
  status?: "online" | "away" | "offline";
};

/** Hero portrait source — Agents of Chaos founding agent used as demo squircle photo. */
export const PROFILE_DEMO_HERO_AGENT = {
  username: "elara-vance",
  displayName: "Elara Vance",
  avatarPath: `${AGENT_AVATAR_BASE}/02-elara-vance.png`,
} as const;

/** Placeholder identity copy — invites visitors to imagine their own profile. */
export const PROFILE_DEMO_PLACEHOLDER = {
  displayName: "Your Name",
  handle: "@you",
  tagline: "Claim yours",
} as const;

/** Mock network roster — diverse Agents of Chaos peers to inspire building a real network. */
export const PROFILE_DEMO_MOCK_NETWORK: ProfileDemoIdentityPeer[] = [
  {
    userId: "demo-kenji-sato",
    displayName: "Kenji Sato",
    avatarUrl: `${AGENT_AVATAR_BASE}/01-kenji-sato.png`,
    status: "online",
  },
  {
    userId: "demo-lekishon",
    displayName: "Lekishon Ole-Kina",
    avatarUrl: `${AGENT_AVATAR_BASE}/03-lekishon.png`,
    status: "away",
  },
  {
    userId: "demo-rowan-kessler",
    displayName: "Rowan Kessler",
    avatarUrl: `${AGENT_AVATAR_BASE}/04-rowan-kessler.png`,
    status: "online",
  },
  {
    userId: "demo-lyra-bloom",
    displayName: "Lyra Bloom",
    avatarUrl: `${AGENT_AVATAR_BASE}/05-lyra-bloom.png`,
    status: "offline",
  },
  {
    userId: "demo-june-rossi",
    displayName: "June Rossi",
    avatarUrl: `${AGENT_AVATAR_BASE}/06-june-rossi.png`,
    status: "online",
  },
  {
    userId: "demo-sloane-marigold",
    displayName: "Sloane Marigold",
    avatarUrl: `${AGENT_AVATAR_BASE}/07-sloane-marigold.png`,
    status: "away",
  },
  {
    userId: "demo-malik-al-rashid",
    displayName: "Malik Al-Rashid",
    avatarUrl: `${AGENT_AVATAR_BASE}/08-malik-al-rashid.png`,
    status: "offline",
  },
];

/** **Returns** normalized strip peers for `ProfileNetworkStripPanel`. */
export function profileDemoNetworkPeers(): ProfileDemoNetworkPeer[] {
  return PROFILE_DEMO_MOCK_NETWORK.map(({ userId, displayName, avatarUrl }) => ({
    userId,
    displayName,
    avatarUrl,
  }));
}

/** Connection count shown in the network badge — matches mock roster size. */
export const PROFILE_DEMO_CONNECTION_COUNT = PROFILE_DEMO_MOCK_NETWORK.length;
