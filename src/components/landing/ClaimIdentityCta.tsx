import type { MouseEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { CtaLordIcon } from "../CtaLordIcon";
import { jokuhButtonClass } from "../system/JokuhButton";
import { CLAIM_IDENTITY_MORPH } from "./claim-identity-morph-ids";

/**
 * **Purpose:** The sign-up CTA, drawn as the app's rainbow jelly bean (`JokuhButton` `create`).
 * **Connects to:** `ClaimIdentityFlowContext`, `/download`, morph overlay handoff.
 * Default label is “Get started” so the marketing CTA reads as signup, not jargon.
 */
export function ClaimIdentityCta({
  href,
  children = "Get started",
  className,
  onActivate,
  morphLayout = false,
}: {
  href: string;
  children?: ReactNode;
  className?: string;
  onActivate?: () => void;
  morphLayout?: boolean;
}) {
  const hoverSoundProps = useGentleHoverSound(true, "premium");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onActivate) return;
    event.preventDefault();
    onActivate();
  };

  const inner = (
    <>
      <motion.span layoutId={morphLayout ? CLAIM_IDENTITY_MORPH.ctaIcon : undefined}>
        <CtaLordIcon icon="domainVerification" size={18} darkColor="currentColor" lightColor="currentColor" />
      </motion.span>
      {children}
    </>
  );

  if (morphLayout) {
    return (
      <motion.a
        href={href}
        onClick={handleClick}
        layoutId={CLAIM_IDENTITY_MORPH.ctaShell}
        {...hoverSoundProps}
        className={jokuhButtonClass("create", "lg", className)}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <a href={href} onClick={handleClick} {...hoverSoundProps} className={jokuhButtonClass("create", "lg", className)}>
      {inner}
    </a>
  );
}
