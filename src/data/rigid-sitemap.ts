/**
 * Rigid sitemap spec v1 — single source for top nav, mega footer, and /sitemap.
 * @see JOKUH_Rigid_Sitemap_Spec_v1
 */

export type RigidLink = {
  label: string;
  href: string;
  /** When set and env origin is defined, rewrites href to that subdomain. */
  host?: "developers" | "status";
  /** Hugeicons link-square (Gooey-style) after label — docs / product launch affordance. */
  navGlyph?: "launch";
  /** Surfaces this link should appear on. Omit to keep it available everywhere. */
  surfaces?: RigidSurface[];
};

export type RigidSurface = "primary" | "footer" | "search" | "sitemap";

export type RigidNavSection = {
  heading: string;
  links: RigidLink[];
  surfaces?: RigidSurface[];
};

export type RigidNavColumn = {
  id: string;
  /** Top nav dropdown label */
  heading: string;
  sections: RigidNavSection[];
  surfaces?: RigidSurface[];
};

const ALL_SOURCES: RigidSurface[] = ["primary", "footer", "search", "sitemap"];

function isSurfaceVisible(surfaces: readonly RigidSurface[] | undefined, surface: RigidSurface): boolean {
  return surfaces ? surfaces.includes(surface) : true;
}

function filterLinks(links: RigidLink[], surface: RigidSurface): RigidLink[] {
  return links.filter((link) => isSurfaceVisible(link.surfaces, surface));
}

function filterSections(sections: RigidNavSection[], surface: RigidSurface): RigidNavSection[] {
  return sections
    .map((section) => {
      if (!isSurfaceVisible(section.surfaces, surface)) return null;
      const links = filterLinks(section.links, surface);
      if (links.length === 0) return null;
      return { ...section, links };
    })
    .filter((section): section is RigidNavSection => section !== null);
}

export function filterRigidNavColumns(cols: readonly RigidNavColumn[], surface: RigidSurface): RigidNavColumn[] {
  return cols
    .map((col) => {
      if (!isSurfaceVisible(col.surfaces, surface)) return null;
      const sections = filterSections(col.sections, surface);
      if (sections.length === 0) return null;
      return { ...col, sections };
    })
    .filter((col): col is RigidNavColumn => col !== null);
}

export const RIGID_NAV_COLUMNS: RigidNavColumn[] = [
  {
    id: "product",
    heading: "Product",
    sections: [
      {
        heading: "Product",
        links: [
          { label: "Pods", href: "/pods", surfaces: ALL_SOURCES },
          { label: "Blurbs", href: "/blurbs", surfaces: ALL_SOURCES },
          { label: "Spine", href: "/spine", surfaces: ALL_SOURCES },
          { label: "Vortex", href: "/vortex", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Get started",
        links: [{ label: "Waitlist", href: "/waitlist", surfaces: ALL_SOURCES }],
      },
    ],
  },
  {
    id: "platform",
    heading: "Platform",
    sections: [
      {
        heading: "Platform",
        links: [
          { label: "Identity", href: "/platform/identity", surfaces: ["sitemap"] },
          { label: "Gooey", href: "/platform/gooey", surfaces: ["sitemap"] },
          { label: "Wallet", href: "/platform/wallet", surfaces: ["sitemap"] },
          { label: "Galaxy Nodes", href: "/platform/galaxy-nodes", surfaces: ["sitemap"] },
        ],
      },
    ],
  },
  {
    id: "ecosystem",
    heading: "Ecosystem",
    sections: [
      {
        heading: "Ecosystem",
        links: [
          { label: "V1llains", href: "/ecosystem/v1llains", surfaces: ["sitemap"] },
          { label: "Community", href: "/ecosystem/community", surfaces: ["sitemap"] },
          { label: "Partnerships", href: "/ecosystem/partnerships", surfaces: ["sitemap"] },
        ],
      },
    ],
  },
  {
    id: "company",
    heading: "Company",
    sections: [
      {
        heading: "Company",
        links: [
          { label: "About us", href: "/about", surfaces: ALL_SOURCES },
          { label: "Careers", href: "/careers", surfaces: ALL_SOURCES },
          { label: "News", href: "/newsroom", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Brand guidelines", href: "/brand-guidelines", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Research & trust",
        links: [
          { label: "Research", href: "/research", surfaces: ["footer", "search", "sitemap"] },
          { label: "Ethics & compliance", href: "/ethics", surfaces: ["footer", "search", "sitemap"] },
          { label: "Contact sales", href: "/contact", surfaces: ["footer", "search", "sitemap"] },
        ],
      },
    ],
  },
  {
    id: "developers",
    heading: "Developers",
    sections: [
      {
        heading: "Explore Developers",
        links: [
          { label: "Jokuh SDK", href: "/developers/sdk", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Open models", href: "/developers/open-models", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Agents of chaos", href: "/developers/agents", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Pods", href: "/pods", navGlyph: "launch", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Docs", href: "/developers/docs", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Cookbooks", href: "/developers/docs/cookbook", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Community", href: "/developers/forum", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
        ],
      },
    ],
  },
];
