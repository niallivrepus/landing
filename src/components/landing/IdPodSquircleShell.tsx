/**
 * **Purpose:** True superellipse chrome for the marketing profile ID pod — matches app `IdPodSquircleShell` / `SquirclePodShape`.
 * **Connects to:** `ProfilePodPanel`, `ProfileHighlightVisual`, `SquircleShell` (`system/squircle.tsx`).
 * **Parity:** `frontend/src/components/pods/IdPodSquircleShell.tsx`, `pod-squircle-chrome.swift`.
 */

import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";
import { SquircleShell } from "../system/squircle";

/** Profile ID pod corner radius — parity web `ID_POD_SQUIRCLE_CORNER_RADIUS` / Swift `idPodSquircleCornerRadius`. */
export const ID_POD_SQUIRCLE_CORNER_RADIUS = 36;

type IdPodSquircleShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Carousel / highlight slides use a tighter radius at smaller scale. */
  cornerRadius?: number;
  /** When false, shell stretches to parent width (Today Brief previews). */
  profileWidth?: boolean;
};

/**
 * **Renders** frosted profile pod squircle with Gooey superellipse geometry (not CSS `border-radius`).
 */
export function IdPodSquircleShell({
  children,
  className,
  contentClassName,
  cornerRadius = ID_POD_SQUIRCLE_CORNER_RADIUS,
  profileWidth = true,
}: IdPodSquircleShellProps) {
  return (
    <SquircleShell
      cornerRadius={cornerRadius}
      cornerSmoothing={1}
      borderWidth={1}
      strokeColor="var(--id-pod-squircle-rim)"
      fillClassName={cn(
        "bg-[rgba(10,10,12,0.88)] backdrop-blur-[18px] backdrop-saturate-[145%]",
        "shadow-[0_20px_44px_rgba(0,0,0,0.34)]",
        "light:bg-white/96 light:shadow-[0_18px_40px_rgba(0,0,0,0.1)]",
      )}
      className={cn(profileWidth ? "w-full max-w-[470px] min-w-0" : "w-full min-w-0", className)}
      contentClassName={cn("box-border p-[22px]", contentClassName)}
    >
      {children}
    </SquircleShell>
  );
}
