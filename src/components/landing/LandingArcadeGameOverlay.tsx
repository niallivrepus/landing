import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { LandingArcadeGameId } from "../../data/landing-arcade-games";
import { LANDING_ARCADE_GAMES } from "../../data/landing-arcade-games";

/**
 * **Purpose:** Wide center sheet for arcade demos — keeps Nexus, corner pills, and library rail visible.
 * **Connects to:** `LandingHomeSuggestionPills`, `ImmersiveAppChrome` (z-index 30 above sheet).
 */
export function LandingArcadeGameOverlay({
  open,
  gameId,
  onClose,
}: {
  open: boolean;
  gameId: LandingArcadeGameId | null;
  onClose: () => void;
}) {
  const game = gameId ? LANDING_ARCADE_GAMES[gameId] : null;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && game ? (
        <motion.div
          className="landing-arcade-sheet-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          role="presentation"
        >
          <button
            type="button"
            className="landing-arcade-sheet-overlay__backdrop"
            aria-label={`Close ${game.title}`}
            onClick={onClose}
          />

          <motion.div
            className="landing-arcade-sheet-overlay__host"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={game.title}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div className="landing-arcade-sheet">
              <div className="landing-arcade-sheet__header">
                <p className="landing-arcade-sheet__title">{game.title}</p>
                <button type="button" className="landing-arcade-sheet__close" onClick={onClose}>
                  Close
                </button>
              </div>

              <div className="landing-arcade-sheet__body">
                <iframe
                  key={game.src}
                  src={game.src}
                  title={game.title}
                  className="landing-arcade-sheet__frame"
                  allow="fullscreen"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
