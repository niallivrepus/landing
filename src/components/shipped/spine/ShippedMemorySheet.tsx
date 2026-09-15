import { cn } from "@jokuh/gooey";
import { ArrowRight, Download, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { SiteLink } from "../../SiteLink";
import { PlatformChips } from "../ShippedWeekEntry";
import { shippedAreaVisual } from "./shipped-spine-tones";
import {
  formatShippedRange,
  getShippedCommits,
  getShippedHref,
  getShippedPeriodName,
  isShippedMonthPost,
  type ShippedWeek,
} from "../../../data/shipped";

export type ShippedMemorySheetState = { post: ShippedWeek; itemIndex: number | null } | null;

function Glyph({ area, size = 40 }: { area: string; size?: number }) {
  const visual = shippedAreaVisual(area);
  const Icon = visual.icon;
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
      style={{ width: size, height: size, background: visual.background, color: visual.ink }}
    >
      <Icon className="size-[45%]" strokeWidth={2.2} />
    </span>
  );
}

function periodLine(post: ShippedWeek) {
  const commits = getShippedCommits(post).toLocaleString("en-US");
  if (isShippedMonthPost(post)) return `${post.label} · ${commits} commits`;
  return `${getShippedPeriodName(post)} · ${formatShippedRange(post)}, ${post.start.slice(0, 4)} · ${commits} commits`;
}

/**
 * **Purpose:** The memory detail sheet from the app's Spine (jokuh-live `SpineMemoryDetailSheet`), for one
 * Shipped update or a whole week/month. Bottom sheet on phones, centred card from 720px; Escape and the
 * backdrop close it, focus returns to the chip that opened it.
 * **Connects to:** `ShippedSpinePage`.
 */
export function ShippedMemorySheet({
  state,
  onClose,
  onSelectItem,
}: {
  state: ShippedMemorySheetState;
  onClose: () => void;
  onSelectItem: (index: number | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const open = state !== null;

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const post = state?.post;
  const item = post && state?.itemIndex != null ? post.items[state.itemIndex] : null;
  const month = post ? isShippedMonthPost(post) : false;

  return createPortal(
    <AnimatePresence>
      {post ? (
        <motion.div
          key="shipped-memory-sheet"
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/55 backdrop-blur-[8px] min-[720px]:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shipped-memory-title"
            className={cn(
              "relative flex max-h-[78vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[28px] min-[720px]:rounded-[28px]",
              "border-[1.5px] border-white/[0.16] bg-[linear-gradient(180deg,#1c1c1f,#121214)] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]",
              "light:border-black/[0.08] light:bg-[linear-gradient(180deg,#ffffff,#f4f4f6)] light:text-zinc-950 light:shadow-[0_24px_80px_rgba(0,0,0,0.18)]",
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center gap-3 px-5 pb-3 pt-5">
              <Glyph area={item?.area ?? "Platform"} />
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[13px] font-semibold">
                  {item ? `Update · ${item.area}` : month ? "Monthly recap" : getShippedPeriodName(post)}
                </p>
                <p className="truncate font-sans text-[11px] tabular-nums text-white/55 light:text-zinc-500">
                  {periodLine(post)}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white/80 transition-colors hover:bg-white/[0.14] light:bg-black/[0.05] light:text-zinc-700 light:hover:bg-black/[0.09]"
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
              {item ? (
                <>
                  <h2 id="shipped-memory-title" className="font-sans text-[1.35rem] font-semibold leading-[1.15] text-balance">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-pretty text-[15px] leading-6 text-white/70 light:text-zinc-600">{item.body}</p>
                  <div className="mt-4">
                    <PlatformChips platforms={item.platforms} />
                  </div>
                </>
              ) : (
                <>
                  <h2 id="shipped-memory-title" className="font-sans text-[1.35rem] font-semibold leading-[1.15] text-balance">
                    {post.headline}
                  </h2>
                  <p className="mt-2 text-pretty text-[15px] leading-6 text-white/70 light:text-zinc-600">{post.dek}</p>
                </>
              )}

              <p className="mb-2 mt-6 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-white/45 light:text-zinc-500">
                {item ? (month ? "Also this month" : "Also this week") : `${post.items.length} updates`}
              </p>
              <ul className="flex flex-col gap-1.5">
                {post.items.map((other, index) =>
                  other === item ? null : (
                    <li key={other.title}>
                      <button
                        type="button"
                        onClick={() => onSelectItem(index)}
                        className="flex w-full items-center gap-3 rounded-[18px] bg-white/[0.04] px-2.5 py-2 text-left transition-colors hover:bg-white/[0.08] light:bg-black/[0.03] light:hover:bg-black/[0.06]"
                      >
                        <Glyph area={other.area} size={30} />
                        <span className="min-w-0 flex-1 truncate font-sans text-[14px] font-medium">{other.title}</span>
                        <span className="shrink-0 font-sans text-[11px] text-white/40 light:text-zinc-400">{other.area}</span>
                      </button>
                    </li>
                  ),
                )}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                <SiteLink
                  href={getShippedHref(post)}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 font-sans text-[13px] font-semibold text-zinc-950 transition-opacity hover:opacity-90 light:bg-zinc-950 light:text-white"
                >
                  {month ? "Read the recap" : "See the full week"}
                  <ArrowRight className="size-4" strokeWidth={2} />
                </SiteLink>
                <SiteLink
                  href="/download"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.08] px-4 font-sans text-[13px] font-semibold transition-colors hover:bg-white/[0.14] light:bg-black/[0.05] light:hover:bg-black/[0.09]"
                >
                  <Download className="size-4" strokeWidth={2} />
                  Get Jokuh
                </SiteLink>
                {item ? (
                  <button
                    type="button"
                    onClick={() => onSelectItem(null)}
                    className="inline-flex h-10 items-center rounded-full px-3 font-sans text-[13px] font-semibold text-white/60 transition-colors hover:text-white light:text-zinc-500 light:hover:text-zinc-950"
                  >
                    {month ? "Whole month" : "Whole week"}
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
