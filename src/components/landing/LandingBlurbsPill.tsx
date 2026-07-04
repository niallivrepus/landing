import { GooeyGlass, cn } from "@jokuh/gooey";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { SiteLink } from "../SiteLink";

/** Matches `LandingNexusPill` — top/bottom center chrome uses the same glass footprint. */
const BLURBS_PILL_WIDTH = 132;
const BLURBS_PILL_HEIGHT = 42;

/**
 * **Purpose:** Bottom-center Blurbs affordance — glass pill with 🌈 (parity with Nexus at top).
 * **Connects to:** `ImmersiveAppChrome`, `BlurbsImmersiveShell`, `/blurbs`.
 */
export function LandingBlurbsPill({
  className,
  active = false,
}: {
  className?: string;
  /** When true, renders as the current-page marker (no navigation). */
  active?: boolean;
}) {
  const hoverSoundProps = useGentleHoverSound(true, "gentle");

  const inner = (
    <GooeyGlass
      className={cn("landing-blurbs-pill landing-gooey-shell", active && "landing-blurbs-pill--active")}
      contentClassName="relative z-0 flex size-full items-center justify-center"
      filterContent={false}
      lens={{
        width: BLURBS_PILL_WIDTH,
        height: BLURBS_PILL_HEIGHT,
        borderRadius: 999,
        scale: 14,
        depth: 1.3,
        curvature: 2.55,
        splay: 1,
        chroma: 0.16,
        glow: 0.2,
        edgeHighlight: 0.42,
      }}
      style={{
        width: BLURBS_PILL_WIDTH,
        height: BLURBS_PILL_HEIGHT,
        borderRadius: 999,
      }}
    >
      <span className="relative z-10 text-[22px] leading-none" aria-hidden>
        🌈
      </span>
    </GooeyGlass>
  );

  if (active) {
    return (
      <div
        className={cn("landing-blurbs-pill-link landing-blurbs-pill-link--active", className)}
        aria-label="Blurbs"
        aria-current="page"
        style={{ width: BLURBS_PILL_WIDTH, height: BLURBS_PILL_HEIGHT }}
        {...hoverSoundProps}
      >
        {inner}
      </div>
    );
  }

  return (
    <SiteLink
      href="/blurbs"
      aria-label="Blurbs"
      className={cn("landing-blurbs-pill-link", className)}
      style={{ width: BLURBS_PILL_WIDTH, height: BLURBS_PILL_HEIGHT }}
      {...hoverSoundProps}
    >
      {inner}
    </SiteLink>
  );
}
