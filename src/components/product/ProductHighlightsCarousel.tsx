import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@jokuh/gooey";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { ProductHighlightSlide } from "../../data/product-detail-blueprints";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { ProductSectionIntro, ProductShowcaseSurface } from "./ProductDetailPrimitives";

const AUTOPLAY_STEP_MS = 80;
const AUTOPLAY_DURATION_MS = 4200;

const cardSurfaceClassName = "relative min-h-[30rem] w-full md:min-h-[36rem]";

export function ProductHighlightsCarousel({
  title,
  slides,
}: {
  title: string;
  slides: ProductHighlightSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  /** Tracks autoplay progress in a ref so the interval tick stays a pure side effect outside updaters. */
  const progressRef = useRef(0);
  /** Avoid intersection observer fighting smooth scroll (intermediate slides become “active”). */
  const suppressIntersectionRef = useRef(false);
  const scrollSuppressTimeoutRef = useRef<number | null>(null);

  const clearScrollSuppression = useCallback(() => {
    suppressIntersectionRef.current = false;
    if (scrollSuppressTimeoutRef.current) {
      window.clearTimeout(scrollSuppressTimeoutRef.current);
      scrollSuppressTimeoutRef.current = null;
    }
  }, []);

  const scrollCardIntoView = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const root = scrollRef.current;
      if (!root) return;
      const card = root.querySelector<HTMLElement>(`[data-slide-index="${index}"]`);
      if (!card) return;

      // Deterministic target: align card's start with the scroll container's start,
      // accounting for `scroll-padding-inline-start` (which `scrollIntoView` ignores in some browsers).
      const padLeft = parseFloat(getComputedStyle(root).scrollPaddingLeft) || 0;
      const targetLeft = Math.max(0, card.offsetLeft - root.offsetLeft - padLeft);

      suppressIntersectionRef.current = true;
      if (scrollSuppressTimeoutRef.current) window.clearTimeout(scrollSuppressTimeoutRef.current);
      scrollSuppressTimeoutRef.current = window.setTimeout(
        clearScrollSuppression,
        behavior === "smooth" ? 800 : 80,
      );

      // For instant jumps, `scroll-smooth` on the root wins over `behavior: "auto"`;
      // briefly clear it so multi-dot jumps don't tween through intermediate slides.
      if (behavior === "auto") {
        const prevInline = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        root.scrollTo({ left: targetLeft, behavior: "auto" });
        requestAnimationFrame(() => {
          root.style.scrollBehavior = prevInline;
        });
        return;
      }

      root.scrollTo({ left: targetLeft, behavior: "smooth" });
    },
    [clearScrollSuppression],
  );

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const tick = window.setInterval(() => {
      progressRef.current += AUTOPLAY_STEP_MS / AUTOPLAY_DURATION_MS;
      if (progressRef.current < 1) {
        setProgress(progressRef.current);
        return;
      }
      progressRef.current = 0;
      setProgress(0);
      // Advance exactly one slide per tick (NOT inside a state updater so StrictMode
      // double-invocation can't double-advance the index).
      setActiveIndex((current) => {
        const nextIndex = current + 1;
        if (nextIndex >= slides.length) {
          // Reached the end — pause and let the user replay.
          setIsPlaying(false);
          return current;
        }
        queueMicrotask(() => scrollCardIntoView(nextIndex, "smooth"));
        return nextIndex;
      });
    }, AUTOPLAY_STEP_MS);

    return () => window.clearInterval(tick);
  }, [isPlaying, slides.length, scrollCardIntoView]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || slides.length <= 1) return;

    const cards = root.querySelectorAll<HTMLElement>("[data-slide-index]");
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressIntersectionRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.45)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target) {
          const idx = Number((visible.target as HTMLElement).dataset.slideIndex);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root, rootMargin: "0px", threshold: [0.45, 0.55, 0.65] },
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const onScrollEnd = () => clearScrollSuppression();
    root.addEventListener("scrollend", onScrollEnd);
    return () => {
      root.removeEventListener("scrollend", onScrollEnd);
      clearScrollSuppression();
    };
  }, [slides.length, clearScrollSuppression]);

  const atEnd = activeIndex === slides.length - 1;

  return (
    <section className="py-20 md:py-28">
      <div className={CONTENT_SHELL_WIDE}>
        <ProductSectionIntro title={title} />
      </div>

      <div className="mt-12 min-w-0 md:mt-16">
        <div
          ref={scrollRef}
          className={cn(
            "flex min-w-0 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-1 md:gap-5",
            "w-full max-w-[100vw] snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
            "pl-3 pr-0 md:pl-[max(2rem,calc((100vw-86.25rem)/2+2rem))]",
            "scroll-pl-3 md:scroll-pl-[max(2rem,calc((100vw-86.25rem)/2+2rem))]",
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              data-slide-index={index}
              className="w-[min(72rem,calc(100vw-1.5rem))] max-w-[min(72rem,calc(100vw-1.5rem))] shrink-0 snap-start md:w-[min(72rem,calc(100vw-4rem))] md:max-w-[min(72rem,calc(100vw-4rem))]"
            >
              <ProductShowcaseSurface className={cardSurfaceClassName}>
                <div className="absolute inset-0">
                  <ProductDetailMedia
                    media={slide.media}
                    active={isPlaying && index === activeIndex}
                    className="size-full"
                  />
                </div>
                <div className="absolute inset-x-0 top-0 px-8 pt-8 md:px-10 md:pt-10">
                  <h3 className="max-w-[16ch] font-sans text-[1.75rem] font-semibold leading-[1.08] tracking-[0em] text-zinc-950 dark:text-zinc-100 md:text-[2.25rem]">
                    {slide.title}
                  </h3>
                </div>
              </ProductShowcaseSurface>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-200/90 bg-[#F5F5F7]/95 px-4 shadow-[0_16px_32px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#2A2A2D]/95 dark:shadow-[0_16px_32px_rgba(0,0,0,0.32)]">
            {slides.map((slide, index) => {
              const active = index === activeIndex;
              const fill = active ? `${Math.max(progress, isPlaying ? 0.08 : 1) * 100}%` : "0%";
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to ${slide.title}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setProgress(0);
                    progressRef.current = 0;
                    setIsPlaying(false);
                    scrollCardIntoView(index, "smooth");
                  }}
                  className={cn(
                    "relative h-2 overflow-hidden rounded-full bg-zinc-300/78 transition-all dark:bg-white/[0.14]",
                    active ? "w-10" : "w-2.5 hover:bg-zinc-400/78 dark:hover:bg-white/[0.22]",
                  )}
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-zinc-800 transition-[width] duration-100 dark:bg-zinc-100/92"
                    style={{ width: fill }}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              if (atEnd && !isPlaying) {
                setActiveIndex(0);
                setProgress(0);
                progressRef.current = 0;
                setIsPlaying(true);
                scrollCardIntoView(0, "smooth");
                return;
              }
              setIsPlaying((value) => !value);
              setProgress(0);
              progressRef.current = 0;
            }}
            className="inline-flex size-12 items-center justify-center rounded-full border border-zinc-200/90 bg-[#F5F5F7] text-zinc-900 shadow-[0_16px_32px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-transform hover:scale-[0.98] active:scale-[0.96] dark:border-white/[0.08] dark:bg-[#2A2A2D] dark:text-zinc-100 dark:shadow-[0_16px_32px_rgba(0,0,0,0.32)]"
            aria-label={
              isPlaying
                ? "Pause highlight carousel"
                : atEnd
                  ? "Replay highlight carousel"
                  : "Play highlight carousel"
            }
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" strokeWidth={2.2} />
            ) : atEnd ? (
              <RotateCcw className="size-4" strokeWidth={2.2} />
            ) : (
              <Play className="size-4 fill-current" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {slides[activeIndex]?.title}
      </div>
    </section>
  );
}
