/**
 * **Purpose:** Copy for the `/defense` page (live; linked from the footer). The page is the app itself: a Jokuh Docs
 * sheet in the app shell that plays through these sections on its own (`components/defense/`).
 * **Connects to:** `pages/DefensePage.tsx`, `components/defense/*`, `lib/site-search-articles.ts` (search entry),
 * `public/defense/captures/manifest.json` (real-app recordings, `scripts/capture-app-demo.mjs`).
 *
 * Accuracy rules (public claim surface aimed at government buyers):
 * - No contracts, awards, registrations, certifications, agency names, or endorsements — none exist.
 * - "Built today" lists only shipped facts. OO runs on third-party cloud models via OpenRouter today:
 *   never claim on-device, air-gapped, self-hosted, on-prem, sovereign, or US-only processing as available.
 * - Roadmap items are phrased as intent ("We're building toward…").
 * - E2EE claims cover direct and group messages only (Mail and Spine are not E2EE; see `/privacy`).
 * - Moderation exists (report and block): never imply "no moderation" or "uncensored".
 * - Calls: `/security` and `/privacy` make no end-to-end encryption claim for calls (calls route through real-time
 *   media providers). Claim nothing more here.
 * - Every app screen on the page is a recording of the real app (`/demo`, demo data), labelled as an illustrative
 *   scenario. Diagrams are drawn as diagrams and say so; never draw a fake app screen.
 * - No partner, competitor, agency or customer names.
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
    "Jokuh is a secure communications and identity platform with a private AI workspace: end-to-end encrypted messages, voice and video calls, and phishing-resistant passkey sign-in, in one app on the devices people already carry.",
  primary: { label: "Talk to our team", href: "/contact" },
  secondary: { label: "Read our security approach", href: "/security" },
} as const;

/** The plain answer to "what are you building, and what's your solution?" — first thing after the hero. */
export const DEFENSE_SOLUTION = {
  title: "What we're building",
  problem: {
    label: "The problem",
    body: "People who protect others still coordinate on consumer apps that profile them, sign in with passwords that get phished, and paste sensitive context into AI tools that keep it.",
  },
  solution: {
    label: "Our solution",
    body: "One app that combines encrypted messaging and calling, an identity backed by keys on the user's device, and a private workspace with an AI assistant, all behind a single passkey sign-in. Direct and group messages are sealed end to end, so the platform in the middle can't read them.",
  },
} as const;

export type DefenseUseCase = { id: string; title: string; body: string };

/** Framed as what we're designing for — never as deployments (there are none yet). */
export const DEFENSE_USE_CASES = {
  title: "Where it fits",
  intro: "Early use cases we're designing for. This is not a list of deployments.",
  items: [
    {
      id: "team-coordination",
      title: "Secure team coordination",
      body: "Encrypted group messages and calls for distributed teams, on personal or issued phones and laptops.",
    },
    {
      id: "phishing-resistant-identity",
      title: "Phishing-resistant identity",
      body: "Passkey sign-in bound to the device, so there's no shared password to steal, reuse, or phish.",
    },
    {
      id: "private-ai-workspace",
      title: "A private AI workspace",
      body: "A timeline, docs, and an assistant that works only with what the user chooses to share. Not for classified or controlled information today.",
    },
  ] satisfies DefenseUseCase[],
} as const;

