/**
 * **Purpose:** Live miniature Texts UI mockups for `/texts` highlight carousel slides.
 * **Connects to:** `ProductDetailMedia`, `LandingMessagesInbox`, `messages-demo-inbox.ts`.
 * **Variants:** inbox, e2ee, ooAgent, mentions, attachments, spineLink — real messaging chrome, not gradients.
 */

import {
  Avatar,
  IncomingMessageBubble,
  MessageBubble,
  cn,
} from "@jokuh/gooey";
import { FileText, Image, Lock, Sparkles } from "lucide-react";
import { useMemo } from "react";
import {
  MESSAGES_OO_SUGGESTIONS,
  MESSAGES_OO_WELCOME,
} from "../../data/messages-oo-demo-chat";
import { buildMessagesInboxThreads } from "../../data/messages-demo-inbox";
import { LandingMessagesInbox } from "./LandingMessagesInbox";
import { OoSpeakBubble } from "./OoSpeakBubble";

/** Carousel slide variants — one mini mockup per Texts highlight theme. */
export type MessagesHighlightVariant =
  | "inbox"
  | "e2ee"
  | "ooAgent"
  | "mentions"
  | "attachments"
  | "spineLink";

type MessagesHighlightVisualProps = {
  variant: MessagesHighlightVariant;
  active?: boolean;
  className?: string;
};

