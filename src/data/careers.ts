export const CAREERS_VALUES = [
  {
    title: "People first",
    body: "We build for humans in the loop—clear consent, understandable retention, and products that fail safely when the world gets messy.",
  },
  {
    title: "Act with humility",
    body: "We assume our models and UX will be wrong sometimes. We design for feedback, audits, and fast iteration instead of brittle certainty.",
  },
  {
    title: "Respect the power of the record",
    body: "Transcripts change careers, cases, and communities. We treat diarization, provenance, and access control as first-class engineering problems.",
  },
  {
    title: "Ship clarity",
    body: "Great speech infra feels obvious in hindsight. We chase that through tight APIs, honest benchmarks, and documentation teams actually use.",
  },
] as const;

export const CAREERS_OPERATING_PRINCIPLES = [
  {
    title: "Find a way",
    body: "We give teams room to propose paths, run small experiments, and own outcomes—especially when the spec is fuzzy and the stakes are high.",
  },
  {
    title: "Creativity over control",
    body: "Prefer inventive constraints and composable tools over heavy process. When in doubt, prototype and measure.",
  },
  {
    title: "Update quickly",
    body: "We share context early, write decisions down, and revise when new data arrives. Velocity without learning is just motion.",
  },
  {
    title: "Intense focus",
    body: "We work hard on a small number of bets. Saying no protects depth on pods, spine, vortex, and the graph that ties them together.",
  },
] as const;

export const CAREERS_BENEFITS = [
  {
    heading: "For employees",
    items: [
      "Competitive compensation and meaningful equity",
      "Health coverage options (details by region)",
      "Stipends for home office and connectivity",
      "Flexible PTO and explicit recharge norms",
    ],
  },
  {
    heading: "Life & family",
    items: [
      "Parental and caregiver leave policies",
      "Mental health resources and flexible scheduling where roles allow",
      "Support for relocation on select roles",
    ],
  },
  {
    heading: "Culture & development",
    items: [
      "Learning budget for conferences, courses, and books",
      "Internal demos, journal clubs, and safety reviews",
      "Team offsites and intentional async-first collaboration",
    ],
  },
] as const;

export const CAREERS_FEATURED_PROGRAMS = [
  {
    title: "Jokuh residency",
    body: "A concentrated program for researchers and engineers who want to go deep on speech, diarization, or graph-backed identity—with a path toward full-time roles.",
    href: "/contact",
    cta: "Express interest",
  },
  {
    title: "Emerging talent",
    body: "Internships and early-career roles for people hungry to learn how production speech systems are built, tested, and governed.",
    href: "/contact",
    cta: "Learn more",
  },
] as const;

export const CAREERS_RESOURCES = [
  { label: "Legal & policies", href: "/legal", tag: "Company" },
  { label: "Ethics & compliance", href: "/ethics", tag: "Trust" },
  { label: "Research", href: "/research", tag: "Company" },
  { label: "Developer docs", href: "/developers/docs", tag: "Build" },
] as const;

export const CAREERS_CLOSING_CTA = {
  headline: "Shape how live speech becomes structured memory",
  buttonLabel: "View open roles",
  buttonHref: "mailto:careers@jokuh.com?subject=Open%20roles",
} as const;
