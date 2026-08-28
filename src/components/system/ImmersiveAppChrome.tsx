import {
  ActionButton,
  LordiconIcon,
  actionLordicons,
  cn,
} from "@jokuh/gooey";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { LandingLibraryRail } from "../landing/LandingLibraryRail";
import { LandingNexusPill } from "../landing/LandingNexusPill";
import {
  LANDING_CORNER_ACTIONS,
  type LandingCornerAction,
  type LandingCornerConfig,
  type LandingCornerSlot,
} from "../../data/landing-shell-preview";

const SCREEN_CORNER_INSET = "max(12px, env(safe-area-inset-left, 12px))";

export type ImmersiveAppChromeProps = {
  /** Highlight the pill for the current product route. */
  activeAction?: LandingCornerAction;
  /** fixed viewport overlay (default) or relative in-flow. */
  mode?: "fixed" | "relative" | "contained";
  /** Show the animated left library rail on desktop (default true). */
  showLibraryRail?: boolean;
  /** Optional bottom-center chrome (e.g. Blurbs 🌈 pill). */
  bottomCenter?: ReactNode;
  /** Replaces the default top-leading corner pill (e.g. back button on `/invest`). */
  topLeadingSlot?: ReactNode;
  className?: string;
  zIndex?: number;
};

/**
 * **Purpose:** Persistent four-corner `ActionButton` chrome + Nexus logo on immersive heroes.
 * Default `contained` is `absolute inset-0` so the library rail stays inside the hero and
 * does not overlay marketing sections or the footer while the page scrolls.
 * **Connects to:** `landing-shell-preview.ts`, product immersive shells, `LandingImmersiveShell`.
 */
export function ImmersiveAppChrome({
  activeAction,
  mode = "contained",
  showLibraryRail = true,
  bottomCenter,
  topLeadingSlot,
  className,
  zIndex = 30,
}: ImmersiveAppChromeProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const cornerHoverSound = useGentleHoverSound(true, "gentle");

  const positionClass = (slot: LandingCornerSlot) => {
    switch (slot) {
      case "topLeading":
        return "left-3 top-3";
      case "topTrailing":
        return "right-3 top-3";
      case "bottomLeading":
        return "left-3 bottom-3";
      case "bottomTrailing":
        return "right-3 bottom-3";
    }
  };

  const pinToOverlay = mode !== "relative";

  const overlayPosition =
    mode === "fixed"
      ? "pointer-events-none fixed inset-0"
      : mode === "relative"
        ? "pointer-events-none relative min-h-0"
        : "pointer-events-none absolute inset-0";

  return (
    <div
      className={cn(overlayPosition, className)}
      style={{ zIndex }}
      aria-hidden={false}
    >
      <header
        className={cn(
          "pointer-events-none flex justify-center",
          pinToOverlay
            ? "absolute inset-x-0 top-0 pt-[calc(env(safe-area-inset-top,0px)+14px)]"
            : "pt-[calc(env(safe-area-inset-top,0px)+14px)]",
        )}
      >
        <div className="pointer-events-auto">
          <LandingNexusPill />
        </div>
      </header>

      {bottomCenter ? (
        <footer
          className={cn(
            "pointer-events-none flex justify-center",
            pinToOverlay
              ? "absolute inset-x-0 bottom-0 pb-[calc(env(safe-area-inset-bottom,0px)+14px)]"
              : "pb-[calc(env(safe-area-inset-bottom,0px)+14px)]",
          )}
        >
          <div className="pointer-events-auto">{bottomCenter}</div>
        </footer>
      ) : null}

      {showLibraryRail && pinToOverlay ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto absolute left-[18px] top-1/2 z-20 hidden -translate-y-1/2 md:block"
          style={{
            height:
              mode === "fixed"
                ? "calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 96px)"
                : "calc(100% - 96px)",
            maxHeight:
              mode === "fixed"
                ? "calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 96px)"
                : "calc(100% - 96px)",
          }}
        >
          <LandingLibraryRail className="h-full" />
        </motion.div>
      ) : null}

      {topLeadingSlot}

      {LANDING_CORNER_ACTIONS.filter(
        (corner) => !(topLeadingSlot && corner.slot === "topLeading"),
      ).map((corner: LandingCornerConfig) => {
        const icons = actionLordicons[corner.lordicon];
        const isActive = activeAction === corner.action;

        return (
          <div
            key={corner.slot}
            className={cn("group pointer-events-auto absolute", positionClass(corner.slot))}
            {...cornerHoverSound}
            style={{
              paddingTop: corner.slot.startsWith("top")
                ? "env(safe-area-inset-top, 0px)"
                : undefined,
              paddingBottom: corner.slot.startsWith("bottom")
                ? "env(safe-area-inset-bottom, 0px)"
                : undefined,
              marginLeft: corner.slot.endsWith("Leading") ? SCREEN_CORNER_INSET : undefined,
              marginRight: corner.slot.endsWith("Trailing") ? SCREEN_CORNER_INSET : undefined,
            }}
          >
            <ActionButton
              aria-label={`${corner.label} — ${corner.action}`}
              aria-current={isActive ? "page" : undefined}
              orientation={corner.orientation}
              notification={isActive ? { color: "green" } : undefined}
              icon={
                <LordiconIcon
                  animationData={isActive ? icons.filled : icons.outline}
                  hoverAnimationData={icons.filled}
                  size={20}
                />
              }
              onClick={() => navigate(corner.href)}
            />
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] transition-opacity",
                isActive
                  ? "text-light-space/70 opacity-100 light:text-zinc-600"
                  : "text-light-space/40 opacity-0 group-hover:opacity-100 light:text-zinc-500",
              )}
            >
              {corner.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
