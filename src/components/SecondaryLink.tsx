import { cn } from "@jokuh/gooey";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

const secondaryLinkStyles =
  "inline-flex items-center gap-x-1 font-sans text-sm font-medium text-blue-3 underline-offset-[3px] transition-colors " +
  "hover:underline dark:text-blue-4 dark:hover:text-blue-5 dark:hover:no-underline";

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
        <ChevronRight className="size-[1em] shrink-0 translate-y-px" strokeWidth={2} aria-hidden />
      </Link>
    );
  }

  const { href, ...anchorRest } = rest as SecondaryLinkHref;
  return (
    <a href={href} className={cls} {...anchorRest}>
      {children}
      <ChevronRight className="size-[1em] shrink-0 translate-y-px" strokeWidth={2} aria-hidden />
    </a>
  );
}
