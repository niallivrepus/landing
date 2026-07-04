import type { RigidLink } from "../data/rigid-sitemap";

/** True when `href` is http(s) and targets a different host than the current page (incl. other subdomains). */
export function isCrossHostHref(href: string): boolean {
  if (!href.startsWith("http://") && !href.startsWith("https://")) return false;
  if (typeof window === "undefined") return false;
  try {
    return new URL(href).host !== window.location.host;
  } catch {
    return false;
  }
}

/** Nav / footer: show diagonal glyph when link leaves this host, or when explicitly marked (e.g. docs before subdomain cutover). */
export function showOffSiteNavGlyph(link: Pick<RigidLink, "href" | "navGlyph">): boolean {
  if (link.navGlyph === "launch") return true;
  return isCrossHostHref(link.href);
}
