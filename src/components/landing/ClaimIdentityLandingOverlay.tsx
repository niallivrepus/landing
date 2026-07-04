import { OO } from "@jokuh/gooey";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDownloadIntercept } from "../../hooks/useDownloadIntercept";
import type { ClaimIdentitySource } from "../../hooks/useClaimIdentityFlow";
import { ClaimIdentityAvatarBackground } from "./ClaimIdentityAvatarBackground";
import { OnboardingHandleField } from "./OnboardingHandleField";

/**
 * **Purpose:** Full-screen claim-identity overlay matching the signed-in app layout (glass card + bottom @handle row).
 * **Connects to:** `useClaimIdentityFlow`, `landing-onboarding.css`, `/download` intercept.
 */
export function ClaimIdentityLandingOverlay({
  open,
  source,
  onClose,
}: {
  open: boolean;
  source: ClaimIdentitySource;
  onClose: () => void;
}) {
  const { intercept } = useDownloadIntercept("claim-overlay");
  const [handle, setHandle] = useState("");
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

  const submit = () => {
    intercept("identity", { ref: source });
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="claim-identity-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="claim-identity-title"
        >
          <ClaimIdentityAvatarBackground visible={mounted} />

          <button type="button" className="onboarding-back-button" onClick={onClose}>
            Back
          </button>

          <div className="claim-identity-feed">
            <div className="claim-identity-feed__stack">
              <motion.article
                className="onboarding-glass-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: mounted ? 1 : 0,
                  y: mounted ? 0 : 14,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="onboarding-glass-card__header flex items-center justify-center">
                  <OO expression="happy" />
                </div>
                <div className="onboarding-glass-card__body flex flex-col gap-2">
                  <h1
                    id="claim-identity-title"
                    className="m-0 font-sans text-[32px] font-bold leading-[1.1] text-[var(--ob-ink)]"
                  >
                    Claim your @handle
                  </h1>
                  <p className="m-0 font-sans text-[14px] leading-relaxed text-[var(--ob-ink-80)]">
                    Your identity is portable, private, and yours alone.
                  </p>
                </div>
              </motion.article>
            </div>
          </div>

          <div className="claim-identity-bottom-chrome">
            <OnboardingHandleField
              value={handle}
              onChange={setHandle}
              onSubmit={submit}
              submitLabel="Continue"
            />
            <details className="onboarding-handle-rules">
              <summary className="onboarding-handle-rules__summary">Handle rules</summary>
              <p className="onboarding-handle-rules__hint">
                Letters, numbers, and hyphens. Unique across Jokuh — display name can change anytime.
              </p>
            </details>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
