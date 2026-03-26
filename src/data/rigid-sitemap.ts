/**
 * Rigid sitemap spec v1 — single source for top nav, mega footer, and /sitemap.
 * @see JOKUH_Rigid_Sitemap_Spec_v1
 */

export type RigidLink = { label: string; href: string };

export type RigidNavColumn = {
  id: string;
  heading: string;
  links: RigidLink[];
  support?: { heading: string; links: RigidLink[] };
};

export const RIGID_NAV_COLUMNS: RigidNavColumn[] = [
  {
    id: "product",
    heading: "Product",
    links: [
      { label: "Pods", href: "/pods" },
      { label: "Blurbs", href: "/blurbs" },
      { label: "Spine", href: "/spine" },
      { label: "Vortex", href: "/vortex" },
      { label: "Prompt bar", href: "/prompt" },
    ],
  },
  {
    id: "platform",
    heading: "Platform",
    links: [
      { label: "Identity", href: "/platform/identity" },
      { label: "Gooey", href: "/platform/gooey" },
      { label: "Wallet", href: "/platform/wallet" },
      { label: "Galaxy Nodes", href: "/platform/galaxy-nodes" },
    ],
  },
  {
    id: "ecosystem",
    heading: "Ecosystem",
    links: [
      { label: "V1llains", href: "/ecosystem/v1llains" },
      { label: "Community", href: "/ecosystem/community" },
      { label: "Waitlist", href: "/waitlist" },
      { label: "Partnerships", href: "/ecosystem/partnerships" },
    ],
  },
  {
    id: "company",
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Research", href: "/research" },
      { label: "Ethics & compliance", href: "/ethics" },
    ],
  },
  {
    id: "developers",
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/developers/documentation" },
      { label: "SDK & API", href: "/developers/sdk" },
      { label: "GitHub", href: "https://github.com/jokuh" },
      { label: "Accessibility", href: "/developers/accessibility" },
    ],
    support: {
      heading: "Support",
      links: [
        { label: "Jokuh Care", href: "/support" },
        { label: "Account", href: "/account" },
      ],
    },
  },
];
