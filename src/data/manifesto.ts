export type ManifestoSection = {
  heading: string;
  paragraphs: string[];
};

export const MANIFESTO = {
  metaLine: "Private Intelligence",
  title: "JOKUH",
  subtitle: "Confidentiality Is Freedom",
  dek: "Sovereign by default. Not by policy. Not by promise. By math.",
  highlights: [
    "Privacy is too small a word for what is being lost.",
    "Confidentiality must be a property of the system itself.",
    "Private Intelligence is the category. Jokuh makes it real.",
  ],
  sections: [
    {
      heading: "Right Now",
      paragraphs: [
        "Right now, humanity is doing something it has never done before.",
        "Everyone is pouring the full architecture of human thought, strategies, secrets, intimate relationship details, every new idea, every unfinished sentence, every half-formed plan, into systems they do not own.",
        "Into servers they cannot audit.",
        "Under terms they have never read.",
        "Controlled by people they did not elect.",
        "This has never happened at this scale, in this medium, at this depth, in human history. The window to course-correct is closing. Whoever owns the AI substrate owns the definition of reality for the next several generations.",
        "This is the inflection that Jokuh exists to answer.",
      ],
    },
    {
      heading: "Every Day That Passes",
      paragraphs: [
        "Every day that passes, the substrate compounds.",
        "More founders pour their intellectual property into it. More lawyers draft strategy inside it. More clinicians dictate cases through it. More families trust it with their most intimate moments. More governments integrate it into core infrastructure. More classrooms depend on it to define what is factual to a generation that will spend their lives inside its outputs.",
        "The data does not disappear.",
        "It accumulates. It compounds. It becomes leverage. And leverage, in the wrong hands, becomes control.",
        "This is no longer a privacy question. It is a question of who holds the architectural memory of civilization, and on whose terms.",
      ],
    },
    {
      heading: "What Is Actually Being Lost",
      paragraphs: [
        "Privacy is too small a word for it.",
        "What is being lost is **authorship over the mind.**",
        "Every day, billions of people speak their most private thoughts into systems they do not own, cannot audit, and have no power over. They ask for medical guidance. They debug unreleased code. They brainstorm legal strategy. They confide in something that feels like a secure assistant, intimate, always present, always listening.",
        "That assistant is a tenant of a corporation. The corporation logs the conversation. The conversation becomes training data, then evidence, then inventory, in that order.",
        "Social media learned to extract what people said in public.",
        "AI is learning to extract what people think in private.",
        "The extraction is no longer at the surface. It is at the source.",
      ],
    },
    {
      heading: "A Universal Scenario",
      paragraphs: [
        "Consider an everyday case. Not a hypothetical, a pattern repeating across millions of households this month.",
        "A daughter sees her mother in pain. She types it into the assistant on her phone. She uploads a photograph for context. She asks for guidance.",
        "The assistant responds with what looks like advice.",
        "Underneath, something else has occurred. The conversation has been logged and translated into a market signal. A pharmaceutical advertiser can now target the mother, on her own device, through her own social feeds. A risk-scoring system can now classify the mother as **disabled**, a label that follows her into employment screens, insurance pricing, and credit decisions she will never know are happening.",
        "The daughter wanted to help. She did help, in the moment. But the system she trusted converted her care into a permanent record on someone else's ledger, against the interests of the person she loves.",
        "This is not a failure of intent. It is the design.",
        "The same shape repeats when a founder brainstorms a product, when a clinician dictates patient notes, when a researcher writes an unpublished method, when a child types a question they would not say aloud, when a couple negotiates a difficult moment through a chat window.",
        "One system. Every life. The same exposure.",
      ],
    },
    {
      heading: "The Pattern Is Not Hypothetical",
      paragraphs: [
        "Mass cognitive surveillance architecture already exists in production, in nation-state form, today.",
        "China operates a Social Credit infrastructure that de-platforms citizens for speech.",
        "Russia compels SORM intercepts that archive communications by law.",
        "Iran uses social media data for retroactive prosecution.",
        "The European Union compels disclosure under regulatory frameworks; companies quietly comply.",
        "These are not edge cases. They are working systems, deployed at population scale, that have already demonstrated what happens when behavioral data and identity become the same record.",
        "AI does not introduce this architecture. AI makes it exponentially more powerful, more accessible, and cheaper to deploy.",
        "The most dangerous prison ever built has no bars, no guards, and no trial. It is an AI that remembered everything a person said when they thought no one was listening, and one person somewhere with the quiet power to use it against them.",
        "That is the architecture currently being shipped to consumers as a productivity tool.",
      ],
    },
    {
      heading: "What Has Already Happened",
      paragraphs: [
        "These are not predictions. They are filed cases, court orders, and published policy.",
        "**A federal court ordered the preservation of deleted chats.** In In re OpenAI, Inc. Copyright Infringement Litigation (Southern District of New York, MDL 1:25-md-03143), a federal court ordered OpenAI to preserve consumer ChatGPT conversations, including chats users had deleted or marked temporary, and to produce twenty million de-identified logs to plaintiffs. Issued November 2025, affirmed January 2026. Enterprise customers under Zero Data Retention agreements were carved out. Free, Plus, and Pro users were not. OpenAI itself characterized the situation as a \"privacy nightmare.\" The court ruled the data admissible.",
        "Plain meaning: when a court asks for user chats, the company must produce them.",
        "**Privilege does not automatically follow the prompt.** In United States v. Heppner (Southern District of New York, February 2026), a federal court held that a defendant's self-directed use of consumer Claude did not receive attorney-client privilege protection, even where the user was preparing for a meeting with counsel. Narrow ruling. Wide implication.",
        "Plain meaning: confiding in AI the way one would confide in a lawyer does not necessarily receive the same legal protection.",
        "**Surveillance by design, alleged.** A class-action complaint filed in San Francisco federal court in April 2026 alleges that Perplexity embedded trackers forwarding user conversations, including conversations in incognito mode, to third-party advertising infrastructure including Meta and Google, without disclosure, in violation of California privacy law. Allegations, not findings. Also a live federal docket.",
        "Plain meaning: even when a session looks private on the surface, it may not be in the wire.",
        "Real filings. Real orders. Real exposure.",
      ],
    },
    {
      heading: "What The Policies Actually Say",
      paragraphs: [
        "The disclosures almost no one reads:",
        "**OpenAI.** Consumer prompts and responses \"may be used to improve our services, for example to train the models that power ChatGPT.\" Opt-out exists, but must be enabled manually. Even after opt-out, conversations are centrally retained, reachable by human review, and producible in litigation, which the court order above demonstrates. The terms note that no transmission is \"fully secure,\" and that data may be produced in legal process. Metadata, names, emails, identifiers, is data too.",
        "**Anthropic.** As of 2025, all consumer tiers (Free, Pro, Max) are used to train Claude unless the user explicitly opts out. Even opted-out data can be retained for up to five years if flagged for safety, abuse, or feedback review. On March 31, 2026, an inadvertent publication briefly exposed roughly 512,000 lines of internal Claude Code source, confirmed publicly. The leak surfaced internal telemetry that classifies user signals such as frustration and profanity. What the telemetry is used for is contested. That it exists is not. Conversations in \"Incognito\" mode are retained for up to thirty days by default. Only Enterprise plans receive contractual protections.",
        "**Perplexity.** Their own privacy notice confirms consumer queries feed model development. The April 2026 complaint alleges the data flow did not stop there, that conversations were piped to advertising infrastructure even in private modes.",
        "The industry's answer to all of this is consistent: **pay more.** Six-figure enterprise contracts get the carve-outs. Everyone else is the product.",
        "This is not a glitch. This is the **business model**.",
      ],
    },
    {
      heading: "The Legal Trapdoor",
      paragraphs: [
        "There is a doctrine built into American law called the **Third-Party Doctrine.** In plain terms: when information is voluntarily handed to a third party, a phone company, a bank, a cloud provider, courts have historically held that the user has a reduced expectation of privacy in that information. It can be reached by lawful process without the user's knowledge.",
        "The moment a private thought is typed into a mainstream AI, it has been voluntarily handed to a third-party corporation.",
        "This doctrine has not yet been fully tested against AI conversations.",
        "That is precisely the point. It is a legal trapdoor that has not yet sprung, and the cases above are the first visible tests.",
      ],
    },
    {
      heading: "Privacy Is Not Criminal",
      paragraphs: [
        "There is an old reflex, taught in public for decades: if you have nothing to hide, you have nothing to fear.",
        "That reflex was useful to the systems that taught it.",
        "The Cypherpunk Manifesto answered this thirty years ago. Privacy is not the same as secrecy. Secrecy is something one wishes the whole world did not know. Privacy is something one wishes the whole world did not need to know, a sealed envelope, a closed door, a thought finished before it is shared.",
        "The reframe being sold today goes further. Defending privacy is now coded as suspicious, eccentric, paranoid, anti-progress.",
        "This is the inversion that makes the racket work. Once defending the envelope is socially expensive, almost no one defends it, and almost everyone hands theirs over.",
        "Privacy is not criminal.",
        "The absence of privacy is what creates the conditions for everything criminal that comes next.",
      ],
    },
    {
      heading: "Privacy Versus Confidentiality",
      paragraphs: [
        "This is the single most important distinction in this document.",
        "**Privacy** is a policy. A corporate promise. A line in a terms-of-service agreement. It can be rewritten. It can be overruled by a court. It can be quietly retired in an update at two in the morning.",
        "**Confidentiality** is a property of the system itself. It is enforced by mathematics and by hardware that the company building the product cannot see into. It does not rely on trust. It does not rely on intent. It does not rely on whether a corporation later decides that user data is worth more as training material than as a protected asset.",
        "Every competitor in the consumer-AI category is selling privacy.",
        "Jokuh is built for confidentiality.",
      ],
    },
    {
      heading: "Why The Incumbents Cannot Answer This",
      paragraphs: [
        "The incumbents are not competitors. They are a different business.",
        "OpenAI, Anthropic, and Perplexity are media and research companies whose entire valuation rests on a training-data flywheel: every consumer conversation makes the next model marginally better, which attracts more users, which produces more conversations. The flywheel is the product. The flywheel requires data retention.",
        "Confidentiality is structurally incompatible with that flywheel.",
        "A consumer AI company that cannot read user conversations cannot improve its model from those conversations. It cannot run safety telemetry against them. It cannot defend itself against discovery by claiming custody of nothing, because it has built its business around custody. The incumbents cannot pivot to confidentiality without dismantling the asset that makes them what they are.",
        "This is the moat. It is not a feature gap. It is an incentive gap.",
        "Jokuh is not building a better consumer AI. Jokuh is building **the confidentiality infrastructure the consumer AI category cannot build for itself.**",
        "The same way Stripe was not a better merchant account, Stripe was payments infrastructure for an internet that had outgrown merchant accounts. The same way Cloudflare was not a better web host, Cloudflare was security infrastructure for an internet that had outgrown firewalls.",
        "Private Intelligence is the category.",
        "Jokuh makes it real.",
      ],
    },
    {
      heading: "What We Built",
      paragraphs: [
        "**Jokuh**, Joining Our Knowledge, Unifying Humanity, is built on the premise that confidentiality cannot rest on corporate policy. It must rest on architecture. And on the premise that intelligence should not be solitary; it should be social, sovereign, and verifiable.",
        "Jokuh is a private operating system where conversation becomes memory, memory becomes structure, and structure becomes action, without the user being handed to a third party along the way.",
        "The technical foundation, in plain terms:",
        "AI inference happens inside a **sealed compartment on the chip itself**, a Trusted Execution Environment. The cloud operator hosting the hardware cannot look inside. The company building Jokuh cannot look inside. The hardware vendor cannot look inside. This is real, production technology in 2026 on NVIDIA H100 and H200 chips, with Intel TDX and AMD SEV-SNP, at measured single-digit-percent overhead on large models. The architectural pattern is consistent with published Confidential Computing Consortium deployment guidance.",
        "The **encryption keys are held by the user**, not by Jokuh. Without the user's key, what Jokuh holds is encrypted noise. With the user's key, it is the user's life, and only the user's.",
        "Around the sealed compartment, Jokuh combines end-to-end encrypted signals, **Zero-Knowledge Proofs** that mathematically attest to the integrity of computation, and **Fully Homomorphic Encryption** where the cost-benefit is honest. The roadmap is published. What is shipping today, what is in integration, and what is research-stage are labeled separately. This document will not collapse \"deployed\" and \"roadmap\" to sound louder.",
        "The result: Jokuh, the company, is **physically and mathematically incapable** of reading user chats, selling user IP, training models on user data, or producing user data to any judge, government, or advertiser. Not because the company has promised to behave. Because the company has nothing to give.",
        "This is not a pledge.",
        "This is cryptographic privilege.",
      ],
    },
    {
      heading: "What It Feels Like To Use",
      paragraphs: [
        "Imagine the screen as a digital campfire. People gather. Conversation happens. For the first time, nothing evaporates.",
        "When a meeting starts, Jokuh **listens and writes it down.** Raw speech becomes usable memory, notes, hooks, action items, retrievable context, without manual notetaking.",
        "When the user wants to find something, Jokuh shows **a timeline of their own life**, meetings, messages, decisions, media, searchable and questionable in plain language. No more reconstructing the week across six disconnected apps.",
        "When the user wants to act, they **ask the prompt bar.** It already knows what happened, what matters, and what is unresolved, because it is drawing from lived work, not a stranger's training set.",
        "When the user wants to share something, Jokuh writes a **personal update for the right audience**, based on what the user actually said, built, and decided that week. Honest expressions of real activity.",
        "When the user wants to coordinate with others, Jokuh provides **shared rooms** where context becomes collective without being surrendered. A team, a family, a community can think together without first handing the platform their data.",
        "Conversation becomes memory. Memory becomes structure. Structure becomes action. All of it inside a boundary the user owns. None of it surrendered.",
        "This is not twenty more apps. It is one continuous system for life and work.",
      ],
    },
    {
      heading: "Do Not Trust. Verify.",
      paragraphs: [
        "Skepticism is welcome. It is required.",
        "Test the claims. Attack the architecture. Demand attestations. Read the code paths. Bring a threat model.",
        "Jokuh is built by people who use it every day under real confidentiality obligations, real meetings captured, real memory preserved, real prompts run against real lived context. The system is dogfooded before it is sold.",
        "The ask is not for trust.",
        "The ask is to verify that trust is unnecessary, because the math holds whether anyone believes in it or not.",
      ],
    },
  ] satisfies ManifestoSection[],
} as const;
