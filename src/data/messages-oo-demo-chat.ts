/** **Purpose:** OO demo chat helpers for the immersive Messages product page. */

export type MessagesOoMessage = {
  id: string;
  author: "user" | "oo";
  body: string;
  thinking?: boolean;
};

export const MESSAGES_OO_WELCOME =
  "Hi — I'm OO, your private agent. Ask about memory, encryption, or how modules work inside messages.";

export const MESSAGES_OO_SUGGESTIONS = [
  "how private are my messages?",
  "what is spine?",
  "help me claim identity",
] as const;

const OO_REPLIES: Record<string, string> = {
  "how private are my messages?":
    "end-to-end by default. your agent only sees what you allow — nothing leaves your device unless you say so.",
  "what is spine?":
    "spine is your operating timeline — calls, blurbs, notes, and prompts in one chronological surface.",
  "help me claim identity":
    "tap claim identity below — i'll walk you through handle, bond, and your first module.",
};

export function createOoUserMessage(body: string, id = crypto.randomUUID()): MessagesOoMessage {
  return { id, author: "user", body };
}

export function createOoThinkingMessage(id = crypto.randomUUID()): MessagesOoMessage {
  return { id, author: "oo", body: "thinking…", thinking: true };
}

export function createOoReply(source: string, id?: string): MessagesOoMessage {
  const normalized = source.trim().toLowerCase();
  const matched = Object.entries(OO_REPLIES).find(([key]) => normalized.includes(key.split(" ")[0]!));
  const body =
    OO_REPLIES[normalized] ??
    matched?.[1] ??
    (source.length > 60
      ? "got it. i can hold that as a module once you claim identity."
      : "received. claim identity to unlock full agent context.");

  return { id: id ?? crypto.randomUUID(), author: "oo", body };
}

export const MESSAGES_OO_THINKING_MS = 1100;
export const MESSAGES_OO_INTERCEPT_AFTER = 2;
