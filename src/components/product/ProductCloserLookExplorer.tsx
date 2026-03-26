import { useState } from "react";
import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import type { ProductCloserLookItem } from "../../data/product-detail-blueprints";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { ProductSectionIntro, ProductShowcaseSurface, ProductStorySection } from "./ProductDetailPrimitives";

const pillRailVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const pillVariants = {
  hidden: (index: number) => ({
    opacity: 0,
    x: -48,
    y: index * 12 - 18,
    scale: 0.94,
    filter: "blur(8px)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 210,
      damping: 22,
      mass: 0.9,
    },
  },
};

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
        <ProductShowcaseSurface className="relative min-h-[30rem] bg-[#f5f4f1] md:min-h-[36rem]">
          <div className="absolute inset-0">
            {activeItem ? (
              <ProductDetailMedia media={activeItem.media} active className="size-full" />
            ) : (
              <div className="size-full bg-[#f8f8f8]" />
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
                  className="absolute right-6 top-6 inline-flex size-10 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors hover:text-zinc-950"
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
                      className="inline-flex size-10 items-center justify-center rounded-full bg-white/72 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors hover:text-zinc-950"
                      aria-label="Previous feature"
                    >
                      <ChevronUp className="size-4" strokeWidth={2.2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((index) => ((index ?? -1) + 1) % items.length)}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-white/72 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors hover:text-zinc-950"
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
                className="min-w-0 flex-1 space-y-3 xl:max-w-[20rem]"
              >
                {items.map((item, index) => {
                  const active = index === activeIndex;
                  return (
                    <motion.div
                      layout
                      key={item.id}
                      custom={index}
                      variants={pillVariants}
                      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                      className={cn(
                        "overflow-hidden rounded-[24px] bg-white/72 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-all",
                        active ? "shadow-[0_18px_30px_rgba(15,23,42,0.08)]" : "",
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
                          "flex w-full items-center gap-3 px-4 py-3 text-left transition-all",
                          active ? "text-zinc-950" : "text-zinc-700 hover:text-zinc-950",
                        )}
                        aria-expanded={active}
                      >
                        <span
                          className={cn(
                            "inline-flex size-5 items-center justify-center rounded-full border text-[10px] transition-all duration-300",
                            active ? "border-zinc-300 bg-zinc-100" : "border-zinc-300/80 bg-transparent",
                          )}
                        >
                          {active ? (
                            <span className="size-2 rounded-full bg-zinc-950" />
                          ) : (
                            <Plus className="size-3" strokeWidth={2.4} />
                          )}
                        </span>
                        <span className="font-sans text-[15px] font-semibold">{item.label}</span>
                      </button>

                      <AnimatePresence initial={false}>
                        {active ? (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <motion.div
                              initial={{ y: -6 }}
                              animate={{ y: 0 }}
                              exit={{ y: -6 }}
                              transition={{ duration: 0.24, ease: "easeOut" }}
                              className="px-4 pb-4 pt-0"
                            >
                              <p className="max-w-[28ch] font-sans text-[14px] leading-relaxed text-zinc-600">
                                {item.body}
                              </p>
                            </motion.div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
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
