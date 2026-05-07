import { useEffect, useRef, useState } from "react";
import { cn } from "@jokuh/gooey";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ChevronDown, ChevronUp, Minus, Plus, X } from "lucide-react";
import type { ProductCloserLookItem } from "../../data/product-detail-blueprints";
import { ProductDetailMedia } from "./ProductDetailMedia";
import { ProductSectionIntro, ProductShowcaseSurface, ProductStorySection } from "./ProductDetailPrimitives";

const PILL_HEIGHT_PX = 50;
const PILL_GAP_PX = 4;
const PILL_PITCH_PX = PILL_HEIGHT_PX + PILL_GAP_PX;
const BUBBLE_EASE = [0.22, 1, 0.36, 1] as const;
const BUBBLE_LAYOUT_TRANSITION = { duration: 0.5, ease: BUBBLE_EASE };
const BUBBLE_RAIL_TRANSITION = {
  duration: 0.42,
  ease: BUBBLE_EASE,
  layout: BUBBLE_LAYOUT_TRANSITION,
};
const BUBBLE_CONTROL_TRANSITION = { duration: 0.42, ease: BUBBLE_EASE };
const BUBBLE_BODY_TRANSITION = {
  height: { duration: 0.5, ease: BUBBLE_EASE },
  opacity: { duration: 0.34, ease: "easeOut" as const },
};
const BUBBLE_BODY_EXIT_TRANSITION = {
  height: { duration: 0.42, ease: BUBBLE_EASE },
  opacity: { duration: 0.16, ease: "easeOut" as const },
};
const BUBBLE_BODY_CONTENT_TRANSITION = { duration: 0.44, ease: BUBBLE_EASE };

