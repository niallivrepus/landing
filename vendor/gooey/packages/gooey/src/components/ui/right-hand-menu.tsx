import * as React from "react";

import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useSpring,
} from "motion/react";
import { Command, Menu } from "lucide-react";

import { cn } from "../../lib/utils/cn";
import { IconHoverContext } from "./lordicon";

export type RightHandMenuSide = "left" | "right" | "top" | "bottom";

export interface RightHandMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  /** optional second line in the tooltip — a short, plain explanation of the item */
  description?: string;
  keyword?: React.ReactNode[];
  hasBadge?: boolean;
  onSelect?: () => void;
}

export interface RightHandMenuProps {
  items: RightHandMenuItem[];
  side?: RightHandMenuSide;
  className?: string;
}

type TooltipContextValue = {
  iconRefs: React.MutableRefObject<HTMLDivElement[]>;
  tooltipRefs: React.MutableRefObject<HTMLDivElement[]>;
  tooltipParentRef: React.MutableRefObject<HTMLDivElement | null>;
  tooltipPosition: MotionValue<number>;
  clipPathStart: MotionValue<number>;
  clipPathEnd: MotionValue<number>;
  opacity: MotionValue<number>;
  onMouseEnterOnIcon: (index: number) => void;
  onMouseLeave: () => void;
  setIconRef: (index: number, element: HTMLDivElement | null) => void;
  setTooltipRef: (index: number, element: HTMLDivElement | null) => void;
  registerContent: (index: number, content: React.ReactNode) => void;
  side: RightHandMenuSide;
  itemsCountRef: React.MutableRefObject<number>;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

/**
 * Find the horizontal bounds of the nearest clipping ancestor (a scroll region,
 * sheet, or any `overflow` container), so a horizontal tooltip can be kept fully
 * inside it instead of being cut off at the container edge.
 */
function getHorizontalClipBounds(element: HTMLElement | null): { left: number; right: number } {
  let node = element?.parentElement ?? null;
  while (node) {
    const style = window.getComputedStyle(node);
    if (/(auto|hidden|clip|scroll)/.test(`${style.overflowX} ${style.overflow}`)) {
      const rect = node.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }
    node = node.parentElement;
  }
  return { left: 0, right: window.innerWidth };
}

function useTooltipContext() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("right hand menu tooltip components must be used within root");
  }
  return context;
}

