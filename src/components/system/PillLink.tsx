import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";

export type PillLinkVariant = "muted" | "primary";

const baseClass =
  "inline-flex h-[50px] items-center rounded-full px-5 font-sans text-[13px] font-medium transition-colors";

const variantClass: Record<PillLinkVariant, string> = {
  muted: "landing-pill-link text-light-space hover:text-light-space light:text-zinc-950 light:hover:text-zinc-950",
  primary: "landing-pill-link landing-pill-link--primary",
};

/**
 * Soft capsule link used across marketing pages. Defaults to the muted style
 * (the "View open roles" / "About Jokuh" / "Join us" treatment).
 * **Parity:** fill depth via `landing-controls.css` `--landing-control-*` tokens.
 */
export function PillLink({
  href,
  children,
  variant = "muted",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: PillLinkVariant;
  className?: string;
}) {
  return (
    <SiteLink href={href} className={cn(baseClass, variantClass[variant], className)}>
      {children}
    </SiteLink>
  );
}
