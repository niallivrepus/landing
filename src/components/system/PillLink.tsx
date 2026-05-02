import type { ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";

export type PillLinkVariant = "muted" | "primary";

const baseClass =
  "inline-flex h-[50px] items-center rounded-full px-5 font-sans text-[13px] font-medium transition-colors";

const variantClass: Record<PillLinkVariant, string> = {
  muted:
    "bg-white/[0.07] text-light-space hover:bg-white/[0.12] light:bg-zinc-950/[0.06] light:text-zinc-950 light:hover:bg-zinc-950/[0.1]",
  primary:
    "bg-light-space text-dark-space hover:bg-light-space/90 light:bg-zinc-950 light:text-white light:hover:bg-zinc-800",
};

/**
 * Soft capsule link used across marketing pages. Defaults to the muted style
 * (the "View open roles" / "About Jokuh" / "Join us" treatment).
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
