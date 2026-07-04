import { PillWheel, useShouldAnimate } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useMemo } from "react";
import { buildClaimIdentityWheelAvatars } from "../../data/claim-identity-avatar-wheel";

/**
 * **Purpose:** Celebratory PillWheel avatar field behind the claim-identity glass card — "join this world of identities."
 * **Connects to:** `ClaimIdentityLandingOverlay`, `IdentityBlock` (same PillWheel vocabulary), `landing-onboarding.css`.
 * **Motion:** Slow counter-rotating rings when animation allowed; static wheel when `prefers-reduced-motion`.
 */
export function ClaimIdentityAvatarBackground({ visible }: { visible: boolean }) {
  const shouldAnimate = useShouldAnimate();
  const wheelAvatars = useMemo(() => buildClaimIdentityWheelAvatars(), []);

  return (
    <motion.div
      className="claim-identity-avatar-bg"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="claim-identity-avatar-bg__wheel">
        <PillWheel
          avatars={wheelAvatars}
          animationDuration={shouldAnimate ? 88 : 0}
        />
      </div>
      <div className="claim-identity-avatar-bg__scrim" />
      <div className="claim-identity-avatar-bg__glow" />
    </motion.div>
  );
}
