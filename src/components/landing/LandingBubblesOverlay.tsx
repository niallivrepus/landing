import { Button, ServerAvatar } from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  LANDING_BUBBLES_FEATURES,
  LANDING_BUBBLES_SUBTITLE,
  LANDING_BUBBLES_TITLE,
} from "../../data/landing-bubbles-copy";
import { LANDING_LIBRARY_SERVERS } from "../../data/landing-library-rail-data";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import { SiteLink } from "../SiteLink";

/**
 * **Purpose:** Full-screen overlay that explains Workspaces **Bubbles** when the prompt-bar bubble button is tapped.
 * **Connects to:** `LandingPromptBar`, `landing-onboarding.css`, `/download` intercept.
 */
export function LandingBubblesOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { intercept } = useDownloadIntercept("bubbles-overlay");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const previewServers = LANDING_LIBRARY_SERVERS.slice(0, 5);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="claim-identity-overlay landing-bubbles-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="landing-bubbles-title"
        >
          <button type="button" className="onboarding-back-button" onClick={onClose}>
            Back
          </button>

          <div className="claim-identity-feed">
            <div className="claim-identity-feed__stack landing-bubbles-overlay__stack">
              <motion.article
                className="onboarding-glass-card landing-bubbles-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: mounted ? 1 : 0,
                  y: mounted ? 0 : 14,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
      ) : null}
    </AnimatePresence>
  );
}
