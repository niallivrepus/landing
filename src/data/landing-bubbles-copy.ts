/**
 * **Purpose:** Marketing copy for the landing Bubbles explainer + homepage beat.
 * **Connects to:** `LandingBubblesOverlay.tsx`, `LandingBubblesSection.tsx`.
 */

export const LANDING_BUBBLES_TITLE = "Bubbles";

export const LANDING_BUBBLES_SUBTITLE =
  "Shared spaces where your people, agents, and conversations live together, not scattered across apps.";

export const LANDING_BUBBLES_FEATURES = [
  {
    id: "people",
    title: "Your people in one place",
    body: "Friends, teammates, and OO share a Bubble. Chats, calls, and plans stay in the same room.",
  },
  {
    id: "channels",
    title: "Huddles for every thread",
    body: "Spin up channels for topics, voice hangs, and baby huddles without losing the main vibe.",
  },
  {
    id: "memory",
    title: "Memory that follows the room",
    body: "OO remembers what was said, who said it, and what needs doing next so energy never gets lost.",
  },
] as const;

/** Scripted Bubble preview chat — plays on the homepage Bubbles section. */
export const LANDING_BUBBLES_PREVIEW_CHAT = [
  {
    id: "maya",
    from: "them" as const,
    name: "Maya",
    text: "I dropped the deck in the Bubble. Can OO pull the open questions?",
  },
  {
    id: "me",
    from: "me" as const,
    name: "You",
    text: "On it. Jumping into the founders hang now.",
  },
  {
    id: "oo",
    from: "oo" as const,
    name: "OO",
    text: "Three open questions from #founders. I pinned them for tomorrow.",
  },
] as const;
