import { Fireworks, type FireworksOptions } from "fireworks-js";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** **Purpose:** July 4 palette — red, gold, and white bursts tuned for dark cinema backgrounds. */
const FREEDOM_DAY_FIREWORKS_OPTIONS: FireworksOptions = {
  autoresize: true,
  opacity: 0.58,
  acceleration: 1.04,
  friction: 0.96,
  gravity: 1.32,
  particles: 44,
  traceLength: 3,
  flickering: 42,
  intensity: 24,
  traceSpeed: 11,
  explosion: 5,
  hue: { min: 0, max: 52 },
  delay: { min: 16, max: 32 },
  brightness: { min: 58, max: 88 },
  decay: { min: 0.014, max: 0.028 },
  lineWidth: {
    explosion: { min: 1, max: 2.5 },
    trace: { min: 1, max: 2 },
  },
  rocketsPoint: { min: 38, max: 62 },
  mouse: { click: false, move: false, max: 1 },
  sound: { enabled: false },
};

/**
 * **Purpose:** Full-viewport Independence Day fireworks behind immersive chrome and story content.
 * **Connects to:** `StoryAudioBlock`, `ImmersiveAppChrome` (z-index 30 above overlay at 15).
 */
export function FreedomDayFireworksOverlay({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<Fireworks | null>(null);

  useEffect(() => {
    if (active && !reduceMotion) {
      document.body.dataset.freedomDayFireworks = "active";
    } else {
      delete document.body.dataset.freedomDayFireworks;
    }

    return () => {
      delete document.body.dataset.freedomDayFireworks;
    };
  }, [active, reduceMotion]);

  useEffect(() => {
    if (!active || reduceMotion) {
      fireworksRef.current?.stop();
      fireworksRef.current = null;
      return undefined;
    }

    const host = canvasHostRef.current;
    if (!host) return undefined;

    const instance = new Fireworks(host, FREEDOM_DAY_FIREWORKS_OPTIONS);
    fireworksRef.current = instance;
    instance.start();

    return () => {
      instance.stop();
      fireworksRef.current = null;
    };
  }, [active, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="freedom-day-fireworks-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <div className="freedom-day-fireworks-overlay__scrim" />
          <div ref={canvasHostRef} className="freedom-day-fireworks-overlay__canvas" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
