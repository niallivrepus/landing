import { createOoReply, createOoThinkingMessage, createOoUserMessage } from "./messages-oo-demo-chat";

/** **Purpose:** Demo chat message shape for the landing `/demo` prompt experience (OO agent). */

export type LandingDemoMessage = {
  id: string;
  author: "user" | "oo";
  body: string;
  thinking?: boolean;
};

export { MESSAGES_OO_WELCOME as LANDING_OO_WELCOME } from "./messages-oo-demo-chat";

/** **Purpose:** Creates a user bubble for the landing demo thread. */
export function createLandingUserMessage(body: string, id = crypto.randomUUID()): LandingDemoMessage {
  return createOoUserMessage(body, id);
}

/** **Purpose:** Creates the transient “thinking…” bubble before OO replies. */
export function createLandingThinkingMessage(id = crypto.randomUUID()): LandingDemoMessage {
  return createOoThinkingMessage(id);
}

/** **Purpose:** Mock OO reply — reuses Messages immersive copy helpers. */
export function createLandingOoReply(source: string, id = crypto.randomUUID()): LandingDemoMessage {
  return createOoReply(source, id);
}

export const LANDING_DEMO_THINKING_MS = 1100;
