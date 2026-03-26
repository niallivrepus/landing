/**
 * Long-form on-site news articles (benchmark tables, charts, testimonials).
 */

import { formatNewsDate, NEWS_ITEMS, type NewsItem } from "./news";

export type BenchmarkRow = { label: string; values: [string, string, string] };

export type TestimonialEntry = {
  id: string;
  company: string;
  quote: string;
  attribution: string;
  /** Paragraph after quote; use **term** for bold */
  followUp: string;
  /** Mini line chart: accuracy vs step */
  sparkline: { step: number; cortex: number; prior: number }[];
};

export type NewsFeatureDetailDocument = {
  kind: "feature";
  slug: string;
  metaLine: string;
  title: string;
  subtitle: string;
  /** Plain text for Web Speech API */
  speechText: string;
  introParagraphs: string[];
  benchmarkTable: {
    columns: [string, string, string, string];
    rows: BenchmarkRow[];
    footnote: string;
  };
  knowledgeWork: {
    title: string;
    paragraphs: string[];
  };
  chartFootnotes: {
    gdpval: string;
    swe: string;
    osworld: string;
  };
  testimonials: TestimonialEntry[];
};

export type NewsBriefDetailDocument = {
  kind: "brief";
  slug: string;
  metaLine: string;
  title: string;
  subtitle: string;
  introParagraphs: string[];
  bodyTitle: string;
  bodyParagraphs: string[];
};

export type NewsDetailDocument = NewsFeatureDetailDocument | NewsBriefDetailDocument;

export const NEWS_DETAIL_BY_SLUG: Record<string, NewsFeatureDetailDocument> = {
  "introducing-jokuh-cortex": {
    kind: "feature",
    slug: "introducing-jokuh-cortex",
    metaLine: "March 5, 2026 · Product · Release",
    title: "Introducing Jokuh Cortex",
    subtitle: "Designed for professional work.",
    speechText: [
      "Introducing Jokuh Cortex, designed for professional work.",
      "Cortex is our new reasoning and tool-use stack for pods and blurbs.",
      "On PodBench Verified, Cortex reaches seventy eight point four percent, up from sixty one point two on the prior generation.",
      "On Threadathlon, it scores fifty two point one percent versus forty four point eight.",
      "BrowseComp for deep research improves to seventy nine percent.",
      "Knowledge work tasks show Cortex winning or tying on eighty three percent of GDPval scenarios against practicing professionals.",
      "Teams at Northline, Harbor, and Signal Desk report faster turnaround on long horizon deliverables.",
      "Cortex runs with lower median latency than frontier baselines at matched accuracy on SWE Bench style tasks.",
    ].join(" "),
    introParagraphs: [
      "**Jokuh Cortex** is our next-generation assistant stack for pods, blurbs, and API workloads—tuned for **long-horizon professional work**: research memos, product specs, incident timelines, and multi-step tool use without losing the thread.",
      "It improves on **Cortex Preview** across coding, browsing, and knowledge benchmarks while staying calmer under parallel tool calls. **Cortex Pro** adds higher reasoning depth for the heaviest workflows.",
    ],
    benchmarkTable: {
      columns: ["Benchmark", "Cortex", "Cortex Preview", "Baseline"],
      rows: [
        { label: "GDPval (wins or ties)", values: ["83.0%", "70.9%", "62.4%"] },
        { label: "SWE-Bench Pro (public)", values: ["57.7%", "52.1%", "48.9%"] },
        { label: "PodBench-Verified", values: ["78.4%", "74.0%*", "61.2%"] },
        { label: "Threadathlon", values: ["52.1%", "48.6%", "44.8%"] },
        { label: "BrowseComp", values: ["79.0%", "71.2%", "58.5%"] },
      ],
      footnote:
        "* PodBench-Verified score for Cortex Preview measured on the January 2026 harness revision; all other cells on the March 2026 suite.",
    },
    knowledgeWork: {
      title: "Knowledge work",
      paragraphs: [
        "On **GDPval**, Cortex now **wins or ties** professionals on **83.0%** of blind-reviewed tasks, up from **70.9%** for Preview. The gains concentrate in synthesis, stakeholder-ready writing, and constraint-heavy planning where small mistakes are costly.",
        "The chart below breaks out **win rate vs industry professionals** across representative bundles—**wins** in light blue, **ties** in deep blue—so you can see where the model is decisive versus merely acceptable.",
      ],
    },
    chartFootnotes: {
      gdpval:
        "GDPval tasks are sampled from anonymized pod transcripts and reviewed by domain leads. “Tie” means both outputs met rubric without a clear preference.",
      swe: "Points are Pareto-optimal configurations from internal latency sweeps; latency is end-to-end wall clock on standard hardware.",
      osworld:
        "A tool yield is when the assistant yields to await tool responses. Parallel tool batches count as one yield. Yields proxy latency better than raw call counts.",
    },
    testimonials: [
      {
        id: "northline",
        company: "Northline",
        quote:
          "Cortex is the best stack we've shipped against internally. It's at the top of our Apex Agents board for professional services-style work—long decks, diligence packs, and legal first drafts—with lower median latency than the models we replaced.",
        attribution: "Morgan Ellis, VP Eng at Northline",
        followUp:
          "Their Apex suite now reports a mean **87.3%** pass rate on rubric checks, with **68.0%** of runs needing no human rewrite on first submission.",
        sparkline: [
          { step: 1, cortex: 62, prior: 54 },
          { step: 2, cortex: 71, prior: 58 },
          { step: 3, cortex: 78, prior: 61 },
          { step: 4, cortex: 84, prior: 63 },
          { step: 5, cortex: 87, prior: 65 },
        ],
      },
      {
        id: "harbor",
        company: "Harbor",
        quote:
          "We stress multi-tab research and CRM writes. Cortex holds context across twelve-plus tool yields without spiraling. That's the difference between 'demo good' and 'Monday morning good.'",
        attribution: "Riley Park, Platform Lead at Harbor",
        followUp:
          "Harbor's pilot cut median research-to-memo time by **34%** while keeping human sign-off on every external send.",
        sparkline: [
          { step: 1, cortex: 55, prior: 52 },
          { step: 2, cortex: 64, prior: 53 },
          { step: 3, cortex: 72, prior: 55 },
          { step: 4, cortex: 79, prior: 56 },
          { step: 5, cortex: 83, prior: 57 },
        ],
      },
      {
        id: "signal-desk",
        company: "Signal Desk",
        quote:
          "We wanted fewer 'almost right' answers in compliance-heavy threads. Cortex Pro's depth mode is the first time our reviewers voluntarily asked to keep a model in the loop.",
        attribution: "Ava Nguyen, Risk Product at Signal Desk",
        followUp:
          "Escalations to secondary review dropped **21%** quarter over quarter in the Cortex arm of the trial.",
        sparkline: [
          { step: 1, cortex: 58, prior: 56 },
          { step: 2, cortex: 66, prior: 57 },
          { step: 3, cortex: 74, prior: 59 },
          { step: 4, cortex: 81, prior: 60 },
          { step: 5, cortex: 86, prior: 61 },
        ],
      },
    ],
  },
};

