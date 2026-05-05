import type { LAVA_LAMP_STYLES } from "../components/LavaLamp";

type LavaStyle = keyof typeof LAVA_LAMP_STYLES;

export type BusinessSolutionCard = {
  title: string;
  caption: string;
  tag: string;
  href: string;
  gradient: string;
  lavaLamp: LavaStyle;
  /** Optional cover photo (used on the home + overview cards when provided). */
  image?: string;
  /** Tailwind classes appended to the cover photo (e.g. "object-right"). */
  imageClassName?: string;
};

const dark = "linear-gradient(135deg, #111113 0%, #232326 100%)";

export const BUSINESS_HERO = {
  eyebrow: "The next era of work is here",
  title: "Build with private speech systems for your team",
  subtitle: "Jokuh turns conversations into structured memory your business can actually trust.",
  primary: { label: "Try now ↗", href: "/download" },
  secondary: { label: "Contact sales", href: "/contact" },
} as const;

export const BUSINESS_SOLUTIONS_HEADING = {
  title: "Enterprise-ready solutions for real impact",
  actionLabel: "See all solutions",
  actionHref: "/spine",
} as const;

export const BUSINESS_PLATFORM_HEADING = "The platform behind every conversation";

export const BUSINESS_SOLUTIONS: BusinessSolutionCard[] = [
  {
    title: "Texts",
    caption: "Threads that stay connected to the people, projects, and recordings behind them.",
    tag: "Product",
    href: "/messages",
    gradient: dark,
    lavaLamp: "arctic",
    image: "/product-hero/texts.jpg",
  },
  {
    title: "Spine",
    caption: "Threaded recall across every call, message, and note your team produces.",
    tag: "Product",
    href: "/spine",
    gradient: dark,
    lavaLamp: "aurora",
  },
  {
    title: "Profile",
    caption: "Portable, cryptographically verifiable identity for everyone in your workspace.",
    tag: "Product",
    href: "/profile",
    gradient: dark,
    lavaLamp: "ultraviolet",
  },
  {
    title: "Calls",
    caption: "Encrypted realtime audio with diarization and consent built into the protocol.",
    tag: "Product",
    href: "/calls",
    gradient: dark,
    lavaLamp: "ember",
    image: "/product-hero/calls.jpg",
    imageClassName: "object-[35%_center]",
  },
] as const;

export type BusinessFeatureBlock = {
  id: string;
  title: string;
  bullets: string[];
  links: { label: string; href: string; trailing?: "arrow" | "chevron" }[];
  lavaLamp: LavaStyle;
};

export const BUSINESS_FEATURE_BLOCKS: BusinessFeatureBlock[] = [
  {
    id: "workforce",
    title: "Enable your team with shared memory",
    bullets: [
      "Unlimited speech-to-text capture across your workspace, with generous credits to extend on Jokuh Enterprise.",
      "Integrations with the tools your team already uses — Slack, Notion, Linear, GitHub, Google Drive, and more.",
      "Business features like shared spaces, projects, tasks, record mode, and custom workspace agents.",
      "Access to Codex-grade review for code-aware workflows that run real engineering loops across your tools.",
    ],
    links: [
      { label: "Try Jokuh Business", href: "/contact", trailing: "arrow" },
      { label: "Learn about Jokuh Enterprise", href: "/contact", trailing: "chevron" },
    ],
    lavaLamp: "sunrise",
  },
  {
    id: "build",
    title: "Build memory-aware products and experiences",
    bullets: [
      "Accelerate roadmap with Jokuh APIs for capture, recall, and diarization across your stack.",
      "Get expert guidance on deployment and best practices from solutions architects.",
      "Optimize speech models for your domain or industry with private fine-tuning.",
    ],
    links: [{ label: "Learn about our APIs", href: "/contact", trailing: "chevron" }],
    lavaLamp: "jungle",
  },
  {
    id: "privacy",
    title: "Enterprise-grade data privacy, security, and admin controls",
    bullets: [
      "No customer data or metadata in training pipelines for Jokuh Business or Enterprise.",
      "Data encryption at rest and in transit, with custom retention windows on qualifying use cases.",
      "Single Sign-On (SSO) with domain verification, role-based access, and audit logs.",
      "SOC 2 Type 2 alignment and HIPAA compliance support — with BAAs available on request.",
    ],
    links: [{ label: "View enterprise privacy", href: "/manifesto", trailing: "chevron" }],
    lavaLamp: "glacier",
  },
];

export const BUSINESS_QUOTE = {
  text: "Speech is the most natural interface for work. Building memory we can actually trust around it changes what teams can hold in their head — and what they can ship.",
  attribution: "Jokuh Engineering Principle",
} as const;

export const BUSINESS_RESOURCES_CTA = {
  headline: "Guides and resources for integrating Jokuh into your business",
  buttonLabel: "Learn more",
  buttonHref: "/contact",
} as const;
