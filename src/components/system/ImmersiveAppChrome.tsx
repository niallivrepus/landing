import {
  ActionButton,
  LordiconIcon,
  actionLordicons,
  cn,
} from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
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
  /**
   * Light a corner in its app energy colour (tinted fill, glowing rim, filled icon, one pulse on arrival) to show
   * where a focused product lives — the console home tile row drives this. `null` clears it with a ~200ms fade.
   */
  highlightAction?: LandingCornerAction | null;
  /** Same glow on the Nexus pill (OO has no corner; the Nexus is its home). */
  highlightNexus?: boolean;
  /** fixed viewport overlay (default) or relative in-flow. */
  mode?: "fixed" | "relative" | "contained";
  /** Show the animated left library rail on desktop (default true). */
  showLibraryRail?: boolean;
  /** Optional bottom-center chrome (e.g. Blurbs 🌈 pill). */
  bottomCenter?: ReactNode;
  /** Replaces the default top-leading corner pill (e.g. back button on `/invest`). */
  topLeadingSlot?: ReactNode;
  /** Optional node stacked under the Nexus pill in the top header (e.g. home shipped ticker). */
  topCenterBelow?: ReactNode;
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
  highlightAction = null,
  highlightNexus = false,
  mode = "contained",
  showLibraryRail = true,
  bottomCenter,
  topLeadingSlot,
  topCenterBelow,
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
          "pointer-events-none flex flex-col items-center gap-2",
          pinToOverlay
            ? "absolute inset-x-0 top-0 pt-[calc(env(safe-area-inset-top,0px)+14px)]"
            : "pt-[calc(env(safe-area-inset-top,0px)+14px)]",
        )}
      >
        <div className="pointer-events-auto relative">
          <AnimatePresence>
            {highlightNexus ? (
              <EnergyGlow
                key="nexus"
                shape="nexus"
                energy={NEXUS_ENERGY}
                reduceMotion={Boolean(reduceMotion)}
              />
            ) : null}
          </AnimatePresence>
          <LandingNexusPill />
        </div>
        {topCenterBelow ? <div className="pointer-events-auto">{topCenterBelow}</div> : null}
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
        const isHighlighted = highlightAction === corner.action;

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
            <span className="relative block size-[50px]">
            <AnimatePresence>
              {isHighlighted ? (
                <EnergyGlow
                  key={corner.action}
                  shape={corner.orientation}
                  energy={corner.energy}
                  reduceMotion={Boolean(reduceMotion)}
                />
              ) : null}
            </AnimatePresence>
            <ActionButton
              aria-label={`${corner.label} — ${corner.action}`}
              aria-current={isActive ? "page" : undefined}
              orientation={corner.orientation}
              notification={isActive ? { color: "green" } : undefined}
              icon={
                <LordiconIcon
                  animationData={isActive || isHighlighted ? icons.filled : icons.outline}
                  hoverAnimationData={icons.filled}
                  size={20}
                />
              }
              onClick={() => navigate(corner.href)}
            />
            </span>
            <span
              className={cn(
                "pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] transition-[opacity,color] duration-200",
                isActive
                  ? "text-light-space/70 opacity-100 light:text-zinc-600"
                  : isHighlighted
                    ? "opacity-100"
                    : "text-light-space/40 opacity-0 group-hover:opacity-100 light:text-zinc-500",
              )}
              style={isHighlighted && !isActive ? { color: corner.energy } : undefined}
            >
              {corner.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** OO's Nexus glow — the aether violet of the OO orb. */
const NEXUS_ENERGY = "#8c73ff";

/**
 * **Purpose:** Energy glow painted behind a corner `ActionButton` (or the Nexus pill): a tinted pill matching the
 * button's rotated inner pill, a glowing rim, and one soft pulse ring when it arrives. Springs in, fades out in
 * ~200ms. Reduced motion: tint only (no pulse, no scale).
 * **Connects to:** `ImmersiveAppChrome` (`highlightAction` / `highlightNexus`), `landing-shell-preview.ts` `energy`,
 * `.landing-energy-glow*` in `landing-controls.css`.
 */
function EnergyGlow({
  shape,
  energy,
  reduceMotion,
}: {
  shape: "left" | "right" | "nexus";
  energy: string;
  reduceMotion: boolean;
}) {
  const style = { "--energy": energy } as CSSProperties;
  return (
    <motion.span
      aria-hidden
      className="landing-energy-glow"
      data-shape={shape}
      style={style}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
      transition={reduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 520, damping: 30, mass: 0.7 }}
    >
      <span className="landing-energy-glow__pill" />
      {reduceMotion ? null : (
        <motion.span
          className="landing-energy-glow__pulse"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </motion.span>
  );
}
