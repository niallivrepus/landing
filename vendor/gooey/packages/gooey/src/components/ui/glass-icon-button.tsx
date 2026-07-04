import * as React from "react";

import { cn } from "../../lib/utils/cn";
import { GooeyGlass } from "./gooey-glass";

export interface GlassIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GlassIconButton({
  children,
  className,
  ...props
}: GlassIconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex items-center justify-center shrink-0 cursor-pointer overflow-hidden p-0 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
        className
      )}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: "var(--color-light-glass-10)",
        border: "1px solid var(--color-light-glass-20)",
        boxShadow: "0px 1px 4px rgba(0,0,0,0.16), inset 0 1px 1px rgba(255,255,255,0.32)",
      }}
      {...props}
    >
      <GooeyGlass
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[6px]"
        lens={{ width: 24, height: 24, borderRadius: 6, scale: 8, depth: 1.05, curvature: 2.35, chroma: 0.14, glow: 0.18, edgeHighlight: 0.38 }}
      >
        <span className="block size-full rounded-[6px] bg-[var(--color-light-glass-10)]" />
      </GooeyGlass>
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
}
