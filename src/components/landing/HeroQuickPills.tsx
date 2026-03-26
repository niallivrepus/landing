import { cn } from "@jokuh/gooey";
import { useCallback, useEffect, useRef, useState } from "react";
import { TopNavAnchor } from "../TopNavAnchor";

/** Single-row pills with horizontal scroll + edge fades (gooey PromptCategories pattern). */
export function HeroQuickPills({ items }: { items: { label: string; href: string }[] }) {
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [fadePx, setFadePx] = useState(32);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    const w = el.clientWidth;
    setFadePx(w < 340 ? 56 : w < 400 ? 48 : w < 520 ? 40 : 32);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState]);

  const f = fadePx;
  const maskImage =
    canScrollLeft && canScrollRight
      ? `linear-gradient(to right, transparent, black ${f}px, black calc(100% - ${f}px), transparent)`
      : canScrollRight
        ? `linear-gradient(to right, black, black calc(100% - ${f}px), transparent)`
        : canScrollLeft
          ? `linear-gradient(to right, transparent, black ${f}px, black)`
          : undefined;

  const navMax =
    "w-full max-w-[min(calc(100vw-2rem),400px)] md:max-w-[min(calc(100vw-4rem),520px)]";

  return (
    <div
      className={cn(
        navMax,
        /* Room for box-shadow + 8px vertical padding from adjacent chrome */
        "py-2",
      )}
    >
      <nav
        ref={scrollRef}
        onScroll={updateScrollState}
        aria-label="Quick links"
        className={cn(
          navMax,
          "overflow-x-auto overscroll-x-contain",
          "snap-x snap-mandatory scroll-pl-3 scroll-pr-3 sm:scroll-pl-4 sm:scroll-pr-4",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        <div className="flex w-full min-w-0 flex-wrap justify-start gap-x-2 gap-y-2 px-1 py-2 sm:justify-center sm:px-0">
          {items.map((item) => (
            <TopNavAnchor
              key={item.label}
              href={item.href}
              className={cn(
                "snap-start inline-flex shrink-0 items-center justify-center rounded-full px-3 py-[8px] font-sans text-xs font-medium whitespace-nowrap",
                "transition-[background-color,box-shadow,border-color,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "sm:px-5 sm:py-[8px] sm:text-sm",
                "border border-[#E0E0E0] bg-light-glass-5 text-light-space backdrop-blur-[25px]",
                "hover:bg-white/[0.08] active:bg-white/[0.06] active:scale-[0.99]",
                "light:border light:border-[#E0E0E0] light:bg-white light:text-zinc-600 light:backdrop-blur-none",
                "light:shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_14px_rgba(0,0,0,0.04)]",
                "light:hover:border-[#E0E0E0] light:hover:bg-zinc-50/80 light:hover:shadow-[0_1px_2px_rgba(0,0,0,0.02),0_5px_18px_rgba(0,0,0,0.045)]",
                "light:active:border-[#E0E0E0] light:active:bg-zinc-100/70 light:active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] light:active:scale-[0.995]",
              )}
            >
              {item.label}
            </TopNavAnchor>
          ))}
        </div>
      </nav>
    </div>
  );
}
