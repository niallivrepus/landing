import { useEffect, useRef, type MouseEventHandler, type PointerEventHandler } from "react";
import type { LandingHoverSoundVariant } from "../lib/landing-sounds";
import {
  playLandingGentleHoverSfxFromGesture,
  playLandingPremiumHoverSfxFromGesture,
  playGentleHoverSfx,
  playPremiumHoverSfx,
  primeGentleHoverSfx,
} from "../lib/gentle-hover-sfx";
import { LANDING_SOUND_GLOBAL } from "../lib/landing-sounds";

/** Hook variant — `bubbly` is a legacy alias for `premium`. */
export type GentleHoverSoundVariant = LandingHoverSoundVariant | "bubbly";

function playVariant(variant: GentleHoverSoundVariant) {
  if (variant === "premium" || variant === "bubbly") {
    playPremiumHoverSfx();
    return;
  }
  playGentleHoverSfx();
}

/**
 * **Purpose:** Play from a trusted pointer gesture, queueing the first tick while AudioContext unlocks.
 * **Inputs:** Hook variant; **side effects:** may resume Web Audio and create a short SFX graph.
 */
function playVariantFromGesture(variant: GentleHoverSoundVariant) {
  if (variant === "premium" || variant === "bubbly") {
    playLandingPremiumHoverSfxFromGesture();
    return;
  }
  playLandingGentleHoverSfxFromGesture();
}

/**
 * **Purpose:** Attach Bond-tuned hover SFX to high-intent surfaces (mouse/pen only).
 * **Connects to:** `landing-sounds.ts`, `gentle-hover-sfx.ts`, CTA and chrome pills.
 *
 * Returns `onPointerEnter`, `onMouseEnter`, and `onPointerDown` — spread onto the
 * outermost hover target (link/button shell) so events reach the DOM node users touch.
 */
export function useGentleHoverSound(
  enabled = true,
  variant: GentleHoverSoundVariant = "gentle",
) {
  const localHoverAtRef = useRef(0);

  const triggerHoverSound = () => {
    if (!enabled) return;

    const now = performance.now();
    if (now - localHoverAtRef.current < LANDING_SOUND_GLOBAL.localCooldownMs) return;
    localHoverAtRef.current = now;
    playVariant(variant);
  };

  const onPointerDown: PointerEventHandler<HTMLElement> = () => {
    if (!enabled) return;
    playVariantFromGesture(variant);
  };

  const onPointerEnter: PointerEventHandler<HTMLElement> = (event) => {
    if (!enabled) return;
    if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    triggerHoverSound();
  };

  const onMouseEnter: MouseEventHandler<HTMLElement> = () => {
    triggerHoverSound();
  };

  useEffect(() => {
    if (!enabled) return;
    primeGentleHoverSfx();
  }, [enabled]);

  return {
    onMouseEnter,
    onPointerEnter,
    onPointerDown,
  };
}
