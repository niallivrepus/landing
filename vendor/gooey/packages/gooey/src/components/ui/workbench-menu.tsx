import * as React from "react";

import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useSpring,
} from "motion/react";

import { cn } from "../../lib/utils/cn";

export type WorkbenchTooltipSide = "top" | "bottom";

export interface WorkbenchMenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  keyword?: React.ReactNode[];
  hasBadge?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export interface WorkbenchMenuProps {
  items: WorkbenchMenuItem[];
  tooltipSide?: WorkbenchTooltipSide;
  className?: string;
  tooltipClassName?: string;
  itemClassName?: string;
}

const SPRING = {
  type: "spring",
  stiffness: 360,
  damping: 30,
  mass: 0.78,
} as const;

function WorkbenchKeyword({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex size-5 items-center justify-center rounded-sm border border-light-glass-30 p-0.5 text-xs text-light-space">
      {children}
    </span>
  );
}

function WorkbenchTooltip({
  items,
  side,
  tooltipRefs,
  tooltipParentRef,
  opacity,
  tooltipPosition,
  clipPathLeft,
  clipPathRight,
  className,
}: {
  items: WorkbenchMenuItem[];
  side: WorkbenchTooltipSide;
  tooltipRefs: React.MutableRefObject<HTMLDivElement[]>;
  tooltipParentRef: React.MutableRefObject<HTMLDivElement | null>;
  opacity: MotionValue<number>;
  tooltipPosition: MotionValue<number>;
  clipPathLeft: MotionValue<number>;
  clipPathRight: MotionValue<number>;
  className?: string;
}) {
  const clipPath = useMotionTemplate`inset(0 ${clipPathRight}% 0 ${clipPathLeft}% round 10px)`;

  return (
    <div
      ref={tooltipParentRef}
      className={cn(
        "pointer-events-none absolute left-0 z-30",
        side === "top" ? "bottom-14" : "top-14",
      )}
    >
      <motion.div
        className={cn(
          "flex h-8 flex-row rounded-[10px] border border-light-glass-20 bg-dark-glass-80 text-light-space shadow-[var(--app-surface-shadow)] backdrop-blur-[20px]",
          className,
        )}
        style={{ opacity, x: tooltipPosition, clipPath }}
      >
        {items.map((item, index) => (
          <div
            ref={(element) => {
              if (element) tooltipRefs.current[index] = element;
            }}
            key={item.id}
            className="z-[1] inline-flex h-8 items-center justify-center"
          >
            <div className="flex items-center justify-center gap-2 whitespace-nowrap px-2 font-sans text-sm font-medium leading-tight tracking-normal text-light-space">
              {item.label}
              {item.keyword && (
                <span className="flex items-center justify-center gap-1">
                  {item.keyword.map((keyword, keywordIndex) => (
                    <WorkbenchKeyword key={keywordIndex}>{keyword}</WorkbenchKeyword>
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function WorkbenchMenu({
  items,
  tooltipSide = "top",
  className,
  tooltipClassName,
  itemClassName,
}: WorkbenchMenuProps) {
  const iconRefs = React.useRef<HTMLButtonElement[]>([]);
  const tooltipRefs = React.useRef<HTMLDivElement[]>([]);
  const tooltipParentRef = React.useRef<HTMLDivElement>(null);

  const tooltipPosition = useSpring(0, { stiffness: 350, damping: 30 });
  const clipPathLeft = useSpring(0, SPRING);
  const clipPathRight = useSpring(0, SPRING);
  const opacity = useSpring(0, SPRING);

  const calculateClipPath = React.useCallback((index: number | null) => {
    if (index === null) {
      clipPathLeft.set(0);
      clipPathRight.set(0);
      opacity.set(0);
      return;
    }

    const totalWidth = tooltipRefs.current.reduce(
      (sum, element) => sum + (element?.getBoundingClientRect().width || 0),
      0,
    );
    const leftWidth = tooltipRefs.current
      .slice(0, index)
      .reduce((sum, element) => sum + (element?.getBoundingClientRect().width || 0), 0);
    const rightWidth = tooltipRefs.current
      .slice(index + 1, items.length)
      .reduce((sum, element) => sum + (element?.getBoundingClientRect().width || 0), 0);

    clipPathLeft.set(totalWidth > 0 ? (leftWidth / totalWidth) * 100 : 0);
    clipPathRight.set(totalWidth > 0 ? (rightWidth / totalWidth) * 100 : 0);
    opacity.set(1);
  }, [clipPathLeft, clipPathRight, items.length, opacity]);

  const showTooltip = React.useCallback((index: number) => {
    const activeIcon = iconRefs.current[index]?.getBoundingClientRect();
    const activeTooltip = tooltipRefs.current[index]?.getBoundingClientRect();
    const parentTooltip = tooltipParentRef.current?.getBoundingClientRect();

    if (activeIcon && activeTooltip && parentTooltip) {
      const widthBeforeCurrent = tooltipRefs.current
        .slice(0, index)
        .reduce((sum, element) => sum + (element?.getBoundingClientRect().width || 0), 0);
      const iconCenter = activeIcon.left + activeIcon.width / 2;
      const tooltipCenter = parentTooltip.left + widthBeforeCurrent + activeTooltip.width / 2;

      tooltipPosition.set(iconCenter - tooltipCenter);
    }

    calculateClipPath(index);
  }, [calculateClipPath, tooltipPosition]);

  const hideTooltip = React.useCallback(() => {
    opacity.set(0);
  }, [opacity]);

  return (
    <div className="relative text-light-space">
      <WorkbenchTooltip
        items={items}
        side={tooltipSide}
        tooltipRefs={tooltipRefs}
        tooltipParentRef={tooltipParentRef}
        opacity={opacity}
        tooltipPosition={tooltipPosition}
        clipPathLeft={clipPathLeft}
        clipPathRight={clipPathRight}
        className={tooltipClassName}
      />
      <div
        data-slot="workbench-menu"
        className={cn(
          "z-10 inline-flex items-center justify-center overflow-hidden rounded-full border border-light-glass-20 bg-dark-glass-80 p-1 text-light-space shadow-[var(--app-surface-shadow)] backdrop-blur-[20px]",
          className,
        )}
      >
        {items.map((item, index) => (
          <button
            ref={(element) => {
              if (element) iconRefs.current[index] = element;
            }}
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-pressed={item.selected}
            onClick={item.onSelect}
            onMouseEnter={() => showTooltip(index)}
            onMouseLeave={hideTooltip}
            onFocus={() => showTooltip(index)}
            onBlur={hideTooltip}
            className={cn(
              "group relative flex size-8 items-center justify-center rounded-full p-1.5 text-light-space transition-colors hover:bg-light-glass-20 active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-space",
              item.selected && "bg-light-glass-20 text-light-space",
              itemClassName,
            )}
          >
            {item.icon}
            {item.hasBadge && (
              <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full border-[1.7px] border-dark-solid bg-blue-4 text-xs text-light-solid group-hover:border-[var(--color-dark-glass-70)]">
                <span className="sr-only">{item.label}</span>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
