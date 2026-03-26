import { useEffect, useRef, type MouseEventHandler, type PointerEventHandler } from "react";
import { playGentleHoverSfx, primeGentleHoverSfx } from "../lib/gentle-hover-sfx";

export function useGentleHoverSound(enabled = true) {
  const localHoverAtRef = useRef(0);

  const triggerHoverSound = () => {
    if (!enabled) return;

    const now = performance.now();
    if (now - localHoverAtRef.current < 220) return;
    localHoverAtRef.current = now;
    playGentleHoverSfx();
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
  };
}
