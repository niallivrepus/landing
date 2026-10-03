import type { ReactNode } from "react";
import { JokuhButton } from "./JokuhButton";

export type PillLinkVariant = "muted" | "primary";

/**
 * Capsule link used across marketing pages. `muted` = Gooey glass secondary ("View open roles",
 * "About Jokuh"); `primary` = solid inverted CTA. Both come from `JokuhButton` (`styles/jokuh-buttons.css`).
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
    <JokuhButton href={href} variant={variant === "primary" ? "primary" : "secondary"} className={className}>
      {children}
    </JokuhButton>
  );
}
