import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@jokuh/gooey";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { ProductHighlightSlide } from "../../data/product-detail-blueprints";
import { CONTENT_SHELL_WIDE } from "../system/shells";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { ProductSectionIntro, ProductShowcaseSurface } from "./ProductDetailPrimitives";

const AUTOPLAY_STEP_MS = 120;
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
  /** Avoid active-state sync fighting programmatic scroll. */
  const suppressIntersectionRef = useRef(false);
  const scrollSuppressTimeoutRef = useRef<number | null>(null);

  const clearScrollSuppression = useCallback(() => {
    suppressIntersectionRef.current = false;
    if (scrollSuppressTimeoutRef.current) {
      window.clearTimeout(scrollSuppressTimeoutRef.current);
      scrollSuppressTimeoutRef.current = null;
    }
  }, []);

  const syncCardsToScrollPosition = useCallback((updateActive = true, parallaxActive = false) => {
    const root = scrollRef.current;
    if (!root) return;

    const rootRect = root.getBoundingClientRect();
    const rootCenter = rootRect.left + rootRect.width / 2;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-slide-index]"));
    let closestIndex = activeIndex;
    let closestDistance = Number.POSITIVE_INFINITY;
    const cardMetrics = cards.map((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - rootCenter);
      const fadeDistance = Math.max(cardRect.width * 0.5, 1);
      const rawProgress = Math.max(-1, Math.min(1, (cardCenter - rootCenter) / fadeDistance));
      const absProgress = Math.abs(rawProgress);
      const titleOpacity = Math.max(0, Math.min(1, 1 - absProgress));
      const index = Number(card.dataset.slideIndex);

      if (distance < closestDistance && !Number.isNaN(index)) {
        closestIndex = index;
        closestDistance = distance;
      }

      return { card, titleOpacity };
    });

    for (const { card, titleOpacity } of cardMetrics) {
      card.style.setProperty("--highlight-title-opacity", titleOpacity.toFixed(3));
      card.style.setProperty("--highlight-media-x", "0px");
      card.style.setProperty("--highlight-media-scale", "1.04");
      card.style.setProperty(
        "--highlight-media-transition",
        parallaxActive ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
      );
    }

    if (!updateActive) return;

    setActiveIndex((current) => {
      if (current === closestIndex) return current;
      progressRef.current = 0;
      setProgress(0);
      return closestIndex;
    });
  }, [activeIndex]);

  const scrollCardIntoView = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const root = scrollRef.current;
      if (!root) return;
      const card = root.querySelector<HTMLElement>(`[data-slide-index="${index}"]`);
      if (!card) return;

      const maxScrollLeft = root.scrollWidth - root.clientWidth;
      const centeredLeft =
        card.offsetLeft - root.offsetLeft - (root.clientWidth - card.offsetWidth) / 2;
      const targetLeft = Math.min(Math.max(0, centeredLeft), maxScrollLeft);

      suppressIntersectionRef.current = true;
      if (scrollSuppressTimeoutRef.current) window.clearTimeout(scrollSuppressTimeoutRef.current);
      scrollSuppressTimeoutRef.current = window.setTimeout(
        clearScrollSuppression,
        80,
      );

      // Keep carousel jumps instant so product-page scrolling stays native-feeling.
      if (behavior === "auto") {
        const prevInline = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        root.scrollTo({ left: targetLeft, behavior: "auto" });
        requestAnimationFrame(() => {
          root.style.scrollBehavior = prevInline;
        });
        return;
      }

      root.scrollTo({ left: targetLeft, behavior: "auto" });
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
        queueMicrotask(() => scrollCardIntoView(nextIndex, "auto"));
        return nextIndex;
      });
    }, AUTOPLAY_STEP_MS);

    return () => window.clearInterval(tick);
  }, [isPlaying, slides.length, scrollCardIntoView]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || slides.length <= 1) return;

    let idleTimer: number | null = null;
    const onScroll = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        idleTimer = null;
        syncCardsToScrollPosition(!suppressIntersectionRef.current, false);
      }, 120);
    };
    const onScrollEnd = () => {
      if (idleTimer) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }
      clearScrollSuppression();
      syncCardsToScrollPosition(true, false);
    };
    syncCardsToScrollPosition(true, false);
    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", onScrollEnd);
    return () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", onScrollEnd);
      clearScrollSuppression();
    };
  }, [slides.length, clearScrollSuppression, syncCardsToScrollPosition]);

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
            "flex min-w-0 gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-1 md:gap-5",
            "w-full max-w-[100vw] snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
            "pl-3 pr-[calc((100vw-min(72rem,calc(100vw-3rem)))/2)] md:pl-[max(2rem,calc((100vw-86.25rem)/2+2rem))] md:pr-[calc((100vw-min(72rem,calc(100vw-9rem)))/2)]",
            "scroll-pl-3 scroll-pr-[calc((100vw-min(72rem,calc(100vw-3rem)))/2)] md:scroll-pl-[max(2rem,calc((100vw-86.25rem)/2+2rem))] md:scroll-pr-[calc((100vw-min(72rem,calc(100vw-9rem)))/2)]",
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {slides.map((slide, index) => {
            const titleAlign = slide.titleAlign ?? (index === 0 ? "center" : "left");
            const titlePosition = slide.titlePosition ?? "top";
            const isNearActive = Math.abs(index - activeIndex) <= 1;
            const titlePositionClass =
              titlePosition === "left-center"
                ? "left-0 top-1/2 w-[min(14rem,72%)] -translate-y-1/2 px-6 lg:w-[min(20rem,30%)] lg:px-10"
                : titlePosition === "right-center"
                ? "right-0 top-1/2 w-[min(14rem,72%)] -translate-y-1/2 px-6 lg:w-[min(20rem,30%)] lg:px-10"
                : titlePosition === "bottom"
                  ? "inset-x-0 bottom-0 px-8 pb-8 md:px-10 md:pb-10"
                  : "inset-x-0 top-0 px-8 pt-8 md:px-10 md:pt-10";

            return (
              <div
                key={slide.id}
                data-slide-index={index}
                className="w-[min(72rem,calc(100vw-3rem))] max-w-[min(72rem,calc(100vw-3rem))] shrink-0 snap-center md:w-[min(72rem,calc(100vw-9rem))] md:max-w-[min(72rem,calc(100vw-9rem))]"
                style={
                  {
                    contentVisibility: isNearActive ? "visible" : "auto",
                    containIntrinsicSize: isNearActive ? undefined : "576px",
                    "--highlight-title-opacity": index === activeIndex ? 1 : 0,
                    "--highlight-media-x": "0px",
                    "--highlight-media-scale": 1.04,
                    "--highlight-media-transition": "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                  } as CSSProperties
                }
              >
                <ProductShowcaseSurface className={cardSurfaceClassName}>
                  <div
                    className="absolute inset-0 z-0 will-change-transform"
                    style={{
                      transform:
                        "translate3d(var(--highlight-media-x),0,0) scale(var(--highlight-media-scale))",
                      transition: "var(--highlight-media-transition)",
                    }}
                  >
                    {isNearActive ? (
                      <ProductDetailMedia
                        media={slide.media}
                        active={index === activeIndex}
                        className="size-full"
                      />
                    ) : (
                      <div className="size-full bg-zinc-900/90 dark:bg-[#1C1C1E]" aria-hidden />
                    )}
                  </div>
                  <div
                    className={cn(
                      "absolute z-10 opacity-[var(--highlight-title-opacity)]",
                      titlePositionClass,
                    )}
                  >
                    <h3
                      className={cn(
                        "font-sans text-[1.35rem] font-medium leading-[1.12] tracking-[0em] md:text-[1.65rem]",
                        titleAlign === "center"
                          ? "mx-auto max-w-[28ch] text-center"
                          : "max-w-[18ch] text-left",
                        slide.titleTone === "light"
                          ? "text-white [text-shadow:0_1px_22px_rgba(0,0,0,0.34)]"
                          : "text-zinc-950 dark:text-zinc-100",
                      )}
                    >
                      {slide.title.split("\n").map((line) => (
                        <span key={`${slide.id}-${line}`} className="block">
                          {line}
                        </span>
                      ))}
                    </h3>
                  </div>
                </ProductShowcaseSurface>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-200/90 bg-[#FBFBFC]/95 px-4 shadow-[0_16px_32px_rgba(15,23,42,0.05)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#2A2A2D]/95 dark:shadow-[0_16px_32px_rgba(0,0,0,0.32)]">
            {slides.map((slide, index) => {
              const active = index === activeIndex;
              const fill = active ? `${Math.max(progress, isPlaying ? 0.08 : 1) * 100}%` : "0%";
              const titleLabel = slide.title.replace(/\s+/g, " ");
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Go to ${titleLabel}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setProgress(0);
                    progressRef.current = 0;
                    setIsPlaying(false);
                    scrollCardIntoView(index, "auto");
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
                scrollCardIntoView(0, "auto");
                return;
              }
              setIsPlaying((value) => !value);
              setProgress(0);
              progressRef.current = 0;
            }}
            className="inline-flex size-12 items-center justify-center rounded-full border border-zinc-200/90 bg-[#FBFBFC] text-zinc-900 shadow-[0_16px_32px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-transform hover:scale-[0.98] active:scale-[0.96] dark:border-white/[0.08] dark:bg-[#2A2A2D] dark:text-zinc-100 dark:shadow-[0_16px_32px_rgba(0,0,0,0.32)]"
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
