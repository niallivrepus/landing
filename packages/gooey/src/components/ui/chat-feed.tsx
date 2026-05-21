/**
 * ChatFeed — vertical container for message rows and date separators.
 * ChatMessageRow — positions an Avatar next to a message bubble.
 *
 * These are pure layout compositions of existing primitives
 * (Avatar, MessageBubble, IncomingMessageBubble, Badge).
 */

interface ChatFeedProps {
  children: React.ReactNode;
  className?: string;
}

/** Vertical stack with 12px gap for message rows and date badges. */
export function ChatFeed({ children, className = "" }: ChatFeedProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>{children}</div>
  );
}

interface ChatMessageRowProps {
  /** left = incoming (avatar left), right = outgoing (avatar right) */
  side: "left" | "right";
  /** Pass an <Avatar /> here */
  avatar: React.ReactNode;
  /** Pass a <MessageBubble /> or <IncomingMessageBubble /> here */
  children: React.ReactNode;
  className?: string;
}

/** Single message row — avatar + bubble with 4px gap, direction based on side. */
export function ChatMessageRow({
  side,
  avatar,
  children,
  className = "",
}: ChatMessageRowProps) {
  return (
    <div
      className={`flex items-start gap-1 ${side === "right" ? "flex-row-reverse" : ""} ${className}`}
    >
      <div className="shrink-0">{avatar}</div>
      {children}
    </div>
  );
}
