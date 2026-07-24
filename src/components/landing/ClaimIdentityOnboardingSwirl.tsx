/**
 * **Purpose:** Figma `3486:259326` claim-identity header art — swirl backdrop + bonding disc + OO badge.
 * **Connects to:** `ClaimIdentityOnboardingCard`, `/public/bond-onboarding/` assets from Platform-3.
 */

const OO_SRC = "/bond-onboarding/oo-figma.svg";
const AVATAR_SRC = "/bond-onboarding/claim-identity-avatar-figma.png";
const SWIRL_SRC = "/bond-onboarding/claim-identity-swirl.svg";

/** **Renders** the identity-step swirl header inside the claim-identity glass card. */
export function ClaimIdentityOnboardingSwirl() {
  return (
    <div className="claim-identity-swirl" aria-hidden="true">
      <img
        className="claim-identity-swirl__backdrop"
        src={SWIRL_SRC}
        alt=""
        draggable={false}
        decoding="async"
      />
      <div className="claim-identity-swirl__center">
        <div className="claim-identity-swirl__bonding-ring">
          {/* 64×86 vertical pill — Gooey medium 20:27 ratio (parity product avatars). */}
          <img className="claim-identity-swirl__avatar" src={AVATAR_SRC} alt="" />
          <div className="claim-identity-swirl__oo-chip">
            <img className="claim-identity-swirl__oo" src={OO_SRC} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
