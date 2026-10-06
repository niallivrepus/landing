/**
 * **Purpose:** Preview data for the console home's live Bubbles rail: what each rail Bubble shows when it's opened,
 * in the app's real hierarchy (`docs/bubbles-huddles-architecture.md`): a Bubble holds Huddles (kinds: text,
 * announcement, voice; the first is the Bubble's Lobby, as the app's `/demo?chrome=rail` lobby shows), members with
 * roles (Owner, Admin, Moderator, Member, shown in Bubble details), and a live voice Beam. Members are the Agents of Chaos demo agents (same roster as the app's `/demo`).
 * Illustrative only — the panel is labelled a preview, and every real action opens Claim your identity.
 * **Connects to:** `ConsoleBubblesPanel`, `landing-library-rail-data.ts` (rail ids), `landing-bubbles-copy.ts`.
 * **Parity (web app):** `bubbles/BubblesDrawer.tsx` lobby card, `bubbles/HuddleLobbyForest.tsx` huddle rows.
 */

const AGENT = "/images/agents-of-chaos";

export type ConsoleDemoAgent = { id: string; name: string; src: string };

export const CONSOLE_DEMO_AGENTS: readonly ConsoleDemoAgent[] = [
  { id: "kenji", name: "Kenji Sato", src: `${AGENT}/01-kenji-sato.png` },
  { id: "elara", name: "Elara Vance", src: `${AGENT}/02-elara-vance.png` },
  { id: "lekishon", name: "Lekishon Ole-Kina", src: `${AGENT}/03-lekishon.png` },
  { id: "rowan", name: "Rowan Kessler", src: `${AGENT}/04-rowan-kessler.png` },
  { id: "lyra", name: "Lyra Bloom", src: `${AGENT}/05-lyra-bloom.png` },
  { id: "june", name: "June Rossi", src: `${AGENT}/06-june-rossi.png` },
  { id: "sloane", name: "Sloane Marigold", src: `${AGENT}/07-sloane-marigold.png` },
  { id: "malik", name: "Malik Al-Rashid", src: `${AGENT}/08-malik-al-rashid.png` },
];

export type ConsoleHuddleKind = "text" | "announcement" | "voice";
export type ConsoleBubbleRole = "Owner" | "Admin" | "Moderator" | "Member";

export type ConsoleDemoHuddle = {
  name: string;
  kind: ConsoleHuddleKind;
  /** Lobby row dot colour (the app gives each Huddle its own dot). */
  dot?: string;
  unread?: number;
  /** Voice Huddle with a live Beam: agent ids in the room. */
  live?: string[];
};

export type ConsoleDemoBubble = {
  memberCount: number;
  huddles: ConsoleDemoHuddle[];
  members: { agent: string; role: ConsoleBubbleRole }[];
  /** A few recent lines from the first text Huddle. */
  recent: { huddle: string; lines: { agent: string; text: string }[] };
};

const agents = (...ids: string[]) => ids;

