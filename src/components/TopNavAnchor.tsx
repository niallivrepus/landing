import type { MouseEventHandler, ReactNode } from "react";
import { SiteLink } from "./SiteLink";

export function TopNavAnchor({
  href,
  className,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <SiteLink
      href={href}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </SiteLink>
  );
}
