/**
 * **Purpose:** Copy + screen sources for the Gooey homepage feature sections.
 * **Claims (keep accurate, same rules as `data/defense.ts`):** E2EE covers direct and group messages only (no claim
 * for calls, Mail or Spine); wallet copy names only coins the wallet shows; agents "ask before they act" = the
 * Agents inbox approvals.
 * **Screens:** every frame is the app's own Gooey web component rendered on demo fixtures — the jokuh-live Goo Lab
 * "Goo" views (`/gooey/labs/<lab>`, dev server, `?canvasDevUnlock=1`), captured by `scripts/capture-goo-lab.mjs`
 * into `public/gooey-home/captures/` in Gooey Dark and Gooey Light. Swap for device recordings when they exist
 * (see `todoCapture`).
 */

export type GooFeatureShot = {
  /** Base name in `/gooey-home/captures/` (`<name>-dark.webp` / `<name>-light.webp`). */
  name: string;
  alt: string;
};

export type GooFeature = {
  id: "calls" | "text" | "id" | "spine" | "wallet" | "oo";
  corner: string;
  accent: string;
  title: string;
  body: string;
  points: string[];
  shots: [GooFeatureShot] | [GooFeatureShot, GooFeatureShot];
  /** Render a live scene in place of the captures (the capture is its first-paint placeholder). */
  live?: "oopolis";
  /** Device capture still wanted for this section (TODO-capture). Shown in no UI. */
  todoCapture?: string;
  learnMore?: { href: string; label: string };
};

/** Meeting violet (`GooLabPalette.violet`), pink, blue, cyan, go green, OO lime. */
export const GOO_FEATURES: GooFeature[] = [
  {
    id: "calls",
    corner: "Call",
    accent: "#8b5cf6",
    title: "Calls that feel close.",
    body: "Ring a friend, or start a meeting with a link anyone can join. Voice or video, one-on-one or the whole group.",
    points: ["Voice and video", "Group calls", "Meeting links"],
    shots: [
      { name: "calls-ring", alt: "An incoming call from Maya Chen with Decline and Accept drops, in Jokuh's Gooey design" },
      { name: "calls-live", alt: "A group call in progress with three people and call controls" },
    ],
    todoCapture: "iOS: Jokuh Meet meeting card with Join (Gooey, dark + light).",
    learnMore: { href: "/calls", label: "More about calls" },
  },
  {
    id: "text",
    corner: "Text",
    accent: "#ff4f9a",
    title: "Messages, sealed.",
    body: "Chat with one person or a whole group. Messages are end-to-end encrypted from the first one, and a live call shows up right in the chat with a Join button.",
    points: ["End-to-end encrypted", "Voice notes and photos", "Join a call from the chat"],
    shots: [{ name: "text-call", alt: "A chat with Malik: three messages and a live call card with a green Join button" }],
    learnMore: { href: "/messages", label: "More about Text" },
  },
  {
    id: "id",
    corner: "ID",
    accent: "#2c81ff",
    title: "One page that is you.",
    body: "Your photo, your music, your places and your people, in pods you arrange. Share it with one link, and connect with a tap.",
    points: ["Pods you arrange", "Your own link", "Connect in a tap"],
    shots: [{ name: "id-page", alt: "A profile page: portrait, name, Connect button and pods for gallery, music, location, Spine, bubble and contact" }],
    learnMore: { href: "/profile", label: "More about ID" },
  },
  {
    id: "spine",
    corner: "Spine",
    accent: "#22d3ee",
    title: "Your day, remembered.",
    body: "Spine keeps your calls, notes, plans and moments on one line through the day, so you can find anything later. OO writes you a short brief each morning.",
    points: ["Hour by hour", "Search your memories", "Birthdays and plans"],
    shots: [{ name: "spine-day", alt: "A Spine day: a short brief at the top, then voice memo, calls and plans along an hour-by-hour goo cord" }],
    todoCapture: "iOS: the Gooey Spine rib-cage overview (memory spine) — not on web yet; this slot shows the web goo day cord.",
    learnMore: { href: "/spine", label: "More about Spine" },
  },
  {
    id: "wallet",
    corner: "Wallet",
    accent: "#21dc11",
    title: "Money, privately.",
    body: "A privacy-first wallet with Zcash and Monero up front, plus Bitcoin, Solana, Avalanche and USDC. Your private balance stays frosted until you wipe it.",
    points: ["Private balance", "Pay and receive", "Swap in a few taps"],
    shots: [
      { name: "wallet-home", alt: "The Gooey wallet: total balance with a live chart, Pay, Receive, Swap and Fuel, a frosted private balance and a list of coins" },
      { name: "wallet-swap", alt: "The wallet's Swap panel turning Zcash into Solana" },
    ],
    todoCapture: "iOS: the shipped goo Wallet (approved 2026-10-18) with Swap, dark + light.",
  },
  {
    id: "oo",
    corner: "OO",
    accent: "#9dff2a",
    title: "OO, and a city of helpers.",
    body: "OO is your own AI. It remembers what matters across your calls, chats and files without giving that context to anyone else. In OOpolis, your agents take on tasks and ask you before they act.",
    points: ["Your own AI", "Agents that ask first", "Works with the apps you use"],
    shots: [{ name: "agents-city", alt: "OOpolis, live: Queen OO hands out tasks and baby OOs walk to Spine, Text, Wallet, Calls, Flights and Calendar, then pop what they finished" }],
    live: "oopolis",
    learnMore: { href: "/agents", label: "More about agents" },
  },
];
