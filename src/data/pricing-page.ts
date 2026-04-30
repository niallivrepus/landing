/** Aligned with docs/landing-page-brief/.../business/pricing.md — no public dollar amounts until finance signs off. */

export const PRICING_HERO = {
  eyebrow: "Jokuh",
  title: "Pricing",
  lead: "Simple plans for individuals, teams, and enterprise deployments.",
  subhead:
    "Jokuh pricing scales with real usage: encrypted memory, AI inference, marketplace activity, and deployment depth.",
} as const;

export const PRICING_PRINCIPLE = {
  body:
    "Most software rewards more seats and thinner usage. Jokuh rewards depth: Spine storage, Sidekick, Calls, Blurbs, and Wallet activity compound over time—the math of an operating system, not a light subscription app.",
} as const;

export type ConsumerTierId = "plus" | "pro" | "ultra";

export type ConsumerTier = {
  id: ConsumerTierId;
  name: string;
  tagline: string;
  bullets: string[];
  ctaLabel: string;
};

export const CONSUMER_TIERS: readonly ConsumerTier[] = [
  {
    id: "plus",
    name: "Plus",
    tagline: "For individuals starting their sovereign workflow.",
    bullets: [
      "Spine—encrypted memory (entry-level capacity)",
      "Blurbs, Calls, Messages, Profile",
      "Sidekick agent (limited inference)",
      "Marketplace and Wallet access",
    ],
    ctaLabel: "Get Plus",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For knowledge workers who live inside Jokuh.",
    bullets: [
      "Spine—expanded encrypted capacity",
      "Everything in Plus",
      "Sidekick (extended inference)",
      "Priority support",
    ],
    ctaLabel: "Get Pro",
  },
  {
    id: "ultra",
    name: "Ultra",
    tagline: "For power users and identity-heavy creators.",
    bullets: [
      "Spine—high-capacity encrypted storage",
      "Everything in Pro",
      "Sidekick (premium inference, multi-model)",
      "Hardware-ready (when available)",
    ],
    ctaLabel: "Get Ultra",
  },
] as const;

export const PRICING_TBD_LINE = "Starting from — to be published";

export type PlanComparisonRow = {
  feature: string;
  plus: string;
  pro: string;
  ultra: string;
};

export type PlanComparisonGroup = {
  label: string;
  rows: readonly PlanComparisonRow[];
};

export const CONSUMER_PLAN_COMPARISON_GROUPS: readonly PlanComparisonGroup[] = [
  {
    label: "Core surfaces",
    rows: [
      {
        feature: "Blurbs, Calls, Messages, Profile",
        plus: "✓",
        pro: "✓",
        ultra: "✓",
      },
      {
        feature: "Marketplace & Wallet",
        plus: "✓",
        pro: "✓",
        ultra: "✓",
      },
    ],
  },
  {
    label: "Spine & agents",
    rows: [
      {
        feature: "Spine (encrypted memory)",
        plus: "Entry-level capacity",
        pro: "Expanded capacity",
        ultra: "High-capacity storage",
      },
      {
        feature: "Sidekick",
        plus: "Limited inference",
        pro: "Extended inference",
        ultra: "Premium inference, multi-model",
      },
      {
        feature: "Hardware-ready",
        plus: "—",
        pro: "—",
        ultra: "When available",
      },
    ],
  },
  {
    label: "Support & commercial",
    rows: [
      {
        feature: "Support",
        plus: "Standard",
        pro: "Priority",
        ultra: "Priority",
      },
      {
        feature: "Price",
        plus: PRICING_TBD_LINE,
        pro: PRICING_TBD_LINE,
        ultra: PRICING_TBD_LINE,
      },
    ],
  },
] as const;

export type B2BComparisonRow = {
  feature: string;
  business: string;
  enterprise: string;
};

export type B2BComparisonGroup = {
  label: string;
  rows: readonly B2BComparisonRow[];
};

