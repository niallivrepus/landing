/**
 * Rigid sitemap spec v1 — single source for top nav, mega footer, and /sitemap.
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
          { label: "Spine", href: "/spine", summary: "See time more clearly.", surfaces: ALL_SOURCES },
          { label: "Blurbs", href: "/blurbs", summary: "Turn talk into clean copy.", surfaces: ALL_SOURCES },
          { label: "Calls", href: "/calls", summary: "Capture conversations without losing the room.", surfaces: ALL_SOURCES },
          { label: "Messages", href: "/messages", summary: "Keep every thread close to the people behind it.", surfaces: ALL_SOURCES },
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
    id: "ecosystem",
    heading: "Ecosystem",
    sections: [
      {
        heading: "Ecosystem",
        links: [
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
          { label: "Manifesto", href: "/manifesto", surfaces: ALL_SOURCES },
          { label: "Brand", href: "/brand", surfaces: ["footer", "sitemap"] },
          { label: "Stories", href: "/stories", surfaces: ALL_SOURCES },
          { label: "Company", href: "/charter", surfaces: ALL_SOURCES },
          { label: "News", href: "/newsroom", surfaces: ALL_SOURCES },
          { label: "Career", href: "/careers", surfaces: ALL_SOURCES },
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
          { label: "Overview", href: "/about", surfaces: ALL_SOURCES },
          { label: "Customer Stories", href: "/stories", surfaces: ALL_SOURCES },
          { label: "Resources", href: "/developers/docs", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Contact Sales", href: "/contact", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Products",
        links: [
          { label: "Jokuh Business", href: "/contact", surfaces: ALL_SOURCES },
          { label: "Jokuh Enterprise", href: "/contact", surfaces: ALL_SOURCES },
          { label: "SDK & API", href: "/developers/docs/sdk", surfaces: ALL_SOURCES },
        ],
      },
    ],
  },
  {
    id: "more",
    heading: "More",
    surfaces: ["footer", "sitemap"],
    sections: [
      {
        heading: "More",
        links: [
          { label: "News", href: "/newsroom", surfaces: ["footer", "sitemap"] },
          { label: "Stories", href: "/stories", surfaces: ["footer", "sitemap"] },
          { label: "RSS", href: "/rss.xml", surfaces: ["footer", "sitemap"] },
        ],
      },
    ],
  },
  {
    id: "safety",
    heading: "Safety",
    surfaces: ["sitemap"],
    sections: [
      {
        heading: "Safety",
        links: [
          { label: "Safety Approach", href: "/safety/approach", surfaces: ["footer", "sitemap"] },
          { label: "Security & Privacy", href: "/safety/security-privacy", surfaces: ["footer", "sitemap"] },
          { label: "Trust & Transparency", href: "/safety/trust-transparency", surfaces: ["footer", "sitemap"] },
        ],
      },
    ],
  },
  {
    id: "terms-policies",
    heading: "Terms & Policies",
    surfaces: ["sitemap"],
    sections: [
      {
        heading: "Terms & Policies",
        links: [
          { label: "Terms of Service", href: "/terms", surfaces: ["footer", "sitemap"] },
          { label: "Privacy Policy", href: "/privacy", surfaces: ["footer", "sitemap"] },
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
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Quickstart", href: "/developers/docs/quickstart", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Docs", href: "/developers/docs", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
        ],
      },
    ],
  },
];
