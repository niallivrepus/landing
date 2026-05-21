import * as React from "react";

import { useTheme } from "../../hooks/use-theme";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "conversation" | "avatar" | "text";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const { isDarkMode } = useTheme();

    const variantStyles = {
      default: "rounded-md bg-black/5 dark:bg-white/5",
      conversation: "rounded-full shrink-0",
      avatar: "rounded-full shrink-0",
      text: "rounded",
    };

    const variantSizes = {
      default: "",
      conversation: "w-full py-3 px-2 pr-3 flex items-center gap-3",
      avatar: "",
      text: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          variantSizes[variant],
          "animate-skeleton-pulse",
          className
        )}
        style={
          variant === "avatar"
            ? {
                width: 42,
                height: 42,
                background: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              }
            : variant === "text"
              ? {
                  background: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                }
              : undefined
        }
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

export function ConversationSkeleton({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={cn("w-full py-3 px-2 pr-3 flex items-center gap-3", className)}
      style={{
        opacity: Math.max(0.15, 1 - (index - 1) * 0.12),
      }}
    >
      <Skeleton variant="avatar" />
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <Skeleton
          variant="text"
          style={{
            width: [90, 120, 100, 80, 110, 95, 130, 85][index - 1] || 100,
            height: 14,
          }}
        />
        <Skeleton
          variant="text"
          className="rounded-r-2xl rounded-tl rounded-bl-2xl"
          style={{
            width: [180, 160, 200, 150, 190, 170, 140, 185][index - 1] || 180,
            maxWidth: "100%",
            height: 32,
            background: isDarkMode ? "#0a0a0a" : "#f0f0f0",
            border: isDarkMode
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.08)",
          }}
        />
      </div>
    </div>
  );
}

export { Skeleton };
