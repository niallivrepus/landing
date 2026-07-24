/**
 * **Purpose:** Homepage “See it work” power demos — OO moves beyond chat into memory, privacy, Spine, calendar.
 * **Connects to:** `ProductDemoSection`, `messages-oo-demo-chat.ts`, claim-identity handoff (`power` param).
 */

export type LandingDemoPowerId =
  | "memory"
  | "privacy"
  | "spine"
  | "calendar"
  | "bubble";

export type LandingDemoPower = {
  id: LandingDemoPowerId;
  label: string;
  /** Short chip subtitle under the label. */
  hint: string;
  /** User prompt that triggers the demo. */
  prompt: string;
  /** OO reply that proves the power. */
  reply: string;
  /** Claim bridge label after this power reveals. */
  bridgeLabel: string;
  /** Compact UI proof that this is more than chat (memory card, calendar, etc.). */
  artifact: {
    eyebrow: string;
    title: string;
    detail: string;
  };
};

export const LANDING_DEMO_POWERS: LandingDemoPower[] = [
  {
    id: "memory",
    label: "Remembers",
    hint: "Preferences stick",
    prompt: "What does Maya prefer for decks?",
    reply:
      "Maya wants Figma links, not PDFs. I saved that from your last thread so you don't have to repeat it.",
    bridgeLabel: "Claim to keep this memory",
    artifact: {
      eyebrow: "Saved preference",
      title: "Maya · decks",
      detail: "Send Figma links, never PDFs",
    },
  },
  {
    id: "privacy",
    label: "Private",
    hint: "E2EE by default",
    prompt: "Who can read my messages with Sam?",
    reply:
      "Only you and Sam. Messages are end-to-end encrypted. I only see what you let me help with.",
    bridgeLabel: "Claim to hold your keys",
    artifact: {
      eyebrow: "Encryption",
      title: "You ↔ Sam",
      detail: "End-to-end · keys on your machine",
    },
  },
  {
    id: "spine",
    label: "Spine",
    hint: "Calls + notes",
    prompt: "What did we decide on pricing last Tuesday?",
    reply:
      "From Tuesday's founders call: $12 solo, $28 team. Two open questions are still pinned on Spine.",
    bridgeLabel: "Claim to open Spine",
    artifact: {
      eyebrow: "From Spine",
      title: "Founders call · Tuesday",
      detail: "$12 solo · $28 team · 2 open questions",
    },
  },
  {
    id: "calendar",
    label: "Moves time",
    hint: "Reschedule for you",
    prompt: "Move Sam's call to next week, same time.",
    reply: "Done. Sam's call is next week at the same time. Calendar updated.",
    bridgeLabel: "Claim to sync your calendar",
    artifact: {
      eyebrow: "Calendar updated",
      title: "Sam · 1:1",
      detail: "Moved to next week, same time",
    },
  },
  {
    id: "bubble",
    label: "Bubbles",
    hint: "Room memory",
    prompt: "What are the open questions in ambush?",
    reply:
      "Three open questions from #founders in ambush. I pinned them for tomorrow morning.",
    bridgeLabel: "Claim to enter Bubbles",
    artifact: {
      eyebrow: "ambush · #founders",
      title: "3 open questions pinned",
      detail: "Ready for tomorrow morning",
    },
  },
];

/** Resolves claim-overlay subtitle for a demo power id. */
export function landingDemoPowerBridgeLabel(powerId: string | null | undefined): string | null {
  if (!powerId) return null;
  const power = LANDING_DEMO_POWERS.find((item) => item.id === powerId);
  return power?.bridgeLabel ?? null;
}
