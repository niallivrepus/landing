/**
 * **Purpose:** Honest `/pricing` copy for early access — no invented tiers, no home redirect.
 * **Connects to:** `PricingPage`, `App.tsx` routes, footer sitemap.
 */

export const PRICING_HERO = {
  eyebrow: "Pricing",
  title: "Early access is included.",
  subtitle:
    "Jokuh is in public beta. Create an account, download the Mac app or iOS TestFlight build, or try the web app — there is no paid plan to unlock the product today.",
} as const;

export const PRICING_CARDS = [
  {
    id: "early-access",
    name: "Early access",
    price: "Free",
    detail: "While we are in beta",
    points: [
      "Your handle, keys, and identity on your machine",
      "Texts, Calls, Spine, Blurbs, and OO on the devices we ship",
      "End-to-end encryption by default — we do not sell your data",
    ],
    cta: { label: "Get started", href: "/#identity" },
  },
  {
    id: "teams",
    name: "Teams",
    price: "Coming later",
    detail: "Capacity and admin, not a gate",
    points: [
      "Paid tiers will expand agent capacity, team controls, and support SLAs",
      "Nothing in the beta is held back behind a paywall",
      "Talk to us if you are planning a rollout now",
    ],
    cta: { label: "Contact sales", href: "/contact" },
  },
] as const;

export const PRICING_FAQ = [
  {
    question: "Is Jokuh free right now?",
    answer:
      "Yes. Early access on iOS (TestFlight), Mac, and the web app is free. We will publish paid team and capacity plans alongside a broader public release — not as a surprise lock on features you already use.",
  },
  {
    question: "Do I need a credit card to try it?",
    answer:
      "No. Create a handle, join TestFlight, or open the web app. There is no trial timer and no card on file.",
  },
  {
    question: "What platforms can I use today?",
    answer:
      "iPhone and iPad via TestFlight, Mac via the notarized desktop app, and the rest of desktop through the browser at app.jokuh.com. Android is in active development.",
  },
  {
    question: "Will my account keep working when paid plans launch?",
    answer:
      "Yes. Early-access accounts stay on the product. Paid plans will add headroom for teams and heavier agent use, not revoke the personal workspace you already claimed.",
  },
] as const;
