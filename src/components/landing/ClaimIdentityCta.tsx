import type { MouseEvent, ReactNode } from "react";
import { Button, cn } from "@jokuh/gooey";
import { motion } from "motion/react";
import { useGentleHoverSound } from "../../hooks/useGentleHoverSound";
import { CtaLordIcon } from "../CtaLordIcon";
import { CLAIM_IDENTITY_MORPH } from "./claim-identity-morph-ids";

/**
 * **Purpose:** Primary claim-identity CTA using Gooey `primary-neutral` button chrome (app parity).
 * **Connects to:** `ClaimIdentityFlowContext`, `/download`, morph overlay handoff.
 */
export function ClaimIdentityCta({
  href,
  children = "Claim identity",
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
        className={cn(
          "inline-flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-full border border-transparent px-8 font-sans text-sm font-bold",
          "bg-[var(--color-light-space)] text-[var(--color-dark-space)] shadow-[var(--shadow-pill)]",
          "[text-shadow:0px_-0.5px_1px_rgba(0,0,0,0.5),0px_0.5px_1px_white]",
          "hover:border-[var(--color-light-glass-20)] active:bg-[var(--color-dark-space)] active:text-[var(--color-light-space)]",
          "light:bg-zinc-900 light:text-white light:hover:bg-zinc-800",
          className,
        )}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <Button
      variant="primary-neutral"
      size="xl"
      asChild
      className={cn("gap-2", className)}
    >
      <a href={href} onClick={handleClick} {...hoverSoundProps}>
        {inner}
      </a>
    </Button>
  );
}
