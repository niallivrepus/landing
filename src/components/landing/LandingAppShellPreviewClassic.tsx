import {
  ActionButton,
  LordiconIcon,
  actionLordicons,
  cn,
} from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  LANDING_CORNER_ACTIONS,
  LANDING_SHELL_CORNER_INSET_PX,
  LANDING_SHELL_PRODUCT_SLIDES,
  type LandingCornerSlot,
} from "../../data/landing-shell-preview";
import { SquircleShell } from "../system/squircle";
import { LANDING_PROMPT_SHELL_CLASS } from "./promptChrome";

const SLIDE_MS = 5200;

/** **Purpose:** Maps one physical corner slot to absolute coordinates inside the preview frame. */
function cornerSlotStyle(slot: LandingCornerSlot): CSSProperties {
  const inset = `${LANDING_SHELL_CORNER_INSET_PX}px`;
  switch (slot) {
    case "topLeading":
      return { top: inset, left: inset };
    case "topTrailing":
      return { top: inset, right: inset };
    case "bottomLeading":
      return { bottom: inset, left: inset };
    case "bottomTrailing":
      return { bottom: inset, right: inset };
  }
}

/**
 * **Purpose:** Preserved split-layout hero shell preview (squircle column + corner pills).
 * **Connects to:** Reuse later for editorial sections or A/B variants — not the live home hero.
 * **Parity:** Snapshot of the pre-immersive `LandingAppShellPreview` implementation.
 */
export function LandingAppShellPreviewClassic({ className }: { className?: string }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [slideIndex, setSlideIndex] = useState(0);
  const activeSlide = LANDING_SHELL_PRODUCT_SLIDES[slideIndex]!;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setSlideIndex((index) => (index + 1) % LANDING_SHELL_PRODUCT_SLIDES.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div
      className={cn("relative mx-auto w-full max-w-[min(100%,520px)]", className)}
      aria-label="Jokuh app shell preview (classic layout)"
    >
      <SquircleShell
        cornerRadius={40}
        cornerSmoothing={1}
        borderWidth={1}
        strokeClassName="stroke-[var(--color-light-glass-10)]"
        fillClassName="bg-[#0d0d0f]/94 light:bg-white/98"
        className="aspect-[4/5] w-full"
        contentClassName="flex min-h-[420px] flex-col p-4 sm:min-h-[460px] sm:p-5"
      >
        <div className="mx-auto inline-flex h-8 items-center rounded-full border border-light-space/10 bg-white/[0.04] px-4 font-sans text-[11px] font-semibold tracking-[0.08em] text-light-space/70 light:border-black/10 light:bg-black/[0.03] light:text-zinc-600">
          Jokuh
        </div>

        <div className="relative mt-4 flex flex-1 flex-col overflow-hidden rounded-[28px] border border-light-space/[0.08] bg-black/40 light:border-black/[0.08] light:bg-section-grey-light/80">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-light-space/45 light:text-zinc-500">
              {activeSlide.title}
            </p>
            <div className="flex gap-1" aria-hidden>
              {LANDING_SHELL_PRODUCT_SLIDES.map((slide, index) => (
                <span
                  key={slide.id}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    index === slideIndex
                      ? "bg-light-space/80 light:bg-zinc-800"
                      : "bg-light-space/25 light:bg-zinc-300",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={activeSlide.id}
                src={activeSlide.image}
                alt=""
                aria-hidden
                className="absolute inset-0 size-full object-cover object-center"
                initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
          </div>
        </div>

        <div
          className={cn(LANDING_PROMPT_SHELL_CLASS, "mt-4 shrink-0 opacity-90")}
          aria-hidden
        >
          <span className="min-w-0 flex-1 truncate px-4 font-sans text-[14px] text-light-space/45 light:text-zinc-500">
            Search or ask anything
          </span>
          <span className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#3A3A3A] light:bg-section-grey-light" />
        </div>
      </SquircleShell>

      {LANDING_CORNER_ACTIONS.map((corner) => {
        const icons = actionLordicons[corner.lordicon];
        return (
          <div
            key={corner.slot}
            className="group absolute z-20"
            style={cornerSlotStyle(corner.slot)}
          >
            <ActionButton
              aria-label={`${corner.label} — ${corner.action}`}
              orientation={corner.orientation}
              icon={
                <LordiconIcon
                  animationData={icons.outline}
                  hoverAnimationData={icons.filled}
                  size={20}
                />
              }
              onClick={() => navigate(corner.href)}
            />
            <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-light-space/40 opacity-0 transition-opacity group-hover:opacity-100 light:text-zinc-500">
              {corner.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
