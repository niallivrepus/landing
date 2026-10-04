import { cn } from "@jokuh/gooey";
import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { JokuhButton } from "../../system/JokuhButton";
import type { LandingTempChat } from "./useLandingTempChat";

const ERROR_COPY = {
  busy: "Lots of people are talking to OO right now. Try again in a minute.",
  unavailable: "OO can't answer right now. Try again in a moment.",
  network: "Couldn't reach OO. Check your connection and try again.",
  turn_limit: "That's the end of this preview.",
} as const;

/**
 * **Purpose:** The homepage's temporary OO chat — replaces the headline area once a visitor sends from the prompt bar.
 * Nothing is saved; the header says so. After a few turns it hands off to Claim your identity.
 * **Connects to:** `useLandingTempChat`, `LandingImmersiveShell`, claim flow (`onClaim`).
 */
export function LandingTempChatPanel({
  chat,
  onClose,
  onClaim,
}: {
  chat: LandingTempChat;
  onClose: () => void;
  onClaim: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);
  const last = chat.messages[chat.messages.length - 1];

  useEffect(() => {
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [chat.messages.length, last?.content, chat.error, chat.atLimit]);

  return (
    <motion.section
      aria-label="Temporary chat with OO"
      className="landing-temp-chat"
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="landing-temp-chat__header">
        <span className="landing-temp-chat__oo" aria-hidden>
          OO
        </span>
        <div className="min-w-0 flex-1">
          <p className="landing-temp-chat__title">Temporary chat</p>
          <p className="landing-temp-chat__subtitle">Not saved · closes when you leave</p>
        </div>
        <JokuhButton variant="ghost" size="sm" aria-label="Close chat" className="!px-2" onClick={onClose}>
          <X className="size-4" strokeWidth={2} aria-hidden />
        </JokuhButton>
      </header>

      <div ref={listRef} className="landing-temp-chat__list" aria-live="polite" aria-busy={chat.streaming}>
        {chat.messages.map((message, index) => {
          const isLast = index === chat.messages.length - 1;
          if (message.role === "user") {
            return (
              <p key={index} className="landing-temp-chat__bubble landing-temp-chat__bubble--user">
                {message.content}
              </p>
            );
          }
          return (
            <p key={index} className={cn("landing-temp-chat__bubble landing-temp-chat__bubble--oo", isLast && chat.streaming && "is-streaming")}>
              {message.content || <span className="landing-temp-chat__thinking">OO is thinking…</span>}
            </p>
          );
        })}

        {chat.error && chat.error !== "turn_limit" ? <p className="landing-temp-chat__error">{ERROR_COPY[chat.error]}</p> : null}

        {chat.atLimit || chat.error === "turn_limit" ? (
          <div className="landing-temp-chat__limit">
            <p>Keep going with an account. OO remembers what matters across your calls, chats and files.</p>
            <JokuhButton variant="create" size="md" onClick={onClaim}>
              Claim your identity
            </JokuhButton>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
