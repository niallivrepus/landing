import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion, useInView, type Variants } from "motion/react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import type { ProductCloserLookItem } from "../../data/product-detail-blueprints";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { ProductSectionIntro, ProductShowcaseSurface, ProductStorySection } from "./ProductDetailPrimitives";

const pillRailVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
} satisfies Variants;

const pillVariants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: -20,
    y: 6 + index * 4,
    scale: 0.97,
    filter: "blur(6px)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
      mass: 0.8,
    },
  },
} satisfies Variants;

export function ProductCloserLookExplorer({
  title,
  items,
}: {
  title: string;
  items: ProductCloserLookItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const controlsInView = useInView(surfaceRef, { amount: 0.35 });

  useEffect(() => {
    if (activeIndex === null) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (controlsRef.current?.contains(target)) return;
      setActiveIndex(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeIndex]);

  return (
    <ProductStorySection>
      <ProductSectionIntro title={title} />

      <div ref={surfaceRef} className="mt-12 md:mt-16">
        <ProductShowcaseSurface className="relative min-h-[30rem] md:min-h-[36rem]">
          <div className="absolute inset-0">
            {activeItem ? (
              <ProductDetailMedia media={activeItem.media} active className="size-full" />
            ) : (
              <div className="size-full bg-[#F5F5F7] dark:bg-[#1C1C1E]" />
            )}
          </div>

          <div className="relative z-10 flex min-h-[30rem] flex-col justify-center overflow-hidden p-6 md:min-h-[36rem] md:p-8">
            <AnimatePresence initial={false}>
              {activeIndex !== null ? (
                <motion.button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-6 top-6 inline-flex size-[50px] items-center justify-center rounded-full border border-zinc-200/80 bg-[#F5F5F7]/95 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-colors hover:text-zinc-950 dark:border-white/[0.08] dark:bg-[#2A2A2D] dark:text-zinc-300 dark:hover:text-zinc-100"
                  aria-label="Close closer look panel"
                >
                  <X className="size-5" strokeWidth={2.2} />
                </motion.button>
              ) : null}
            </AnimatePresence>

            <motion.div
              ref={controlsRef}
              initial="hidden"
              animate={controlsInView ? "visible" : "hidden"}
              variants={pillRailVariants}
              className="flex min-w-0 flex-col items-start gap-3"
            >
              <AnimatePresence initial={false}>
                {activeIndex !== null ? (
                  <motion.button
                    key="rail-up"
                    type="button"
                    onClick={() =>
                      setActiveIndex((i) => ((i ?? 0) - 1 + items.length) % items.length)
                    }
                    initial={{ opacity: 0, scale: 0.6, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 8 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex size-[50px] items-center justify-center rounded-full border border-zinc-200/70 bg-[#F5F5F7]/95 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-colors hover:text-zinc-950 dark:border-white/[0.08] dark:bg-[#2A2A2D] dark:text-zinc-300 dark:hover:text-zinc-100"
                    aria-label="Previous feature"
                  >
                    <ChevronUp className="size-5" strokeWidth={2.2} />
                  </motion.button>
                ) : null}
              </AnimatePresence>

              {items.map((item, index) => {
                const active = index === activeIndex;
                return (
                  <Fragment key={item.id}>
                    <motion.button
                      type="button"
                      layout="position"
                      custom={index}
                      variants={pillVariants}
                      transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                      onClick={() => setActiveIndex(active ? null : index)}
                      aria-expanded={active}
                      className={cn(
                        "block w-fit max-w-full overflow-hidden rounded-[24px] border border-zinc-200/60 bg-[#F5F5F7]/92 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-[box-shadow,border-color,color] duration-300 dark:border-white/[0.08] dark:bg-[#232326]/88 dark:backdrop-blur-[50px]",
                        active
                          ? "text-zinc-950 shadow-[0_18px_30px_rgba(15,23,42,0.08)] dark:text-zinc-100 dark:shadow-[0_18px_30px_rgba(0,0,0,0.42)]"
                          : "text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100",
                      )}
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex size-5 items-center justify-center rounded-full border text-[10px] transition-all duration-300",
                            active
                              ? "border-zinc-300 bg-white/80 dark:border-white/[0.1] dark:bg-[#2A2A2D]"
                              : "border-zinc-300/80 bg-transparent dark:border-white/[0.1]",
                          )}
                        >
                          {active ? (
                            <span className="size-2 rounded-full bg-zinc-950 dark:bg-zinc-200" />
                          ) : (
                            <Plus className="size-3" strokeWidth={2.4} />
                          )}
                        </span>
                        <span
                          className="font-sans font-semibold transition-[font-size] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{ fontSize: active ? "17px" : "15px" }}
                        >
                          {item.label}
                        </span>
                      </div>

                      <motion.div
                        initial={false}
                        animate={{
                          height: active ? "auto" : 0,
                          opacity: active ? 1 : 0,
                        }}
                        transition={{
                          height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: active ? 0.28 : 0.15, ease: "easeOut" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0">
                          <p className="max-w-[28ch] font-sans text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                            {item.body}
                          </p>
                        </div>
                      </motion.div>
                    </motion.button>
                  </Fragment>
                );
              })}

              <AnimatePresence initial={false}>
                {activeIndex !== null ? (
                  <motion.button
                    key="rail-down"
                    type="button"
                    onClick={() =>
                      setActiveIndex((i) => ((i ?? -1) + 1) % items.length)
                    }
                    initial={{ opacity: 0, scale: 0.6, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: -8 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex size-[50px] items-center justify-center rounded-full border border-zinc-200/70 bg-[#F5F5F7]/95 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-colors hover:text-zinc-950 dark:border-white/[0.08] dark:bg-[#2A2A2D] dark:text-zinc-300 dark:hover:text-zinc-100"
                    aria-label="Next feature"
                  >
                    <ChevronDown className="size-5" strokeWidth={2.2} />
                  </motion.button>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </div>
        </ProductShowcaseSurface>
      </div>
    </ProductStorySection>
  );
}
