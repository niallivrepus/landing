export type ManifestoSection = {
  heading: string;
  paragraphs: string[];
};

export const MANIFESTO = {
  metaLine: "Manifesto",
  title: "JOKUH",
  subtitle: "The Freedom Layer for Your Mind",
  dek: "You speak your most private thoughts into AI every day.",
  highlights: [
    "Privacy is a corporate promise. Confidentiality is a property of the system.",
    "Jokuh is built for confidentiality.",
    "This is not a pledge. It is a property of the system.",
  ],
  sections: [
    {
      heading: "The Short Version",
      paragraphs: [
        "You speak your most private thoughts into AI every day. Medical worries. Legal questions. Half-formed business ideas. Things you have not told your partner. Things you have not told yourself.",
        "You assume those words stay between you and the assistant.",
        "They do not.",
        "Every major consumer AI logs your conversation. That conversation becomes training data. Sometimes it becomes evidence in a courtroom. Always, it becomes inventory on someone else's balance sheet.",
        "This is not a conspiracy theory. It is the disclosed business model.",
        "In the past year, a federal court ordered OpenAI to preserve and produce twenty million ChatGPT conversations — including chats users had already deleted. A separate ruling held that consumer AI conversations do not automatically carry the legal protection a conversation with your lawyer does. A class-action complaint in San Francisco alleges that Perplexity quietly forwarded user chats to advertisers, even in incognito mode.",
        "What social media did to your public life, AI is now doing to your inner life.",
        "There is a difference between privacy — a corporate promise that can be rewritten in a midnight terms-of-service update — and confidentiality — a property of the system itself, enforced by mathematics.",
        "Jokuh is built for confidentiality.",
        "Your conversations run on hardware we cannot see into. The keys are held by you, not us. We are architecturally incapable of reading, selling, training on, or handing over your data — because there is nothing in our custody to hand over.",
        "This is not a pledge. It is a property of the system.",
        "If you want the full picture, keep reading.",
      ],
    },
    {
      heading: "What You Are Actually Losing",
      paragraphs: [
        "Privacy is too small a word for it.",
        "What is being lost is authorship over the mind.",
        "Every day, billions of people speak their most private thoughts into AI systems they do not own, cannot audit, and have no power over. They ask for medical advice. They debug unreleased code. They brainstorm legal strategy. They confide in something that feels like a secure assistant — intimate, always present, always listening.",
        "That assistant is a tenant of a corporation. The corporation logs the conversation. The conversation becomes training data, then evidence, then inventory — in that order.",
        "Social media extracted what you said in public.",
        "AI extracts what you think in private.",
        "The extraction is no longer at the surface. It is at the source.",
      ],
    },
    {
      heading: "What Has Already Happened",
      paragraphs: [
        "These are not hypotheticals. They are filed cases, court orders, and published corporate policy.",
        "A federal court ordered the preservation of deleted chats. In In re OpenAI, Inc. Copyright Infringement Litigation (Southern District of New York, MDL 1:25-md-03143), a federal court ordered OpenAI to preserve consumer ChatGPT conversations — including chats users had deleted or marked temporary — and to produce twenty million de-identified logs to news-organization plaintiffs. The order was issued in November 2025 and affirmed in January 2026. This was a discovery ruling, not a trial admission. Enterprise customers under Zero Data Retention agreements were carved out. Free, Plus, and Pro users were not.",
        "Plain meaning: if a court asks for your chats, the company has to produce them.",
        "Privilege does not automatically follow the prompt. In United States v. Heppner (Southern District of New York, February 2026), a federal court held that a defendant's self-directed use of consumer Claude did not receive privilege protection. The ruling was narrow and fact-specific. The implication is not.",
        "Plain meaning: if you confide in AI the way you would confide in a lawyer, the law may not protect you the same way.",
        "Surveillance by design — alleged. A class-action complaint filed in San Francisco federal court in March 2026 alleges that Perplexity embedded trackers forwarding user conversations — including conversations in incognito mode — to third-party advertising infrastructure without disclosure. These are allegations, not findings. They are also a live federal docket.",
        "Plain meaning: even when you think the assistant is being private, it may not be.",
        "Real filings. Real orders. Real exposure.",
      ],
    },
    {
      heading: "What The Policies Actually Say",
      paragraphs: [
        "The ones almost no one reads:",
        "OpenAI. Consumer prompts and responses may be used to improve the service. Opt-out exists but must be enabled manually. Even after opt-out, conversations are centrally retained, reachable by human review, and producible in litigation — which is what the court order above demonstrates.",
        "Anthropic. Consumer conversations across Free, Pro, and Max tiers are used for model training unless the user explicitly opts out. Safety-flagged material can be retained for up to five years. In March 2026, a packaging error briefly exposed a partial source map from the Claude Code CLI — confirmed publicly by the company. The leak surfaced internal telemetry that classifies user frustration and profanity. What the telemetry is used for is contested. That it exists is not.",
        "Perplexity. Their privacy notice confirms consumer queries feed model development. The March 2026 complaint alleges the data flow did not stop there.",
        "The industry's answer to all of this: pay more. Six-figure enterprise contracts get the carve-outs. Everyone else is the product.",
        "Privacy is not a premium feature. It is a human right.",
      ],
    },
    {
      heading: "The Legal Trapdoor No One Talks About",
      paragraphs: [
        "There is a doctrine built into American law called the Third-Party Doctrine. In plain language: when you voluntarily hand information to a third party — a phone company, a bank, a cloud provider — courts have historically said you have a reduced expectation of privacy in that information. It can be reached by lawful process without your knowledge.",
        "The moment you type a private thought into a mainstream AI, you are voluntarily handing it to a third-party corporation.",
        "This doctrine has not yet been fully tested against AI conversations. That is the point. It is a legal trapdoor that has not yet sprung — and the OpenAI case is the first visible test.",
        "A mother's back pain, described in a private AI chat, becomes a data point. The data point becomes an ad, a classification, a risk score. None of this requires malice. It only requires a system designed to extract value from trust.",
      ],
    },
    {
      heading: "The Pattern Is Familiar",
      paragraphs: [
        "This has happened before.",
        "Social media promised connection and delivered behavioral manipulation, polarization, and mass data harvesting. The platforms apologized, paid fines, and continued — because violating user trust remained cheaper than respecting it.",
        "AI is the same architecture, one layer deeper.",
        "Social media captured what you share publicly.",
        "AI captures what you think privately — your reasoning, your fears, your unfinished ideas, your family's health, your intellectual property before it has a name.",
        "The same playbook. The same incentives. A more sensitive layer of you.",
      ],
    },
    {
      heading: "The Second Problem: You Are Alone In There",
      paragraphs: [
        "The current generation of AI has not only made thought extractable. It has made intelligence anti-social.",
        "Every person sits alone in their own prompt box. Every person types into their own siloed window. No shared context. No shared memory. No way to coordinate thought across a team, a family, or a company without first handing everything to a platform.",
        "This is not collective intelligence. It is private dependency at scale.",
        "And the modern screen makes it worse. Work fragments across too many apps, too many logins, too many feeds, too many systems that do not understand each other. You context-switch all day. You manually remember. You manually summarize. You manually rebuild the narrative thread of your own life.",
        "The digital world has become too cluttered to think clearly inside it.",
      ],
    },
    {
      heading: "Who This Affects",
      paragraphs: [
        "A founder brainstorming a product hands competitive intelligence to a platform that trains future models on it.",
        "A plumber drafting estimates feeds pricing strategy into a system that retains it.",
        "An artist generating concepts watches their style become training data.",
        "A dentist using AI for patient notes creates records outside any privilege framework.",
        "A researcher drafting a grant feeds unpublished methodology into retention they cannot reach.",
        "A family asking for medical guidance generates behavioral data that flows to institutions they never consented to share with.",
        "A child interacting with AI builds a behavioral profile before they understand what consent means.",
        "One system. Every life. The same exposure.",
        "This is not a problem for technologists alone. It is a problem for anyone who thinks out loud.",
      ],
    },
    {
      heading: "Privacy Versus Confidentiality",
      paragraphs: [
        "This is the single most important distinction in the document. Read it slowly.",
        "Privacy is a policy. A corporate promise. A line in a terms-of-service agreement. It can be rewritten. It can be overruled by a court. It can be quietly abandoned in an update at two in the morning.",
        "Confidentiality is a property of the system itself. It is enforced by mathematics and by hardware that the company building the product cannot see into. It does not depend on trust. It does not depend on good intentions. It does not depend on whether a corporation decides your data is worth more as training material than as a protected asset.",
        "Every competitor says they are private. Everyone says that.",
        "Jokuh is built for confidentiality. Not privacy theater.",
      ],
    },
    {
      heading: "What We Built",
      paragraphs: [
        "We built Jokuh — Joining Our Knowledge, Unifying Humanity — because confidentiality cannot rest on corporate policy. It has to rest on architecture. And because intelligence should not be solitary. It should be social, sovereign, and alive.",
        "Jokuh is a private operating layer where conversation becomes memory, memory becomes structure, and structure becomes action — without you ever being handed to a third party along the way.",
        "The technical foundation, in plain terms:",
        "The AI inference happens inside a sealed compartment on the chip itself — a Trusted Execution Environment. The cloud operator hosting the hardware cannot look inside. We, the company building Jokuh, cannot look inside. The hardware vendor cannot look inside. This is real, production technology in 2026 on NVIDIA H100 and H200 chips with Intel TDX and AMD SEV-SNP, with measured single-digit-percent overhead on large models.",
        "The encryption keys are held by you, not us. Without your key, what we have is encrypted noise. With your key, it is your life.",
        "We are honest about what is shipping today versus what is on the roadmap. Trusted Execution Environments are deployed now. Zero-Knowledge Proofs are integrated where verification of computation is operationally justified. Fully Homomorphic Encryption is the mathematical ideal for AI inference and remains operationally expensive at scale; we deploy it where the math and the cost-benefit are honest, not as decoration.",
        "We will not collapse \"deployed\" and \"roadmap\" to sound louder.",
      ],
    },
    {
      heading: "What It Feels Like To Use",
      paragraphs: [
        "Imagine the screen as a digital campfire. People gather. Conversation happens. And for the first time, nothing evaporates.",
        "When a meeting starts, Jokuh listens and writes it down for you. Raw speech becomes usable memory — notes, hooks, action items, retrievable context — without you taking notes.",
        "When you want to find something, Jokuh shows you a timeline of your own life — meetings, messages, decisions, media — that you can scroll, search, and ask questions of in plain language. No more reconstructing your week across six disconnected apps.",
        "When you want to act, you ask the prompt bar. It already knows what happened, what matters, and what is still unresolved — because it is drawing from your own lived work, not a stranger's training set.",
        "When you want to share something, Jokuh writes a personal update for the right audience — based on what you actually said, built, and decided this week. Not manual posts. Automatic expressions of real activity.",
        "When you want to coordinate with others, Jokuh gives you shared rooms where context is collective without being surrendered. Your team, your family, your community can think together without any of you handing your data to a platform first.",
        "Conversation becomes memory. Memory becomes structure. Structure becomes action. All of it inside a boundary you own. None of it surrendered.",
        "This is not twenty more apps. It is one continuous layer for life and work.",
      ],
    },
    {
      heading: "Do Not Trust. Verify.",
      paragraphs: [
        "We welcome your skepticism. We demand it.",
        "Test the claims. Attack the architecture. Demand attestations. Read the code. Bring your own threat model. This system is built by people who use it every day under real confidentiality obligations — real meetings captured, real memory preserved, real prompts run against lived context.",
        "We are not asking you to trust us.",
        "We are asking you to verify that trust is unnecessary — because the math holds whether you believe in us or not.",
      ],
    },
    {
      heading: "The Window Is Closing",
      paragraphs: [
        "The age of surrendering the mind to centralized systems is ending — but only if enough people choose to end it.",
        "The world is noisy. The window is closing.",
        "Claim your sovereignty. Forge your first sidekick. Reclaim your data, your time, and your authorship over your own thinking.",
        "Welcome to Jokuh.",
        "The doors are locked from the inside — and only you hold the key.",
      ],
    },
  ] satisfies ManifestoSection[],
} as const;
