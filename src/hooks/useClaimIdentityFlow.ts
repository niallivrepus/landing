import { useCallback, useState } from "react";
import { useReducedMotion } from "motion/react";

export type ClaimIdentityPhase = "idle" | "opening" | "open" | "closing";
export type ClaimIdentitySource = "hero" | "identity-block" | "demo" | "download";

/** Optional context when opening claim from a proof power or other surface. */
export type ClaimIdentityOpenOptions = {
  /** Homepage demo power id (memory, spine, …) — travels to app as `power`. */
  power?: string | null;
};

/**
 * **Purpose:** Orchestrates the homepage claim-identity morph overlay open/close cycle.
 * Carries optional proof-power context so handoff URLs continue the demo beat in-app.
 * **Connects to:** `ClaimIdentityLandingOverlay`, `ClaimIdentityCta`, `ProductDemoSection`.
 */
export function useClaimIdentityFlow() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<ClaimIdentityPhase>("idle");
  const [source, setSource] = useState<ClaimIdentitySource>("hero");
  const [power, setPower] = useState<string | null>(null);

  const open = useCallback(
    (from: ClaimIdentitySource = "hero", options?: ClaimIdentityOpenOptions) => {
      setSource(from);
      setPower(options?.power?.trim() || null);
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
      setPower(null);
      return;
    }
    setPhase("closing");
    window.setTimeout(() => {
      setPhase("idle");
      setPower(null);
    }, 380);
  }, [reduceMotion]);

  const isOpen = phase === "open" || phase === "opening";

  return { phase, source, power, open, close, isOpen };
}
