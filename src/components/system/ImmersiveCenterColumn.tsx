import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";

/**
 * **Purpose:** Horizontally centers immersive product content on the viewport.
 * The library rail is contained to the hero overlay — content must not use left padding offset.
 * **Connects to:** all `*ImmersiveShell` pages, `LandingImmersiveShell`, `LandingDemoShell`.
 */
export function ImmersiveCenterColumn({
  children,
  maxWidthClass = "max-w-[520px]",
  className,
}: {
  children: ReactNode;
  /** Tailwind max-width class for the column (e.g. `max-w-[420px]` for Spine). */
  maxWidthClass?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "immersive-center-column relative z-10 mx-auto flex w-full flex-col items-center justify-center px-4",
        "min-h-[100svh] pb-[calc(env(safe-area-inset-bottom,0px)+96px)] pt-[calc(env(safe-area-inset-top,0px)+80px)]",
        maxWidthClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
