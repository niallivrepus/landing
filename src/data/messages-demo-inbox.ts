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
  reply: string;
};

/** **Purpose:** Demo DM bodies keyed by inbox thread id (parity with `ProductDemoSection` threads). */
export const MESSAGES_DM_THREADS: Record<string, MessagesDmThread> = {
  maya: {
    id: "maya",
    messages: [
      { from: "them", text: "did you ever send over the deck from last week?" },
      { from: "me", text: "yeah — sent the Figma link, not a PDF" },
      { from: "them", text: "ha, it remembered that" },
    ],
    reply: "Noted — Maya gets links, not PDFs, from now on.",
  },
  sam: {
    id: "sam",
    messages: [
      { from: "them", text: "can we push the call to next week?" },
      { from: "me", text: "works for me, same time?" },
    ],
    reply: "Moved — Sam's call is now next week, same time. Calendar updated.",
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
      preview: "did you send the deck?",
      accentColor: "var(--color-flame-4, #fb923c)",
      unread: true,
    },
    {
      id: "sam",
      kind: "dm",
      name: "Sam",
      preview: "next week works",
      accentColor: "var(--color-insight-4, #a855f7)",
    },
  ];
}
