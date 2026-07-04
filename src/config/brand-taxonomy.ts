export const BRAND_DOMAIN = "jokuh.com";
export const BRAND_ORIGIN = `https://${BRAND_DOMAIN}`;

export const BRAND_NAMES = {
  company: "Jokuh",
  operatingSystem: "Jokuh OS",
  primaryInterface: "ARC Terminal",
  category: "sovereign agentic operating system",
  plainCategory: "privacy-first AI operating system for memory, agents, communication, and wallet workflows",
} as const;

export const PUBLIC_EMAILS = {
  /** General and early-access contact surfaced across marketing (mailto, footers, errors). */
  general: "sean@sierri.com",
  sales: "sales@jokuh.com",
  support: "support@jokuh.com",
  careers: "careers@jokuh.com",
  founderInvestor: "sean@sierri.com",
} as const;

export const FORBIDDEN_PUBLIC_EMAILS = ["privacy@jokuh.com"] as const;
export const FORBIDDEN_PUBLIC_DOMAINS = ["jokuh.io"] as const;

export type PrimitiveStatus = "live" | "beta" | "roadmap";
export type TestFlightVerificationStatus = "verified" | "not-verified" | "not-applicable";

export type Primitive = {
  id: string;
  name: string;
  status: PrimitiveStatus;
  route: `/${string}` | null;
  publicRole: string;
  canonicalDescription: string;
  detailRouteAllowed: boolean;
  testFlight: {
    status: TestFlightVerificationStatus;
    evidence: string;
  };
};

export const LIVE_PRIMITIVES = [
  {
    id: "spine",
    name: "Spine",
    status: "live",
    route: "/spine",
    publicRole: "Private memory and context layer",
    canonicalDescription: "Spine is Jokuh's private memory layer, turning chosen context into structured recall for ARC Terminal.",
    detailRouteAllowed: true,
    testFlight: {
      status: "verified",
      evidence: "Repo newsroom item: Spine ships to TestFlight.",
    },
  },
] as const satisfies readonly Primitive[];

export const BETA_PRIMITIVES = [
  {
    id: "sidekick",
    name: "Sidekick",
    status: "beta",
    route: "/sidekick",
    publicRole: "Agentic operator and workflow companion",
    canonicalDescription: "Sidekick is Jokuh's agentic operator, helping plan and act across approved ARC Terminal context.",
    detailRouteAllowed: true,
    testFlight: {
      status: "not-verified",
      evidence: "No authoritative repo evidence found proving Sidekick ships in iOS TestFlight today.",
    },
  },
  {
    id: "blurbs",
    name: "Blurbs",
    status: "beta",
    route: "/blurbs",
    publicRole: "Shareable updates and output cards",
    canonicalDescription: "Blurbs turns conversations and rough notes into clean, shareable updates without losing source context.",
    detailRouteAllowed: true,
    testFlight: {
      status: "not-verified",
      evidence: "No authoritative repo evidence found proving Blurbs ships in iOS TestFlight today.",
    },
  },
  {
    id: "pods",
    name: "Pods",
    status: "beta",
    route: "/pods",
    publicRole: "Shared workspaces and collaboration containers",
    canonicalDescription: "Pods are shared ARC Terminal spaces for teams, projects, and communities to keep scoped context together.",
    detailRouteAllowed: true,
    testFlight: {
      status: "not-verified",
      evidence: "No authoritative repo evidence found proving Pods ships in iOS TestFlight today.",
    },
  },
  {
    id: "wallet",
    name: "Wallet",
    status: "beta",
    route: "/wallet",
    publicRole: "Identity, payments, and transaction control",
    canonicalDescription: "Wallet gives Jokuh users identity, payments, and transaction control inside ARC Terminal.",
    detailRouteAllowed: true,
    testFlight: {
      status: "not-verified",
      evidence: "No authoritative repo evidence found proving Wallet ships in iOS TestFlight today.",
    },
  },
] as const satisfies readonly Primitive[];