const NEWSROOM_BRIEF_BY_SLUG: Record<
  string,
  Omit<NewsBriefDetailDocument, "kind" | "slug" | "metaLine" | "title">
> = {
  "jokuh-spine-tighter-sync": {
    subtitle: "Lower latency handoff when you move between pods on desktop and web.",
    introParagraphs: [
      "This release tightens how active context follows people between pods. Session state, tool permissions, and in-progress timelines now reconcile faster when a user moves from one surface to another.",
      "The goal is simple: fewer moments where the interface feels like it forgot what you were doing. That means quicker sync on pod handoff, less duplicate setup, and cleaner recovery when multiple devices are involved.",
    ],
    bodyTitle: "Why it matters",
    bodyParagraphs: [
      "Cross-pod work only feels professional if the handoff stays intact. We focused on reducing the gap between local state, shared state, and what the receiving pod sees first so context arrives in the right order.",
      "Teams testing the update saw less friction when bouncing between focused tasks and shared review. This is part of the larger effort to make Jokuh feel like one continuous workspace rather than a collection of separate screens.",
    ],
  },
  "waitlist-regional-rollout-next-quarter": {
    subtitle: "We are sequencing the next invite wave by region, support coverage, and onboarding readiness.",
    introParagraphs: [
      "The next waitlist rollout is being staged by support capacity, language readiness, and local infrastructure constraints. We would rather invite fewer people well than open a region before the product and support paths are ready.",
      "That sequencing also helps the team monitor activation quality. We can see where onboarding stalls, where latency varies by geography, and where policy or billing setup needs to be clearer before expanding access.",
    ],
    bodyTitle: "What changes next quarter",
    bodyParagraphs: [
      "Priority will go to regions where onboarding, support windows, and compliance review are already in place. Users in later waves will continue to receive updates as the schedule firms up.",
      "This is an operations decision as much as a growth decision. We want regional launches to feel stable on day one, not like a preview that leaves people guessing about availability or follow-up.",
    ],
  },
  "gooey-accessible-focus-rings-motion-prefs": {
    subtitle: "Gooey 0.9 improves keyboard clarity, respects motion preferences, and tightens default accessibility behavior across primitives.",
    introParagraphs: [
      "Gooey 0.9 focuses on interaction details that are easy to miss until a UI is under real pressure: visible focus treatment, calmer transitions, and more predictable fallback behavior when motion needs to be reduced.",
      "The update brings keyboard states closer to first-class design tokens instead of one-off overrides. That means product teams inherit better defaults instead of patching accessibility later in the build.",
    ],
    bodyTitle: "What shipped",
    bodyParagraphs: [
      "Focus rings are more legible across dark and light surfaces, especially on dense panels and glass treatments. Motion-sensitive transitions now step down more consistently when the system asks for reduced motion.",
      "For engineering teams, the change is mostly about trust in the base layer. If the component library behaves well out of the box, product teams can spend more energy on workflow quality instead of repairing interaction debt.",
    ],
  },
  "responsible-use-guidelines-v1llains-lab": {
    subtitle: "We tightened sandbox language, escalation rules, and disclosure expectations for experimental agents.",
    introParagraphs: [
      "The latest V1llains lab guidance clarifies what experimental agent work is allowed to do, how it should disclose uncertainty, and when a workflow must stop for a human review instead of pushing ahead.",
      "These changes are meant to keep the lab useful without treating novelty as a license for vague boundaries. The more agentic a system becomes, the more explicit the operating rules need to be.",
    ],
    bodyTitle: "Policy direction",
    bodyParagraphs: [
      "The updated guidance sharpens escalation thresholds for destructive actions, external access, and ambiguous user intent. It also makes disclosure expectations clearer when the system is operating on partial evidence or inferred goals.",
      "We treat responsible-use rules as product behavior, not just documentation. Clearer policy language helps shape interfaces, default settings, and review steps across the broader Jokuh ecosystem.",
    ],
  },
  "blurbs-composer-markdown-tables-paste-cleanup": {
    subtitle: "Composer paste now normalizes tables, strips inline cruft, and keeps formatting safer across exports.",
    introParagraphs: [
      "The Blurbs composer now does a better job cleaning pasted content before it enters the editing surface. Tables keep their structure more reliably, and messy inline markup is less likely to survive the trip from other tools.",
      "This update is about protecting flow. People should be able to paste quickly from docs, email, or shared notes without needing a cleanup pass before they can start shaping the final output.",
    ],
    bodyTitle: "Editing quality",
    bodyParagraphs: [
      "We focused on the places where paste handling tends to erode trust: broken tables, duplicated styles, and export mismatches. The new logic normalizes those cases earlier so the editor stays calmer under mixed input.",
      "It is a small feature on the surface, but it makes the writing loop feel more professional. Better paste behavior turns into fewer formatting surprises and less manual repair downstream.",
    ],
  },
  "open-office-hours-identity-claim-flow": {
    subtitle: "We are opening product office hours around identity verification, claims, and account portability.",
    introParagraphs: [
      "The identity team is starting a regular office-hours format for questions about claim flows, verification edge cases, and how portability should work across Jokuh surfaces.",
      "A lot of the hardest issues in identity products show up at the edges: disputed claims, region-specific documents, shared organizational ownership, and the moments where people need clear next steps instead of policy jargon.",
    ],
    bodyTitle: "What to expect",
    bodyParagraphs: [
      "These sessions are meant to create a tighter loop between the people building the flow and the people blocked by it. Product and support teams can bring repeated friction points directly into the discussion.",
      "We expect the office-hours format to shape both UX copy and escalation design. It is easier to improve trust flows when the confusing cases are visible early instead of buried inside support volume.",
    ],
  },
  "hiring-design-systems-realtime-infra": {
    subtitle: "We are growing the teams behind Gooey, realtime transcription, and the infra that keeps them reliable.",
    introParagraphs: [
      "Jokuh is hiring across design systems and realtime infrastructure as the product surface and platform load both expand. The work spans component quality, streaming systems, and the tooling that keeps both shippable.",
      "These are not isolated functions. The design system influences how quickly product teams move, and realtime infrastructure determines whether those workflows hold up under actual usage.",
    ],
    bodyTitle: "Where we are investing",
    bodyParagraphs: [
      "On the design-systems side, we want people who care about durable primitives, accessibility, and integration discipline. On the realtime side, we are focused on latency, reliability, and the shape of speech data as it moves through the stack.",
      "This hiring push reflects where we think the product earns trust. The interface and the infrastructure have to mature together if Jokuh is going to feel coherent at scale.",
    ],
  },
  "pod-encryption-at-rest-what-changed": {
    subtitle: "We rotated key handling, narrowed access paths, and tightened how encrypted pod state moves through storage.",
    introParagraphs: [
      "We have updated how encrypted pod state is stored and accessed, with changes to key handling, service boundaries, and the paths through which sensitive state can be decrypted for legitimate use.",
      "Security improvements like this matter most when they reduce both exposure and ambiguity. The goal is not just stronger protection in theory, but a smaller and more reviewable surface in practice.",
    ],
    bodyTitle: "Security changes",
    bodyParagraphs: [
      "The update narrows which services can touch decrypted state and improves the auditability of those paths. We also tightened assumptions around storage lifecycle so encrypted state is handled more consistently during backup and recovery.",
      "This kind of work is not always visible to end users, but it is foundational. Durable privacy depends on the boring parts being explicit, tested, and easy for engineering teams to reason about later.",
    ],
  },
};

