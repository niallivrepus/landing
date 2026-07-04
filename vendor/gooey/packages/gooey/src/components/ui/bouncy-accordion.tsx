import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, CalendarDays, ChevronDown, CircleDollarSign, ShieldAlert, Sparkles } from "lucide-react";

import { useShouldAnimate } from "../../hooks/use-reduced-motion";
import { cn } from "../../lib/utils";

export interface BouncyAccordionItem {
  id: string;
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BouncyAccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  items?: BouncyAccordionItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, item: BouncyAccordionItem | null) => void;
  collapsible?: boolean;
  collapsedHeight?: number;
  expandedHeight?: number;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const BOUNCY_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 20,
} as const;

export const BOUNCY_ACCORDION_ITEMS: BouncyAccordionItem[] = [
  {
    id: "read",
    icon: <BookOpen aria-hidden="true" className="size-4" />,
    title: "read",
    description: "open a compact learning card without leaving the flow.",
  },
  {
    id: "signal",
    icon: <Sparkles aria-hidden="true" className="size-4" />,
    title: "signal",
    description: "surface a useful system hint with a soft spring expansion.",
  },
  {
    id: "schedule",
    icon: <CalendarDays aria-hidden="true" className="size-4" />,
    title: "schedule",
    description: "reveal timing, reminders, and context in one calm motion.",
  },
  {
    id: "balance",
    icon: <CircleDollarSign aria-hidden="true" className="size-4" />,
    title: "balance",
    description: "show account state, recent movement, and next action.",
  },
  {
    id: "alert",
    icon: <ShieldAlert aria-hidden="true" className="size-4" />,
    title: "alert",
    description: "expand critical context without turning the interface loud.",
  },
];

function resolveActiveItem(items: BouncyAccordionItem[], activeId: string | null) {
  return items.find((item) => item.id === activeId) ?? null;
}

function getRadiusState(index: number, activeIndex: number | null, itemCount: number) {
  const isActive = activeIndex === index;
  const isAfterActive = activeIndex !== null && index === activeIndex + 1;
  const isBeforeActive = activeIndex !== null && index === activeIndex - 1;

  return {
    borderTopLeftRadius: index === 0 || isActive || isAfterActive ? "20px" : "0px",
    borderTopRightRadius: index === 0 || isActive || isAfterActive ? "20px" : "0px",
    borderBottomRightRadius: index === itemCount - 1 || isActive || isBeforeActive ? "20px" : "0px",
    borderBottomLeftRadius: index === itemCount - 1 || isActive || isBeforeActive ? "20px" : "0px",
  };
}

export function BouncyAccordion({
  items = BOUNCY_ACCORDION_ITEMS,
  value,
  defaultValue = items[0]?.id ?? null,
  onValueChange,
  collapsible = true,
  collapsedHeight = 48,
  expandedHeight = 104,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  ...props
}: BouncyAccordionProps) {
  const shouldAnimate = useShouldAnimate();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | null>(defaultValue);
  const activeId = isControlled ? value : internalValue;
  const activeIndex = items.findIndex((item) => item.id === activeId);
  const activeItem = resolveActiveItem(items, activeId ?? null);
  const stableId = React.useId();

  const setActiveId = React.useCallback(
    (nextValue: string | null) => {
      const nextItem = resolveActiveItem(items, nextValue);

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue, nextItem);
    },
    [isControlled, items, onValueChange],
  );

  React.useEffect(() => {
    if (!activeItem && activeId !== null) {
      setActiveId(null);
    }
  }, [activeId, activeItem, setActiveId]);

  return (
    <div className={cn("w-full max-w-[320px]", className)} {...props}>
      <ul className="w-full select-none" aria-label="bouncy accordion">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const panelId = `${stableId}-${item.id}-panel`;
          const triggerId = `${stableId}-${item.id}-trigger`;

          return (
            <motion.li
              key={item.id}
              animate={{
                height: isActive ? expandedHeight : collapsedHeight,
                marginBlock: isActive ? 10 : 0,
                ...getRadiusState(index, activeIndex >= 0 ? activeIndex : null, items.length),
              }}
              transition={shouldAnimate ? BOUNCY_TRANSITION : { duration: 0 }}
              className={cn(
                "relative overflow-hidden border border-white/10 bg-white/[0.06] text-white shadow-[0_1px_4px_rgba(0,0,0,0.16)] backdrop-blur-xl",
                "hover:bg-white/[0.08] focus-within:border-white/25",
                item.disabled && "opacity-40",
                itemClassName,
              )}
            >
              <button
                id={triggerId}
                type="button"
                disabled={item.disabled}
                aria-expanded={isActive}
                aria-controls={panelId}
                onClick={() => {
                  if (item.disabled) {
                    return;
                  }

                  if (isActive && collapsible) {
                    setActiveId(null);
                    return;
                  }

                  setActiveId(item.id);
                }}
                className={cn(
                  "flex h-12 w-full items-center gap-2 px-4 text-left text-sm text-white/75 outline-none transition-colors",
                  "disabled:cursor-not-allowed focus-visible:text-white",
                  triggerClassName,
                )}
              >
                {item.icon && (
                  <span className="flex size-6 shrink-0 items-center justify-center text-white/65">{item.icon}</span>
                )}
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn("size-4 shrink-0 text-white/50 transition-transform duration-200", isActive && "rotate-180")}
                />
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={shouldAnimate ? { opacity: 0, filter: "blur(2px)", y: -2 } : false}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={shouldAnimate ? { opacity: 0, filter: "blur(2px)", y: -2 } : { opacity: 0 }}
                    transition={shouldAnimate ? { duration: 0.16, ease: "easeOut" } : { duration: 0 }}
                    className={cn("px-4 pb-4 text-sm leading-5 text-white/55", contentClassName)}
                  >
                    {item.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
