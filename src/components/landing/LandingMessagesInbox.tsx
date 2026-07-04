import { cn } from "@jokuh/gooey";
import type { MessagesInboxThread } from "../../data/messages-demo-inbox";
import { OO } from "@jokuh/gooey";

/**
 * **Purpose:** Texts inbox roster — tap a person to open their thread or story.
 * **Connects to:** `MessagesImmersiveShell`, `messages-demo-inbox.ts`.
 */
export function LandingMessagesInbox({
  threads,
  activeId,
  onSelect,
  className,
}: {
  threads: MessagesInboxThread[];
  activeId?: string | null;
  onSelect: (threadId: string) => void;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-1", className)} role="list">
      {threads.map((thread) => (
        <li key={thread.id}>
          <button
            type="button"
            onClick={() => onSelect(thread.id)}
            className={cn(
              "landing-inbox-row w-full text-left",
              thread.id === activeId && "landing-inbox-row--active",
            )}
          >
            <span className="landing-inbox-row__leading" aria-hidden>
              {thread.kind === "oo" ? (
                <span className="landing-inbox-row__oo">
                  <OO expression="happy" />
                </span>
              ) : thread.avatarSrc ? (
                <img src={thread.avatarSrc} alt="" className="landing-inbox-row__avatar" />
              ) : (
                <span
                  className="landing-inbox-row__dot"
                  style={{ backgroundColor: thread.accentColor }}
                />
              )}
            </span>

            <span className="landing-inbox-row__body">
              <span className="landing-inbox-row__top">
                <span className="landing-inbox-row__name">{thread.name}</span>
                {thread.pinned ? (
                  <span className="landing-inbox-row__meta">Pinned</span>
                ) : thread.unread ? (
                  <span className="landing-inbox-row__unread" aria-label="Unread" />
                ) : null}
              </span>
              <span className="landing-inbox-row__preview">{thread.preview}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