export function ProductCloserLookExplorer({
  title,
  items,
}: {
  title: string;
  items: ProductCloserLookItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const imageBackedPanel =
    activeItem?.media.kind === "image" ||
    activeItem?.media.kind === "video" ||
    activeItem?.media.kind === "blurbCallScene" ||
    activeItem?.media.kind === "blurbTravelFlow";
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
              <div className="size-full bg-[#FBFBFC] dark:bg-[#1C1C1E]" />
            )}
          </div>

          <div
            tabIndex={0}
            className="relative z-10 flex min-h-[30rem] flex-col justify-center overflow-hidden p-6 outline-none focus:outline-none focus-visible:outline-none md:min-h-[36rem] md:p-8"
            onClick={() => {
              if (activeIndex !== null) setActiveIndex(null);
            }}
            onKeyDown={(event) => {
              if (activeIndex === null) return;

              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((i) => ((i ?? 0) - 1 + items.length) % items.length);
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((i) => ((i ?? -1) + 1) % items.length);
              }

              if (event.key === "Escape") {
                event.preventDefault();
                setActiveIndex(null);
              }
            }}
          >
            <AnimatePresence initial={false}>
              {activeIndex !== null ? (
                <motion.button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "absolute right-6 top-6 inline-flex size-[50px] items-center justify-center rounded-full border backdrop-blur-xl outline-none transition-colors focus:outline-none focus-visible:outline-none",
                    imageBackedPanel
                      ? "border-white/20 bg-white/[0.14] text-white/80 shadow-[0_14px_28px_rgba(0,0,0,0.2)] hover:bg-white/[0.2] hover:text-white"
                      : "border-white/10 bg-white/5 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)] hover:text-zinc-950 dark:bg-black/30 dark:text-zinc-300 dark:hover:text-zinc-100",
                  )}
                  aria-label="Close closer look panel"
                >
                  <X className="size-5" strokeWidth={2.2} />
                </motion.button>
              ) : null}
            </AnimatePresence>

            {activeIndex === null ? (
              <motion.div
                ref={controlsRef}
                className="relative w-[min(18rem,100%)] min-w-0 overflow-visible"
                style={{
                  height: items.length * PILL_HEIGHT_PX + Math.max(0, items.length - 1) * PILL_GAP_PX,
                }}
              >
                {items.map((item, index) => {
                  const finalY = (index - (items.length - 1) / 2) * PILL_PITCH_PX;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{
                        opacity: 0,
                        y: 0,
                        scale: 0.92,
                        filter: "blur(10px)",
                      }}
                      animate={
                        controlsInView
                          ? {
                              opacity: 1,
                              y: finalY,
                              scale: 1,
                              filter: "blur(0px)",
                            }
                          : {
                              opacity: 0,
                              y: 0,
                              scale: 0.92,
                              filter: "blur(10px)",
                            }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 12,
                        mass: 0.72,
                        delay: index * 0.025,
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveIndex(index);
                      }}
                      aria-expanded={false}
                      className="absolute left-0 top-1/2 block h-[50px] w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/5 text-left text-zinc-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl outline-none transition-[box-shadow,border-color,color] duration-300 hover:text-zinc-950 focus:outline-none focus-visible:outline-none dark:bg-black/30 dark:text-zinc-400 dark:hover:text-zinc-100"
                      style={{ marginTop: -PILL_HEIGHT_PX / 2 }}
                    >
                      <div className="flex h-[50px] items-center gap-3 px-4">
                        <span className="inline-flex size-5 items-center justify-center text-[10px] transition-all duration-300">
                          <Plus className="size-3" strokeWidth={2.4} />
                        </span>
                        <span className="font-sans text-[15px] font-semibold">{item.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                ref={controlsRef}
                className="flex w-[min(18rem,100%)] min-w-0 flex-col items-start gap-1 overflow-visible"
                initial={{ opacity: 0, scale: 0.96, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                layout
                transition={BUBBLE_RAIL_TRANSITION}
              >
                <AnimatePresence initial={false}>
                  <motion.button
                    key="rail-up"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveIndex((i) => ((i ?? 0) - 1 + items.length) % items.length);
                    }}
                    initial={{ opacity: 0, scale: 0.72, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.72, y: 8 }}
                    transition={BUBBLE_CONTROL_TRANSITION}
                    className={cn(
                      "inline-flex size-[50px] items-center justify-center rounded-full border backdrop-blur-xl outline-none transition-colors focus:outline-none focus-visible:outline-none",
                      imageBackedPanel
                        ? "border-white/20 bg-white/[0.14] text-white/80 shadow-[0_14px_28px_rgba(0,0,0,0.2)] hover:bg-white/[0.2] hover:text-white"
                        : "border-white/10 bg-white/5 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)] hover:text-zinc-950 dark:bg-black/30 dark:text-zinc-300 dark:hover:text-zinc-100",
                    )}
                    aria-label="Previous feature"
                  >
                    <ChevronUp className="size-5" strokeWidth={2.2} />
                  </motion.button>
                </AnimatePresence>

                {items.map((item, index) => {
                  const active = index === activeIndex;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      layout
                      transition={{ layout: BUBBLE_LAYOUT_TRANSITION }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveIndex(active ? null : index);
                      }}
                      aria-expanded={active}
                      className={cn(
                        "block w-full overflow-hidden rounded-[24px] border text-left backdrop-blur-xl outline-none transition-[background-color,box-shadow,border-color,color] duration-300 focus:outline-none focus-visible:outline-none dark:backdrop-blur-[50px]",
                        imageBackedPanel
                          ? active
                            ? "border-white/25 bg-white/[0.22] text-white shadow-[0_20px_42px_rgba(0,0,0,0.22)]"
                            : "border-white/15 bg-white/[0.14] text-white/75 shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:border-white/20 hover:bg-white/[0.18] hover:text-white"
                          : active
                            ? "border-white/10 bg-white/5 text-zinc-950 shadow-[0_18px_30px_rgba(15,23,42,0.08)] dark:bg-black/30 dark:text-zinc-100 dark:shadow-[0_18px_30px_rgba(0,0,0,0.42)]"
                            : "border-white/10 bg-white/5 text-zinc-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:text-zinc-950 dark:bg-black/30 dark:text-zinc-400 dark:hover:text-zinc-100",
                      )}
                    >
                      <div className="flex h-[50px] items-center gap-3 px-4">
                        <span
                          className={cn(
                            "inline-flex size-5 items-center justify-center text-[10px] transition-all duration-300",
                            active
                              ? imageBackedPanel
                                ? "rounded-full bg-white/[0.2] text-white"
                                : "rounded-full bg-white/80 text-zinc-950 dark:bg-[#2A2A2D] dark:text-zinc-200"
                              : imageBackedPanel
                                ? "bg-transparent text-white/75"
                                : "bg-transparent text-current",
                          )}
                        >
                          {active ? (
                            <Minus className="size-3" strokeWidth={2.4} />
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: active ? "auto" : 0,
                          opacity: active ? 1 : 0,
                        }}
                        transition={{
                          ...(active ? BUBBLE_BODY_TRANSITION : BUBBLE_BODY_EXIT_TRANSITION),
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: -6 }}
                          animate={{ y: active ? 0 : -6 }}
                          transition={BUBBLE_BODY_CONTENT_TRANSITION}
                          className="px-4 pb-4 pt-0"
                        >
                          <p
                            className={cn(
                              "max-w-[28ch] font-sans text-[14px] leading-relaxed",
                              imageBackedPanel ? "text-white/75" : "text-black/60 dark:text-white/60",
                            )}
                          >
                            {item.body}
                          </p>
                        </motion.div>
                      </motion.div>
                    </motion.button>
                  );
                })}

                <AnimatePresence initial={false}>
                  <motion.button
                    key="rail-down"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveIndex((i) => ((i ?? -1) + 1) % items.length);
                    }}
                    initial={{ opacity: 0, scale: 0.72, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.72, y: -8 }}
                    transition={BUBBLE_CONTROL_TRANSITION}
                    className={cn(
                      "inline-flex size-[50px] items-center justify-center rounded-full border backdrop-blur-xl outline-none transition-colors focus:outline-none focus-visible:outline-none",
                      imageBackedPanel
                        ? "border-white/20 bg-white/[0.14] text-white/80 shadow-[0_14px_28px_rgba(0,0,0,0.2)] hover:bg-white/[0.2] hover:text-white"
                        : "border-white/10 bg-white/5 text-zinc-700 shadow-[0_10px_20px_rgba(15,23,42,0.05)] hover:text-zinc-950 dark:bg-black/30 dark:text-zinc-300 dark:hover:text-zinc-100",
                    )}
                    aria-label="Next feature"
                  >
                    <ChevronDown className="size-5" strokeWidth={2.2} />
                  </motion.button>
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </ProductShowcaseSurface>
      </div>
    </ProductStorySection>
  );
}
