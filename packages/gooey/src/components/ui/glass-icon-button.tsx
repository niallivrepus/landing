import * as React from "react";

import { cn } from "../../lib/utils/cn";

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
        "flex items-center justify-center shrink-0 cursor-pointer p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background outline-none",
        className
      )}
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        background: "var(--color-light-glass-5)",
        border: "2px solid var(--color-light-glass-5)",
        backdropFilter: "blur(25px)",
        WebkitBackdropFilter: "blur(25px)",
        boxShadow:
          "0px 1px 4px rgba(0,0,0,0.1), inset 0px 2px 4px rgba(255,255,255,0.15)",
      }}
      {...props}
    >
      {children}
    </button>
  );
}
