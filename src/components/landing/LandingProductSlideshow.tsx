import { cn, useShouldAnimate } from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { LANDING_SHELL_PRODUCT_SLIDES } from "../../data/landing-shell-preview";
import { SquircleShell } from "../system/squircle";

const SLIDE_MS = 5200;

/**
 * **Purpose:** Rotating product surface preview inside the hero squircle — lives on `/demo`, not the homepage.
 * **Connects to:** `landing-shell-preview.ts`, `LandingDemoShell`.
 */
export function LandingProductSlideshow({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = useShouldAnimate();
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
    <SquircleShell
      cornerRadius={44}
      cornerSmoothing={1}
      borderWidth={1}
      strokeClassName="stroke-[var(--color-light-glass-10)]"
      fillClassName="bg-[#0a0a0c]/82 light:bg-white/94"
      className={cn("w-full", className)}
      contentClassName="flex min-h-[min(42vh,400px)] flex-col overflow-hidden p-4 sm:min-h-[min(44vh,440px)] sm:p-5"
    >
      <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-[28px] border border-light-space/[0.08] bg-black/35 light:border-black/[0.08] light:bg-section-grey-light/70">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={activeSlide.id}
            src={activeSlide.image}
            alt=""
            className="absolute inset-0 size-full object-cover object-center"
            initial={shouldAnimate && !reduceMotion ? { opacity: 0, scale: 1.03 } : false}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldAnimate && !reduceMotion ? { opacity: 0, scale: 1.01 } : undefined}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent light:from-white/80 light:via-white/25" />
      </div>

      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={activeSlide.id}
            initial={shouldAnimate && !reduceMotion ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldAnimate && !reduceMotion ? { opacity: 0, y: -4 } : undefined}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[clamp(1.5rem,5vw,2.5rem)] font-semibold leading-none tracking-[-0.02em] text-light-space light:text-zinc-950"
          >
            {activeSlide.title}
          </motion.p>
        </AnimatePresence>
        <div className="flex gap-1.5" aria-hidden>
          {LANDING_SHELL_PRODUCT_SLIDES.map((slide, index) => (
            <span
              key={slide.id}
              className={cn(
                "size-1.5 rounded-full transition-colors",
                index === slideIndex
                  ? "bg-light-space/85 light:bg-zinc-800"
                  : "bg-light-space/25 light:bg-zinc-300",
              )}
            />
          ))}
        </div>
      </div>
    </SquircleShell>
  );
}
