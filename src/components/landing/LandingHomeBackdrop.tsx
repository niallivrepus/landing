import { LANDING_HOME_HERO_IMAGE } from "../../data/landing-hero-copy";

/**
 * **Purpose:** Full-viewport homepage hero photo with readability scrim behind headline + prompt.
 * **Connects to:** `LandingImmersiveShell`, `landing-hero-copy.ts`.
 */
export function LandingHomeBackdrop() {
  return (
    <>
      <img
        src={LANDING_HOME_HERO_IMAGE}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover object-[center_42%]"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/62 to-black/90 light:from-white/58 light:via-white/74 light:to-white/94"
        aria-hidden
      />
    </>
  );
}