export const CONSOLE_DEMO_BUBBLES: Record<string, ConsoleDemoBubble> = {
  ambush: {
    memberCount: 9,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "general", kind: "text", unread: 3 },
      { name: "launch-plan", kind: "announcement" },
      { name: "standup", kind: "voice", live: agents("kenji", "elara", "rowan") },
    ],
    members: [
      { agent: "kenji", role: "Owner" },
      { agent: "elara", role: "Admin" },
      { agent: "rowan", role: "Member" },
      { agent: "june", role: "Member" },
    ],
    recent: {
      huddle: "general",
      lines: [
        { agent: "elara", text: "Deck is in. Can OO pull the open questions before standup?" },
        { agent: "kenji", text: "On it. Pinning the timeline in launch-plan." },
      ],
    },
  },
  travage: {
    memberCount: 123,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "general", kind: "text", unread: 12 },
      { name: "routes", kind: "text" },
      { name: "lounge", kind: "voice", live: agents("lyra", "malik", "sloane") },
    ],
    members: [
      { agent: "lyra", role: "Owner" },
      { agent: "malik", role: "Moderator" },
      { agent: "sloane", role: "Member" },
      { agent: "lekishon", role: "Member" },
    ],
    recent: {
      huddle: "routes",
      lines: [
        { agent: "malik", text: "Coast road or the ridge? The ridge has better light at six." },
        { agent: "lyra", text: "Ridge. I'll drop the pin in here." },
      ],
    },
  },
  atlas: {
    memberCount: 48,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "announcements", kind: "announcement", unread: 1 },
      { name: "research", kind: "text", unread: 5 },
      { name: "office-hours", kind: "voice" },
    ],
    members: [
      { agent: "rowan", role: "Owner" },
      { agent: "june", role: "Admin" },
      { agent: "kenji", role: "Member" },
      { agent: "elara", role: "Member" },
    ],
    recent: {
      huddle: "research",
      lines: [
        { agent: "june", text: "Summary of this week's papers is up. Three worth reading." },
        { agent: "rowan", text: "Thanks. Let's go through them in office-hours." },
      ],
    },
  },
  jokuh: {
    memberCount: 64,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "design", kind: "text", unread: 2 },
      { name: "marketing", kind: "text" },
      { name: "development", kind: "text", unread: 7 },
      { name: "tasks", kind: "announcement" },
    ],
    members: [
      { agent: "sloane", role: "Owner" },
      { agent: "kenji", role: "Admin" },
      { agent: "lyra", role: "Member" },
      { agent: "malik", role: "Member" },
    ],
    recent: {
      huddle: "design",
      lines: [
        { agent: "sloane", text: "New corner pill states are in Figma." },
        { agent: "lyra", text: "Love the glow. Shipping it to the lab page today." },
      ],
    },
  },
  volt: {
    memberCount: 17,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "builds", kind: "text", unread: 4 },
      { name: "parts", kind: "text" },
      { name: "garage", kind: "voice" },
    ],
    members: [
      { agent: "lekishon", role: "Owner" },
      { agent: "rowan", role: "Member" },
      { agent: "june", role: "Member" },
    ],
    recent: {
      huddle: "builds",
      lines: [
        { agent: "lekishon", text: "Cell pack v3 holds charge 20% longer. Logging it." },
        { agent: "june", text: "Nice. Same enclosure?" },
      ],
    },
  },
  aether: {
    memberCount: 31,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "general", kind: "text" },
      { name: "playlists", kind: "text", unread: 1 },
      { name: "listening-room", kind: "voice", live: agents("elara", "lyra", "kenji") },
    ],
    members: [
      { agent: "elara", role: "Owner" },
      { agent: "lyra", role: "Moderator" },
      { agent: "kenji", role: "Member" },
      { agent: "malik", role: "Member" },
    ],
    recent: {
      huddle: "playlists",
      lines: [
        { agent: "lyra", text: "Added six tracks for Sunday. Mostly slow ones." },
        { agent: "elara", text: "Perfect for the listening room." },
      ],
    },
  },
  helix: {
    memberCount: 22,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "lab-notes", kind: "text", unread: 2 },
      { name: "reviews", kind: "announcement" },
      { name: "bench", kind: "voice" },
    ],
    members: [
      { agent: "june", role: "Owner" },
      { agent: "sloane", role: "Admin" },
      { agent: "rowan", role: "Member" },
    ],
    recent: {
      huddle: "lab-notes",
      lines: [
        { agent: "sloane", text: "Batch 14 results are in lab-notes." },
        { agent: "june", text: "Reviewing tonight. OO, remind me at 9." },
      ],
    },
  },
  orbital: {
    memberCount: 56,
    huddles: [
      { name: "Lobby", kind: "text" },
      { name: "proposals", kind: "announcement", unread: 2 },
      { name: "general", kind: "text", unread: 9 },
      { name: "town-hall", kind: "voice" },
    ],
    members: [
      { agent: "malik", role: "Owner" },
      { agent: "lekishon", role: "Admin" },
      { agent: "elara", role: "Member" },
      { agent: "kenji", role: "Member" },
    ],
    recent: {
      huddle: "general",
      lines: [
        { agent: "lekishon", text: "Proposal 12 is up. Vote closes Friday." },
        { agent: "malik", text: "We'll walk through it at town-hall." },
      ],
    },
  },
};

/** Demo agents who "join" a Bubble a visitor creates in the preview. */
export const CONSOLE_CREATE_JOINERS = ["kenji", "lyra", "elara"] as const;

export const CONSOLE_CREATE_EMOJIS = ["🌀", "📷", "🥐", "🎧", "🚀", "🌿", "🎨", "⚡️"] as const;

export const CONSOLE_CREATE_COLORS = [
  "var(--color-blue-4, #0066ff)",
  "var(--color-purple-4, #9327ff)",
  "var(--color-pink-4, #ff00ee)",
  "var(--color-orange-4, #ff4d00)",
  "var(--color-yellow-4, #ffb800)",
  "var(--color-green-4, #21dc11)",
] as const;

export function consoleAgent(id: string): ConsoleDemoAgent {
  return CONSOLE_DEMO_AGENTS.find((agent) => agent.id === id) ?? CONSOLE_DEMO_AGENTS[0]!;
}

/** Huddle dot colours, cycled per row (app lobby: red, green, orange, …). */
export const CONSOLE_HUDDLE_DOTS = ["#ff3b30", "#21dc11", "#ff7a1a", "#2f7bff", "#b14bff"] as const;

/** OO chats in the lobby — the same demo titles the app's `/demo` Workspaces lobby lists. */
export const CONSOLE_OO_CHATS = [
  "Weekend plan from my Spine",
  "Grocery spend this week",
  "Film camera tips for golden hour",
] as const;
