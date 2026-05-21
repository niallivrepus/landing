import * as React from "react";
import { cn } from "../../lib/utils";

interface PromptCategory {
  name: string;
  icon: React.ReactNode;
}

interface PromptCategoriesProps {
  categories: PromptCategory[];
  activeCategory?: string | null;
  onSelect?: (name: string) => void;
  className?: string;
}

/**
 * PromptCategories — horizontally scrollable row of glass pill buttons with emoji icons.
 * Cinematic edge masks fade in on the sides when content overflows.
 * Used below the prompt bar to let users pick a topic before seeing specific prompts.
 */
function PromptCategories({ categories, activeCategory, onSelect, className }: PromptCategoriesProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState]);

  // Build the mask based on scroll position
  const maskImage = canScrollLeft && canScrollRight
    ? "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)"
    : canScrollRight
      ? "linear-gradient(to right, black, black calc(100% - 32px), transparent)"
      : canScrollLeft
        ? "linear-gradient(to right, transparent, black 32px, black)"
        : undefined;

  return (
    <div
      ref={scrollRef}
      onScroll={updateScrollState}
      className={cn(
        "flex w-full gap-2 overflow-x-auto",
        className,
      )}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitMaskImage: maskImage,
        maskImage,
      }}
    >
      {categories.map(({ name, icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onSelect?.(name)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium text-light-space backdrop-blur-[25px] transition-all cursor-pointer whitespace-nowrap",
            "border",
            activeCategory === name
              ? "bg-light-glass-20 border-light-glass-40"
              : "bg-light-glass-5 border-light-glass-20 hover:bg-light-glass-10",
          )}
        >
          <span className="inline-flex items-center gap-[6px]">{icon} {name}</span>
        </button>
      ))}
    </div>
  );
}

export { PromptCategories, type PromptCategoriesProps, type PromptCategory };