/** Business vs Enterprise — Jokuh-shaped, not spec numbers. */
export const B2B_PLAN_COMPARISON_GROUPS: readonly B2BComparisonGroup[] = [
  {
    label: "Essentials",
    rows: [
      {
        feature: "Encrypted Spine memory",
        business: "Included",
        enterprise: "Expanded",
      },
      {
        feature: "Sidekick agents",
        business: "Included",
        enterprise: "Expanded",
      },
      {
        feature: "Calls, Blurbs, Wallet",
        business: "✓",
        enterprise: "✓",
      },
    ],
  },
  {
    label: "Security",
    rows: [
      {
        feature: "Admin controls",
        business: "Standard",
        enterprise: "Advanced",
      },
      {
        feature: "Audit logs",
        business: "✓",
        enterprise: "✓",
      },
      {
        feature: "SSO, SCIM, EKM",
        business: "Add-on",
        enterprise: "Included",
      },
    ],
  },
  {
    label: "Support",
    rows: [
      {
        feature: "Support",
        business: "Priority",
        enterprise: "Dedicated",
      },
      {
        feature: "Contract",
        business: "Annual",
        enterprise: "Custom",
      },
    ],
  },
] as const;

export type BusinessOffer = {
  name: string;
  sublabel: string;
  /** Main price line: mirrors OpenAI "Custom pricing" / "$20" slot. */
  priceHeadline: string;
  priceSubline?: string;
  description: string;
  bullets: readonly string[];
  ctaLabel: string;
  href: string;
  /** Visual emphasis in grid (e.g. enterprise card). */
  highlight?: boolean;
};

export const BUSINESS_OFFERS: readonly BusinessOffer[] = [
  {
    name: "Jokuh Business",
    sublabel: "Teams",
    priceHeadline: "Team quote",
    priceSubline: "Built around usage and rollout size.",
    description: "A secure workspace for teams using Jokuh across memory, agents, calls, wallet, and marketplace workflows.",
    bullets: [
      "Admin controls and audit logs",
      "Org Spine, Sidekick, Calls, Blurbs",
      "Priority rollout support",
    ],
    ctaLabel: "Contact sales",
    href: "/contact",
  },
  {
    name: "Jokuh Enterprise",
    sublabel: "Scale",
    priceHeadline: "Custom pricing",
    priceSubline: "For regulated and global deployments.",
    description:
      "For organizations that need private infrastructure, advanced controls, and named operational guarantees.",
    bullets: [
      "Private deployment options",
      "SSO, SCIM, EKM, SIEM, RBAC",
      "SLAs and custom legal terms",
    ],
    ctaLabel: "Contact sales",
    href: "/contact",
    highlight: true,
  },
] as const;

export const PERSONAL_PLANS_STRIP = {
  title: "Looking for personal plans?",
  line: "Plus, Pro, and Ultra are in early access. Try Jokuh on TestFlight today.",
  ctaLabel: "Join TestFlight",
} as const;

export const TRUSTED_LINE = "Backed by Red Beard Ventures and Denarii Labs. Supported by Avalanche, RunPod, Hume AI, and Kihew.";

export const INCLUDED_EVERYWHERE = [
  "End-to-end encryption.",
  "Trusted Execution Environment computation.",
  "Spine memory (capacity scales with tier).",
  "Sidekick agentic runtime (inference quota scales with tier).",
  "Native multi-chain Wallet.",
  "Marketplace access.",
  "Identity / Sigil.",
] as const;

export const NEVER_PAY_FOR = [
  "Selling your data. We cannot—we cannot read it.",
  "Ads inside the product.",
  "Surprise per-seat ratchets.",
  "Lock-in. Spine exports are first-class.",
] as const;

export const PRICING_FAQ = [
  {
    question: "Do you charge per seat?",
    answer:
      "Seats matter for Business and Enterprise, but usage depth matters more. We quote against rollout shape, storage, inference, and deployment needs.",
  },
  {
    question: "Can I try before I buy?",
    answer:
      "Yes. Personal plans are available through TestFlight. Business pilots are available for qualified teams.",
  },
  {
    question: "Do prices change later?",
    answer: "Existing tiers are honored for existing users.",
  },
  {
    question: "Are there volume discounts?",
    answer: "Yes for Enterprise. Talk to sales for volume, infrastructure, and support terms.",
  },
] as const;
