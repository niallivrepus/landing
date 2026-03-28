/**
 * Consolidated reference model: OpenAI / Apple / ChatGPT public IA patterns → Jokuh parity routes.
 * Regenerate signals via `npm run ecosystem:agents` (parallel URL probes).
 */

export type ReferenceEcosystem = {
  id: string;
  label: string;
  rootUrl: string;
  pillars: { name: string; paths: string[]; notes?: string }[];
};

export const REFERENCE_ECOSYSTEMS: ReferenceEcosystem[] = [
  {
    id: "openai-marketing",
    label: "OpenAI (marketing)",
    rootUrl: "https://openai.com",
    pillars: [
      {
        name: "Product entry & stories",
        paths: ["/", "/news/company-announcements/", "/stories/", "/index/"],
        notes: "Hero CTA, news index, long-form stories, business case studies.",
      },
      {
        name: "Research",
        paths: ["/research/", "/research/index/"],
      },
      {
        name: "ChatGPT funnel",
        paths: ["/chatgpt/download/"],
        notes: "Consumer app surfaces link out to chatgpt.com for product.",
      },
    ],
  },
  {
    id: "openai-developers",
    label: "OpenAI Developers",
    rootUrl: "https://developers.openai.com",
    pillars: [
      {
        name: "Hub & platforms",
        paths: ["/", "/api/docs", "/codex", "/apps-sdk", "/commerce"],
        notes: "Featured cards, video, API docs, Codex, Pods SDK, commerce/agentic patterns.",
      },
      {
        name: "Learn & explore",
        paths: ["/learn", "/blog", "/cookbook"],
      },
      {
        name: "Community & programs",
        paths: ["/learn"],
        notes: "Help center (help.openai.com), forum (community.openai.com), startups (openai.com/startups).",
      },
      {
        name: "Trust & reliability",
        paths: ["/"],
        notes: "Status links to status.openai.com (often powered by incident.io-style status product).",
      },
    ],
  },
  {
    id: "openai-status",
    label: "OpenAI Status",
    rootUrl: "https://status.openai.com",
    pillars: [
      {
        name: "Incident surface",
        paths: ["/", "/history"],
        notes: "Per-product components, uptime, subscribe; typically separate subdomain from marketing and docs.",
      },
    ],
  },
  {
    id: "apple-legal",
    label: "Apple Legal",
    rootUrl: "https://www.apple.com/legal/",
    pillars: [
      {
        name: "Structured legal home",
        paths: [
          "/legal/",
          "/legal/internet-services/",
          "/legal/privacy/",
          "/legal/warranty/",
          "/legal/sla/",
          "/legal/sales-support/",
          "/legal/intellectual-property/",
          "/legal/more-resources/",
        ],
        notes: "Clear IA: hardware, software, sales, internet services, privacy, IP; locale-specific privacy flows.",
      },
    ],
  },
  {
    id: "chatgpt-product",
    label: "ChatGPT (product)",
    rootUrl: "https://chatgpt.com",
    pillars: [
      {
        name: "Minimal shell",
        paths: ["/"],
        notes: "Terms + privacy deep-link to openai.com; keeps legal centralized on corporate site.",
      },
    ],
  },
];

export type JokuhPortalSurface = {
  id: string;
  intent: string;
  jokuhRouteOrEnv: string;
  referenceIds: string[];
};

/** Where Jokuh should mirror reference IA (routes are on marketing site unless host=developers|status). */
export const JOKUH_PORTAL_PARITY: JokuhPortalSurface[] = [
  {
    id: "marketing-hub",
    intent: "Primary narrative, news, research, business stories",
    jokuhRouteOrEnv: "/, /journal, /research, /stories/*",
    referenceIds: ["openai-marketing"],
  },
  {
    id: "developers-hub",
    intent: "Docs, SDK, cookbooks, featured builds, MCP / apps platform",
    jokuhRouteOrEnv: "VITE_ORIGIN_DEVELOPERS → /developers/*",
    referenceIds: ["openai-developers"],
  },
  {
    id: "status-trust",
    intent: "Uptime, incidents, history, email/RSS subscribe",
    jokuhRouteOrEnv: "VITE_ORIGIN_STATUS (e.g. status.jokuh.com); fallback /system-status",
    referenceIds: ["openai-status"],
  },
  {
    id: "legal-apple-style",
    intent: "Legal home grid, internet services, privacy locales, terms",
    jokuhRouteOrEnv: "/legal, /legal/*, /privacy, /terms",
    referenceIds: ["apple-legal"],
  },
  {
    id: "product-legal-links",
    intent: "Thin product shell linking to centralized policies",
    jokuhRouteOrEnv: "Future app surfaces → /terms, /privacy",
    referenceIds: ["chatgpt-product"],
  },
];

export const ECOSYSTEM_AGENT_URLS: { url: string; label: string }[] = [
  { url: "https://openai.com", label: "openai-marketing" },
  { url: "https://developers.openai.com", label: "openai-developers" },
  { url: "https://status.openai.com", label: "openai-status" },
  { url: "https://www.apple.com/legal/", label: "apple-legal" },
  { url: "https://chatgpt.com", label: "chatgpt-product" },
  { url: "https://help.openai.com/en/", label: "openai-help" },
  { url: "https://community.openai.com/", label: "openai-forum" },
];