function RightHandMenuTooltipRoot({
  children,
  className,
  side = "left",
}: {
  children: React.ReactNode;
  className?: string;
  side?: RightHandMenuSide;
}) {
  const iconRefs = React.useRef<HTMLDivElement[]>([]);
  const tooltipRefs = React.useRef<HTMLDivElement[]>([]);
  const tooltipParentRef = React.useRef<HTMLDivElement>(null);
  const itemsCountRef = React.useRef(0);
  const contentMapRef = React.useRef<Map<number, React.ReactNode>>(new Map());
  const [, forceUpdate] = React.useReducer((value) => value + 1, 0);

  const tooltipPosition = useSpring(0, { stiffness: 350, damping: 30 });
  const clipPathStart = useSpring(0, { stiffness: 400, damping: 30, mass: 0.8 });
  const clipPathEnd = useSpring(0, { stiffness: 400, damping: 30, mass: 0.8 });
  const opacity = useSpring(0, { stiffness: 300, damping: 30, mass: 0.8 });
  const verticalClipPath = useMotionTemplate`inset(${clipPathStart}% 0 ${clipPathEnd}% 0 round 10px)`;
  const horizontalClipPath = useMotionTemplate`inset(0 ${clipPathEnd}% 0 ${clipPathStart}% round 10px)`;

  const calculateClipPath = React.useCallback((index: number | null) => {
    if (index === null) {
      clipPathStart.set(0);
      clipPathEnd.set(0);
      opacity.set(0);
      return;
    }

    if (side === "left" || side === "right") {
      const totalHeight = tooltipRefs.current.reduce(
        (sum, element) => sum + (element?.getBoundingClientRect().height || 0),
        0,
      );
      const topHeight = tooltipRefs.current
        .slice(0, index)
        .reduce((sum, element) => sum + (element?.getBoundingClientRect().height || 0), 0);
      const bottomHeight = tooltipRefs.current
        .slice(index + 1, itemsCountRef.current)
        .reduce((sum, element) => sum + (element?.getBoundingClientRect().height || 0), 0);

      clipPathStart.set(totalHeight > 0 ? (topHeight / totalHeight) * 100 : 0);
      clipPathEnd.set(totalHeight > 0 ? (bottomHeight / totalHeight) * 100 : 0);
    } else {
      const totalWidth = tooltipRefs.current.reduce(
        (sum, element) => sum + (element?.getBoundingClientRect().width || 0),
        0,
      );
      const leftWidth = tooltipRefs.current
        .slice(0, index)
        .reduce((sum, element) => sum + (element?.getBoundingClientRect().width || 0), 0);
      const rightWidth = tooltipRefs.current
        .slice(index + 1, itemsCountRef.current)
        .reduce((sum, element) => sum + (element?.getBoundingClientRect().width || 0), 0);

      clipPathStart.set(totalWidth > 0 ? (leftWidth / totalWidth) * 100 : 0);
      clipPathEnd.set(totalWidth > 0 ? (rightWidth / totalWidth) * 100 : 0);
    }

    opacity.set(1);
  }, [clipPathEnd, clipPathStart, opacity, side]);

  const onMouseEnterOnIcon = React.useCallback((index: number) => {
    const activeIcon = iconRefs.current[index]?.getBoundingClientRect();
    const activeTooltip = tooltipRefs.current[index]?.getBoundingClientRect();
    const parentTooltip = tooltipParentRef.current?.getBoundingClientRect();

    if (activeIcon && activeTooltip && parentTooltip) {
      if (side === "left" || side === "right") {
        const heightBeforeCurrent = tooltipRefs.current
          .slice(0, index)
          .reduce((sum, element) => sum + (element?.getBoundingClientRect().height || 0), 0);
        const iconCenter = activeIcon.top + activeIcon.height / 2;
        const tooltipCenter = parentTooltip.top + heightBeforeCurrent + activeTooltip.height / 2;
        tooltipPosition.set(iconCenter - tooltipCenter);
      } else {
        const widthBeforeCurrent = tooltipRefs.current
          .slice(0, index)
          .reduce((sum, element) => sum + (element?.getBoundingClientRect().width || 0), 0);
        const iconCenter = activeIcon.left + activeIcon.width / 2;
        const tooltipCenter = parentTooltip.left + widthBeforeCurrent + activeTooltip.width / 2;
        let offset = iconCenter - tooltipCenter;

        // keep the revealed slice inside the nearest clipping container (sheet /
        // scroll region) so a wide tooltip near the edge shifts in instead of
        // clipping. measure from the tooltip container, not the icon — the icon
        // sits inside the pill's own `overflow-hidden`.
        const bounds = getHorizontalClipBounds(tooltipParentRef.current);
        const margin = 8;
        const halfWidth = activeTooltip.width / 2;
        const visibleLeft = iconCenter - halfWidth;
        const visibleRight = iconCenter + halfWidth;
        if (visibleRight > bounds.right - margin) {
          offset -= visibleRight - (bounds.right - margin);
        }
        if (visibleLeft < bounds.left + margin) {
          offset += bounds.left + margin - visibleLeft;
        }
        tooltipPosition.set(offset);
      }
    }

    calculateClipPath(index);
  }, [calculateClipPath, side, tooltipPosition]);

  const registerContent = React.useCallback((index: number, content: React.ReactNode) => {
    if (contentMapRef.current.get(index) === content) return;
    contentMapRef.current.set(index, content);
    itemsCountRef.current = contentMapRef.current.size;
    forceUpdate();
  }, []);

  const contentItems = Array.from(contentMapRef.current.entries()).sort(([a], [b]) => a - b);

  return (
    <TooltipContext.Provider
      value={{
        iconRefs,
        tooltipRefs,
        tooltipParentRef,
        tooltipPosition,
        clipPathStart,
        clipPathEnd,
        opacity,
        onMouseEnterOnIcon,
        onMouseLeave: () => opacity.set(0),
        setIconRef: (index, element) => {
          if (element) iconRefs.current[index] = element;
        },
        setTooltipRef: (index, element) => {
          if (element) tooltipRefs.current[index] = element;
        },
        registerContent,
        side,
        itemsCountRef,
      }}
    >
      <div className="relative text-light-space">
        <div
          ref={tooltipParentRef}
          className={cn(
            "pointer-events-none absolute z-50",
            side === "right" && "left-14 top-0",
            side === "left" && "right-14 top-0",
            side === "bottom" && "left-0 top-14",
            side === "top" && "bottom-14 left-0",
          )}
        >
          <motion.div
            className={cn(
              // surface (bg + 1px stroke + rounding) lives on each item slice, not here,
              // so the clip-path reveals a complete, fully-stroked pill on every side. if
              // the stroke lived on this outer container, the slice's cut edges (top/bottom
              // for a middle item, bottom for the top item, top for the bottom item) would
              // be bare strokeless cuts — the "clipped at the wrong sides" artifact.
              // only the drop shadow + blur ride here, alongside the slide + clip.
              "shadow-[var(--app-surface-shadow)] backdrop-blur-[20px]",
              (side === "left" || side === "right") && "flex flex-col",
              (side === "top" || side === "bottom") && "flex h-8 flex-row",
              className,
            )}
            style={
              side === "left" || side === "right"
                ? { opacity, y: tooltipPosition, clipPath: verticalClipPath }
                : { opacity, x: tooltipPosition, clipPath: horizontalClipPath }
            }
          >
            {contentItems.map(([originalIndex, content]) => (
              <div
                ref={(element) => {
                  if (element) tooltipRefs.current[originalIndex] = element;
                }}
                key={originalIndex}
                className={cn(
                  "z-[1] inline-flex items-center justify-center rounded-[10px] bg-dark-glass-80 shadow-[inset_0_0_0_1px_var(--color-light-glass-20)]",
                  (side === "left" || side === "right") && "h-8",
                  (side === "top" || side === "bottom") && "w-auto",
                )}
              >
                {content}
              </div>
            ))}
          </motion.div>
        </div>
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

function RightHandMenuItemRoot({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const { registerContent } = useTooltipContext();
  const previousContentRef = React.useRef<React.ReactNode>(null);

  React.useEffect(() => {
    let content: React.ReactNode = null;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === RightHandMenuTooltipContent) {
        content = (child.props as { children: React.ReactNode }).children;
      }
    });

    if (content && previousContentRef.current !== content) {
      previousContentRef.current = content;
      registerContent(index, content);
    }
  }, [children, index, registerContent]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === RightHandMenuTooltipTrigger) {
          return (
            <RightHandMenuTriggerWrapper index={index}>
              {(child.props as { children: React.ReactNode }).children}
            </RightHandMenuTriggerWrapper>
          );
        }
        return null;
      })}
    </>
  );
}

