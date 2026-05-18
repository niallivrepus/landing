import * as React from "react";
import { cn } from "../../lib/utils";

export interface Joki {
  id: string;
  icon: React.ReactNode; // Emoji or Avatar
}

export interface MenuContextOptionData {
  id: string;
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "destructive" | "component";
  onSelect?: () => void;
}

export interface MenuContextProps extends React.HTMLAttributes<HTMLDivElement> {
  jokis?: Joki[];
  options: MenuContextOptionData[];
}

/**
 * Menu Context Option - Atomic design component
 * Shows individual option with hover state
 */
export const MenuContextOption = React.forwardRef<
  HTMLButtonElement,
  MenuContextOptionData & {
    isHovered?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>(({ id, icon, label, variant = "default", isHovered = false, onSelect, onMouseEnter, onMouseLeave, ...props }, ref) => {
  const isDestructive = variant === "destructive";
  const isComponent = variant === "component";

  const getBackgroundColor = () => {
    if (isDestructive) return "var(--color-red-1)";
    if (isComponent) return "var(--color-purple-1)";
    if (isHovered) return "var(--color-dark-glass-30%)";
    return "transparent";
  };

  const getTextColor = () => {
    if (isDestructive) return "var(--color-red-4)";
    if (isComponent) return "var(--color-purple-5)";
    if (isHovered) return "var(--color-light-space)";
    return "var(--color-smoke-4)";
  };

  return (
    <button
      ref={ref}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex gap-1.5 h-8 items-center px-1.5 pr-5 py-1 rounded-full shrink-0 w-full transition-colors hover:cursor-pointer focus:outline-none"
      style={{
        backgroundColor: getBackgroundColor(),
      }}
      data-variant={variant}
      data-node-id="2934:4205"
      {...props}
    >
      {/* Icon */}
      <div
        className="overflow-clip relative shrink-0 size-3.5 flex items-center justify-center"
        style={{
          fontSize: "14px",
          lineHeight: "1",
          color: isDestructive ? "var(--color-red-4)" : isComponent ? "var(--color-purple-5)" : "var(--color-smoke-4)",
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <p
        className="font-satoshi text-xs font-normal leading-normal not-italic relative shrink-0 flex-1 text-left"
        style={{
          fontSize: "14px",
          color: getTextColor(),
        }}
      >
        {label}
      </p>
    </button>
  );
});

MenuContextOption.displayName = "MenuContextOption";

/**
 * Menu Context Component
 *
 * Displays a context menu with:
 * - Horizontal scrollable jokies section at top (max 5 visible)
 * - Menu options with icons and labels (max 6 items)
 * - Hover states with dark-glass-30% background
 * - Support for destructive actions (red styling)
 *
 * Atomic design: Uses MenuContextOption for individual items
 *
 * @example
 * <MenuContext
 *   jokies={reactions}
 *   options={menuOptions}
 * />
 */
export const MenuContext = React.forwardRef<HTMLDivElement, MenuContextProps>(
  ({ jokis = [], options, className, style, ...props }, ref) => {
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col rounded-2xl backdrop-blur-[25px]", className)}
        style={{
          width: "177px",
          backgroundColor: "var(--color-light-glass-5)",
          border: "2px solid var(--color-light-glass-20)",
          padding: "8px",
          gap: "4px",
          // Light Big effect: inset shadow
          boxShadow:
            "inset 0 2px 2px 0 rgba(255, 255, 255, 0.15), 0px 10px 20px 0px rgba(0, 0, 0, 0.1)",
          // Force GPU layer for immediate backdrop-blur rendering
          willChange: "backdrop-filter",
          transform: "translateZ(0)",
          ...style,
        }}
        data-slot="menu-context"
        data-node-id="2934:4223"
        {...props}
      >
        {/* Jokis Section - Horizontal scrollable (up to 21 most recent) */}
        {jokis.length > 0 && (
          <div
            className="overflow-x-auto overflow-y-hidden py-1 flex-shrink-0"
            style={{
              backgroundColor: "var(--color-smoke-1)",
              borderRadius: "9999px",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              // Ensure proper clipping of joki icons
              clip: "rect(0, auto, auto, 0)",
              clipPath: "inset(0 0 0 0 round 9999px)",
            }}
          >
            <div
              className="flex gap-2 h-8 items-center px-1.5"
              style={{
                // Display up to 21 most recent jokis
                // Most recent is at top-left (index 0)
                minWidth: "fit-content",
              }}
            >
              {jokis.slice(0, 21).map((joki) => (
                <div
                  key={joki.id}
                  className="flex items-center justify-center shrink-0 size-4"
                  style={{
                    fontSize: "14px",
                    lineHeight: "1",
                  }}
                >
                  {joki.icon}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Options Container - scrollable if more than 6 items */}
        <div
          className="flex flex-col gap-1 overflow-y-auto flex-1"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {options.map((option) => {
            const isHovered = hoveredId === option.id;

            return (
              <MenuContextOption
                key={option.id}
                {...option}
                isHovered={isHovered}
                onMouseEnter={() => setHoveredId(option.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

MenuContext.displayName = "MenuContext";

export { MenuContext as default };