/** Floating OO context chip shared across slides. */
function OoContextChip({ children }: { children: string }) {
  return (
    <div className="messages-highlight-visual__oo-chip">
      <span className="messages-highlight-visual__oo-chip-dot" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

/** Inbox roster — OO pinned, stories, and demo DMs. */
function InboxHighlightMockup() {
  const threads = useMemo(() => buildMessagesInboxThreads().slice(0, 5), []);

  return (
    <div className="messages-highlight-visual__stage">
      <div className="messages-highlight-visual__squircle">
        <p className="messages-highlight-visual__panel-title">Inbox</p>
        <p className="messages-highlight-visual__panel-sub">People, stories, and OO</p>
        <div className="messages-highlight-visual__inbox-wrap">
          <LandingMessagesInbox threads={threads} onSelect={() => undefined} />
        </div>
      </div>
      <OoContextChip>One inbox for people, stories, and your agent</OoContextChip>
    </div>
  );
}

/** E2EE lock badge with encrypted DM bubbles. */
function E2eeHighlightMockup() {
  return (
    <div className="messages-highlight-visual__stage">
      <div className="messages-highlight-visual__squircle">
        <div className="messages-highlight-visual__e2ee-badge">
          <Lock className="size-3.5 shrink-0" strokeWidth={2.2} aria-hidden />
          <span>End-to-end encrypted</span>
        </div>
        <div className="messages-highlight-visual__thread">
          <div className="flex justify-start">
            <IncomingMessageBubble
              name="Maya"
              message="Hey, did you send the deck?"
              className="max-w-[78%]"
              showTime={false}
            />
          </div>
          <div className="flex justify-end">
            <MessageBubble
              message="Yep. Figma link, not a PDF."
              color="aether"
              className="max-w-[78%]"
              showTime={false}
            />
          </div>
          <p className="messages-highlight-visual__e2ee-note">
            Only you and Maya can read this thread.
          </p>
        </div>
      </div>
      <OoContextChip>E2EE DMs. Keys stay on your devices.</OoContextChip>
    </div>
  );
}

/** OO thread with suggestion pills — mirrors immersive ThreadPanel; speaks when slide is active. */
function OoAgentHighlightMockup({ active }: { active: boolean }) {
  return (
    <div className="messages-highlight-visual__stage">
      <div className="messages-highlight-visual__squircle">
        <div className="messages-highlight-visual__thread">
          <div className="flex items-end gap-2">
            <Avatar showOO originColor="aether" size={28} className="mb-0.5 shrink-0" />
            <OoSpeakBubble
              key={active ? "oo-speak-active" : "oo-speak-idle"}
              message={MESSAGES_OO_WELCOME}
              speak={active}
              className="flex-1"
            />
          </div>
          <div className="messages-highlight-visual__suggestions">
            {MESSAGES_OO_SUGGESTIONS.map((suggestion) => (
              <span key={suggestion} className="messages-highlight-visual__suggestion-pill">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </div>
      <OoContextChip>@oo in any thread — suggestion pills when you need a nudge</OoContextChip>
    </div>
  );
}

/** @mention typeahead mock — when active, OO speaks a draft reply after the @oo ask. */
function MentionsHighlightMockup({ active }: { active: boolean }) {
  return (
    <div className="messages-highlight-visual__stage">
      <div className="messages-highlight-visual__squircle">
        <div className="messages-highlight-visual__thread messages-highlight-visual__thread--compact">
          <div className="flex justify-end">
            <MessageBubble
              message="can @oo draft a reply to Sam?"
              color="aether"
              className="max-w-[88%]"
              showTime={false}
            />
          </div>
          {active ? (
            <div className="mt-2 flex items-end gap-2">
              <Avatar showOO originColor="aether" size={28} className="mb-0.5 shrink-0" />
              <OoSpeakBubble
                key="mentions-oo-draft"
                message="Sure. How about: “Next week same time works. I’ll send a calendar hold.”"
                speak
                className="flex-1"
              />
            </div>
          ) : null}
        </div>
        <div className="messages-highlight-visual__composer">
          <p className="messages-highlight-visual__composer-input">
            looping in @m
            {active ? <span className="messages-highlight-visual__cursor" aria-hidden /> : null}
          </p>
          <div className="messages-highlight-visual__typeahead">
            <span className="messages-highlight-visual__typeahead-row messages-highlight-visual__typeahead-row--active">
              <span className="messages-highlight-visual__typeahead-at">@</span>
              <span>maya</span>
              <span className="messages-highlight-visual__typeahead-meta">DM</span>
            </span>
            <span className="messages-highlight-visual__typeahead-row">
              <span className="messages-highlight-visual__typeahead-at">@</span>
              <span>oo</span>
              <span className="messages-highlight-visual__typeahead-meta">Agent</span>
            </span>
          </div>
        </div>
      </div>
      <OoContextChip>@mentions and @oo — people and agent in one composer</OoContextChip>
    </div>
  );
}

/** Attachment chips — GIF, photo, file in composer. */
function AttachmentsHighlightMockup() {
  return (
    <div className="messages-highlight-visual__stage">
      <div className="messages-highlight-visual__squircle">
        <div className="messages-highlight-visual__thread messages-highlight-visual__thread--compact">
          <div className="flex justify-start">
            <IncomingMessageBubble
              name="Sam"
              message="Send the room screenshot when you're done."
              className="max-w-[82%]"
              showTime={false}
            />
          </div>
        </div>
        <div className="messages-highlight-visual__attachment-row">
          <span className="messages-highlight-visual__attachment-chip messages-highlight-visual__attachment-chip--gif">
            GIF · deal.gif
          </span>
          <span className="messages-highlight-visual__attachment-chip">
            <Image className="size-3 shrink-0" strokeWidth={2.1} aria-hidden />
            room.png
          </span>
          <span className="messages-highlight-visual__attachment-chip">
            <FileText className="size-3 shrink-0" strokeWidth={2.1} aria-hidden />
            terms.pdf
          </span>
        </div>
        <p className="messages-highlight-visual__upload-note">Resumable uploads · rich previews</p>
      </div>
      <OoContextChip>GIF picker, photos, and doc vault cards in-thread</OoContextChip>
    </div>
  );
}

/** Message captured to Spine — unified transcript chip. */
function SpineLinkHighlightMockup() {
  return (
    <div className="messages-highlight-visual__stage">
      <div className="messages-highlight-visual__squircle">
        <div className="messages-highlight-visual__thread messages-highlight-visual__thread--compact">
          <div className="flex justify-end">
            <MessageBubble
              message="let's close today if legal clears"
              color="aether"
              className="max-w-[88%]"
              showTime={false}
            />
          </div>
        </div>
        <div className="messages-highlight-visual__spine-bridge" aria-hidden>
          <span className="messages-highlight-visual__spine-bridge-line" />
          <Sparkles className="size-3.5 text-violet-300" strokeWidth={2.1} />
          <span className="messages-highlight-visual__spine-bridge-line" />
        </div>
        <div className="messages-highlight-visual__spine-chip">
          <span className="messages-highlight-visual__spine-chip-label">Spine · unified transcript</span>
          <p className="messages-highlight-visual__spine-chip-body">
            Sterling close — message + call notes on one timeline
          </p>
        </div>
      </div>
      <OoContextChip>Calls and messages share one searchable transcript</OoContextChip>
    </div>
  );
}

/**
 * **Renders** the Texts highlight mini-mockup for a carousel slide variant.
 * **Inputs:** `variant` selects which messaging UI replica to show; `active` drives subtle motion.
 */
export function MessagesHighlightVisual({
  variant,
  active = false,
  className,
}: MessagesHighlightVisualProps) {
  return (
    <div className={cn("messages-highlight-visual", className)} aria-hidden>
      {variant === "inbox" ? <InboxHighlightMockup /> : null}
      {variant === "e2ee" ? <E2eeHighlightMockup /> : null}
      {variant === "ooAgent" ? <OoAgentHighlightMockup active={active} /> : null}
      {variant === "mentions" ? <MentionsHighlightMockup active={active} /> : null}
      {variant === "attachments" ? <AttachmentsHighlightMockup /> : null}
      {variant === "spineLink" ? <SpineLinkHighlightMockup /> : null}
    </div>
  );
}
