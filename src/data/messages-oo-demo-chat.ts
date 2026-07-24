/**
 * **Purpose:** OO demo chat helpers for Texts immersive + homepage “See it work”.
 * Replies stay plain and concrete so visitors see agent powers, not chatbot filler.
 */

import { LANDING_DEMO_POWERS } from "./landing-demo-powers";

export type MessagesOoMessage = {
  id: string;
  author: "user" | "oo";
  body: string;
  thinking?: boolean;
};

export const MESSAGES_OO_WELCOME = "Tap a power below. I'll show you what I can do.";

/** Homepage chips — map 1:1 to `LANDING_DEMO_POWERS` labels for the demo strip. */
export const MESSAGES_OO_SUGGESTIONS = LANDING_DEMO_POWERS.map((power) => power.prompt);

const OO_REPLIES: Record<string, string> = Object.fromEntries(
  LANDING_DEMO_POWERS.map((power) => [power.prompt.toLowerCase(), power.reply]),
);

export function createOoUserMessage(body: string, id = crypto.randomUUID()): MessagesOoMessage {
  return { id, author: "user", body };
}

export function createOoThinkingMessage(id = crypto.randomUUID()): MessagesOoMessage {
  return { id, author: "oo", body: "thinking…", thinking: true };
}

export function createOoReply(source: string, id?: string): MessagesOoMessage {
  const normalized = source.trim().toLowerCase();
  const powerHit = LANDING_DEMO_POWERS.find(
    (power) =>
      normalized === power.prompt.toLowerCase() ||
      normalized.includes(power.label.toLowerCase()) ||
      normalized.includes(power.id),
  );
  const body =
    OO_REPLIES[normalized] ??
    powerHit?.reply ??
    (source.length > 60
      ? "Got it. Claim identity and I can hold that as lasting context."
      : "Received. Claim identity to unlock full agent context across Texts, Spine, and Bubbles.");

  return { id: id ?? crypto.randomUUID(), author: "oo", body };
}

export const MESSAGES_OO_THINKING_MS = 1100;
/** Soft-stop after two power proofs so the claim bridge becomes the next step. */
export const MESSAGES_OO_INTERCEPT_AFTER = 2;
