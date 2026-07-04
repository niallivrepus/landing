import {
  Avatar,
  ClaimIdentity,
  GooeyViewportProvider,
  IncomingMessageBubble,
  MessageBubble,
  cn,
  useCurrentGooeyViewport,
  useShouldAnimate,
} from "@jokuh/gooey";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MESSAGES_DM_THREADS,
  buildMessagesInboxThreads,
  type MessagesInboxThread,
} from "../../data/messages-demo-inbox";
import { getStoryDetail } from "../../data/stories-detail";
import {
  MESSAGES_OO_INTERCEPT_AFTER,
  MESSAGES_OO_SUGGESTIONS,
  MESSAGES_OO_THINKING_MS,
  MESSAGES_OO_WELCOME,
  createOoReply,
  createOoThinkingMessage,
  createOoUserMessage,
  type MessagesOoMessage,
} from "../../data/messages-oo-demo-chat";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { ImmersiveAppChrome } from "../system/ImmersiveAppChrome";
import { ImmersiveCenterColumn } from "../system/ImmersiveCenterColumn";
import { SquircleShell } from "../system/squircle";
import { ImmersiveProductBackdrop } from "./ImmersiveProductBackdrop";
import { LandingMessagesInbox } from "./LandingMessagesInbox";
import { LandingPromptBar } from "./LandingPromptBar";
import { LandingStoryReader } from "./LandingStoryReader";

type MessagesView = "inbox" | "thread";

/**
 * **Purpose:** Full-viewport Texts page — inbox roster, per-person threads, and customer stories.
 * **Connects to:** `messages-demo-inbox.ts`, `messages-oo-demo-chat.ts`, `/download` intercept.
 */
export function MessagesImmersiveShell() {
  return (
    <GooeyViewportProvider>
      <MessagesImmersiveShellInner />
    </GooeyViewportProvider>
  );
}

function MessagesImmersiveShellInner() {
  const viewport = useCurrentGooeyViewport();
  const shouldAnimate = useShouldAnimate();
  const { intercept } = useDownloadIntercept("messages-immersive");
  const inboxThreads = useMemo(() => buildMessagesInboxThreads(), []);

  const [view, setView] = useState<MessagesView>("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [ooMessages, setOoMessages] = useState<MessagesOoMessage[]>([
    { id: "welcome", author: "oo", body: MESSAGES_OO_WELCOME },
  ]);
  const [sendCount, setSendCount] = useState(0);
  const thinkingRef = useRef<number | null>(null);

  const selectedThread = inboxThreads.find((thread) => thread.id === selectedThreadId);
  const storyDetail =
    selectedThread?.kind === "story" && selectedThread.storySlug
      ? getStoryDetail(selectedThread.storySlug)
      : undefined;
  const dmThread =
    selectedThread?.kind === "dm" ? MESSAGES_DM_THREADS[selectedThread.id] : undefined;

  useEffect(() => {
    return () => {
      if (thinkingRef.current) window.clearTimeout(thinkingRef.current);
    };
  }, []);

  const gated = sendCount >= MESSAGES_OO_INTERCEPT_AFTER;

  const openThread = useCallback((threadId: string) => {
    setSelectedThreadId(threadId);
    setView("thread");
  }, []);

  const backToInbox = useCallback(() => {
    setView("inbox");
    setSelectedThreadId(null);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (view === "inbox") {
        openThread("oo");
      }

      if (selectedThread && selectedThread.kind !== "oo") {
        intercept("send-message", { ref: selectedThread.id });
        return;
      }

      if (gated) {
        intercept("send-message");
        return;
      }

      const userMessage = createOoUserMessage(trimmed);
      const thinking = createOoThinkingMessage();
      setOoMessages((prev) => [...prev, userMessage, thinking]);
      setSendCount((count) => count + 1);

      if (thinkingRef.current) window.clearTimeout(thinkingRef.current);
      thinkingRef.current = window.setTimeout(() => {
        setOoMessages((prev) =>
          prev.map((message) =>
            message.id === thinking.id ? createOoReply(trimmed, thinking.id) : message,
          ),
        );
        if (trimmed.toLowerCase().includes("claim")) {
          intercept("identity");
        }
      }, MESSAGES_OO_THINKING_MS);
    },
    [gated, intercept, openThread, selectedThread, view],
  );

  return (
    <section className="relative min-h-[100svh] overflow-hidden" aria-label="Texts preview">
      <ImmersiveProductBackdrop productId="messages" />
      <ImmersiveAppChrome activeAction="text" />

      <ImmersiveCenterColumn maxWidthClass="max-w-[560px]">
        <SquircleShell
          cornerRadius={44}
          cornerSmoothing={1}
          borderWidth={1}
          strokeClassName="stroke-[var(--color-light-glass-10)]"
          fillClassName="bg-[#0a0a0c]/88 light:bg-white/96"
          className="w-full"
          contentClassName="flex min-h-[min(62vh,560px)] flex-col p-4 sm:p-5"
        >
          {view === "inbox" ? (
            <>
              <div className="mb-3 border-b border-light-space/[0.08] pb-3 light:border-black/[0.08]">
                <p className="font-sans text-[15px] font-bold text-light-space light:text-zinc-900">Inbox</p>
                <p className="font-sans text-[11px] text-light-space/50 light:text-zinc-500">
                  People, stories, and OO — tap to open
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <LandingMessagesInbox
                  threads={inboxThreads}
                  activeId={selectedThreadId}
                  onSelect={openThread}
                />
              </div>
            </>
          ) : (
            <ThreadPanel
              thread={selectedThread}
              storyDetail={storyDetail}
              dmThread={dmThread}
              ooMessages={ooMessages}
              gated={gated}
              shouldAnimate={shouldAnimate}
              onBack={backToInbox}
              onSendSuggestion={handleSend}
              onClaim={() => intercept("identity")}
              onReadStory={() =>
                intercept("send-message", { ref: selectedThread?.storySlug ?? "story" })
              }
            />
          )}
        </SquircleShell>

        <div className="mt-4 w-full max-w-[450px]">
          <LandingPromptBar
            variant={viewport === "phone" ? "phone" : "desktop"}
            viewport={viewport}
            previewText={
              view === "inbox"
                ? "Message someone…"
                : gated
                  ? "Create account to continue"
                  : selectedThread?.kind === "oo"
                    ? "Message OO"
                    : "Reply in Jokuh"
            }
            onSend={handleSend}
            onPlus={() => intercept("prompt-plus")}
          />
        </div>

        <p className="mt-6 text-center font-sans text-[clamp(1.5rem,5vw,2.5rem)] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">
          Texts
        </p>
      </ImmersiveCenterColumn>
    </section>
  );
}