function fallbackBrief(item: NewsItem): NewsBriefDetailDocument {
  return {
    kind: "brief",
    slug: item.slug!,
    metaLine: `${formatNewsDate(item.publishedAt)} · ${item.category} · Newsroom`,
    title: item.title,
    subtitle: item.excerpt ?? "Latest update from Jokuh's newsroom.",
    introParagraphs: [
      item.excerpt ?? "This update covers the latest change from Jokuh's product, company, and platform teams.",
      `The work touches ${item.topics.join(", ").toLowerCase()} and is part of the broader effort to keep Jokuh dependable as the surface grows.`,
    ],
    bodyTitle: "Why this matters",
    bodyParagraphs: [
      "We publish these updates so the product narrative and the implementation narrative stay closer together. People should be able to understand what changed without hunting through unrelated pages.",
      "This article is using the standard newsroom template so updates remain separate from stories, product marketing pages, and other parts of the site architecture.",
    ],
  };
}

export function getNewsDetail(slug: string | undefined): NewsDetailDocument | undefined {
  if (!slug) return undefined;
  const feature = NEWS_DETAIL_BY_SLUG[slug];
  if (feature) return feature;

  const item = NEWS_ITEMS.find((entry) => entry.slug === slug && entry.internalHref && !entry.externalUrl);
  if (!item || !item.slug) return undefined;

  const brief = NEWSROOM_BRIEF_BY_SLUG[item.slug];
  if (!brief) return fallbackBrief(item);

  return {
    kind: "brief",
    slug: item.slug,
    metaLine: `${formatNewsDate(item.publishedAt)} · ${item.category} · Newsroom`,
    title: item.title,
    subtitle: brief.subtitle,
    introParagraphs: brief.introParagraphs,
    bodyTitle: brief.bodyTitle,
    bodyParagraphs: brief.bodyParagraphs,
  };
}

