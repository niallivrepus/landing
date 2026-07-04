import { resolveRigidNavColumns } from "../config/site-subdomains";
import { RIGID_NAV_COLUMNS, type RigidLink } from "../data/rigid-sitemap";

export type MegaLink = Pick<RigidLink, "label" | "href" | "summary" | "navGlyph">;

export type MegaColumn = { heading: string; links: MegaLink[] };

export type MegaGroup = {
  id: string;
  label: string;
  primaryHeading?: string;
  primary: MegaLink[];
  secondary?: MegaColumn[];
};

/**
 * **Purpose:** Shared mega-menu grouping for top and bottom site navigation.
 * **Connects to:** `SiteTopBar`, `SiteBottomNav`, `rigid-sitemap.ts`.
 */
export function buildNavGroups(
  cols: ReturnType<typeof resolveRigidNavColumns>,
): MegaGroup[] {
  return cols.map((col) => ({
    id: col.id,
    label: col.heading,
    primaryHeading: col.sections[0]?.heading,
    primary: [...col.sections[0].links],
    secondary:
      col.sections.length > 1
        ? col.sections.slice(1).map((s) => ({ heading: s.heading, links: [...s.links] }))
        : undefined,
  }));
}

/** **Purpose:** Primary nav columns (Products, Company, Business, Developers) for chrome bars. */
export function primaryNavGroups(): MegaGroup[] {
  return buildNavGroups(resolveRigidNavColumns(RIGID_NAV_COLUMNS, "primary"));
}
