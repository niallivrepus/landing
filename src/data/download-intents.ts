import type { LandingCornerAction } from "./landing-shell-preview";

/** **Purpose:** Conversion intent IDs for contextual `/download` routing from immersive dummy UIs. */
export type DownloadIntentId =
  | "default"
  | "identity"
  | "corner-call"
  | "corner-text"
  | "corner-id"
  | "corner-spine"
  | "prompt-library"
  | "bubbles"
  | "prompt-plus"
  | "connect"
  | "call"
  | "send-message"
  | "view-network"
  | "save-memory"
  | "product-hero";

export type DownloadIntentCopy = {
  eyebrow?: string;
  headline: string;
  subcopy: string;
  platformFocus?: "mobile" | "desktop" | "both";
};

export const DOWNLOAD_INTENTS: Record<DownloadIntentId, DownloadIntentCopy> = {
  default: {
    headline: "Download Jokuh",
    subcopy: "Early access through TestFlight and desktop rollout waves.",
    platformFocus: "both",
  },
  identity: {
    eyebrow: "Profile",
    headline: "Claim your identity",
    subcopy: "Keys, reputation, and agents you run — portable and under your control.",
    platformFocus: "mobile",
  },
  "corner-call": {
    eyebrow: "Calls",
    headline: "Talk in private",
    subcopy: "End-to-end encrypted voice with memory written back to your Spine.",
    platformFocus: "mobile",
  },
  "corner-text": {
    eyebrow: "Texts",
    headline: "Send messages in Jokuh",
    subcopy: "Private peer-to-peer chat with full agent context — download to start a thread.",
    platformFocus: "mobile",
  },
  "corner-id": {
    eyebrow: "Profile",
    headline: "Own your identity",
    subcopy: "Your sovereign layer: keys, reputation, and public surfaces.",
    platformFocus: "mobile",
  },
  "corner-spine": {
    eyebrow: "Spine",
    headline: "Hold every memory",
    subcopy: "One timeline for notes, calls, messages, and reminders.",
    platformFocus: "both",
  },
  "prompt-library": {
    eyebrow: "Library",
    headline: "Unlock your library",
    subcopy: "Search memories, blurbs, and modules once you claim identity.",
    platformFocus: "both",
  },
  bubbles: {
    eyebrow: "Bubbles",
    headline: "Step inside your Bubble",
    subcopy: "Shared spaces for your people, huddles, and live voice — download to create or join one.",
    platformFocus: "both",
  },
  "prompt-plus": {
    eyebrow: "Compose",
    headline: "Create your first module",
    subcopy: "Attach tools, media, and memory inside one calm bubble.",
    platformFocus: "mobile",
  },
  connect: {
    eyebrow: "Network",
    headline: "Connect on Jokuh",
    subcopy: "Build your network with end-to-end encrypted identity.",
    platformFocus: "mobile",
  },
  call: {
    eyebrow: "Calls",
    headline: "Join the call",
    subcopy: "Download Jokuh to enter encrypted voice and video rooms.",
    platformFocus: "mobile",
  },
  "send-message": {
    eyebrow: "OO",
    headline: "Chat with OO",
    subcopy: "Your private agent lives in messages — claim identity to continue.",
    platformFocus: "mobile",
  },
  "view-network": {
    eyebrow: "Network",
    headline: "See the full network map",
    subcopy: "Connections, mutual agents, and wormholes unlock after signup.",
    platformFocus: "mobile",
  },
  "save-memory": {
    eyebrow: "Spine",
    headline: "Save to Spine",
    subcopy: "Crystallize moments into your operating timeline.",
    platformFocus: "both",
  },
  "product-hero": {
    headline: "Download Jokuh",
    subcopy: "Get early access and start using this primitive in ARC Terminal.",
    platformFocus: "both",
  },
};

/** **Purpose:** Maps corner pill semantic actions to download intents (for gated affordances). */
export function cornerActionToIntent(action: LandingCornerAction): DownloadIntentId {
  switch (action) {
    case "call":
      return "corner-call";
    case "text":
      return "corner-text";
    case "id":
      return "corner-id";
    case "spine":
      return "corner-spine";
  }
}
