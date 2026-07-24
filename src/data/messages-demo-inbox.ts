/**
 * **Purpose:** Demo DM bodies for homepage “See it work” and Texts immersive parity.
 * Plain, human conversation — no em dashes — so visitors grasp OO’s memory in one glance.
 * **Connects to:** `ProductDemoSection`, `MessagesImmersiveShell`.
 */

import { HOME_STORIES } from "./home-stories";
import { getStoryDetail } from "./stories-detail";

/** **Purpose:** Thread kinds for the landing Texts inbox — OO, customer stories, and demo DMs. */
export type MessagesInboxThreadKind = "oo" | "story" | "dm";

export type MessagesInboxThread = {
  id: string;
  kind: MessagesInboxThreadKind;
  name: string;
  preview: string;
  accentColor: string;
  storySlug?: string;
  avatarSrc?: string;
  unread?: boolean;
  pinned?: boolean;
};

export type MessagesDmMessage = {
  from: "them" | "me";
  text: string;
};

export type MessagesDmThread = {
  id: string;
  messages: MessagesDmMessage[];
  /** OO agent note after the peer exchange — spoken via `OoSpeakBubble`, not shown as the human. */
  reply: string;
};

/** **Purpose:** Demo DM bodies keyed by inbox thread id. */
export const MESSAGES_DM_THREADS: Record<string, MessagesDmThread> = {
  maya: {
    id: "maya",
    messages: [
      { from: "them", text: "Hey, did you send last week's deck?" },
      { from: "me", text: "Yep. I sent the Figma link, not a PDF." },
      { from: "them", text: "Perfect, that's exactly what I needed." },
    ],
    reply: "Got it. Maya prefers Figma links over PDFs. I'll remember that.",
  },
  sam: {
    id: "sam",
    messages: [
      { from: "them", text: "Can we move our call to next week?" },
      { from: "me", text: "Sure. Same time work for you?" },
      { from: "them", text: "Same time is great. Thanks!" },
    ],
    reply: "Done. Sam's call is next week at the same time.",
  },
};

/**
 * **Purpose:** Builds the Texts inbox roster — OO pinned, story people, then demo DMs.
 * **Connects to:** `MessagesImmersiveShell`, `home-stories.ts`, `stories-detail.ts`.
 */
export function buildMessagesInboxThreads(): MessagesInboxThread[] {
  const storyThreads: MessagesInboxThread[] = HOME_STORIES.map((story) => {
    const detail = getStoryDetail(story.slug);
    return {
      id: `story-${story.slug}`,
      kind: "story",
      name: story.title,
      preview: detail?.dek ?? "Read their story",
      accentColor: "var(--color-insight-4, #b794f6)",
      storySlug: story.slug,
      avatarSrc: story.image,
      unread: true,
    };
  });

  return [
    {
      id: "oo",
      kind: "oo",
      name: "OO",
      preview: "Your private agent · always here",
      accentColor: "var(--color-aether-4, #3b82f6)",
      pinned: true,
    },
    ...storyThreads,
    {
      id: "maya",
      kind: "dm",
      name: "Maya",
      preview: "Hey, did you send last week's deck?",
      accentColor: "var(--color-flame-4, #fb923c)",
      unread: true,
    },
    {
      id: "sam",
      kind: "dm",
      name: "Sam",
      preview: "Can we move our call to next week?",
      accentColor: "var(--color-insight-4, #a855f7)",
    },
  ];
}
