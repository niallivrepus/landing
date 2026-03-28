import { cn, lordiconAssets } from "@jokuh/gooey";
import { Player } from "@lordicon/react";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { TopNavAnchor } from "../TopNavAnchor";
import type { HeroQuickLink } from "./LandingHero";

const pillClassName = cn(
  "group/pill snap-start inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-[8px] font-sans text-xs font-medium whitespace-nowrap",
  "transition-[background-color,box-shadow,border-color,transform] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
  "sm:px-5 sm:py-[8px] sm:text-sm",
  "border border-[#3A3A3C] bg-[#111111]/88 text-light-space backdrop-blur-[25px]",
  "hover:border-[#4A4A4D] hover:bg-white/[0.08] active:border-[#4A4A4D] active:bg-white/[0.06] active:scale-[0.99]",
  "light:border light:border-[#E0E0E0] light:bg-white light:text-zinc-600 light:backdrop-blur-none",
  "light:shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_14px_rgba(0,0,0,0.04)]",
  "light:hover:border-[#E0E0E0] light:hover:bg-zinc-50/80 light:hover:shadow-[0_1px_2px_rgba(0,0,0,0.02),0_5px_18px_rgba(0,0,0,0.045)]",
  "light:active:border-[#E0E0E0] light:active:bg-zinc-100/70 light:active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] light:active:scale-[0.995]",
);

function PillContent({
  item,
  darkRef,
  lightRef,
}: {
  item: HeroQuickLink;
  darkRef: MutableRefObject<any>;
  lightRef: MutableRefObject<any>;
}) {
  return (
    <>
      {item.icon.lordicon ? (
        <>
          <span className="flex size-5 items-center justify-center shrink-0 [.light_&]:hidden">
            <Player
              ref={darkRef}
              icon={lordiconAssets[item.icon.lordicon]}
              size={20}
              colorize="#ffffff"
            />
          </span>
          <span className="hidden size-5 items-center justify-center shrink-0 [.light_&]:flex">
            <Player
              ref={lightRef}
              icon={lordiconAssets[item.icon.lordicon]}
              size={20}
              colorize="#18181b"
            />
          </span>
        </>
      ) : item.icon.lucide ? (
        <item.icon.lucide
          className="size-4 shrink-0 stroke-[1.9] text-current transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/pill:scale-[1.04]"
          aria-hidden
        />
      ) : null}
      {item.label}
    </>
  );
}

function HeroQuickPill({ item }: { item: HeroQuickLink }) {
  const darkRef = useRef<any>(null);
  const lightRef = useRef<any>(null);

  const handleMouseEnter = () => {
    darkRef.current?.playFromBeginning();
    lightRef.current?.playFromBeginning();
  };

  return (
    <TopNavAnchor
      href={item.href ?? "/"}
      onMouseEnter={handleMouseEnter}
      className={pillClassName}
    >
      <PillContent item={item} darkRef={darkRef} lightRef={lightRef} />
    </TopNavAnchor>
  );
}

function HeroQuickMorePill({ item, expanded, onExpand }: { item: HeroQuickLink; expanded: boolean; onExpand: () => void }) {
  const darkRef = useRef<any>(null);
  const lightRef = useRef<any>(null);

  const handleMouseEnter = () => {
    darkRef.current?.playFromBeginning();
    lightRef.current?.playFromBeginning();
  };

  return (
    <button
      type="button"
      onClick={onExpand}
      onMouseEnter={handleMouseEnter}
      aria-expanded={expanded}
      className={pillClassName}
    >
      <PillContent item={item} darkRef={darkRef} lightRef={lightRef} />
    </button>
  );
}

export function HeroQuickPills({
  items,
  overflowItems = [],
}: {
  items: HeroQuickLink[];
  overflowItems?: HeroQuickLink[];
}) {
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [fadePx, setFadePx] = useState(32);
  const [expanded, setExpanded] = useState(false);

  const visibleItems = useMemo(() => {
    const primary = items.filter((item) => item.action !== "expand");
    const expandItem = items.find((item) => item.action === "expand");
    if (!expandItem || overflowItems.length === 0) return primary;
    return expanded ? [...primary, ...overflowItems] : [...primary, expandItem];
  }, [expanded, items, overflowItems]);

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

  useEffect(() => {
    updateScrollState();
    if (expanded) {
      window.requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      });
    }
  }, [expanded, updateScrollState]);

  const f = fadePx;
  const maskImage =
    canScrollLeft && canScrollRight
      ? `linear-gradient(to right, transparent, black ${f}px, black calc(100% - ${f}px), transparent)`
      : canScrollRight
        ? `linear-gradient(to right, black, black calc(100% - ${f}px), transparent)`
        : canScrollLeft
          ? `linear-gradient(to right, transparent, black ${f}px, black)`
          : undefined;

  return (
    <div className="w-full max-w-[min(calc(100vw-2rem),900px)]">
      <nav
        ref={scrollRef}
        onScroll={updateScrollState}
        aria-label="Quick links"
        className={cn(
          "w-full overflow-x-auto overscroll-x-contain",
          "snap-x snap-mandatory scroll-pl-3 scroll-pr-3 sm:scroll-pl-4 sm:scroll-pr-4",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
        style={{
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        <div className="flex w-max min-w-0 max-w-none flex-nowrap justify-start gap-x-2 px-1">
          {visibleItems.map((item) =>
            item.action === "expand" ? (
              <HeroQuickMorePill
                key={item.label}
                item={item}
                expanded={expanded}
                onExpand={() => setExpanded(true)}
              />
            ) : (
              <HeroQuickPill key={item.label} item={item} />
            ),
          )}
        </div>
      </nav>
    </div>
  );
}
