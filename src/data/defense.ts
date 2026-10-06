/**
 * **Purpose:** Copy for the `/defense` page (draft for owner review).
 * **Connects to:** `pages/DefensePage.tsx`, `lib/site-search-articles.ts` (search entry).
 *
 * Accuracy rules (public claim surface aimed at government buyers):
 * - No contracts, awards, registrations, certifications, agency names, or endorsements — none exist.
 * - "Built today" lists only shipped facts. OO runs on third-party cloud models via OpenRouter today:
 *   never claim on-device, air-gapped, self-hosted, on-prem, sovereign, or US-only processing as available.
 * - Roadmap items are phrased as intent ("We're building toward…").
 * - E2EE claims cover direct and group messages only (Mail and Spine are not E2EE; see `/privacy`).
 * - Moderation exists (report and block): never imply "no moderation" or "uncensored".
 */

export type DefensePrincipleIcon = "lock" | "key" | "seal" | "devices";

export type DefensePrinciple = {
  id: string;
  icon: DefensePrincipleIcon;
  title: string;
  body: string;
};

export const DEFENSE_HERO = {
  eyebrow: "Defense",
  title: "Defense technology for free people",
  subtitle:
    "Encrypted messages, an identity you control, and a private workspace for you and your AI. Built to protect the people who use it.",
  primary: { label: "Talk to our team", href: "/contact" },
  secondary: { label: "Read our security approach", href: "/security" },
} as const;

export const DEFENSE_PRINCIPLES_HEADING = {
  title: "Private intelligence, identity, and community.",
  intro: "Four principles shape what we build.",
} as const;

export const DEFENSE_PRINCIPLES: DefensePrinciple[] = [
  {
    id: "private-by-default",
    icon: "lock",
    title: "Private by default",
    body: "Direct and group messages are end-to-end encrypted from the first message. Privacy is the starting point, not a setting you have to find.",
  },
  {
    id: "you-hold-the-keys",
    icon: "key",
    title: "You hold the keys",
    body: "You sign in with a passkey that stays on your device, so there is no password to phish. The keys behind your identity are held by you.",
  },
  {
    id: "speech-not-altered",
    icon: "seal",
    title: "Speech that can't be silently altered",
    body: "An encrypted message is sealed on the sender's device and opened on the recipient's. A platform in the middle can't quietly read or rewrite it.",
  },
  {
    id: "built-for-the-field",
    icon: "devices",
    title: "Built for the field",
    body: "Native apps for iPhone, iPad, Mac, Android, and the web. It runs on the devices people already carry.",
  },
];

export const DEFENSE_BUILT_TODAY = {
  title: "What's built today",
  intro: "Shipping now, in the same apps anyone can download.",
  items: [
    "End-to-end encrypted direct and group messages.",
    "Voice and video calls.",
    "Passkey sign-in. No passwords to phish, and the passkey stays on your device.",
    "An identity you control, with keys held by you.",
    "Spine, a private timeline and workspace for you and your AI.",
    "OO, an assistant that works only with the context you choose to share. It runs on third-party cloud models today.",
    "Native apps for iPhone, iPad, Mac, Android, and the web.",
    "Report and block tools to keep communities safe.",
  ],
} as const;

export const DEFENSE_ROADMAP = {
  badge: "Roadmap",
  title: "On our roadmap",
  intro: "Not available yet. This is where we're headed, and we'll share timelines when we can stand behind them.",
  items: [
    {
      id: "dedicated-deployment",
      title: "Dedicated and self-hosted deployment",
      body: "We're building toward deployments an organization can run on infrastructure it controls.",
    },
    {
      id: "us-only-processing",
      title: "US-only data processing",
      body: "We're building toward an option that keeps data processing inside the United States.",
    },
  ],
} as const;

export const DEFENSE_CLOSING = {
  headline: "If your work is protecting people, let's talk.",
  buttonLabel: "Talk to our team",
  buttonHref: "/contact",
  /** Name meaning — rendered as a quiet signature line with the initials emphasized. */
  signature: {
    wordmark: "JOKUH",
    words: ["Joining", "Our", "Knowledge,", "Unifying", "Humanity."],
  },
} as const;

/** Plain-text signature line, exactly as approved: "JOKUH: Joining Our Knowledge, Unifying Humanity." */
export const DEFENSE_SIGNATURE_TEXT = `${DEFENSE_CLOSING.signature.wordmark}: ${DEFENSE_CLOSING.signature.words.join(" ")}`;
