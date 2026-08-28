import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { landingDemoPowerBridgeLabel } from "../../data/landing-demo-powers";
import { buildClaimIdentityAppHandoffUrl } from "../../lib/claim-identity-handoff";
import { isValidJokuhUsername, normalizeUsernameInput } from "../../lib/jokuh-username";
import type { ClaimIdentitySource } from "../../hooks/useClaimIdentityFlow";
import { ClaimIdentityAvatarBackground } from "./ClaimIdentityAvatarBackground";
import { ClaimIdentityOnboardingCard } from "./ClaimIdentityOnboardingCard";
import { OnboardingHandleField } from "./OnboardingHandleField";

/**
 * **Purpose:** Full-screen claim-identity overlay — **username-first on marketing only**.
 * Validates handle format, then hands off to the web app with optional proof-power context.
 * App order: language → birthday → claim (pre-filled) → Bond.
 * **Connects to:** `useClaimIdentityFlow`, `landing-demo-powers.ts`, `claim-identity-handoff.ts`.
 */
export function ClaimIdentityLandingOverlay({
  open,
  source,
  power = null,
  onClose,
}: {
  open: boolean;
  source: ClaimIdentitySource;
  /** Homepage demo power id when claim started from a proof bridge. */
  power?: string | null;
  onClose: () => void;
}) {
  const [handle, setHandle] = useState("");
  const [mounted, setMounted] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const bridgeSubtitle = landingDemoPowerBridgeLabel(power);

  useEffect(() => {
    if (!open) {
      setMounted(false);
      setHandle("");
      setInputError(null);
      setSubmitting(false);
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

  const handleChange = useCallback((next: string) => {
    setHandle(next);
    setInputError(null);
  }, []);

  const submit = () => {
    if (submitting) return;
    const u = normalizeUsernameInput(handle);
    if (!isValidJokuhUsername(u)) {
      setInputError("Pick a handle with letters, numbers, or hyphens.");
      return;
    }
    setInputError(null);
    setSubmitting(true);

    // Attribution must live on the URL — sessionStorage does not cross jokuh.com → app.jokuh.com.
    const handoffUrl = buildClaimIdentityAppHandoffUrl(u, {
      source,
      intent: "identity",
      power: power ?? undefined,
    });
    window.location.assign(handoffUrl);
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
              <ClaimIdentityOnboardingCard
                mounted={mounted}
                errorMessage={inputError}
                subtitle={bridgeSubtitle ?? "Pick a handle to continue"}
              />
            </div>
          </div>

          <div className="claim-identity-bottom-chrome">
            <OnboardingHandleField
              value={handle}
              onChange={handleChange}
              onSubmit={submit}
              submitLabel={submitting ? "Continue…" : "Continue"}
              disabled={submitting}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
