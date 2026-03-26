import {
  filterRigidNavColumns,
  type RigidNavColumn,
  type RigidLink,
  type RigidSurface,
} from "../data/rigid-sitemap";

/** Set in deploy (e.g. https://developers.jokuh.com) so /developers/* nav targets the dev subdomain. */
export const DEV_PORTAL_ORIGIN =
  (import.meta.env.VITE_ORIGIN_DEVELOPERS as string | undefined)?.replace(/\/$/, "") ?? "";

/** Status / incidents (e.g. incident.io-backed page on status.jokuh.com). */
export const STATUS_PORTAL_ORIGIN =
  (import.meta.env.VITE_ORIGIN_STATUS as string | undefined)?.replace(/\/$/, "") ?? "";

/** Help center / support knowledge base (e.g. https://help.jokuh.com). */
export const HELP_PORTAL_ORIGIN =
  (import.meta.env.VITE_ORIGIN_HELP as string | undefined)?.replace(/\/$/, "") ?? "";

export function resolveStatusHref(href: string = "/"): string {
  if (!STATUS_PORTAL_ORIGIN) return "/system-status";
  const raw = href && href !== "/" ? href : "";
  const path = raw === "" ? "" : raw.startsWith("/") ? raw : `/${raw}`;
  return path === "" ? `${STATUS_PORTAL_ORIGIN}/` : `${STATUS_PORTAL_ORIGIN}${path}`;
}

export function resolveHelpHref(href: string = "/"): string {
  if (!HELP_PORTAL_ORIGIN) return "/support";
  const raw = href && href !== "/" ? href : "";
  const path = raw === "" ? "" : raw.startsWith("/") ? raw : `/${raw}`;
  return path === "" ? `${HELP_PORTAL_ORIGIN}/` : `${HELP_PORTAL_ORIGIN}${path}`;
}

export function isDevPortalAbsoluteHref(href: string): boolean {
  return Boolean(
    DEV_PORTAL_ORIGIN && (href === DEV_PORTAL_ORIGIN || href.startsWith(`${DEV_PORTAL_ORIGIN}/`)),
  );
}

export function isStatusPortalAbsoluteHref(href: string): boolean {
  return Boolean(
    STATUS_PORTAL_ORIGIN && (href === STATUS_PORTAL_ORIGIN || href.startsWith(`${STATUS_PORTAL_ORIGIN}/`)),
  );
}

export function isHelpPortalAbsoluteHref(href: string): boolean {
  return Boolean(HELP_PORTAL_ORIGIN && (href === HELP_PORTAL_ORIGIN || href.startsWith(`${HELP_PORTAL_ORIGIN}/`)));
}

/** Marketing site opens these first-party subdomains in the same tab (like OpenAI → developers / status). */
export function isTrustedSiblingOriginHref(href: string): boolean {
  return isDevPortalAbsoluteHref(href) || isStatusPortalAbsoluteHref(href) || isHelpPortalAbsoluteHref(href);
}

export function resolveSiteHref(link: RigidLink): string {
  if (link.host === "status") {
    return resolveStatusHref(link.href);
  }
  if (link.host === "developers" && DEV_PORTAL_ORIGIN && link.href.startsWith("/developers")) {
    const rest = link.href.slice("/developers".length);
    return `${DEV_PORTAL_ORIGIN}${rest || "/"}`;
  }
  return link.href;
}

export function resolveRigidNavColumns(
  cols: readonly RigidNavColumn[],
  surface: RigidSurface,
): RigidNavColumn[] {
  return filterRigidNavColumns(cols, surface).map((col) => ({
    ...col,
    sections: col.sections.map((sec) => ({
      ...sec,
      links: sec.links.map((l) => ({ ...l, href: resolveSiteHref(l) })),
    })),
  }));
}
