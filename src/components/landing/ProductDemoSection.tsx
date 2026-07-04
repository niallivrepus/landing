import { cn, Squircle } from "@jokuh/gooey";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SquircleShell } from "../system/squircle";
import { CONTENT_SHELL_WIDE } from "../system/shells";

type DemoMessage = { from: "them" | "me"; text: string };

type DemoThread = {
  id: string;
  name: string;
  preview: string;
  color: string;
  messages: DemoMessage[];
  reply: string;
};

const DEMO_THREADS: DemoThread[] = [
  {
    id: "maya",
    name: "Maya",
    preview: "did you send the deck?",
    color: "var(--color-flame)",
    messages: [
      { from: "them", text: "did you ever send over the deck from last week?" },
      { from: "me", text: "yeah — sent the Figma link, not a PDF" },
      { from: "them", text: "ha, it remembered that" },
    ],
    reply: "Noted — Maya gets links, not PDFs, from now on.",
  },
  {
    id: "team-call",
    name: "Founders call",
    preview: "recap from Tuesday",
    color: "var(--color-aether)",
    messages: [
      { from: "them", text: "what did we land on for the pricing tiers?" },
      { from: "me", text: "$12 solo, $28 team — OO has the full recap if you want it" },
    ],
    reply: "Pulled the recap from Tuesday's call — pricing, timeline, and the two open questions.",
  },
  {
    id: "sam",
    name: "Sam",
    preview: "next week works",
    color: "var(--color-insight)",
    messages: [
      { from: "them", text: "can we push the call to next week?" },
      { from: "me", text: "works for me, same time?" },
    ],
    reply: "Moved — Sam's call is now next week, same time. Calendar updated.",
  },
];

function useTypewriter(text: string, active: boolean) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) {
      setShown("");
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 18);

    return () => window.clearInterval(id);
  }, [text, active]);

  return shown;
}

function MessageBubble({ from, text }: DemoMessage) {
  const mine = from === "me";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <SquircleShell
        cornerRadius={18}
        cornerSmoothing={1}
        fillClassName={
          mine
            ? "bg-light-space light:bg-zinc-950"
            : "bg-white/[0.06] light:bg-black/[0.04]"
        }
        contentClassName={cn(
          "max-w-[80%] px-4 py-2.5 font-sans text-[13.5px] leading-relaxed",
          mine ? "text-dark-space light:text-white" : "text-light-space light:text-zinc-900",
        )}
      >
        {text}
      </SquircleShell>
    </div>
  );
}

export function ProductDemoSection() {
  const [activeId, setActiveId] = useState(DEMO_THREADS[0]!.id);
  const [draft, setDraft] = useState("");
  const [replying, setReplying] = useState(false);
  const [sent, setSent] = useState(false);
  const active = DEMO_THREADS.find((t) => t.id === activeId)!;
  const typedReply = useTypewriter(active.reply, replying);
  const replyTimer = useRef<number | null>(null);

  function selectThread(id: string) {
    if (replyTimer.current) window.clearTimeout(replyTimer.current);
    setActiveId(id);
    setSent(false);
    setReplying(false);
    setDraft("");
  }

  function send() {
    if (!draft.trim()) return;
    setSent(true);
    setDraft("");
    replyTimer.current = window.setTimeout(() => setReplying(true), 500);
  }

  return (
    <section id="demo" className="scroll-mt-24 bg-dark-space px-4 py-16 light:bg-white md:px-8 md:py-20">
      <div className={CONTENT_SHELL_WIDE}>
        <div className="mb-10 flex items-baseline justify-between gap-4">
          <h2 className="font-sans text-lg font-semibold tracking-[0em] text-light-space light:text-zinc-950 md:text-xl">
            See it work
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-light-space/40 light:text-zinc-400">
            Demo — illustrative
          </p>
        </div>

        {/*
          **Purpose:** Squircle frame is a non-interactive background layer so `clipPath` does not
          crop thread rows or chat bubbles; interactive content sits in the sibling grid above it.
        */}
        <div className="relative isolate">
          <Squircle
            cornerRadius={32}
            cornerSmoothing={1}
            borderWidth={1}
            strokeClassName="stroke-[var(--color-light-glass-10)]"
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-white/[0.02] light:bg-section-grey-light/60"
          />
          <div className="relative z-[1] grid gap-0 p-5 md:grid-cols-[220px_1fr] md:p-6">
            <div className="flex flex-row gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
              {DEMO_THREADS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectThread(t.id)}
                  className="shrink-0 md:w-full"
                >
                  <div
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-sans text-[13px] leading-normal transition-colors",
                      t.id === activeId
                        ? "bg-white/[0.06] text-light-space light:bg-black/[0.05] light:text-zinc-950"
                        : "text-light-space/55 hover:bg-white/[0.03] light:text-zinc-500 light:hover:bg-black/[0.03]",
                    )}
                  >
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="min-w-0">
                      <p className="font-semibold leading-snug">{t.name}</p>
                      <p className="truncate text-[11px] leading-snug text-light-space/40 light:text-zinc-400">
                        {t.preview}
                      </p>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex min-h-[420px] flex-col pt-4 md:pt-0">
              <div className="flex flex-1 flex-col justify-end gap-3">
              {active.messages.map((m, i) => (
                <MessageBubble key={i} {...m} />
              ))}
              {sent ? <MessageBubble from="me" text={draft || "sent"} /> : null}
              {replying ? <MessageBubble from="them" text={typedReply} /> : null}
              </div>

              <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <SquircleShell
                cornerRadius={24}
                cornerSmoothing={1}
                borderWidth={1}
                strokeClassName="stroke-[var(--color-light-glass-10)]"
                fillClassName="bg-white/[0.03] light:bg-white"
                contentClassName="mt-5 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 font-sans text-[14px] text-light-space outline-none placeholder:text-light-space/40 light:text-zinc-950 light:placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="flex size-11 shrink-0 items-center justify-center text-light-space/70 transition-colors hover:text-light-space light:text-zinc-500 light:hover:text-zinc-950"
                >
                  <ArrowUp className="size-5" strokeWidth={2} aria-hidden />
                </button>
              </SquircleShell>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