/** ~160 words/min for TTS pacing */
export function estimateSpeechDurationLabel(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(60, Math.round((words / 160) * 60));
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const GDPVAL_BAR_DATA = [
  { name: "Cortex Pro", wins: 74, ties: 14 },
  { name: "Cortex", wins: 68, ties: 18 },
  { name: "Preview Pro", wins: 61, ties: 12 },
  { name: "Preview", wins: 55, ties: 10 },
];

export const SWE_LINE_DATA = [
  { latency: 280, cortex: 54.2, preview: 52.1, baseline: 47.8 },
  { latency: 520, cortex: 55.8, preview: 53.4, baseline: 49.1 },
  { latency: 880, cortex: 56.9, preview: 54.2, baseline: 50.2 },
  { latency: 1200, cortex: 57.7, preview: 54.8, baseline: 51.0 },
  { latency: 1680, cortex: 58.1, preview: 55.1, baseline: 51.4 },
];

export const OSWORLD_LINE_DATA = [
  { yields: 9, cortex: 41, baseline: 28 },
  { yields: 12, cortex: 58, baseline: 35 },
  { yields: 15, cortex: 72, baseline: 42 },
  { yields: 18, cortex: 76, baseline: 44 },
  { yields: 22, cortex: 78, baseline: 46 },
];
