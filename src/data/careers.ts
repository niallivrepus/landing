export const CAREERS_VALUES = [
  {
    title: "Humanity first",
    body: "Working at Jokuh means being part of a team that is passionate about benefitting people and society through our work. We build private speech systems to elevate the lives behind every word.",
  },
  {
    title: "Act with humility",
    body: "Humility reminds us to recognize the limits of our own knowledge and to remain open to new ideas, perspectives, and the possibility of being wrong. This mindset influences our iterative approach to deployment, and the reintegration of feedback into our research.",
  },
  {
    title: "Respect the record",
    body: "The conversations we touch are part of people's lives. Building infrastructure for memory requires rigor, discipline, boundless imagination, and a deep sense of responsibility for what gets captured, kept, and recalled.",
  },
  {
    title: "Ship joy",
    body: "Through our research we develop products that can transform how people live, work, and remember. Our technology reflects an internal culture of optimism for the future and stewardship of our mission.",
  },
] as const;

export const CAREERS_OPERATING_PRINCIPLES = [
  {
    title: "Find a way",
    body: "We believe in finding a way to do the things that matter. We give agency to individuals and teams to find an approach that works. Ideas come from anywhere, regardless of title or tenure.",
  },
  {
    title: "Creativity over control",
    body: "We look to find creative solutions, even if sometimes imperfect, over rigidity and control. Our approach to solving problems is based on first principles and best practices.",
  },
  {
    title: "Update quickly",
    body: "We come in with a hypothesis and are willing to change our approach as we receive new information. We seek truth and adapt — flexibility is key to progress on private speech infrastructure.",
  },
  {
    title: "Intense focus",
    body: "We are hard workers here to make an impact on the world. This intensity and resilience are pivotal to the mission, while clarity and focus let us make the hard decisions that come with handling people's words.",
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

export type CareersTeam = "Research" | "Platform" | "Product" | "Design" | "Operations";

/** Long-form team intro copy reused across role detail pages. */
export const CAREERS_TEAM_INTROS: Record<CareersTeam, string[]> = {
  Research: [
    "Jokuh's Research org advances the science behind private speech systems — speech recognition, speaker diarization, semantic memory, and the evaluation infrastructure that keeps quality honest as we ship.",
    "We work across the full stack from raw audio to long-horizon memory, partnering with product and platform teams to translate research into surfaces people actually rely on.",
  ],
  Platform: [
    "The Platform team builds the durable infrastructure under Jokuh: realtime audio pipelines, encrypted storage, identity and trust primitives, and the runtime that keeps every conversation low-latency and private by default.",
    "We focus on resilience, observability, and clean APIs so product teams can move fast without compromising on consent or correctness.",
  ],
  Product: [
    "Product engineering ships the surfaces people touch every day — ARC Terminal, mobile clients, and the in-app experiences that make memory feel calm and useful.",
    "We pair tight craft with deep collaboration with research and design, so the speed of iteration never erodes the quality of the final feel.",
  ],
  Design: [
    "Design at Jokuh shapes how memory looks, sounds, and behaves. We are responsible for the visual system, motion, copy, and interaction patterns across product, brand, and editorial.",
    "We work alongside engineering and research from the first prototype through release, treating the operating model of the product as a design problem itself.",
  ],
  Operations: [
    "Operations keeps Jokuh running across people, partners, and policy — talent, trust & safety, documentation, finance, and the systems that let small teams move fast without dropping balls.",
    "We are the connective tissue that makes craft sustainable: hiring, onboarding, vendor management, and the rhythms that keep the company calm while it grows.",
  ],
};

export type CareersRole = {
  slug: string;
  title: string;
  team: CareersTeam;
  location: string;
  /** Internal route to the detail page for this role. */
  href: string;
  /** Mailto used for the Apply CTA on the detail page. */
  applyHref: string;
  /** "About the Role" body paragraphs. */
  roleCopy: string[];
  /** Bulleted Key Responsibilities. */
  responsibilities: string[];
  /** Free-form compensation note. */
  compensation: string;
};

function makeRole(input: Omit<CareersRole, "href" | "applyHref">): CareersRole {
  const subject = encodeURIComponent(input.title);
  return {
    ...input,
    href: `/careers/roles/${input.slug}`,
    applyHref: `mailto:careers@jokuh.com?subject=${subject}`,
  };
}

export const CAREERS_ROLES: readonly CareersRole[] = [
  makeRole({
    slug: "speech-systems-engineer",
    title: "Speech Systems Engineer",
    team: "Research",
    location: "Remote",
    roleCopy: [
      "We are looking for a Speech Systems Engineer to push the production stack behind Jokuh's transcription, diarization, and memory layers. You will own end-to-end pipelines from raw audio to structured artifacts that downstream agents and products rely on.",
      "You will partner closely with researchers and platform engineers to evaluate tradeoffs, measure quality, and ship improvements that move latency, accuracy, and consent guarantees in the right direction.",
    ],
    responsibilities: [
      "Design and operate production speech pipelines across cloud and on-device targets.",
      "Build evaluation harnesses and dashboards that quantify quality, latency, and drift over time.",
      "Collaborate with research on data curation, model fine-tuning, and inference optimization.",
      "Reduce cost, jitter, and tail latency without compromising user-facing quality.",
      "Document systems and decisions clearly so the rest of the team can build on top of them.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "privacy-infrastructure-engineer",
    title: "Privacy Infrastructure Engineer",
    team: "Platform",
    location: "Remote",
    roleCopy: [
      "We are looking for a Privacy Infrastructure Engineer to design and operate the systems that keep Jokuh's data flow private by architecture: encryption, key management, scoped access, and the audit trails that prove the system behaves as advertised.",
      "You will work with research, product, and trust & safety to translate privacy commitments into concrete primitives that other teams can build on without re-inventing the wheel.",
    ],
    responsibilities: [
      "Own the end-to-end design of encryption, key handling, and access scoping across services.",
      "Build retention and deletion primitives that are reviewable and testable.",
      "Partner with trust & safety on audit logging and incident-response tooling.",
      "Drive threat modeling and security reviews on new product surfaces.",
      "Write clear interfaces and documentation so privacy guarantees stay legible as the system grows.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "diarization-researcher",
    title: "Diarization Researcher",
    team: "Research",
    location: "Remote",
    roleCopy: [
      "Diarization is core to Jokuh's promise — knowing who said what, with the right confidence and consent, even in messy real-world audio. As Diarization Researcher, you will lead the science behind speaker separation, identification, and continuity across long sessions.",
      "You will own the loop between data, models, and metrics: defining the right benchmarks, shipping improvements, and helping platform partners move them into production safely.",
    ],
    responsibilities: [
      "Lead research on speaker diarization, identification, and clustering across noisy real-world audio.",
      "Curate and maintain evaluation datasets and benchmarks that reflect how Jokuh is actually used.",
      "Prototype and ship model improvements with platform engineering.",
      "Investigate failure modes (overlap, background noise, codec mismatch) and propose mitigations.",
      "Communicate research clearly through internal docs, demos, and external write-ups when appropriate.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "identity-trust-engineer",
    title: "Identity & Trust Engineer",
    team: "Platform",
    location: "Remote",
    roleCopy: [
      "We are hiring an Identity & Trust Engineer to build the identity primitives that anchor Jokuh: who someone is, what they have consented to, and what every speech artifact is allowed to be used for.",
      "You will design the graph that ties accounts, devices, and conversations together, and the policy layer that makes the trust model visible inside the product.",
    ],
    responsibilities: [
      "Design identity, device, and consent primitives used across product surfaces.",
      "Implement provenance, retention, and revocation flows that survive real-world edge cases.",
      "Partner with product on trust UX so users can understand and control what is happening.",
      "Build tooling that lets internal teams reason about access and verify behavior.",
      "Contribute to threat modeling and incident response with trust & safety.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "product-designer-memory",
    title: "Product Designer, Memory",
    team: "Design",
    location: "Remote",
    roleCopy: [
      "We are looking for a Product Designer to shape the memory surfaces inside Jokuh — Spine, Calls, and the threads that stitch them together. The work spans interaction, system, and editorial: how memory is captured, browsed, and trusted.",
      "You will partner closely with product, research, and platform teams to make the trust model visible inside the interface, not buried in a settings page.",
    ],
    responsibilities: [
      "Design end-to-end flows for memory capture, review, and recall.",
      "Define the visual and interaction system for Spine and connected surfaces.",
      "Prototype animations and interactions that make consent feel present, not anxious.",
      "Run usability sessions and translate findings into iterations.",
      "Maintain quality bars across web and mobile through thoughtful redlines and reviews.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "realtime-infra-engineer",
    title: "Realtime Infra Engineer",
    team: "Platform",
    location: "Brooklyn, NY",
    roleCopy: [
      "We are looking for a Realtime Infra Engineer to own the streaming pipelines that carry voice into Jokuh — capture, transport, transcription, and the message bus that fans events out to product and agents.",
      "You will obsess over jitter, packet loss, and tail latency, and you will design the systems that keep memory in lockstep with the conversation that produced it.",
    ],
    responsibilities: [
      "Operate and evolve realtime audio capture and transport across client and server.",
      "Tune jitter buffers, codecs, and signaling to minimize perceptible latency.",
      "Design event-driven backplanes that keep transcription, diarization, and storage consistent.",
      "Build observability for streaming health, dropped frames, and re-sync events.",
      "Partner with product engineering on graceful degradation when networks misbehave.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "foundations-researcher-audio",
    title: "Foundations Researcher, Audio",
    team: "Research",
    location: "Remote",
    roleCopy: [
      "Foundations Research at Jokuh sits between core models and product realities. As a Foundations Researcher on audio, you will study representations and architectures that improve speech understanding while remaining shippable in production.",
      "You will help define the multi-quarter research roadmap for audio and ensure that we measure progress in a way that reflects real Jokuh usage.",
    ],
    responsibilities: [
      "Investigate model architectures, training recipes, and pretraining data for speech.",
      "Run controlled experiments and track results in shared evaluation infrastructure.",
      "Translate research progress into proposals product and platform teams can adopt.",
      "Mentor applied researchers on rigor, reproducibility, and benchmarking.",
      "Engage with the broader research community when work merits external sharing.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "applied-researcher-memory",
    title: "Applied Researcher, Memory",
    team: "Research",
    location: "Remote",
    roleCopy: [
      "We are hiring an Applied Researcher on memory to push the recall layer of Jokuh — how a conversation becomes structured context, and how that context is surfaced at the right moment.",
      "You will live at the intersection of retrieval, summarization, and graph reasoning, working with product to turn experiments into shipped improvements.",
    ],
    responsibilities: [
      "Design retrieval and summarization systems tuned to long-horizon memory.",
      "Build evaluation harnesses that measure helpfulness, faithfulness, and freshness.",
      "Prototype graph-backed reasoning over Jokuh's memory primitives.",
      "Work with product on UX patterns that make memory legible and controllable.",
      "Track research progress with the rigor of an experimentalist.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "frontend-engineer-arc-terminal",
    title: "Frontend Engineer, ARC Terminal",
    team: "Product",
    location: "Remote",
    roleCopy: [
      "ARC Terminal is the surface most people first touch in Jokuh. As a Frontend Engineer on ARC, you will own the craft of the experience — performance, motion, accessibility, and the small details that make the product feel calm.",
      "You will work closely with design and platform engineers to push the boundary of what feels possible inside a private workspace built around speech.",
    ],
    responsibilities: [
      "Ship product features in React and TypeScript across the ARC Terminal codebase.",
      "Own performance budgets and measurable web vitals across critical flows.",
      "Translate design intent into precise components with thoughtful motion.",
      "Improve accessibility, keyboard support, and resilience under flaky networks.",
      "Mentor teammates on craft, tooling, and code review patterns.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "mobile-engineer-ios",
    title: "Mobile Engineer, iOS",
    team: "Product",
    location: "Remote",
    roleCopy: [
      "We are hiring an iOS engineer to build the Jokuh mobile experience — capture, recall, and consent in your pocket. You will own the architecture of the iOS app and lead its evolution as new memory surfaces ship.",
      "You will work hand-in-hand with product engineering and platform teams to keep the mobile and desktop experiences in lockstep.",
    ],
    responsibilities: [
      "Architect and ship features in Swift and SwiftUI across the Jokuh iOS app.",
      "Optimize battery, memory, and bandwidth use for always-on capture flows.",
      "Build offline-first surfaces that gracefully recover from network changes.",
      "Partner with platform on background sync, encryption, and identity primitives.",
      "Maintain release quality through automated and manual test coverage.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "security-engineer",
    title: "Security Engineer",
    team: "Platform",
    location: "Remote",
    roleCopy: [
      "We are hiring a Security Engineer to harden Jokuh end to end — code, infrastructure, supply chain, and the operations around them.",
      "You will work across teams to make secure-by-default the path of least resistance and to ensure incident response is rehearsed before it is needed.",
    ],
    responsibilities: [
      "Lead application and infrastructure security reviews across the stack.",
      "Build automated checks for dependencies, secrets, and misconfigurations.",
      "Drive threat modeling and red-team exercises with realistic scope.",
      "Operate runbooks for incident response and post-incident learning.",
      "Help vendors and partners meet Jokuh's security requirements.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "brand-designer",
    title: "Brand Designer",
    team: "Design",
    location: "Brooklyn, NY",
    roleCopy: [
      "We are hiring a Brand Designer to shape how Jokuh shows up in the world — marketing, editorial, partnerships, and the visual system that supports them.",
      "You will partner with the founder, product designers, and writing leads to keep the brand sharp as we grow into new surfaces.",
    ],
    responsibilities: [
      "Own the visual system across marketing, editorial, and event surfaces.",
      "Direct illustration, photography, and motion partners.",
      "Design product launch moments end to end alongside product design.",
      "Maintain a brand guidelines kit that internal and external partners can use.",
      "Champion craft and consistency in everything we ship outwardly.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "trust-safety-lead",
    title: "Trust & Safety Lead",
    team: "Operations",
    location: "Remote",
    roleCopy: [
      "We are hiring a Trust & Safety Lead to define the policy and operational practice behind Jokuh's commitments to consent, retention, and abuse prevention.",
      "You will build the playbooks that platform and product engineers rely on, and represent Jokuh credibly to partners, regulators, and users.",
    ],
    responsibilities: [
      "Define policy for content, consent, retention, and external sharing.",
      "Build operational workflows for review, escalation, and resolution.",
      "Partner with platform and security on tooling and audit infrastructure.",
      "Engage with regulators and policy stakeholders on trust questions.",
      "Translate principles into trainings and rituals the rest of the team can live.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "technical-writer",
    title: "Technical Writer",
    team: "Operations",
    location: "Remote",
    roleCopy: [
      "We are hiring a Technical Writer to own the documentation surface for Jokuh — internal references, customer-facing docs, and the editorial layer that helps people understand the system without selling them.",
      "You will work across teams to keep what we ship and what we publish in lockstep.",
    ],
    responsibilities: [
      "Author and maintain user-facing and internal docs across product surfaces.",
      "Define style and structure that scale with the team.",
      "Partner with engineering on changelogs, runbooks, and deprecation notes.",
      "Edit broader marketing and editorial content for clarity and accuracy.",
      "Champion plain language as a shared engineering practice.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
  makeRole({
    slug: "recruiter-engineering",
    title: "Recruiter, Engineering",
    team: "Operations",
    location: "Remote",
    roleCopy: [
      "We are looking for a Recruiter focused on engineering hiring at Jokuh. You will partner with the founder and team leads to build pipelines for research, platform, and product roles.",
      "You will treat hiring as a craft — measurable, kind, and aligned with the operating principles we expect of teammates.",
    ],
    responsibilities: [
      "Run end-to-end search across research, platform, and product engineering roles.",
      "Build sourcing channels, networks, and outbound campaigns that compound.",
      "Coach hiring managers on calibration, structure, and decision-making.",
      "Steward the candidate experience across every touchpoint.",
      "Track hiring health with metrics that match the kind of company we want to be.",
    ],
    compensation: "Competitive cash and meaningful equity. Specifics confirmed at offer stage and based on country of residence.",
  }),
];

export function getCareersRoleBySlug(slug: string): CareersRole | undefined {
  return CAREERS_ROLES.find((role) => role.slug === slug);
}

/** Subset surfaced on the main /careers page. */
export const CAREERS_FEATURED_ROLES = CAREERS_ROLES.slice(0, 5);

export const CAREERS_PROGRAMS = [
  {
    title: "Jokuh Residency",
    body: "A six-month program offering a pathway to a full-time role at Jokuh for researchers and engineers who want to go deep on speech, diarization, and graph-backed identity.",
    cta: "Find out more",
    href: "/contact",
    image: "/story-art/maren-workspace.png",
    alt: "A focused workspace scene representing memory and craft.",
  },
  {
    title: "Emerging talent",
    body: "Join us in building private speech systems for everyone. We welcome curious, driven people early in their professional journey through internships, residencies, and full-time roles.",
    cta: "Find out more",
    href: "/contact",
    image: "/story-art/aaron-nyc-writing.png",
    alt: "An early-career operator working alongside a teammate.",
  },
] as const;

export const CAREERS_QUOTE = {
  text: "My colleagues recognize the importance of what we’re building and genuinely care about the outcomes — for users, for the record, and for the people behind every word.",
  attribution: "Engineering principle at Jokuh",
} as const;

export const CAREERS_RESOURCES = [
  {
    label: "Manifesto",
    tag: "Company",
    href: "/manifesto",
    gradient: "linear-gradient(135deg, #111113 0%, #232326 100%)",
    lavaLamp: "arctic",
  },
  {
    label: "Interview guide",
    tag: "Careers",
    href: "/contact",
    gradient: "linear-gradient(135deg, #111113 0%, #232326 100%)",
    lavaLamp: "ultraviolet",
  },
  {
    label: "Building dynamic teams",
    tag: "Company",
    href: "/about",
    gradient: "linear-gradient(135deg, #111113 0%, #232326 100%)",
    lavaLamp: "coral",
  },
] as const;

export const CAREERS_CLOSING_CTA = {
  headline: "Shape the future of speech",
  buttonLabel: "View open roles",
  buttonHref: "/careers/roles",
} as const;
