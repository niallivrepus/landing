import { GooeyGlass, NexusLogo, cn } from "@jokuh/gooey";
import { Home } from "lucide-react";
import { SiteLink } from "../SiteLink";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";

/** App parity: `NexusHomeIsland` center standard width × pill height. */
const NEXUS_PILL_WIDTH = 132;
const NEXUS_PILL_HEIGHT = 42;

/**
 * **Purpose:** Brand logo at rest; house glyph on fine-pointer hover (`NexusHomeCenterIdleMark` parity).
 * **Connects to:** `LandingNexusPill`, `frontend/src/styles/glass.css` `.nexus-home-center-mark`.
 */
function LandingNexusCenterMark() {
  return (
    <span className="landing-nexus-pill__mark" aria-hidden>
      <span className="landing-nexus-pill__mark-layer landing-nexus-pill__mark-layer--logo">
        <NexusLogo height={13} className="text-[var(--color-light-space)] opacity-90 light:text-zinc-950 light:opacity-95" />
      </span>
      <span className="landing-nexus-pill__mark-layer landing-nexus-pill__mark-layer--house">
        <Home size={18} strokeWidth={2.25} className="text-light-space light:text-zinc-950" />
      </span>
    </span>
  );
}

/**
 * **Purpose:** Marketing Nexus center pill — links home, glass hover, logo→house swap on desktop hover.
 * **Connects to:** `ImmersiveAppChrome`, `NexusHomeIsland` / `DynamicIslandGlassSurface` in Gooey.
 */
export function LandingNexusPill({ className }: { className?: string }) {
  const hoverSoundProps = useGentleHoverSound(true, "gentle");

  return (
    <SiteLink
      href="/"
      aria-label="Jokuh home"
      className={cn("group landing-nexus-pill-link", className)}
      style={{ width: NEXUS_PILL_WIDTH, height: NEXUS_PILL_HEIGHT }}
      {...hoverSoundProps}
    >
      <GooeyGlass
        className="landing-nexus-pill landing-gooey-shell"
        contentClassName="relative z-0 flex size-full items-center justify-center"
        filterContent={false}
        lens={{
          width: NEXUS_PILL_WIDTH,
          height: NEXUS_PILL_HEIGHT,
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
          width: NEXUS_PILL_WIDTH,
          height: NEXUS_PILL_HEIGHT,
          borderRadius: 999,
        }}
      >
        <span className="relative z-10 flex size-full items-center justify-center">
          <LandingNexusCenterMark />
        </span>
      </GooeyGlass>
    </SiteLink>
  );
}
