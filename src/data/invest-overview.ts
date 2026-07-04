/**
 * **Purpose:** Copy, links, vesting tiers, fund allocation, and FAQ for `/invest`.
 * **Connects to:** `InvestPage`, `InvestTokenCountdown`, search corpus, home suggestion pill.
 * **Parity:** Institutional resources proxy to `app.jokuh.com`; token rules are illustrative until definitive docs ship.
 */

import { PUBLIC_EMAILS } from "../config/brand-taxonomy";

/** Token economy launch — countdown target (noon Eastern, August 8, 2026). */
export const INVEST_TOKEN_RELEASE_AT = "2026-08-08T16:00:00.000Z";

export const INVEST_HERO = {
  eyebrow: "Capital & economy",
  title: "Build with us. Own the machine layer.",
  subtitle:
    "Qualified capital partners can review our pre-seed materials. Everyone else gets the same transparency on how the Jokuh economy token launches — on-platform only, vesting for every allocation, and rules we publish before a dollar moves.",
  primary: { label: "Open data room", href: "/dataroom" },
  secondary: { label: "Talk to the team", href: "/contact" },
} as const;

export type InvestResourceLink = {
  label: string;
  href: string;
  description: string;
  external?: boolean;
};

/** Institutional and narrative resources surfaced in the hero grid. */
export const INVEST_RESOURCE_LINKS: InvestResourceLink[] = [
  {
    label: "Data room",
    href: "/dataroom",
    description: "Financials, product roadmap, and diligence materials for qualified partners.",
    external: true,
  },
  {
    label: "Pitch deck",
    href: "/pitchdeck",
    description: "Pre-seed narrative, market, traction, and capital plan.",
    external: true,
  },
  {
    label: "Customer stories",
    href: "/stories",
    description: "How operators and makers use Jokuh in the wild.",
  },
  {
    label: "Manifesto",
    href: "/manifesto",
    description: "Why sovereign agentic systems matter — the thesis behind the company.",
  },
  {
    label: "Business overview",
    href: "/business",
    description: "Enterprise motion, primitives, and go-to-market for teams.",
  },
  {
    label: "Invest pipeline",
    href: "/xx/investpipeline",
    description: "Secure flow for qualified investors already in diligence.",
    external: true,
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Partnerships, pilots, and investor conversations with a human on the other end.",
  },
  {
    label: "Email the founder",
    href: `mailto:${PUBLIC_EMAILS.founderInvestor}`,
    description: "Direct line for serious inbound — sean@sierri.com.",
    external: true,
  },
];

export const INVEST_TOKEN_SECTION = {
  title: "Jokuh economy token",
  lead:
    "The economy token powers Realms, agents, and on-chain workflows inside Jokuh. It is not a casino ticker — it is infrastructure with lock-ups, published schedules, and purchase only through jokuh.com and the Jokuh app.",
  rules: [
    {
      title: "On-platform only at launch",
      body: "Purchase and allocation happen inside Jokuh — on the website and in the app. No CEX listings, no crypto.com, no third-party wallet swaps at release. World Liberty Fi–style distribution: you participate in our economy, not someone else's exchange.",
    },
    {
      title: "Everyone vests — no exceptions",
      body: "Founders, pre-seed partners, and $50 contributors share the same principle: tokens unlock on a published schedule. Small allocations still vest. We would rather leave money on the table than create rug-pull optics.",
    },
    {
      title: "Borrow, don't dump",
      body: "Team and insiders align like mature public companies: borrow against locked holdings for liquidity when needed, do not sell into the market. The goal is decades of compounding, not a launch-day chart.",
    },
    {
      title: "Operating company ≠ token",
      body: "Jokuh the company builds the OS. The economy token powers on-chain features inside the product. Equity conversations and token participation follow separate definitive documents — never conflated on this page.",
    },
  ],
} as const;

export type InvestVestingTier = {
  id: string;
  audience: string;
  lockUp: string;
  vesting: string;
  notes: string;
};

