import { useState } from "react";
import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion, type Variants } from "motion/react";
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

  return (
    <ProductStorySection>
      <ProductSectionIntro title={title} />

      <div className="mt-12 md:mt-16">
        <ProductShowcaseSurface className="relative min-h-[30rem] md:min-h-[36rem]">
          <div className="absolute inset-0">
            {activeItem ? (
              <ProductDetailMedia media={activeItem.media} active className="size-full" />
            ) : (
              <div className="size-full bg-zinc-100 dark:bg-black" />
            )}
          </div>

          <div className="relative z-10 overflow-hidden p-6 md:p-8">
            <AnimatePresence initial={false}>
              {activeIndex !== null ? (
                <motion.button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-6 top-6 inline-flex size-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/95 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors hover:text-zinc-950 dark:border-zinc-600/60 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100"
                  aria-label="Close closer look panel"
                >
                  <X className="size-4" strokeWidth={2.2} />
                </motion.button>
              ) : null}
            </AnimatePresence>

            <div className="flex gap-4 xl:min-h-[34rem] xl:items-center">
              <AnimatePresence initial={false}>
                {activeIndex !== null ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="hidden flex-col justify-center gap-4 xl:flex"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex((index) => ((index ?? 0) - 1 + items.length) % items.length)}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-200/70 bg-white/90 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors hover:text-zinc-950 dark:border-zinc-600/60 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100"
                      aria-label="Previous feature"
                    >
                      <ChevronUp className="size-4" strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((index) => ((index ?? -1) + 1) % items.length)}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-200/70 bg-white/90 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors hover:text-zinc-950 dark:border-zinc-600/60 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100"
                      aria-label="Next feature"
                    >
                      <ChevronDown className="size-4" strokeWidth={2.2} />
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.45 }}
                variants={pillRailVariants}
                className="flex min-w-0 flex-1 flex-col items-start gap-3 xl:max-w-[20rem]"
              >
                {items.map((item, index) => {
                  const active = index === activeIndex;
                  return (
                    <motion.div
                      layout="position"
                      key={item.id}
                      custom={index}
                      variants={pillVariants}
                      transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                      className={cn(
                        "overflow-hidden rounded-[24px] border border-zinc-200/60 bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-[box-shadow,border-color] duration-300 dark:border-zinc-800/60 dark:bg-black/80 dark:backdrop-blur-[50px]",
                        active ? "shadow-[0_18px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_30px_rgba(0,0,0,0.5)]" : "",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (active) {
                            setActiveIndex(null);
                            return;
                          }
                          setActiveIndex(index);
                        }}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200",
                          active
                            ? "text-zinc-950 dark:text-zinc-100"
                            : "text-zinc-700 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100",
                        )}
                        aria-expanded={active}
                      >
                        <span
                          className={cn(
                            "inline-flex size-5 items-center justify-center rounded-full border text-[10px] transition-all duration-300",
                            active
                              ? "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                              : "border-zinc-300/80 bg-transparent dark:border-zinc-700",
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
                      </button>

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
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </ProductShowcaseSurface>
      </div>
    </ProductStorySection>
  );
}
