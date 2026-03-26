import { useEffect, useRef, useState } from "react";
import { cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import type { ProductHighlightSlide } from "../../data/product-detail-blueprints";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { ProductSectionIntro, ProductShowcaseSurface, ProductStorySection } from "./ProductDetailPrimitives";

const AUTOPLAY_STEP_MS = 80;
const AUTOPLAY_DURATION_MS = 4200;

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
  const swipeStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const tick = window.setInterval(() => {
      setProgress((current) => {
        const next = current + AUTOPLAY_STEP_MS / AUTOPLAY_DURATION_MS;
        if (next < 1) return next;
        setActiveIndex((index) => (index + 1) % slides.length);
        return 0;
      });
    }, AUTOPLAY_STEP_MS);

    return () => window.clearInterval(tick);
  }, [isPlaying, slides.length]);

  const activeSlide = slides[activeIndex];
  const nextSlide = slides[(activeIndex + 1) % slides.length];
  const goToNextSlide = () => {
    setActiveIndex((index) => (index + 1) % slides.length);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <ProductStorySection>
      <ProductSectionIntro title={title} />

      <div className="mt-12 md:mt-16">
        <div className="overflow-visible">
          <motion.div
            drag={slides.length > 1 ? "x" : false}
            dragDirectionLock
            dragElastic={{ left: 0.02, right: 0 }}
            dragMomentum={false}
            onDragStart={(_, info) => {
              swipeStartXRef.current = info.point.x;
            }}
            onDragEnd={(_, info) => {
              const startX = swipeStartXRef.current;
              swipeStartXRef.current = null;
              if (startX === null) return;

              const deltaX = info.point.x - startX;
              if (deltaX < -72) {
                goToNextSlide();
              }
            }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="flex w-max touch-pan-y items-stretch gap-4 md:gap-5"
          >
            <ProductShowcaseSurface className="relative min-h-[30rem] w-full max-w-full bg-[#f5f4f1] md:min-h-[36rem] md:w-[min(72rem,calc(100vw-4rem))]">
              <div className="absolute inset-0">
                <ProductDetailMedia media={activeSlide.media} active={isPlaying} className="size-full" />
              </div>
              <div className="absolute inset-x-0 top-0 px-8 pt-8 md:px-10 md:pt-10">
                <h3 className="max-w-[16ch] font-sans text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-zinc-950 md:text-[2.25rem]">
                  {activeSlide.title}
                </h3>
              </div>
            </ProductShowcaseSurface>

            {slides.length > 1 ? (
              <ProductShowcaseSurface className="relative hidden min-h-[30rem] w-[min(72rem,calc(100vw-4rem))] shrink-0 bg-[#f5f4f1] md:block md:min-h-[36rem]">
                <div className="absolute inset-0">
                  <ProductDetailMedia media={nextSlide.media} className="size-full" />
                </div>
                <div className="absolute inset-x-0 top-0 px-8 pt-8 md:px-10 md:pt-10">
                  <h3 className="max-w-[16ch] font-sans text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.04em] text-zinc-950 md:text-[2.25rem]">
                    {nextSlide.title}
                  </h3>
                </div>
              </ProductShowcaseSurface>
            ) : null}
          </motion.div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-3 shadow-[0_16px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl">
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
                    setIsPlaying(false);
                  }}
                  className={cn(
                    "relative h-2 overflow-hidden rounded-full bg-zinc-300/80 transition-all",
                    active ? "w-10" : "w-2.5 hover:bg-zinc-400/80",
                  )}
                >
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-zinc-700 transition-[width] duration-100"
                    style={{ width: fill }}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPlaying((value) => !value);
              setProgress(0);
            }}
            className="inline-flex size-12 items-center justify-center rounded-full bg-white/88 text-zinc-900 shadow-[0_16px_32px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-transform hover:scale-[0.98] active:scale-[0.96]"
            aria-label={isPlaying ? "Pause highlight carousel" : "Play highlight carousel"}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" strokeWidth={2.2} />
            ) : (
              <Play className="size-4 fill-current" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {activeSlide.title}
      </div>
    </ProductStorySection>
  );
}