/** Illustrative vesting framework — superseded by definitive token/equity docs at close. */
export const INVEST_VESTING_TIERS: InvestVestingTier[] = [
  {
    id: "team",
    audience: "Founders & core team",
    lockUp: "12-month cliff",
    vesting: "48-month linear after cliff",
    notes: "Borrow-against-holdings policy; no discretionary market sales. Alignment modeled on SpaceX / pre-IPO discipline.",
  },
  {
    id: "preseed",
    audience: "Pre-seed & institutional",
    lockUp: "6-month hard lock",
    vesting: "18–24 month linear unlock",
    notes: "Schedule scales with round size; full calendar published in data room before wire.",
  },
  {
    id: "economy-small",
    audience: "Economy participants (< $1k)",
    lockUp: "30-day hold",
    vesting: "12-month linear",
    notes: "Still vesting — even small allocations unlock gradually so launch day stays stable.",
  },
  {
    id: "economy-mid",
    audience: "Economy participants ($1k–$25k)",
    lockUp: "90-day hold",
    vesting: "18-month linear",
    notes: "Tier published at T-minus 30 days; pro-rata if you participate across tranches.",
  },
  {
    id: "economy-large",
    audience: "Economy participants ($25k+)",
    lockUp: "6-month hold",
    vesting: "24-month linear",
    notes: "Large allocations mirror institutional discipline — longer lock, slower unlock.",
  },
  {
    id: "treasury",
    audience: "Treasury & ecosystem reserve",
    lockUp: "Protocol-enforced",
    vesting: "36-month programmatic release",
    notes: "On-chain schedule + quarterly transparency report. No discretionary treasury dumps.",
  },
];

export type InvestFundAllocation = {
  label: string;
  percent: number;
  detail: string;
  color: string;
};

/** Committed allocation framework for raised capital — illustrative percentages. */
export const INVEST_FUND_ALLOCATION: InvestFundAllocation[] = [
  {
    label: "Product & engineering",
    percent: 45,
    detail: "OS primitives, agents, wallet, Realms economy, and mobile/desktop parity.",
    color: "var(--color-blue-4)",
  },
  {
    label: "Security & audits",
    percent: 15,
    detail: "Smart-contract audits, infra hardening, bug bounty, and key management.",
    color: "var(--color-cyan-4)",
  },
  {
    label: "Go-to-market & community",
    percent: 20,
    detail: "Launch, creator programs, support, and economy education — not paid shills.",
    color: "var(--color-purple-4)",
  },
  {
    label: "Legal & compliance",
    percent: 10,
    detail: "Entity structure, token docs, regulatory counsel, and investor reporting.",
    color: "var(--color-orange-4)",
  },
  {
    label: "Reserve / runway",
    percent: 10,
    detail: "Shock absorption and opportunistic hires — untouched except board-approved draws.",
    color: "var(--color-green-4)",
  },
];

export const INVEST_FAQ = [
  {
    question: "Are you raising pre-seed right now?",
    answer:
      "Yes — for qualified venture, growth, and strategic partners who fit the machine-layer thesis. This page is transparent by design, not a billboard. If you are institutional, start in the data room or email sean@sierri.com. If you are exploring the economy token, read the vesting rules below — same discipline, different lane.",
  },
  {
    question: "Can I buy the token on an exchange?",
    answer:
      "Not at launch. Allocation is on jokuh.com and inside the Jokuh app only. We are not pursuing CEX listings or third-party wallet swap routes for the release. That keeps distribution aligned with people who actually use the product.",
  },
  {
    question: "Do small contributors get vesting too?",
    answer:
      "Yes. Every allocation — including the smallest economy participation — follows a published lock-up and linear vest. No instant unlocks for friends, no hidden wallets. The schedule is part of the launch docs, not a surprise after you pay.",
  },
  {
    question: "How is this different from equity?",
    answer:
      "Equity is ownership in Jokuh the company. The economy token powers on-chain features inside the OS. They are related strategically but legally separate. Investors in the company receive equity docs; economy participants receive token docs. Neither substitutes for the other.",
  },
  {
    question: "What happens on August 8, 2026?",
    answer:
      "That is our published economy token release date. Before then we publish final vesting calendars, allocation tiers, and on-platform purchase flow. The countdown above tracks to noon Eastern on August 8 — follow the data room and this page for T-minus updates.",
  },
  {
    question: "Is this investment advice?",
    answer:
      "No. Nothing on this page is an offer to sell securities or tokens where prohibited. Participation requires definitive documents, jurisdiction checks, and your own diligence. Numbers here describe our committed framework, not a guarantee of returns.",
  },
] as const;

export const INVEST_DISCLAIMER =
  "Illustrative framework only. Vesting percentages, dates, and fund allocation are committed policy directions — definitive terms appear in executed agreements and on-chain schedules. Jokuh the operating company and the economy token are separate legal constructs. This is not investment, tax, or legal advice.";

export const INVEST_CLOSING = {
  title: "Serious partners welcome. Speculators optional.",
  label: "Request a conversation",
  href: "/contact",
} as const;
