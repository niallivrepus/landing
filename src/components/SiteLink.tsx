import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { isTrustedSiblingOriginHref } from "../config/site-subdomains";

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> & {
  href: string;
  children: ReactNode;
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function isInternalRouteHref(href: string) {
  return href.startsWith("/") && !href.includes("#");
}

export function SiteLink({ href, children, rel, target, ...props }: SiteLinkProps) {
  if (isExternalHref(href)) {
    const sameTab = isTrustedSiblingOriginHref(href);

    return (
      <a
        href={href}
        rel={sameTab ? rel : (rel ?? "noopener noreferrer")}
        target={sameTab ? target : (target ?? "_blank")}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isInternalRouteHref(href)) {
    return (
      <Link to={href} rel={rel} target={target} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} rel={rel} target={target} {...props}>
      {children}
    </a>
  );
}
