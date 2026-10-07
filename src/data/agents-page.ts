/**
 * **Purpose:** All copy for the public `/agents` page (Jokuh agents: inbox, next steps, OOpolis, status dots,
 * "Tell your agents", built-in Jokuh tools, connectors, safety, where to find it) and the homepage Agents tile.
 * **Accuracy rules (read before editing):**
 * - Source of truth is the app repo: `docs/agents-inbox-plan.md` (inbox, next steps, dots, routing, grace undo, Mac
 *   menu bar), `docs/oopolis-plan.md` (OOpolis states), `docs/agents-jokuh-tools-plan.md` §0 (built-in tools: owner
 *   only, risk tiers, receipts with Undo) and `docs/connectors-white-label.md` (connectors).
 * - Claim only what exists. Anything still shipping carries `status: "rolling-out"` and shows a "Rolling out" tag;
 *   flip it to `"live"` only once it is in the public builds on every platform.
 * - Calm and plain: no hype words, no numbers we can't back, no fake data that looks like real people. Agent names in
 *   the visuals are villain names from the OOpolis renders (`public/agents/`).
 * - Don't promise white-labelled sign-in, Google app verification, or connectors that aren't live.
 * **Connects to:** `pages/AgentsPage.tsx`, `console-home-products.ts` (Agents tile), `lib/site-search-articles.ts`.
 */

export type AgentsFeatureStatus = "live" | "rolling-out";

export const AGENTS_PAGE_TITLE = "Agents — Jokuh";

/** Rendered stills of the real app (OOpolis) — no real people. */
export const AGENTS_IMAGES = {
  /** OOpolis in the app: the city card with agents, connected apps and speech bubbles (780 × 1240). */
  city: "/agents/oopolis-city.webp",
  /** OOpolis as a phone sheet: state counts, today's actions, the city and "Tap an OO to give it a task" (750 × 1530). */
  phone: "/agents/oopolis-phone.webp",
  /** The hive: every agent as a cell in the colour of its state (1024 × 1024). */
  hive: "/agents/oopolis-hive.webp",
} as const;

export const AGENTS_CONSOLE_SENTENCE = "Agents that work across your apps. When one needs you, answer in a tap.";

export const AGENTS_HERO = {
  eyebrow: "Agents",
  title: "Your agents. Answer in a tap.",
  subtitle:
    "Villains that work for you across your apps and inside Jokuh. When one needs a decision, it asks, and you answer with a tap or a keystroke.",
  primary: { label: "Get Jokuh", href: "/download" },
  secondary: { label: "How it works", href: "#how-it-works" },
  note: "Agents are rolling out on iPhone, iPad, Mac, Android and the web. Anything marked Rolling out may not be on your device yet.",
} as const;

export type AgentsStep = { title: string; body: string };

export const AGENTS_STEPS: readonly AgentsStep[] = [
  {
    title: "Craft or pick a villain",
    body: "Start from a template or make your own. Give it a name, a personality and a job.",
  },
  {
    title: "Connect your apps",
    body: "Gmail, Discord, Slack, Stripe, Mercury and more. Each agent only gets the apps you connect to it.",
  },
  {
    title: "They work. You answer in a tap.",
    body: "Agents get on with it and come back when they finish or need you. One tap approves, answers or sends the next step.",
  },
];

export type AgentsFeature = {
  id: string;
  title: string;
  body: string;
  status: AgentsFeatureStatus;
};

/** The two large blocks with visuals. */
export const AGENTS_INBOX: AgentsFeature = {
  id: "inbox",
  title: "One inbox for everything that needs you",
  body: "Approvals, questions, anything that got stuck and work that just finished, from every agent, in one list. Each row has numbered answers: press 1, 2 or 3, or tap. On a Mac or the web, J and K move through the list, E clears a row and Enter opens it.",
  status: "rolling-out",
};

export const AGENTS_OOPOLIS: AgentsFeature = {
  id: "oopolis",
  title: "OOpolis, your agents as a living city",
  body: "Every agent you own, floating around Queen OO. Each one shows what it is doing right now: working, waiting on you, stuck, resting or asleep, with a speech bubble saying what it's on. Nothing is staged: an agent shown working has a run in progress. Tap one to give it a task.",
  status: "rolling-out",
};

/** Smaller feature cards. */
export const AGENTS_FEATURES: readonly AgentsFeature[] = [
  {
    id: "next-steps",
    title: "Next steps",
    body: "When an agent finishes, it can suggest up to two follow-ups, already written. Tap one to send it.",
    status: "rolling-out",
  },
  {
    id: "status-dots",
    title: "Status dots",
    body: "Small dots on the robot button show how your agents are doing: blue working, amber needs you, red stuck, green done. On a Mac they sit in the menu bar too.",
    status: "rolling-out",
  },
  {
    id: "tell-your-agents",
    title: "Tell your agents",
    body: "Type a task in home search, or start with @ and an agent's name. Jokuh picks the agent that fits and shows which one before it sends, so you can change it. Double-tap the robot button to say it instead.",
    status: "rolling-out",
  },
  {
    id: "jokuh-tools",
    title: "Built-in Jokuh tools",
    body: "Agents can work inside Jokuh without connecting anything: organize your Spine, write Docs, build mood boards and crime boards in Spaces, make images in Studio, sort and draft in Mail, and set up meetings. They act on your account only, and sending mail or meeting invites always asks first.",
    status: "rolling-out",
  },
];