export const ROADMAP_PRIMITIVES = [
  {
    id: "vortex",
    name: "Vortex",
    status: "roadmap",
    route: null,
    publicRole: "Roadmap primitive",
    canonicalDescription: "Vortex is a roadmap primitive.",
    detailRouteAllowed: false,
    testFlight: { status: "not-applicable", evidence: "Roadmap primitive; no public detail route." },
  },
  {
    id: "passport",
    name: "Passport",
    status: "roadmap",
    route: null,
    publicRole: "Roadmap primitive",
    canonicalDescription: "Passport is a roadmap primitive.",
    detailRouteAllowed: false,
    testFlight: { status: "not-applicable", evidence: "Roadmap primitive; no public detail route." },
  },
  {
    id: "orb",
    name: "Orb",
    status: "roadmap",
    route: null,
    publicRole: "Roadmap primitive",
    canonicalDescription: "Orb is a roadmap primitive.",
    detailRouteAllowed: false,
    testFlight: { status: "not-applicable", evidence: "Roadmap primitive; no public detail route." },
  },
  {
    id: "realms",
    name: "Realms",
    status: "roadmap",
    route: null,
    publicRole: "Roadmap primitive",
    canonicalDescription: "Realms is a roadmap primitive.",
    detailRouteAllowed: false,
    testFlight: { status: "not-applicable", evidence: "Roadmap primitive; no public detail route." },
  },
  {
    id: "v1llains",
    name: "V1llains",
    status: "roadmap",
    route: null,
    publicRole: "Roadmap primitive",
    canonicalDescription: "V1llains is a roadmap primitive.",
    detailRouteAllowed: false,
    testFlight: { status: "not-applicable", evidence: "Roadmap primitive; no public detail route." },
  },
] as const satisfies readonly Primitive[];

export const PUBLIC_PRIMITIVES = [...LIVE_PRIMITIVES, ...BETA_PRIMITIVES] as const;
export const ALL_PRIMITIVES = [...PUBLIC_PRIMITIVES, ...ROADMAP_PRIMITIVES] as const;

export type RouteStatus = "live" | "hidden" | "redirect" | "system";
export type RouteSurface = "top-nav" | "footer" | "search" | "hidden" | "xml";

export type BrandRoute = {
  path: string;
  status: RouteStatus;
  surfaces: readonly RouteSurface[];
  sitemap: boolean;
  note: string;
  redirectTo?: string;
};