/** Honest status for government readers: no contracts, authorizations, or certifications yet. */
export const DEFENSE_WORKING_WITH_US = {
  title: "Working with government",
  body: "We're at the start of the government process. We don't hold federal contracts, authorizations, or certifications yet, and Jokuh isn't approved for classified information or CUI. We're open to pilots, research partnerships, and early programs that need private communications and identity.",
  buttonLabel: "Talk to our team",
  buttonHref: "/contact",
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

// ─── The doc (the page is a Jokuh Docs sheet) ────────────────────────────────

/** Doc chrome: the file name in the meta line and the doc icon (Docs pages carry an emoji icon). */
export const DEFENSE_DOC = {
  name: "Jokuh for defense teams",
  icon: "\u{1F6E1}\uFE0F",
  meta: "Jokuh for defense teams \u00b7 Jokuh Docs \u00b7 2 min read",
  heroDiagramCaption:
    "Diagram. One passkey sign-in on the device opens every part of Jokuh. Direct and group messages travel sealed between devices.",
} as const;

/** Nodes of the connected-system diagram (hero block + the persistent mini map beside the doc). */
export type DefenseNodeId = "identity" | "messages" | "calls" | "spine" | "docs" | "oo" | "bubbles";

export const DEFENSE_SYSTEM_NODES: Record<DefenseNodeId, { label: string; sub: string }> = {
  identity: { label: "Identity", sub: "Passkey on device" },
  messages: { label: "Messages", sub: "End-to-end encrypted" },
  calls: { label: "Calls", sub: "Voice and video" },
  spine: { label: "Spine", sub: "Shared memory" },
  docs: { label: "Docs", sub: "Lives in Spine" },
  oo: { label: "OO", sub: "AI assistant" },
  bubbles: { label: "Bubbles", sub: "Teams and huddles" },
};

export const DEFENSE_SYSTEM_PACKET_LABEL = "End-to-end encrypted";

/** Capture surfaces the walkthrough plays (keys of `public/defense/captures/manifest.json`). */
export type DefenseCaptureSurface = "signin" | "id" | "drawer" | "texts" | "calls" | "spine" | "docs" | "oo";

export type DefenseStep = {
  id: string;
  number: string;
  title: string;
  body: string;
  /** Phrase inside `body` the doc highlights while the step plays. */
  mark: string;
  /** Recordings, in order (a second one takes over halfway, e.g. Spine → the briefing opening in Docs). */
  captures: DefenseCaptureSurface[];
  /** What it connects through, shown as chips under the recording. */
  path: DefenseNodeId[];
  /** The part this step is about (its energy colour rings the recording). */
  node: DefenseNodeId;
};

export const DEFENSE_WALKTHROUGH = {
  title: "See it work",
  label: "Illustrative scenario \u00b7 real app UI with demo data",
  intro:
    "How a team could run one working day in Jokuh. Every screen below is a recording of the real app running on demo data. It shows no real team, agency, or deployment.",
  captureCaption: "Real app recording \u00b7 demo data",
  steps: [
    {
      id: "identity",
      number: "1",
      title: "One identity",
      body: "Each person signs in with a passkey bound to their device, so there's no shared password to phish. The same identity carries through every part of the app.",
      mark: "a passkey bound to their device",
      captures: ["id"],
      path: ["identity"],
      node: "identity",
    },
    {
      id: "team",
      number: "2",
      title: "The team space",
      body: "The team gets a Bubble, with a huddle for each part of the work, and everyone can see who's live in voice right now.",
      mark: "who's live in voice right now",
      captures: ["drawer"],
      path: ["identity", "bubbles"],
      node: "bubbles",
    },
    {
      id: "texts",
      number: "3",
      title: "Encrypted coordination",
      body: "Direct and group messages are end-to-end encrypted. Each one is sealed on the sender's device and opened on the recipient's, so the platform in the middle only relays ciphertext.",
      mark: "sealed on the sender's device and opened on the recipient's",
      captures: ["texts"],
      path: ["identity", "messages", "bubbles"],
      node: "messages",
    },
    {
      id: "calls",
      number: "4",
      title: "Reach anyone",
      body: "Voice and video calls start from the same roster, one tap from the person you need.",
      mark: "one tap from the person you need",
      captures: ["calls"],
      path: ["identity", "calls"],
      node: "calls",
    },
    {
      id: "spine",
      number: "5",
      title: "Shared memory",
      body: "Spine keeps the day on one timeline, and a briefing written in Docs lives right on it. Spine and Docs are private to the account, but they are not end-to-end encrypted.",
      mark: "a briefing written in Docs lives right on it",
      captures: ["spine", "docs"],
      path: ["spine", "docs"],
      node: "spine",
    },
    {
      id: "oo",
      number: "6",
      title: "Private AI",
      body: "OO, the assistant, can summarize a handover using only the context the user chooses to share. It runs on third-party cloud AI models today.",
      mark: "only the context the user chooses to share",
      captures: ["oo"],
      path: ["spine", "docs", "oo"],
      node: "oo",
    },
  ] satisfies DefenseStep[],
} as const;

/** "How it's connected": the trust-boundary data-flow diagram. Hover or tap a part for its one line. */
export type DefenseTrustNodeId = "passkey" | "keys" | "relay" | "recipient" | "calls" | "store" | "oo" | "roadmap";
export type DefenseTrustKind = "sealed" | "account" | "ai" | "neutral" | "roadmap";

export const DEFENSE_CONNECTED = {
  title: "How it's connected",
  intro:
    "Where data is sealed end to end, where it isn't, and what leaves for AI. Tap any part of the diagram to see what it does.",
  diagramCaption: "Diagram. Trust boundaries in Jokuh today.",
  zones: {
    device: "Your device",
    recipient: "Recipient's device",
    platform: "Jokuh servers",
    ai: "Third-party AI models",
  },
  nodes: {
    passkey: {
      label: "Passkey",
      kind: "sealed",
      line: "You sign in with a passkey that stays on your device, so there's no password to phish.",
    },
    keys: {
      label: "Message keys",
      kind: "sealed",
      line: "The keys behind your messages are held on your devices. They seal and open direct and group messages.",
    },
    relay: {
      label: "Messages relay",
      kind: "sealed",
      line: "Direct and group messages are sealed on your device and opened on the recipient's. Jokuh relays ciphertext it can't read.",
    },
    recipient: {
      label: "Opens on device",
      kind: "sealed",
      line: "The devices in the conversation are the only places a message is opened.",
    },
    calls: {
      label: "Calls",
      kind: "neutral",
      line: "Voice and video calls connect through a real-time media provider. This page makes no end-to-end encryption claim for calls.",
    },
    store: {
      label: "Spine \u00b7 Docs \u00b7 Mail",
      kind: "account",
      line: "Spine, Docs, and Mail are private to your account and stored on our servers. They are not end-to-end encrypted, and we say so plainly.",
    },
    oo: {
      label: "OO",
      kind: "ai",
      line: "Only the context you choose to share is sent to third-party cloud AI models to answer you.",
    },
    roadmap: {
      label: "US-only \u00b7 Self-hosted",
      kind: "roadmap",
      line: "US-only processing and self-hosted deployment are on our roadmap. Neither is available today.",
    },
  } satisfies Record<DefenseTrustNodeId, { label: string; kind: DefenseTrustKind; line: string }>,
  legend: [
    { kind: "sealed", label: "Sealed end to end" },
    { kind: "account", label: "Private to your account, not end-to-end encrypted" },
    { kind: "ai", label: "Sent to third-party AI, only what you choose" },
    { kind: "roadmap", label: "Roadmap" },
  ] satisfies { kind: DefenseTrustKind; label: string }[],
  /** Order the diagram walks through by itself during autoplay. */
  tour: ["passkey", "keys", "relay", "recipient", "calls", "store", "oo", "roadmap"] satisfies DefenseTrustNodeId[],
} as const;

/** "At a glance": compact capability tiles, each a crop of a real-app recording. */
export type DefenseCapability = {
  id: string;
  title: string;
  body: string;
  capture: DefenseCaptureSurface;
  /** Crop focus inside the recording's poster (CSS object-position). */
  focus: string;
  node: DefenseNodeId;
};

export const DEFENSE_CAPABILITIES = {
  title: "At a glance",
  intro: "Crops of the same real-app recordings, one per capability.",
  items: [
    { id: "thread", title: "Encrypted threads", body: "Direct and group messages, sealed end to end.", capture: "texts", focus: "72% 56%", node: "messages" },
    { id: "live", title: "Live voice", body: "See who's live in a huddle and join in.", capture: "drawer", focus: "82% 33%", node: "bubbles" },
    { id: "identity", title: "One identity", body: "Passkey sign-in. No password to phish.", capture: "id", focus: "55% 42%", node: "identity" },
    { id: "calls", title: "Voice and video", body: "Calls from the same roster.", capture: "calls", focus: "45% 18%", node: "calls" },
    { id: "doc", title: "Shared docs", body: "Briefings written in Docs, on the Spine day.", capture: "docs", focus: "35% 38%", node: "docs" },
    { id: "summary", title: "AI summaries", body: "OO works from the context you choose.", capture: "oo", focus: "45% 62%", node: "oo" },
  ] satisfies DefenseCapability[],
} as const;

/** Bottom-of-doc links (the doc replaces the site footer on this page). */
export const DEFENSE_DOC_FOOTER_LINKS = [
  { label: "Security", href: "/security" },
  { label: "Privacy", href: "/privacy" },
  { label: "Contact", href: "/contact" },
] as const;

/** Auto-play: the toggle's label and the replay label at the end. */
export const DEFENSE_AUTOPLAY = {
  label: "Auto-play",
  replay: "Replay",
} as const;
