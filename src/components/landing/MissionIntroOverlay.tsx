import { Avatar } from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  LANDING_MISSION_INTRO_FADE_MS,
  LANDING_MISSION_INTRO_HOLD_MS,
  LANDING_MISSION_INTRO_LINES,
  LANDING_MISSION_INTRO_LOCK_LINE,
  LANDING_MISSION_OO_AVATAR_AT,
  LANDING_MISSION_OO_LINE_INDEX,
  LANDING_MISSION_STATEMENT,
} from "../../data/landing-mission-intro";
import { useScrambleReveal } from "../../hooks/useScrambleReveal";
import { markMissionIntroSeen, resolveMissionIntroForce } from "../../lib/mission-intro-storage";
import { LandingHomeBackdrop } from "./LandingHomeBackdrop";

type MissionIntroOverlayProps = {
  /** Fires once the overlay has fully faded out and the home hero should take over. */
  onComplete: () => void;
};

/**
 * **Purpose:** Full-viewport mission intro — same Satoshi semibold as the home headline,
 * left-aligned over the landing hero photo, soft scramble, then fade into the hero.
 * The `00` mention unlocks an inline OO avatar beside the digits.
 * Plays on every homepage visit (`?intro=0` skips, `?intro=1` forces).
 * **Connects to:** `LandingImmersiveShell`, `LandingHomeBackdrop`, Gooey `Avatar`, `useScrambleReveal`.
 */
export function MissionIntroOverlay({ onComplete }: MissionIntroOverlayProps) {
  const [shouldPlay] = useState(() => {
    const force = resolveMissionIntroForce();
    if (force === "skip") return false;
    return true;
  });

  const [open, setOpen] = useState(shouldPlay);
  const [dismissed, setDismissed] = useState(false);

  const { lines, phase, reduceMotion } = useScrambleReveal(LANDING_MISSION_INTRO_LINES, {
    enabled: shouldPlay && open,
    stepMs: 38,
    shimmerWindow: 3,
  });

  const dismiss = useCallback(() => {
    if (dismissed) return;
    setDismissed(true);
    markMissionIntroSeen();
    setOpen(false);
  }, [dismissed]);

  useEffect(() => {
    if (!shouldPlay || !open || phase !== "complete" || dismissed) return;
    const hold = reduceMotion ? 500 : LANDING_MISSION_INTRO_HOLD_MS;
    const id = window.setTimeout(() => dismiss(), hold);
    return () => window.clearTimeout(id);
  }, [dismiss, dismissed, open, phase, reduceMotion, shouldPlay]);

  useEffect(() => {
    if (!shouldPlay) onComplete();
  }, [onComplete, shouldPlay]);

  useEffect(() => {
    if (!open || !shouldPlay) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss, open, shouldPlay]);

  if (!shouldPlay) return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {open ? (
        <motion.div
          key="mission-intro"
          className="landing-mission-intro"
          role="dialog"
          aria-modal="true"
          aria-label="Jokuh mission"
          aria-describedby="landing-mission-intro-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: LANDING_MISSION_INTRO_FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
          onClick={dismiss}
        >
          <div className="landing-mission-intro__backdrop" aria-hidden="true">
            <LandingHomeBackdrop />
          </div>
          <p id="landing-mission-intro-text" className="sr-only">
            {LANDING_MISSION_STATEMENT}
          </p>
          <motion.div
            className="landing-mission-intro__stage"
            aria-hidden="true"
            initial={{ opacity: 0.85, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {lines.map((cells, index) => {
              const ooLocked =
                index === LANDING_MISSION_OO_LINE_INDEX &&
                cells[LANDING_MISSION_OO_AVATAR_AT - 1]?.state === "locked";

              return (
                <p
                  key={LANDING_MISSION_INTRO_LINES[index]}
                  className={
                    index === LANDING_MISSION_INTRO_LOCK_LINE
                      ? "landing-mission-intro__line landing-mission-intro__line--lock"
                      : "landing-mission-intro__line"
                  }
                >
                  {cells.map((cell, cellIndex) => (
                    <Fragment key={`${index}-${cellIndex}`}>
                      <span
                        className={`landing-mission-intro__glyph landing-mission-intro__glyph--${cell.state}`}
                      >
                        {cell.display}
                      </span>
                      {index === LANDING_MISSION_OO_LINE_INDEX &&
                      cellIndex === LANDING_MISSION_OO_AVATAR_AT - 1 ? (
                        <span
                          className={
                            ooLocked
                              ? "landing-mission-intro__oo landing-mission-intro__oo--visible"
                              : "landing-mission-intro__oo"
                          }
                        >
                          <Avatar
                            showOO
                            originColor="aether"
                            size="mini"
                            borderStyle="origins"
                            disableNavigation
                            className="landing-mission-intro__oo-avatar"
                          />
                        </span>
                      ) : null}
                    </Fragment>
                  ))}
                </p>
              );
            })}
          </motion.div>
          <p className="landing-mission-intro__hint">Continue</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
