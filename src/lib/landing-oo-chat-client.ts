/**
 * **Purpose:** Streams the signed-out homepage OO preview chat from the `landing-oo-chat` edge function.
 * **Connects to:** jokuh-live `backend/supabase/functions/landing-oo-chat`, `useLandingTempChat`.
 * The Supabase URL and publishable key are public by design; the Docker build doesn't pass VITE_SUPABASE_*, so
 * the same public values from `.env.example` are the fallback.
 */

export type LandingChatMessage = { role: "user" | "assistant"; content: string };
export type LandingChatErrorCode = "busy" | "turn_limit" | "unavailable" | "network";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "https://iyrpplpvggsdsubwmudw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "sb_publishable_TV6S_N2Zp2bE6ew3U1LPKg_iiCMMam3";

export class LandingChatError extends Error {
  constructor(public readonly code: LandingChatErrorCode) {
    super(code);
  }
}

/** **Streams** OO's reply; calls `onDelta` with each new text chunk. Resolves when the reply is complete. */
export async function streamLandingOoChat(
  messages: LandingChatMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/landing-oo-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (error) {
    if ((error as Error)?.name === "AbortError") throw error;
    throw new LandingChatError("network");
  }

  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => ({}) as { error?: string });
    const code = (body as { error?: string }).error;
    throw new LandingChatError(code === "busy" || code === "turn_limit" ? code : "unavailable");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline = buffer.indexOf("\n");
    while (newline !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");
      if (!line.startsWith("data:")) continue; // SSE comments (": OPENROUTER PROCESSING") and blank lines
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta) onDelta(delta);
      } catch {
        /* partial or non-JSON keep-alive line */
      }
    }
  }
}
