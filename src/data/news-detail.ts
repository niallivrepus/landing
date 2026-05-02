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

export const NEWS_DETAIL_BY_SLUG: Record<string, NewsFeatureDetailDocument> = {};

const NEWSROOM_BRIEF_BY_SLUG: Record<
  string,
  Omit<NewsBriefDetailDocument, "kind" | "slug" | "metaLine" | "title">
> = {
  "jokuh-at-consensus-2026-miami": {
    subtitle: "The team building the Sovereign Agentic Operating System is heading to Miami.",
    introParagraphs: [
      "Jokuh will be at Consensus 2026 in Miami. The team is bringing live demos of Spine, Blurbs, Calls, and the ARC Terminal — the surfaces that make up the Sovereign Agentic Operating System — and is opening private sessions for investors, ecosystem partners, and builders working on identity, agent runtimes, and on-chain settlement.",
      "Consensus is the venue where the Web3 stack meets capital. We are showing up because the conversation about agents, memory, and sovereign identity has moved past slideware. People want to touch the product. They want to see encryption that actually holds. They want to understand how an agent inherits a Knowledge Pool without leaking it back into a centralized log. We are bringing the answers — and the device — to the room.",
    ],
    bodyTitle: "What we are showing",
    bodyParagraphs: [
      "The Miami sessions will walk through three demonstrations. First, **Spine** — encrypted personal memory, with keys held by the user and computation verified through the Trusted Execution Environment, Zero-Knowledge Proofs, and Fully Homomorphic Encryption layer. Second, **Sigil** — the living digital identity object surfaced through Profile. Third, the **ARC Terminal** — the desktop interface where Sidekick executes on the user's behalf with scoped permissions and reviewable audit trails.",
      "We will also be running closed-door briefings on the agent runtime architecture, the wallet settlement layer, and the marketplace for agents, themes, and identities. These sessions are by request only.",
      "\"Consensus is where serious builders show their hand,\" said **Sean Rock**, Founder & CEO. \"We are not going to Miami to pitch a vision. We are going to demonstrate that the math works, that the product runs, and that sovereign agentic computing is not a thesis anymore — it is a thing you can install.\"",
      "Investors, partners, and press attending Consensus 2026 in Miami can request a slot via sean@sierri.com. Slots are limited and will be assigned by relevance to the round, the integration, or the story.",
      "Jokuh is in early access. Access, features, availability, and offers may change and may vary by region, device, account, or plan.",
      "Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.",
    ],
  },
  "backing-redbeard-denarii": {
    subtitle: "Two operators with a long view on Web3 infrastructure are now on the cap table.",
    introParagraphs: [
      "Jokuh has confirmed institutional backing from **Red Beard Ventures** and **Denarii Labs**. Both firms have invested into the company building the Sovereign Agentic Operating System — a private, local-first runtime for memory, identity, and agent workflows on mobile, desktop, and the SDK.",
      "The backing follows months of technical diligence on the Spine memory layer, the agent runtime, and the privacy stack — Trusted Execution Environment, end-to-end encryption between identities, Zero-Knowledge Proofs verifying computation, and Fully Homomorphic Encryption for data in untrusted environments. Encryption keys are held by the user. The company cannot read user data. That is a design constraint, not a marketing line.",
    ],
    bodyTitle: "Why these two",
    bodyParagraphs: [
      "Red Beard Ventures and Denarii Labs are not generalist tourists. They have stayed close to operators across multiple Web3 cycles and they invest where the architecture is doing the work. Jokuh is in the same posture. We are not asking the market to take privacy on faith. The math is auditable, and the surfaces — Spine, Blurbs, Calls, Messages, Profile — are designed so that the user, not the platform, holds the keys.",
      "\"We took the meeting because the architecture is real,\" said a representative familiar with the diligence process. **Sean Rock**, Founder & CEO of Jokuh, added: \"Red Beard and Denarii were not buying a deck. They reviewed the runtime, the encryption stack, and the live MVP in TestFlight. The backing reflects what is already shipping, not what we are promising.\"",
      "Capital from this backing supports continued engineering across the live MVP in TestFlight, the ARC Terminal desktop interface, the Chrome capture plugin, and the marketplace surface for agents, themes, and identities. It also supports security work and audit prep ahead of broader public availability.",
      "Jokuh — operating company — is structured to be insulated from token and accelerator obligations. Investors deal with Jokuh.",
      "Jokuh is in early access. Access, features, availability, and offers may change and may vary by region, device, account, or plan.",
      "Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.",
    ],
  },
  "spine-ships-testflight": {
    subtitle: "The encrypted memory layer at the core of Jokuh is now in the hands of active users.",
    introParagraphs: [
      "Spine — Jokuh's encrypted personal memory and storage layer — is now live for active TestFlight users on iOS. Spine is the substrate beneath every other surface in the Sovereign Agentic Operating System: Blurbs are scoped from it, Calls and Messages sync into it, Sidekick reads from it under user-granted permission, and Sigil is anchored to it. If Jokuh is the operating system, Spine is the disk.",
    ],
    bodyTitle: "What ships",
    bodyParagraphs: [
      "This release puts the full privacy stack into production for early-access users: **Trusted Execution Environment (TEE)** at the core of computation; **end-to-end encryption** between identities, with no server-side break-glass; **Zero-Knowledge Proofs** verifying that computation ran as specified; **Fully Homomorphic Encryption** protecting data in untrusted environments; and **user-held keys**. Jokuh the company cannot read user data. The math holds whether you trust us or not.",
      "Spine integrates with the Chrome capture plugin so meeting transcripts flow into the Knowledge Pool without ever transiting an unencrypted store. From there, Blurbs are generated against the user's own corpus — scoped, attributable, and revocable.",
      "Spine reframes what \"memory\" means inside an AI workspace. Most products treat your conversation history as their inventory. Jokuh treats it as your property. Active users in TestFlight can already feel the difference: continuity across surfaces, recall without leakage, and a Knowledge Pool that grows on the device — not in a vendor's training pipeline.",
      "\"Spine is the part of Jokuh that decides whether the rest of the product is honest,\" said **Hyke Vlas**, Web3 / AI Lead and UX/UI. \"We designed it so that the moment a user opens Calls, runs a Blurb, or hands a task to Sidekick, the trust contract is already settled in cryptography — not in a privacy policy. The interface is quiet. The architecture is the loud part.\"",
      "The team is staging the desktop ARC Terminal connection to Spine, expanding Knowledge Pool sync into Calls and Messages, and preparing third-party verification work that will be communicated through the AUDIT tag when ready.",
      "Jokuh is in early access. Access, features, availability, and offers may change and may vary by region, device, account, or plan.",
      "Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.",
    ],
  },
  "grant-stack-avalanche-runpod-hume-kihew": {
    subtitle: "Four ecosystem partners — covering settlement, compute, voice, and regional infrastructure — have backed Jokuh with non-dilutive grants.",
    introParagraphs: [
      "Jokuh has received grants from **Avalanche**, **RunPod**, **Hume AI**, and **Kihew**. Each grant maps to a load-bearing layer of the Sovereign Agentic Operating System. Together, they signal something a deck cannot fake: independent technical validation from the ecosystems that would feel the impact first if the architecture did not work.",
    ],
    bodyTitle: "What each grant supports",
    bodyParagraphs: [
      "**Avalanche** supports settlement-layer integration for the native multi-chain wallet and the marketplace surface where agents, themes, and identities are exchanged.",
      "**RunPod** supports compute for the agent runtime that executes on the user's behalf, with Trusted Execution Environment isolation and signed action logs.",
      "**Hume AI** supports voice intelligence for Calls, Jokuh's encrypted voice product with Knowledge Pool sync.",
      "**Kihew** supports regional infrastructure and onboarding, aligning with the staged availability rollout described in our company updates.",
      "The grants are non-dilutive and arrived after technical reviews specific to each layer. We are publishing them together because, read as a stack, they describe the product more honestly than any single benchmark.",
      "Jokuh is not a thin wrapper on a public API. The product runs across encrypted memory, an agent runtime, a privacy stack (TEE, ZKP, FHE), a wallet, and a marketplace. Each of those layers has its own correctness bar. When four independent ecosystems back four independent layers, the conclusion is simple: the architecture survives outside its own marketing.",
      "\"Grants are not press points for us. They are receipts,\" said **Sean Rock**, Founder & CEO. \"Avalanche reviewed settlement. RunPod reviewed compute. Hume AI reviewed voice. Kihew reviewed our regional rollout posture. None of them needed to like our slides — they needed the engineering to hold. It does.\"",
      "The team continues to ship across mobile, the ARC Terminal desktop, and the SDK. Future updates on integration depth — including any third-party verification work — will be communicated under the AUDIT and PARTNERSHIP tags as appropriate.",
      "Jokuh is in early access. Access, features, availability, and offers may change and may vary by region, device, account, or plan.",
      "Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.",
    ],
  },
  "ethics-compliance-responsible-deployment": {
    subtitle: "Ethics and compliance are product behaviors, not a policy appendix.",
    introParagraphs: [
      "**Position:** Ethics and compliance are product behaviors, not a policy appendix.",
      "Jokuh operates in domains where credibility is the product — tokenized communities, regulated launches, sensitive internal operations, technical diligence, and decision support that affects real users and real capital. We treat ethics and compliance as load-bearing engineering constraints, wired into the product, the review workflow, and the deploy pipeline. They are not a marketing layer applied after the system feels impressive.",
      "Our standard is direct: **high-agency systems require high-clarity boundaries.** We design for traceability, least-privilege access, explicit escalation, human accountability, and disclosure of model uncertainty whenever evidence is incomplete or confidence is bounded.",
    ],
    bodyTitle: "What we optimize for",
    bodyParagraphs: [
      "We optimize for outputs that are **useful and reviewable.** Speed without provenance is not a product — it is a liability. A client must be able to see where a claim came from, what assumptions shaped it, and the precise threshold at which the system should have paused and asked for human judgment.",
      "In practice, this means we prefer **constrained autonomy** to performative autonomy. In legal, clinical, financial, identity, security-sensitive, or on-chain settlement contexts, our workflows escalate early rather than improvise through ambiguity. Improvisation is acceptable on ideation surfaces; it is not acceptable where the cost of being wrong is asymmetric.",
      "**Operational controls.** Our product direction is informed by control themes from SOC 2, ISO/IEC 27001, the NIST AI Risk Management Framework, EU AI Act risk-tiering, and GDPR data minimization principles. That language describes a design influence, not a claim of certification.",
      "Inside the product, this surfaces as scoped permission boundaries, role-based access controls, approval checkpoints for destructive or externally consequential actions, reviewable audit trails, signed action logs, and disclosure rules covering inferred intent, generated summaries, and model uncertainty. Experimentation and production are separated by policy and by infrastructure so customer-facing surfaces can use narrower scopes and additional review.",
      "**Human review and escalation.** Some tasks must never quietly auto-complete. If a workflow touches regulated content, personal data, account access, policy interpretation, financial settlement, or irreversible system state, the product routes to human confirmation rather than hiding the handoff.",
      "Escalation is not failure. It is a product behavior. Mature systems recognize when evidence is thin, when instructions conflict, and when the cost of being approximately right is materially higher than the cost of asking. We instrument these handoffs explicitly so reviewers can see what triggered the escalation, what the system inferred, and what remains unverified.",
      "**Privacy, security, and evidence.** We treat privacy and security as components of model quality. A polished answer is low quality if it relied on data outside the agreed boundary, accessed information too broadly, or made claims unsupported by retrievable evidence.",
      "Our approach: **data minimization by default, auditable access paths, source-aware reasoning, retrieval grounding, and explicit scoping.** The system makes it easier — not harder — to see what it knows, what it inferred, and what still requires verification. We red-team for direct and indirect prompt injection, retrieval poisoning, and adversarial input shaping. Output provenance and citation are treated as first-class product surfaces, not afterthoughts.",
      "For Web3 workflows, we can scope additional controls such as screening, allowlists, custody separation, and human approval where a deployment requires them.",
      "**What this means for clients and partners.** For Web3 communities, biotech teams, and enterprise operators, the bar is the same: **the product must support speed without weakening defensibility.** Workflows for policy-sensitive research, launch readiness, support operations, and internal knowledge work are designed around the actual risk profile of the task — not a uniform assumption that every action is low risk.",
      "For procurement and diligence, we can provide structured security and architecture materials to qualified counterparties under NDA.",
      "**Contact:** For a controls review, implementation walkthrough, or procurement-ready answers on responsible use, privacy, or security posture, route the request to our team and it will be assigned to the appropriate operator.",
    ],
  },
  "jokuh-spine-tighter-sync": {
    subtitle: "Cleaner handoff when active context moves between workspace surfaces.",
    introParagraphs: [
      "This release tightens how active context follows people between workspace surfaces. Session state, tool permissions, and in-progress timelines are designed to reconcile more cleanly when a user moves from one surface to another.",
      "The goal is simple: fewer moments where the interface feels like it forgot what you were doing. That means less duplicate setup and cleaner recovery when multiple devices are involved.",
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

export const GDPVAL_BAR_DATA: { name: string; wins: number; ties: number }[] = [];

export const SWE_LINE_DATA: { latency: number; cortex: number; preview: number; baseline: number }[] = [];

export const OSWORLD_LINE_DATA: { yields: number; cortex: number; baseline: number }[] = [];
