import {
  Avatar,
  ClaimIdentity,
  GooeyViewportProvider,
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
import { JokuhButton, jokuhButtonClass } from "../system/JokuhButton";
import { OoSpeakBubble } from "./OoSpeakBubble";
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

const MESSAGES_AUTOPLAY_THREAD_IDS = Object.keys(MESSAGES_DM_THREADS);
const MESSAGES_AUTOPLAY_INBOX_MS = 2400;
const MESSAGES_AUTOPLAY_LINE_MS = 1300;
const MESSAGES_AUTOPLAY_NOTE_MS = 4200;

/**
 * **Purpose:** The Texts app surface on its own (inbox ⇄ thread squircle) for the console home scene.
 * `autoplay` loops: inbox → open a demo DM → lines arrive one by one with typing dots → OO's memory note types
 * out → back to the inbox → next DM. Same demo data as `/messages`; nothing is sent anywhere.
 * **Connects to:** `ConsoleHomeShell` scenes, `messages-demo-inbox.ts`.
 */
export function MessagesAppSurface({ autoplay = false }: { autoplay?: boolean }) {
  return (
    <GooeyViewportProvider>
      <MessagesImmersiveShellInner scene autoplay={autoplay} />
    </GooeyViewportProvider>
  );
}

function MessagesImmersiveShellInner({ scene = false, autoplay = false }: { scene?: boolean; autoplay?: boolean } = {}) {
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

  // Scene autoplay: alternate inbox and demo DM threads; the thread itself reveals line by line.
  const [autoplayCycle, setAutoplayCycle] = useState(0);
  useEffect(() => {
    if (!scene || !autoplay) return undefined;
    const threadId = MESSAGES_AUTOPLAY_THREAD_IDS[autoplayCycle % MESSAGES_AUTOPLAY_THREAD_IDS.length];
    if (!threadId) return undefined;
    const lines = MESSAGES_DM_THREADS[threadId]?.messages.length ?? 0;
    let timer = 0;
    const after = (ms: number, fn: () => void) => {
      const tick = () => {
        if (document.hidden) {
          timer = window.setTimeout(tick, 500);
          return;
        }
        fn();
      };
      timer = window.setTimeout(tick, ms);
    };
    if (view === "inbox") {
      after(MESSAGES_AUTOPLAY_INBOX_MS, () => {
        setSelectedThreadId(threadId);
        setView("thread");
      });
    } else {
      after(lines * MESSAGES_AUTOPLAY_LINE_MS + MESSAGES_AUTOPLAY_NOTE_MS, () => {
        setView("inbox");
        setSelectedThreadId(null);
        setAutoplayCycle((cycle) => cycle + 1);
      });
    }
    return () => window.clearTimeout(timer);
  }, [autoplay, autoplayCycle, scene, view]);

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

  const panel = (
    <>
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
        progressive={scene && autoplay}
        onBack={backToInbox}
        onSendSuggestion={handleSend}
        onClaim={() => intercept("identity")}
        onReadStory={() =>
          intercept("send-message", { ref: selectedThread?.storySlug ?? "story" })
        }
      />
    )}
    </>
  );

  // Console home scene: the window around it is the app column, so no second shell here.
  if (scene) return <div className="flex h-[540px] flex-col overflow-hidden">{panel}</div>;

  const surface = (
    <SquircleShell
      cornerRadius={44}
      cornerSmoothing={1}
      borderWidth={1}
      strokeClassName="stroke-[var(--color-light-glass-10)]"
      fillClassName="bg-[#0a0a0c]/88 light:bg-white/96"
      className="w-full"
      contentClassName="flex min-h-[min(62vh,560px)] flex-col p-4 sm:p-5"
    >
      {panel}
    </SquircleShell>
  );

  return (
    <section className="relative min-h-[100svh] overflow-hidden" aria-label="Texts preview">
      <ImmersiveProductBackdrop productId="messages" />
      <ImmersiveAppChrome activeAction="text" />

      <ImmersiveCenterColumn maxWidthClass="max-w-[560px]">
        {surface}

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

        <div className="text-center">
          <p className="mt-6 font-sans text-[clamp(1.5rem,5vw,2.5rem)] font-semibold tracking-[-0.02em] text-light-space light:text-zinc-950">
            Texts
          </p>
          <p className="mt-1 font-sans text-[clamp(0.85rem,2.5vw,1rem)] font-medium text-light-space/72 light:text-zinc-600">
            E2EE DMs, @oo in-thread, and a unified Spine transcript.
          </p>
          <p className="mx-auto mt-2 max-w-[22rem] font-sans text-[clamp(0.75rem,2vw,0.875rem)] leading-relaxed text-light-space/48 light:text-zinc-500">
            GIFs, voice notes, read receipts, and suggestion pills — one inbox for people, stories, and your agent.
          </p>
        </div>
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
  progressive = false,
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
  /** Reveal DM lines one at a time with typing dots (console home autoplay). */
  progressive?: boolean;
  onBack: () => void;
  onSendSuggestion: (text: string) => void;
  onClaim: () => void;
  onReadStory: () => void;
}) {
  const dmLineCount = dmThread?.messages.length ?? 0;
  const [revealed, setRevealed] = useState(progressive ? 0 : Number.POSITIVE_INFINITY);
  useEffect(() => {
    if (!progressive) {
      setRevealed(Number.POSITIVE_INFINITY);
      return undefined;
    }
    setRevealed(0);
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setRevealed((count) => {
        if (count >= dmLineCount) window.clearInterval(id);
        return Math.min(count + 1, dmLineCount);
      });
    }, MESSAGES_AUTOPLAY_LINE_MS);
    return () => window.clearInterval(id);
  }, [dmLineCount, progressive, thread?.id]);

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
          {dmThread.messages.slice(0, revealed).map((message, index) => (
            <motion.div
              key={`${thread.id}-${index}`}
              initial={progressive && shouldAnimate ? { opacity: 0, y: 10, scale: 0.98 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            >
              <DmBubble from={message.from} text={message.text} />
            </motion.div>
          ))}
          {progressive && revealed < dmLineCount ? (
            <TypingDots mine={dmThread.messages[revealed]?.from === "me"} />
          ) : null}
          {/* Agent memory note after the DM — OO speaks it (not the human peer). */}
          {revealed >= dmLineCount ? (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="flex items-end gap-2 pt-1"
          >
            <Avatar showOO originColor="aether" size={32} className="mb-1 shrink-0" />
            <OoSpeakBubble
              key={`${thread.id}-oo-note`}
              message={dmThread.reply}
              speak
              className="flex-1"
            />
          </motion.div>
          ) : null}
        </div>
      </>
    );
  }

  return (
    <>
      <ThreadHeader thread={thread} onBack={onBack} />
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {ooMessages.map((message, index) => {
          const isLatestOo =
            message.author === "oo" &&
            !message.thinking &&
            ooMessages.findLastIndex((item) => item.author === "oo" && !item.thinking) === index;

          return (
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
                  <OoSpeakBubble
                    message={message.body}
                    thinking={Boolean(message.thinking)}
                    speak={isLatestOo}
                    className="flex-1"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
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
              className={jokuhButtonClass("secondary", "sm")}
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
      <JokuhButton variant="ghost" size="md" aria-label="Back" className="mr-1" onClick={onBack}>
        ←
      </JokuhButton>
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

/** Three-dot typing bubble shown before the next demo line lands (console home autoplay). */
function TypingDots({ mine }: { mine: boolean }) {
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")} aria-hidden>
      <div
        className={cn(
          "flex items-center gap-1 rounded-[18px] px-4 py-3",
          mine ? "bg-light-space/80 light:bg-zinc-900/80" : "bg-white/[0.06] light:bg-black/[0.04]",
        )}
      >
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className={cn("size-1.5 rounded-full", mine ? "bg-dark-space light:bg-white" : "bg-light-space light:bg-zinc-900")}
            animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.18, ease: "easeInOut" }}
          />
        ))}
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