function ThreadPanel({
  thread,
  storyDetail,
  dmThread,
  ooMessages,
  gated,
  shouldAnimate,
  onBack,
  onSendSuggestion,
  onClaim,
  onReadStory,
}: {
  thread?: MessagesInboxThread;
  storyDetail?: ReturnType<typeof getStoryDetail>;
  dmThread?: (typeof MESSAGES_DM_THREADS)[string];
  ooMessages: MessagesOoMessage[];
  gated: boolean;
  shouldAnimate: boolean;
  onBack: () => void;
  onSendSuggestion: (text: string) => void;
  onClaim: () => void;
  onReadStory: () => void;
}) {
  if (!thread) return null;

  if (thread.kind === "story" && storyDetail) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <LandingStoryReader story={storyDetail} onBack={onBack} onReadFull={onReadStory} />
      </div>
    );
  }

  if (thread.kind === "dm" && dmThread) {
    return (
      <>
        <ThreadHeader thread={thread} onBack={onBack} />
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {dmThread.messages.map((message, index) => (
            <DmBubble key={`${thread.id}-${index}`} from={message.from} text={message.text} />
          ))}
          <DmBubble from="them" text={dmThread.reply} />
        </div>
      </>
    );
  }

  return (
    <>
      <ThreadHeader thread={thread} onBack={onBack} />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {ooMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
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
                  message={message.body}
                  showTime={false}
                  className={message.thinking ? "animate-pulse" : undefined}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {gated ? (
        <div className="mt-3">
          <ClaimIdentity variant="get-identity" onClick={onClaim} />
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {MESSAGES_OO_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSendSuggestion(suggestion)}
              className="rounded-full border border-light-space/12 bg-white/[0.05] px-3 py-1.5 font-sans text-[11px] font-semibold text-light-space/70 light:border-black/10 light:text-zinc-600"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function ThreadHeader({
  thread,
  onBack,
}: {
  thread: MessagesInboxThread;
  onBack: () => void;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b border-light-space/[0.08] pb-3 light:border-black/[0.08]">
      <button
        type="button"
        onClick={onBack}
        className="mr-1 font-sans text-[11px] font-semibold text-light-space/50 light:text-zinc-500"
      >
        ←
      </button>
      {thread.kind === "oo" ? (
        <Avatar showOO originColor="aether" size={32} className="shrink-0" />
      ) : thread.avatarSrc ? (
        <img src={thread.avatarSrc} alt="" className="size-8 shrink-0 rounded-xl object-cover" />
      ) : (
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: thread.accentColor }}
        />
      )}
      <div className="min-w-0">
        <p className="font-sans text-[14px] font-bold text-light-space light:text-zinc-900">
          {thread.name}
        </p>
        <p className="truncate font-sans text-[11px] text-light-space/50 light:text-zinc-500">
          {thread.preview}
        </p>
      </div>
    </div>
  );
}

function DmBubble({ from, text }: { from: "them" | "me"; text: string }) {
  const mine = from === "me";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[82%] rounded-[18px] px-4 py-2.5 font-sans text-[13px] leading-relaxed",
          mine
            ? "bg-light-space text-dark-space light:bg-zinc-900 light:text-white"
            : "bg-white/[0.06] text-light-space light:bg-black/[0.04] light:text-zinc-900",
        )}
      >
        {text}
      </div>
    </div>
  );
}
