import {
  Avatar,
  IncomingMessageBubble,
  MessageBubble,
  cn,
  useShouldAnimate,
} from "@jokuh/gooey";
import { motion } from "motion/react";
import type { LandingDemoMessage } from "../../data/landing-demo-chat";
import { LANDING_OO_WELCOME } from "../../data/landing-demo-chat";

/**
 * **Purpose:** OO demo chat thread with proper Gooey bubbles — used on `/demo` after the visitor sends a prompt.
 * **Connects to:** `LandingDemoShell`, `landing-demo-chat.ts`, `MessagesImmersiveShell` parity.
 */
export function LandingDemoChat({
  messages,
  className,
}: {
  messages: LandingDemoMessage[];
  className?: string;
}) {
  const shouldAnimate = useShouldAnimate();
  const thread = messages.length === 0 ? [] : messages;

  if (thread.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("flex w-full flex-col gap-3", className)}
      aria-live="polite"
      aria-label="Conversation with OO"
    >
      {thread.map((message, index) => (
        <motion.div
          key={message.id}
          initial={shouldAnimate ? { opacity: 0, y: 18, scale: 0.98 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            shouldAnimate
              ? { type: "spring", stiffness: 360, damping: 32, mass: 0.82, delay: index * 0.04 }
              : { duration: 0 }
          }
          className="w-full"
        >
          {message.author === "user" ? (
            <div className="flex justify-end">
              <MessageBubble message={message.body} color="light" showTime={false} />
            </div>
          ) : (
            <div className="flex items-end gap-2">
              <Avatar showOO originColor="aether" size={32} className="mb-1 shrink-0" />
              <IncomingMessageBubble
                name="OO"
                message={message.thinking ? "thinking…" : message.body}
                showTime={false}
                className={message.thinking ? "animate-pulse" : undefined}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/** **Purpose:** Static OO welcome row shown before the first send on `/demo`. */
export function LandingOoWelcomeRow({ className }: { className?: string }) {
  const shouldAnimate = useShouldAnimate();

  return (
    <motion.div
      className={cn("flex w-full items-end gap-2", className)}
      initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { duration: 0.4, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
    >
      <Avatar showOO originColor="aether" size={32} className="mb-1 shrink-0" />
      <IncomingMessageBubble name="OO" message={LANDING_OO_WELCOME} showTime={false} />
    </motion.div>
  );
}
