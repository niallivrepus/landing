import { sampleAvatar, type OriginColor } from "@jokuh/gooey";

/** **Purpose:** Demo call participant for the marketing library rail (parity with `CollapsedLibraryRail`). */
export type LandingLibraryParticipant = {
  src: string;
  borderColor: string;
  originColor: OriginColor;
  name: string;
};

export type LandingLibraryActiveCall = {
  channelId: string;
  participants: LandingLibraryParticipant[];
  count?: number;
  status?: "entering" | "active" | "exiting";
  newAvatarJoined?: boolean;
  eventKey?: string;
};

export type LandingLibraryServer = {
  id: string;
  name: string;
  symbolSrc: string;
  backgroundColor: string;
  symbolColor?: string;
  symbolScale?: number;
  hasStar?: boolean;
  hypeAvatars?: [string, string, string];
  hypeColors?: [OriginColor, OriginColor, OriginColor];
  memberCount?: number;
  activeCall?: LandingLibraryActiveCall;
};

const ORIGIN_BORDER: Record<OriginColor, string> = {
  fruta: "var(--color-fruta-4)",
  flame: "var(--color-flame-4, var(--color-orange-4))",
  solar: "var(--color-solar-4, var(--color-yellow-4))",
  life: "var(--color-life-4, var(--color-green-4))",
  aether: "var(--color-aether-4, var(--color-blue-4))",
  insight: "var(--color-insight-4, var(--color-purple-4))",
  spirit: "var(--color-spirit-4, var(--color-pink-4))",
};

const CALL_NAMES = ["sean", "hyke", "mira", "noor", "kai", "iona", "veda", "rune", "sol"] as const;

/** **Purpose:** Builds three hype-train participants from seeded sample avatars. */
export function landingCallParticipants(a: number, b: number, c: number): LandingLibraryParticipant[] {
  return [sampleAvatar(a), sampleAvatar(b), sampleAvatar(c)].map((avatar, index) => ({
    src: avatar.src.replace("/images/aliens/", "/aliens/"),
    originColor: avatar.originColor,
    borderColor: ORIGIN_BORDER[avatar.originColor],
    name: CALL_NAMES[(a + index) % CALL_NAMES.length]!,
  }));
}

const ambushCall = landingCallParticipants(1, 2, 3);
const travageCall = landingCallParticipants(4, 5, 6);
const voltCall = landingCallParticipants(7, 8, 9);
const aetherCall = landingCallParticipants(10, 11, 12);

function createCall(
  channelId: string,
  participants: LandingLibraryParticipant[],
  count?: number,
): LandingLibraryActiveCall {
  return {
    channelId,
    participants,
    count,
    status: "active",
    eventKey: `${channelId}-initial`,
  };
}

/** **Purpose:** Initial server roster for the left library rail on immersive landing pages. */
export const LANDING_LIBRARY_SERVERS: LandingLibraryServer[] = [
  {
    id: "ambush",
    name: "ambush",
    symbolSrc: "/images/server-logos/logo-01.svg",
    backgroundColor: "var(--color-red-4)",
    symbolScale: 0.72,
    activeCall: createCall("voice", ambushCall.slice(0, 1)),
  },
  {
    id: "travage",
    name: "travage",
    symbolSrc: "/images/server-logos/logo-02.svg",
    backgroundColor: "var(--color-blue-4)",
    symbolScale: 0.72,
    hasStar: true,
    activeCall: createCall("calls", travageCall, 123),
  },
  {
    id: "atlas",
    name: "atlas protocol",
    symbolSrc: "/images/server-logos/logo-03.svg",
    backgroundColor: "var(--color-purple-4)",
    symbolScale: 0.68,
    memberCount: 48,
    activeCall: createCall("lab", landingCallParticipants(13, 14, 15), 48),
  },
  {
    id: "jokuh",
    name: "jokuh",
    /** Canonical owl logomark — always black tile + white mark (not theme-inverting `--color-dark-space`). */
    symbolSrc: "/brand/jokuh-logomark-white.svg",
    backgroundColor: "#000000",
    symbolColor: "#ffffff",
    symbolScale: 0.56,
    hasStar: true,
  },
  {
    id: "volt",
    name: "volt cell",
    symbolSrc: "/images/server-logos/logo-07.svg",
    backgroundColor: "var(--color-yellow-4)",
    symbolColor: "var(--color-yellow-1)",
    symbolScale: 0.66,
    activeCall: createCall("energy", voltCall.slice(0, 2)),
  },
  {
    id: "aether",
    name: "aether",
    symbolSrc: "/images/server-logos/logo-08.svg",
    backgroundColor: "var(--color-green-4)",
    symbolColor: "var(--color-green-1)",
    symbolScale: 0.72,
    hypeAvatars: [
      "/aliens/alien-0010.jpg",
      "/aliens/alien-0011.jpg",
      "/aliens/alien-0012.jpg",
    ],
    hypeColors: ["fruta", "aether", "life"],
    activeCall: createCall("ritual", aetherCall),
  },
  {
    id: "helix",
    name: "helix labs",
    symbolSrc: "/images/server-logos/logo-09.svg",
    backgroundColor: "var(--color-green-4)",
    symbolColor: "var(--color-green-1)",
    symbolScale: 0.74,
  },
  {
    id: "orbital",
    name: "orbital dao",
    symbolSrc: "/images/server-logos/logo-10.svg",
    backgroundColor: "var(--color-orange-4)",
    symbolScale: 0.7,
  },
];

export const LANDING_LIBRARY_SIMULATED_STEPS: Array<{
  endServerId: string;
  startServerId: string;
  call: Omit<LandingLibraryActiveCall, "status" | "eventKey" | "newAvatarJoined">;
}> = [
  {
    endServerId: "atlas",
    startServerId: "jokuh",
    call: { channelId: "spine", participants: landingCallParticipants(16, 17, 18), count: 12 },
  },
  {
    endServerId: "travage",
    startServerId: "helix",
    call: { channelId: "rna", participants: landingCallParticipants(19, 20, 21).slice(0, 2) },
  },
  {
    endServerId: "volt",
    startServerId: "orbital",
    call: { channelId: "governance", participants: landingCallParticipants(22, 23, 24), count: 9 },
  },
  {
    endServerId: "aether",
    startServerId: "atlas",
    call: { channelId: "voice", participants: landingCallParticipants(25, 26, 27), count: 48 },
  },
  {
    endServerId: "jokuh",
    startServerId: "travage",
    call: { channelId: "calls", participants: travageCall, count: 123 },
  },
  {
    endServerId: "helix",
    startServerId: "volt",
    call: { channelId: "energy", participants: voltCall.slice(0, 2) },
  },
  {
    endServerId: "orbital",
    startServerId: "aether",
    call: { channelId: "ritual", participants: aetherCall },
  },
];

export const LANDING_LIBRARY_RAINBOW_BURST_MS = 1120;
export const LANDING_LIBRARY_CALL_INTERVAL_MS = 5200;