export const AGENTS_CONNECTORS = {
  title: "Works with the apps you already use",
  body: "Each agent has its own logins, for only the apps you connect to it. Money apps are careful by default: Mercury connects read-only, and moving money in Stripe always asks first.",
  apps: [
    { name: "Gmail", note: null },
    { name: "Discord", note: null },
    { name: "Slack", note: null },
    { name: "Stripe", note: null },
    { name: "Mercury", note: "Read-only" },
  ],
  more: "and more",
} as const;

export type AgentsSafetyPoint = { title: string; body: string; status: AgentsFeatureStatus };

export const AGENTS_SAFETY = {
  title: "You stay in charge",
  intro: "Agents act only for you. Nothing sends, spends or deletes without your OK.",
  points: [
    {
      title: "Approvals",
      body: "Anything that sends, spends or deletes waits for your OK, and you get a notification when one is waiting.",
      status: "live",
    },
    {
      title: "Receipts",
      body: "Every action leaves a receipt you can look back on. Changes inside Jokuh, like a new Spine note, come with Undo.",
      status: "live",
    },
    {
      title: "Budgets",
      body: "Each agent has its own monthly budget and stops when it runs out. You can pause your agents any time.",
      status: "live",
    },
    {
      title: "Undo on send",
      body: "Whatever you send an agent waits two seconds first. Tap Undo, or press Esc, to take it back.",
      status: "rolling-out",
    },
  ] satisfies AgentsSafetyPoint[],
} as const;

export type AgentsLocation = { title: string; body: string; status: AgentsFeatureStatus };

export const AGENTS_WHERE = {
  title: "Where to find it",
  places: [
    {
      title: "The robot button",
      body: "In Text and in Bubbles. Tap it for Your agents; long-press it for quick approvals.",
      status: "live",
    },
    {
      title: "/oopolis",
      body: "Type /oopolis to open the city.",
      status: "rolling-out",
    },
    {
      title: "Home search",
      body: "Start typing a task and choose “Tell your agents”, or @ an agent by name.",
      status: "rolling-out",
    },
    {
      title: "Mac menu bar",
      body: "The Jokuh mask with your agents' status dots. Its menu lists what needs you. You can hide it in Settings.",
      status: "rolling-out",
    },
  ] satisfies AgentsLocation[],
} as const;

export const AGENTS_FAQ = [
  {
    question: "What can an agent do without asking?",
    answer:
      "Read what you've connected it to, and make private, reversible changes inside your own Jokuh, like adding a Spine note or a sticky to a board. Those come with Undo. Other changes in your apps either ask first or run on their own, depending on how you set the agent up. Anything that sends, spends or deletes always asks first.",
  },
  {
    question: "Who can my agents act for?",
    answer:
      "Only you. Its Jokuh tools work on your account, and only when you run it, @mention it, or it runs a routine you set up.",
  },
  {
    question: "Which apps can I connect?",
    answer:
      "Gmail, Discord, Slack, Stripe and Mercury (read-only), among others. Each agent gets only the apps you connect to it.",
  },
] as const;

export const AGENTS_CLOSING = {
  title: "Meet your agents.",
  label: "Get Jokuh",
  href: "/download",
} as const;

/** Inbox illustration rows (static). Agent names and avatars come from the OOpolis render — villains, not people. */
export type AgentsInboxDemoRow = {
  agent: string;
  avatar: string;
  kind: "Approval" | "Question" | "Done" | "Stuck";
  title: string;
  body?: string;
  actions: readonly { key: string; label: string }[];
};

export const AGENTS_INBOX_DEMO: readonly AgentsInboxDemoRow[] = [
  {
    agent: "Ledger",
    avatar: "/agents/avatars/ledger.webp",
    kind: "Approval",
    title: "Pay invoice #204",
    actions: [
      { key: "1", label: "Approve" },
      { key: "2", label: "Deny" },
      { key: "3", label: "Open" },
    ],
  },
  {
    agent: "Pilot",
    avatar: "/agents/avatars/pilot.webp",
    kind: "Question",
    title: "Flights to Lisbon: morning or evening?",
    actions: [
      { key: "1", label: "Morning" },
      { key: "2", label: "Evening" },
      { key: "3", label: "Reply…" },
    ],
  },
  {
    agent: "Inbox Zero",
    avatar: "/agents/avatars/inbox-zero.webp",
    kind: "Done",
    title: "Sorted today's email",
    body: "3 need a reply · 12 actions",
    actions: [
      { key: "1", label: "Draft the 3 replies" },
      { key: "2", label: "Unsubscribe the rest" },
    ],
  },
  {
    agent: "Muse",
    avatar: "/agents/avatars/muse.webp",
    kind: "Stuck",
    title: "Hit a snag",
    body: "Notion needs reconnecting",
    actions: [
      { key: "", label: "Retry" },
      { key: "", label: "Open" },
    ],
  },
];
