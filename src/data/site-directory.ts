export type SiteLink = { label: string; href: string };
export type SiteSection = { id: string; heading: string; links: SiteLink[] };
export type SiteColumn = { sections: SiteSection[] };

/** Apple-style mega footer / sitemap columns — Jokuh copy and anchors. */
export const SITE_DIRECTORY_COLUMNS: SiteColumn[] = [
  {
    sections: [
      {
        id: "shop-learn",
        heading: "Shop and learn",
        links: [
          { label: "Pods", href: "/pods" },
          { label: "Blurbs", href: "/blurbs" },
          { label: "Spine", href: "/spine" },
          { label: "Vortex", href: "/vortex" },
          { label: "Prompt bar", href: "/#prompt" },
          { label: "Journal", href: "/#journal" },
          { label: "Site map", href: "/sitemap#sitemap-top" },
        ],
      },
      {
        id: "identity-wallet",
        heading: "Identity",
        links: [
          { label: "Claim identity", href: "/#identity" },
          { label: "Waitlist", href: "/#start" },
          { label: "V1llains", href: "/#identity" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        id: "account",
        heading: "Account",
        links: [
          { label: "Manage your Jokuh account", href: "#" },
          { label: "Waitlist status", href: "/#start" },
        ],
      },
      {
        id: "platform",
        heading: "Platform",
        links: [
          { label: "Gooey UI kit", href: "/#journal" },
          { label: "Documentation", href: "#" },
          { label: "SDK", href: "#" },
          { label: "Accessibility", href: "#" },
          { label: "API & integrations", href: "#" },
        ],
      },
      {
        id: "support",
        heading: "Support",
        links: [
          { label: "Self-service", href: "#" },
          { label: "Accessibility", href: "#" },
          { label: "Community & get help", href: "#" },
          { label: "Genius Bar", href: "#" },
          { label: "Repair", href: "#" },
          { label: "Billing & subscriptions", href: "#" },
          { label: "Jokuh Care", href: "#" },
          { label: "Jokuh account & password", href: "#" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        id: "jokuh-store",
        heading: "Jokuh",
        links: [
          { label: "What is Jokuh?", href: "/#journal" },
          { label: "Try Jokuh", href: "/#start" },
          { label: "Search", href: "/#prompt" },
          { label: "Latest posts", href: "/#journal" },
          { label: "Shopping help", href: "#" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        id: "for-builders",
        heading: "For builders",
        links: [
          { label: "Developers overview", href: "#" },
          { label: "SDK", href: "#" },
          { label: "Accessibility", href: "#" },
          { label: "GitHub", href: "#" },
        ],
      },
      {
        id: "for-teams",
        heading: "For teams",
        links: [
          { label: "Company", href: "/#journal" },
          { label: "Press & partnerships", href: "#" },
        ],
      },
    ],
  },
  {
    sections: [
      {
        id: "values",
        heading: "Jokuh values",
        links: [
          { label: "Privacy", href: "/legal/privacy" },
          { label: "Security", href: "#" },
          { label: "Accessibility", href: "#" },
        ],
      },
      {
        id: "about",
        heading: "About Jokuh",
        links: [
          { label: "Newsroom", href: "/news" },
          { label: "Careers", href: "#" },
          { label: "Contact", href: "#" },
          { label: "Ethics & compliance", href: "/legal#ethics" },
        ],
      },
    ],
  },
];

/** Multi-paragraph fine print (Apple-style) above footer links — Jokuh-specific. */
export const FOOTER_FINE_PRINT = {
  paragraphs: [
    "1. Waitlist placement, early access, and any account credits or promotional offers are limited, subject to eligibility, and may expire or change without notice. Additional terms apply when you join the waitlist or redeem offers through Jokuh.",
    "Use of Jokuh requires a compatible device, a network connection, and software versions that meet our published requirements. Subscriptions, paid add-ons, and payment plans require valid billing information and are subject to approval or issuer terms where applicable.",
    "Jokuh services may be provided by Jokuh, its affiliates, and designated service providers and subprocessors as described in our legal documentation.",
    "Customer communications and primary documentation are offered in English unless otherwise indicated for your region. Response times and phone or chat availability may vary by location.",
    {
      before: "For more on how we evaluate waitlist applications, roll out features, and manage beta access, see our ",
      linkLabel: "support overview",
      href: "#",
    },
    "Some Jokuh capabilities—including select Pods, Spine or Vortex features, and certain partner integrations—may require a paid subscription, separate license, or third-party account.",
    "Features, interfaces, and availability are subject to change, may be offered as previews or betas, and may not be available in all regions or on all devices. Jokuh is in early access; product details may vary.",
  ] as const,
};
