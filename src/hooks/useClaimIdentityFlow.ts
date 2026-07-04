import { useCallback, useState } from "react";
import { useReducedMotion } from "motion/react";

export type ClaimIdentityPhase = "idle" | "opening" | "open" | "closing";
export type ClaimIdentitySource = "hero" | "identity-block" | "demo";

/**
 * **Purpose:** Orchestrates the homepage claim-identity morph overlay open/close cycle.
 * **Connects to:** `ClaimIdentityLandingOverlay`, `ClaimIdentityCta`, `LandingImmersiveShell`.
 */
export function useClaimIdentityFlow() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<ClaimIdentityPhase>("idle");
  const [source, setSource] = useState<ClaimIdentitySource>("hero");

  const open = useCallback(
    (from: ClaimIdentitySource = "hero") => {
      setSource(from);
      if (reduceMotion) {
        setPhase("open");
        return;
      }
      setPhase("opening");
      window.requestAnimationFrame(() => setPhase("open"));
    },
    [reduceMotion],
  );

  const close = useCallback(() => {
    if (reduceMotion) {
      setPhase("idle");
      return;
    }
    setPhase("closing");
    window.setTimeout(() => setPhase("idle"), 380);
  }, [reduceMotion]);

  const isOpen = phase === "open" || phase === "opening";

  return { phase, source, open, close, isOpen };
}
