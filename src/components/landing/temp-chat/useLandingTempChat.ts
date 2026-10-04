import { useCallback, useEffect, useRef, useState } from "react";
import {
  LandingChatError,
  streamLandingOoChat,
  type LandingChatErrorCode,
  type LandingChatMessage,
} from "../../../lib/landing-oo-chat-client";

/** Visitor messages before the chat asks them to claim an identity (the server allows a little more). */
export const LANDING_TEMP_CHAT_MAX_TURNS = 6;

export type LandingTempChat = {
  messages: LandingChatMessage[];
  streaming: boolean;
  error: LandingChatErrorCode | null;
  active: boolean;
  atLimit: boolean;
  send: (text: string) => void;
  reset: () => void;
};

/**
 * **Purpose:** State for the homepage's temporary OO chat — one conversation in memory, never persisted; closing it
 * aborts the in-flight reply and clears everything.
 * **Connects to:** `LandingImmersiveShell` (prompt bar + chips call `send`), `LandingTempChatPanel`.
 */
export function useLandingTempChat(): LandingTempChat {
  const [messages, setMessages] = useState<LandingChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<LandingChatErrorCode | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<LandingChatMessage[]>([]);
  messagesRef.current = messages;

  const turns = messages.filter((m) => m.role === "user").length;
  const atLimit = turns >= LANDING_TEMP_CHAT_MAX_TURNS;

  const send = useCallback((text: string) => {
    const content = text.trim();
    if (!content || abortRef.current) return;
    if (messagesRef.current.filter((m) => m.role === "user").length >= LANDING_TEMP_CHAT_MAX_TURNS) return;

    const history: LandingChatMessage[] = [...messagesRef.current, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setError(null);
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    streamLandingOoChat(
      history,
      (delta) => {
        setMessages((current) => {
          const next = current.slice();
          const last = next[next.length - 1];
          if (last?.role === "assistant") next[next.length - 1] = { ...last, content: last.content + delta };
          return next;
        });
      },
      controller.signal,
    )
      .catch((err: unknown) => {
        if ((err as Error)?.name === "AbortError") return;
        setError(err instanceof LandingChatError ? err.code : "unavailable");
        // Drop the empty OO bubble so the error line takes its place.
        setMessages((current) => {
          const last = current[current.length - 1];
          return last?.role === "assistant" && !last.content ? current.slice(0, -1) : current;
        });
      })
      .finally(() => {
        if (abortRef.current === controller) abortRef.current = null;
        setStreaming(false);
      });
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setError(null);
    setStreaming(false);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { messages, streaming, error, active: messages.length > 0 || error !== null, atLimit, send, reset };
}
