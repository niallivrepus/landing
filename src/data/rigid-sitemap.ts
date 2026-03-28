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
          { label: "Orb", href: "/orb", surfaces: ALL_SOURCES },
          { label: "Realms", href: "/realms", surfaces: ["footer"] },
        ],
      },
      {
        heading: "Identity",
        links: [
          { label: "Passport", href: "/passport", surfaces: ALL_SOURCES },
          { label: "V1llains", href: "/ecosystem/v1llains", surfaces: ALL_SOURCES },
          { label: "Realms", href: "/realms", surfaces: ["primary", "search", "sitemap"] },
        ],
      },
      {
        heading: "Get started",
        links: [{ label: "Waitlist", href: "/waitlist", surfaces: ["footer", "search", "sitemap"] }],
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
          { label: "Overview", href: "/chatgpt/business", surfaces: ALL_SOURCES },
          { label: "Pricing", href: "/pricing", surfaces: ALL_SOURCES },
          { label: "Customer Stories", href: "/stories", surfaces: ALL_SOURCES },
          { label: "Resources", href: "/developers/docs", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Contact Sales", href: "/contact", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Products",
        links: [
          { label: "Jokuh Business", href: "/chatgpt/business", surfaces: ALL_SOURCES },
          { label: "Jokuh Enterprise", href: "/chatgpt/enterprise", surfaces: ALL_SOURCES },
          { label: "API Platform", href: "/developers/sdk", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Solutions",
        links: [
          { label: "Coding", href: "/developers/sdk", surfaces: ALL_SOURCES },
          { label: "Agents", href: "/developers/agents", surfaces: ALL_SOURCES },
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
          { label: "RSS", href: "/rss", surfaces: ["footer", "sitemap"] },
        ],
      },
    ],
  },
  {
    id: "safety",
    heading: "Safety",
    surfaces: ["footer", "sitemap"],
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
    id: "chatgpt",
    heading: "ChatGPT",
    surfaces: ["sitemap"],
    sections: [
      {
        heading: "ChatGPT",
        links: [
          { label: "Explore ChatGPT", href: "/chatgpt/explore", navGlyph: "launch", surfaces: ["sitemap"] },
          { label: "Business", href: "/chatgpt/business", surfaces: ["sitemap"] },
          { label: "Enterprise", href: "/chatgpt/enterprise", surfaces: ["sitemap"] },
          { label: "Education", href: "/chatgpt/education", surfaces: ["sitemap"] },
          { label: "Pricing", href: "/pricing", navGlyph: "launch", surfaces: ["sitemap"] },
          { label: "Download", href: "/download", navGlyph: "launch", surfaces: ["sitemap"] },
        ],
      },
    ],
  },
  {
    id: "terms-policies",
    heading: "Terms & Policies",
    surfaces: ["footer", "sitemap"],
    sections: [
      {
        heading: "Terms & Policies",
        links: [
          { label: "Terms of Use", href: "/terms", surfaces: ["footer", "sitemap"] },
          { label: "Privacy Policy", href: "/privacy", surfaces: ["footer", "sitemap"] },
          { label: "Other Policies", href: "/legal", surfaces: ["footer", "sitemap"] },
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
          { label: "Agents of Chaos", href: "/developers/agents", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Pods API", href: "/pods", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Cookbooks", href: "/developers/docs/cookbook", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Community", href: "/developers/forum", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
          { label: "Docs", href: "/developers/docs", host: "developers", navGlyph: "launch", surfaces: ALL_SOURCES },
        ],
      },
    ],
  },
];
