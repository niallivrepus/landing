import { Button, ServerAvatar } from "@jokuh/gooey";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  LANDING_BUBBLES_FEATURES,
  LANDING_BUBBLES_SUBTITLE,
  LANDING_BUBBLES_TITLE,
} from "../../data/landing-bubbles-copy";
import { LANDING_LIBRARY_SERVERS } from "../../data/landing-library-rail-data";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { SiteLink } from "../SiteLink";
import { LandingLibraryRail } from "./LandingLibraryRail";

const OVERLAY_EASE = [0.22, 1, 0.36, 1] as const;
const RAIL_EXPAND_DELAY_MS = 280;

/**
 * **Purpose:** Homepage Bubbles overlay — opaque explainer plus the left library rail sliding in
 * from the screen edge (the same server pills as immersive chrome, hidden on the home hero).
 * **Connects to:** `LandingPromptBar`, `LandingLibraryRail`, `landing-onboarding.css`.
 */
export function LandingBubblesOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { intercept } = useDownloadIntercept("bubbles-overlay");
  const reduceMotion = useReducedMotion();
  const previewServers = LANDING_LIBRARY_SERVERS.slice(0, 5);
  const [railExpanded, setRailExpanded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setRailExpanded(false);
      return;
    }
    const delay = reduceMotion ? 0 : RAIL_EXPAND_DELAY_MS;
    const id = window.setTimeout(() => setRailExpanded(true), delay);
    return () => window.clearTimeout(id);
  }, [open, reduceMotion]);

  const slide = reduceMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: OVERLAY_EASE };

  const overlay = open ? (
    <motion.div
      key="landing-bubbles-overlay"
      className="claim-identity-overlay landing-bubbles-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="landing-bubbles-title"
    >
      <button type="button" className="onboarding-back-button" onClick={onClose}>
        Back
      </button>

      <div className="landing-bubbles-overlay__rail">
        <motion.div
          className="h-full"
          initial={reduceMotion ? false : { opacity: 0, x: -72 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -48 }}
          transition={slide}
        >
          <LandingLibraryRail className="h-full" forceExpanded={railExpanded} />
        </motion.div>
      </div>

      <div className="claim-identity-feed">
        <div className="claim-identity-feed__stack landing-bubbles-overlay__stack">
          <motion.article
            className="onboarding-glass-card landing-bubbles-card"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.46, delay: 0.06, ease: OVERLAY_EASE }
            }
          >
            <div className="landing-bubbles-card__avatars" aria-hidden>
              {previewServers.map((server) => (
                <ServerAvatar
                  key={server.id}
                  size={40}
                  symbolSrc={server.symbolSrc}
                  backgroundColor={server.backgroundColor}
                  symbolColor={server.symbolColor}
                  symbolScale={server.symbolScale ?? 0.72}
                />
              ))}
              <span className="landing-bubbles-card__portal spectral-border-animated active" />
            </div>

            <div className="onboarding-glass-card__body flex flex-col gap-3">
              <h1
                id="landing-bubbles-title"
                className="m-0 font-sans text-[32px] font-bold leading-[1.1] text-[var(--ob-ink)]"
              >
                {LANDING_BUBBLES_TITLE}
              </h1>
              <p className="m-0 font-sans text-[14px] leading-relaxed text-[var(--ob-ink-80)]">
                {LANDING_BUBBLES_SUBTITLE}
              </p>

              <ul className="landing-bubbles-feature-list">
                {LANDING_BUBBLES_FEATURES.map((feature) => (
                  <li key={feature.id} className="landing-bubbles-feature-list__item">
                    <p className="landing-bubbles-feature-list__title">{feature.title}</p>
                    <p className="landing-bubbles-feature-list__body">{feature.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        </div>
      </div>

      <div className="landing-bubbles-overlay__cta">
        <Button
          variant="primary-neutral"
          size="xl"
          className="shrink-0"
          onClick={() => intercept("bubbles")}
        >
          Get Jokuh
        </Button>
        <Button variant="secondary-neutral" size="xl" asChild className="shrink-0">
          <SiteLink href="/messages">See Texts demo</SiteLink>
        </Button>
      </div>
    </motion.div>
  ) : null;

  if (typeof document === "undefined") return null;

  return createPortal(<AnimatePresence>{overlay}</AnimatePresence>, document.body);
}
