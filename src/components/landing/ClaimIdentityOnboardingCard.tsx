import { createSquirclePath } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ClaimIdentityOnboardingSwirl } from "./ClaimIdentityOnboardingSwirl";

/**
 * **Purpose:** Figma `3486:259326` / `3505:41076` claim-identity glass card (header + copy only).
 * **Connects to:** `ClaimIdentityLandingOverlay` — handle input stays in bottom chrome; handle rules live in card copy.
 */
export function ClaimIdentityOnboardingCard({
  mounted,
  errorMessage,
  subtitle = "Pick a handle to continue",
}: {
  mounted: boolean;
  errorMessage?: string | null;
  /** Proof-aware line (e.g. Claim to keep Spine) when handed off from the demo. */
  subtitle?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const reactId = useId();
  const clipId = `claim-identity-card-squircle-${reactId.replace(/:/g, "")}`;
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;

    const measure = () => {
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const squirclePath = useMemo(() => {
    if (size.width <= 0 || size.height <= 0) return "";
    return createSquirclePath({
      width: size.width,
      height: size.height,
      cornerRadius: 54,
      cornerSmoothing: 1,
    });
  }, [size.height, size.width]);

  return (
    <motion.article
      ref={cardRef}
      className="claim-identity-glass-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{
        opacity: mounted ? 1 : 0,
        y: mounted ? 0 : 14,
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {squirclePath ? (
        <svg
          className="claim-identity-glass-card__squircle"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={squirclePath} />
            </clipPath>
          </defs>
          <path className="claim-identity-glass-card__squircle-rim" d={squirclePath} />
        </svg>
      ) : null}

      <div
        className="claim-identity-glass-card__clip"
        style={squirclePath ? { clipPath: `url(#${clipId})` } : undefined}
      >
        <div className="claim-identity-glass-card__header">
          <ClaimIdentityOnboardingSwirl />
        </div>
        <div className="claim-identity-glass-card__body">
          <div className="claim-identity-glass-card__copy">
            <h1 id="claim-identity-title" className="claim-identity-glass-card__title">
              Create your account
            </h1>
            <p className="claim-identity-glass-card__subtitle">{subtitle}</p>
            <p className="claim-identity-glass-card__rules">
              a–z, 0–9, and hyphens · 3–32 characters
            </p>
            {errorMessage ? (
              <p className="claim-identity-glass-card__error" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
