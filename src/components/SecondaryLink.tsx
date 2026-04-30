import { cn } from "@jokuh/gooey";
import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

const secondaryLinkStyles =
  "inline-flex items-center font-sans text-sm font-medium text-blue-4 underline-offset-[3px] transition-colors " +
  "hover:text-blue-5 hover:underline hover:no-underline light:text-blue-3 light:hover:text-blue-4";

type SecondaryLinkBase = {
  children: ReactNode;
  className?: string;
};

type SecondaryLinkTo = SecondaryLinkBase &
  Omit<LinkProps, "className" | "children"> & { href?: never };

type SecondaryLinkHref = SecondaryLinkBase &
  React.ComponentPropsWithoutRef<"a"> & { to?: never };

export type SecondaryLinkProps = SecondaryLinkTo | SecondaryLinkHref;

export function SecondaryLink(props: SecondaryLinkProps) {
  const { children, className, ...rest } = props;
  const cls = cn(secondaryLinkStyles, className);

  if ("to" in rest && rest.to != null) {
    const { to, ...linkRest } = rest;
    return (
      <Link to={to} className={cls} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { href, ...anchorRest } = rest as SecondaryLinkHref;
  return (
    <a href={href} className={cls} {...anchorRest}>
      {children}
    </a>
  );
}
