/**
 * Rigid navigation spec v1 — single source for top nav, mega footer, and search.
 * @see JOKUH_Rigid_Sitemap_Spec_v1
 */

export type RigidLink = {
  label: string;
  href: string;
  /** Optional short support copy for richer nav/menu surfaces. */
  summary?: string;
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
        heading: "Products",
        links: [
          { label: "Calls", href: "/calls", summary: "Capture conversations without losing the room.", surfaces: ALL_SOURCES },
          { label: "Texts", href: "/messages", summary: "Stay in the loop with the people who matter.", surfaces: ALL_SOURCES },
          { label: "Spine", href: "/spine", summary: "See time more clearly.", surfaces: ALL_SOURCES },
          { label: "Blurbs", href: "/blurbs", summary: "Turn talk into clean copy.", surfaces: ALL_SOURCES },
          { label: "Profile", href: "/profile", summary: "Build a living identity people can actually use.", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Get started",
        links: [{ label: "Download", href: "/download", surfaces: ALL_SOURCES }],
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
          { label: "Manifesto", href: "/manifesto", surfaces: ALL_SOURCES },
          { label: "Brand", href: "/brand", surfaces: ["footer", "sitemap"] },
          { label: "Stories", href: "/stories", surfaces: ALL_SOURCES },
          { label: "News", href: "/newsroom", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Company links",
        links: [
          { label: "About us", href: "/about", surfaces: ALL_SOURCES },
          { label: "Careers", href: "/careers", surfaces: ALL_SOURCES },
        ],
      },
    ],
  },
  {
    id: "business",
    heading: "Business",
    sections: [
      {
        heading: "Business",
        links: [
          { label: "Overview", href: "/business", surfaces: ALL_SOURCES },
          { label: "Customer Stories", href: "/stories", surfaces: ALL_SOURCES },
          { label: "Contact Sales", href: "/contact", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Business resources",
        links: [
          { label: "Brand Book", href: "/brand", surfaces: ["primary"] },
          { label: "Pitch Deck", href: "/pitchdeck", surfaces: ["primary"] },
          { label: "Data Room", href: "/dataroom", surfaces: ["primary"] },
          { label: "Invest", href: "/invest", surfaces: ["primary"] },
        ],
      },
    ],
  },
  {
    id: "more",
    heading: "More",
    surfaces: ["footer"],
    sections: [
      {
        heading: "More",
        links: [
          { label: "News", href: "/newsroom", surfaces: ["footer"] },
          { label: "Stories", href: "/stories", surfaces: ["footer"] },
          { label: "RSS", href: "/rss.xml", surfaces: ["footer"] },
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
          {
            label: "Jokuh SDK (soon)",
            href: "/contact",
            summary: "Developer docs and SDK access are planned, not public yet.",
            surfaces: ALL_SOURCES,
          },
        ],
      },
    ],
  },
];