function RightHandMenuTriggerWrapper({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const { onMouseEnterOnIcon, onMouseLeave, setIconRef } = useTooltipContext();

  return (
    <div
      ref={(element) => setIconRef(index, element)}
      onMouseEnter={() => onMouseEnterOnIcon(index)}
      onMouseLeave={onMouseLeave}
      onFocus={() => onMouseEnterOnIcon(index)}
      onBlur={onMouseLeave}
      className="flex items-center justify-center"
    >
      {children}
    </div>
  );
}

function RightHandMenuTooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function RightHandMenuTooltipContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function MenuKeyword({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-5 items-center justify-center rounded-sm border border-light-glass-30 p-0.5 text-xs text-light-space">
      {children}
    </span>
  );
}

// the whole button drives the icon's hover, so animated (lordicon) icons play
// even when the pointer is over the padding rather than the glyph itself.
function RightHandMenuButton({ item }: { item: RightHandMenuItem }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={item.label}
      onClick={item.onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex size-10 items-center justify-center rounded-full p-1.5 text-light-space transition-colors hover:bg-light-glass-20 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-space"
    >
      <IconHoverContext.Provider value={hovered}>
        {item.icon}
      </IconHoverContext.Provider>
      {item.hasBadge && (
        <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full border-[1.7px] border-dark-solid bg-blue-4 text-xs text-light-solid group-hover:border-[var(--color-dark-glass-70)]">
          <span className="sr-only">{item.label}</span>
        </span>
      )}
    </button>
  );
}

export function RightHandMenu({
  items,
  side = "left",
  className,
}: RightHandMenuProps) {
  return (
    <RightHandMenuTooltipRoot
      side={side}
      className="rounded-[10px]"
    >
      <div
        data-slot="right-hand-menu"
        className={cn(
          "z-10 inline-flex items-center justify-center overflow-hidden rounded-full border border-light-glass-20 bg-dark-glass-80 p-1 text-light-space shadow-[var(--app-surface-shadow)] backdrop-blur-[20px]",
          (side === "left" || side === "right") && "flex-col",
          className,
        )}
      >
        {items.map((item, index) => (
          <RightHandMenuItemRoot key={item.id} index={index}>
            <RightHandMenuTooltipTrigger>
              <RightHandMenuButton item={item} />
            </RightHandMenuTooltipTrigger>
            <RightHandMenuTooltipContent>
              <div className="flex flex-col gap-0.5 px-2">
                <div className="flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium leading-tight tracking-normal text-light-space">
                  {item.label}
                  {item.keyword && (
                    <span className="flex items-center justify-center gap-1">
                      {item.keyword.map((keyword, keywordIndex) => (
                        <MenuKeyword key={keywordIndex}>{keyword}</MenuKeyword>
                      ))}
                    </span>
                  )}
                </div>
                {item.description && (
                  <div className="whitespace-nowrap font-sans text-xs font-normal leading-tight tracking-normal text-light-space/55">
                    {item.description}
                  </div>
                )}
              </div>
            </RightHandMenuTooltipContent>
          </RightHandMenuItemRoot>
        ))}
      </div>
    </RightHandMenuTooltipRoot>
  );
}

export const DEFAULT_RIGHT_HAND_MENU_ITEMS: RightHandMenuItem[] = [
  {
    id: "comment",
    icon: <Menu className="size-full" />,
    label: "comment",
    keyword: ["c"],
  },
  {
    id: "share",
    icon: <Menu className="size-full" />,
    label: "share",
  },
  {
    id: "menu",
    icon: <Menu className="size-full" />,
    label: "menu",
    keyword: [<Command className="size-2.5" key="cmd" />, "k"],
    hasBadge: true,
  },
];
