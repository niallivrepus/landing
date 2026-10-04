import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@jokuh/gooey";
import { SiteLink } from "../SiteLink";

/**
 * **Purpose:** The site's one button — the app's current Gooey recipes (`styles/jokuh-buttons.css`).
 * - `primary`: solid inverted (white on dark, ink on light) — the default CTA
 * - `accent`: Gooey blue — downloads and high-intent app actions
 * - `secondary`: Gooey glass on dark / raised white control on light
 * - `ghost`: quiet third-tier action
 * - `create`: rainbow jelly bean — sign-up / create only, at most one per view
 * Renders a `SiteLink` when `href` is set, otherwise a `<button type="button">`.
 * **Connects to:** `PillLink`, `LandingBlueCta`, `ClaimIdentityCta`, `PrimaryNavCta` and page CTAs.
 */
export type JokuhButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "create";
export type JokuhButtonSize = "sm" | "md" | "lg";

type Common = {
  variant?: JokuhButtonVariant;
  size?: JokuhButtonSize;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type ButtonProps = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function jokuhButtonClass(variant: JokuhButtonVariant = "primary", size: JokuhButtonSize = "lg", className?: string) {
  return cn("jk-btn", `jk-btn--${variant}`, `jk-btn--${size}`, className);
}

export function JokuhButton(props: LinkProps | ButtonProps) {
  if (props.href !== undefined) {
    const { variant, size, className, children, href, ...rest } = props;
    return (
      <SiteLink href={href} {...rest} className={jokuhButtonClass(variant, size, className)}>
        {children}
      </SiteLink>
    );
  }
  const { variant, size, className, children, href: _href, type = "button", ...rest } = props;
  return (
    <button type={type} {...rest} className={jokuhButtonClass(variant, size, className)}>
      {children}
    </button>
  );
}