export const BRAND_ROUTES = [
  { path: "/", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Home" },
  { path: "/about", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Company" },
  { path: "/spine", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Live primitive" },
  { path: "/sidekick", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Beta primitive" },
  { path: "/blurbs", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Beta primitive" },
  { path: "/pods", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Beta primitive" },
  { path: "/wallet", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Beta primitive" },
  { path: "/download", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "iOS TestFlight" },
  { path: "/contact", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Sales and business contact" },
  { path: "/support", status: "live", surfaces: ["footer", "search"], sitemap: true, note: "Lean support page" },
  { path: "/privacy", status: "live", surfaces: ["footer"], sitemap: true, note: "Lean privacy page" },
  { path: "/terms", status: "live", surfaces: ["footer"], sitemap: true, note: "Lean terms page" },
  { path: "/newsroom", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Company updates" },
  { path: "/newsroom/:slug", status: "live", surfaces: ["search"], sitemap: true, note: "News detail route" },
  { path: "/stories", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Story index" },
  { path: "/stories/:slug", status: "live", surfaces: ["search"], sitemap: true, note: "Story detail route" },
  { path: "/stories/share", status: "live", surfaces: ["hidden"], sitemap: false, note: "Allowed hidden story submission route" },
  { path: "/careers", status: "live", surfaces: ["top-nav", "footer", "search"], sitemap: true, note: "Hiring" },
  { path: "/brand", status: "live", surfaces: ["footer"], sitemap: true, note: "Brand assets and usage" },
  { path: "/sitemap.xml", status: "system", surfaces: ["xml"], sitemap: false, note: "XML sitemap only" },
  { path: "/rss.xml", status: "system", surfaces: ["xml", "footer"], sitemap: false, note: "RSS feed" },
  { path: "/pricing", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "Hidden until pricing decision lands" },
  { path: "/developers/docs", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "Docs menu label may say soon, no public route" },
  { path: "/developers/sdk", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "SDK menu label may say soon, no public route" },
  { path: "/roadmap", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "No roadmap route; roadmap rail lives on /about" },
  { path: "/calls", status: "redirect", surfaces: ["hidden"], sitemap: false, note: "ARC Terminal feature, not standalone route", redirectTo: "/spine" },
  { path: "/messages", status: "redirect", surfaces: ["hidden"], sitemap: false, note: "ARC Terminal feature, not standalone route", redirectTo: "/pods" },
  { path: "/profile", status: "redirect", surfaces: ["hidden"], sitemap: false, note: "ARC Terminal feature, not standalone route", redirectTo: "/wallet" },
  { path: "/vortex", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "Roadmap primitive; no detail route" },
  { path: "/passport", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "Roadmap primitive; no detail route" },
  { path: "/orb", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "Roadmap primitive; no detail route" },
  { path: "/realms", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "Roadmap primitive; no detail route" },
  { path: "/v1llains", status: "hidden", surfaces: ["hidden"], sitemap: false, note: "Roadmap primitive; no detail route" },
] as const satisfies readonly BrandRoute[];

export const HERO_SUBHEADLINE_OPTIONS = [
  {
    id: "sovereign-agentic-os",
    text: "Jokuh is a sovereign agentic OS for private memory, agents, communication, and wallet workflows.",
  },
  {
    id: "arc-command-center",
    text: "ARC Terminal is the private command center for your AI memory, agents, messages, and wallet.",
  },
  {
    id: "privacy-first-ai-os",
    text: "A privacy-first AI operating system for teams that need memory, agents, identity, and action in one place.",
  },
] as const;

export const RECOMMENDED_HERO_SUBHEADLINE_ID = "sovereign-agentic-os";

export const PROOF_OF_LIFE = {
  primary: "iOS TestFlight live.",
} as const;

export const ARC_TERMINAL_FEATURE_REDIRECTS = {
  calls: "/spine",
  messages: "/pods",
  profile: "/wallet",
} as const;

export const ROADMAP_PLACEMENT = {
  route: null,
  surface: "/about",
  component: "roadmap rail",
  guard: "status='roadmap'",
} as const;

export const CONTACT_SURFACES = {
  contact: {
    route: "/contact",
    purpose: "Sales, pilots, partnerships, business inquiries, and investor/founder-facing requests.",
    email: PUBLIC_EMAILS.sales,
  },
  support: {
    route: "/support",
    purpose: "Product help, account issues, privacy requests, troubleshooting, and user questions.",
    email: PUBLIC_EMAILS.support,
  },
} as const;

export const DEVELOPERS_NAV_BEHAVIOR = {
  visible: true,
  state: "disabled-soon",
  href: null,
  labels: ["Docs soon", "SDK soon"],
} as const;

export const VOICE_POLICY = {
  rules: ["Precise over hype.", "Evidence over adjectives.", "Plain claims over mystique.", "Name early-access limits when relevant."],
  bannedTerms: [
    "revolutionary",
    "game-changing",
    "next-gen",
    "powered by AI",
    "military-grade",
    "bank-grade",
    "bulletproof",
    "unbreakable",
    "trustless",
    "fully secure",
    "fully private",
    "impossible to breach",
    "mathematically guaranteed",
    "zero-risk",
    "cannot be hacked",
  ],
} as const;

export const PLATFORM_AVAILABILITY = {
  live: [{ id: "ios-testflight", label: "iOS TestFlight" }],
  roadmap: [{ id: "macos-q3", label: "macOS desktop", timing: "Q3" }],
} as const;

export const SECURITY_CLAIM_POLICY = {
  auditedEvidenceRequiredFor: ["TEE", "ZKP", "FHE", "company cannot read user data", "math proves privacy"],
  requiredQualifiersUntilEvidence: ["audit pending", "architected for", "designed for", "roadmap"],
  forbiddenUnqualifiedClaims: [
    "TEE in production",
    "ZKP in production",
    "FHE in production",
    "company cannot read user data",
    "the math proves privacy",
  ],
} as const;

export const CONSENT_POSTURE = {
  analyticsDefault: false,
  marketingDefault: false,
  implicitAcceptAllowed: false,
  rejectAllRequired: true,
} as const;

export const SEO_REQUIREMENTS = {
  canonicalOrigin: BRAND_ORIGIN,
  sitemapUrl: `${BRAND_ORIGIN}/sitemap.xml`,
  ogImageSize: { width: 1200, height: 630 },
  jsonLdType: "Organization",
} as const;

export const FOUNDER_APPROVAL_REQUIRED_FOR = [
  "Primitive status",
  "Public route policy",
  "Email whitelist",
  "Domain policy",
  "Security or privacy claim policy",
  "Developer nav behavior",
  "Pricing visibility",
  "Public product hierarchy",
  "Hero H1, subheadline, or proof-of-life line",
  "Any roadmap primitive route or placement",
  "Deploy command or production build target",
] as const;
