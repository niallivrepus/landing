/**
 * **Purpose:** Marketing copy for the landing Bubbles explainer overlay.
 * **Connects to:** `LandingBubblesOverlay.tsx`, product `realms` narrative in `products.ts`.
 */

export const LANDING_BUBBLES_TITLE = "Bubbles";

export const LANDING_BUBBLES_SUBTITLE =
  "Shared spaces where your people, agents, and conversations live together — not scattered across apps.";

export const LANDING_BUBBLES_FEATURES = [
  {
    id: "people",
    title: "Your people in one place",
    body: "Friends, teammates, and OO share a Bubble — chats, calls, and plans stay in the same room.",
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
