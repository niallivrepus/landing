export type ManifestoSection = {
  heading: string;
  paragraphs: string[];
};

export const MANIFESTO = {
  metaLine: "Manifesto",
  title: "JOKUH",
  subtitle: "A private AI workspace for sensitive context",
  dek: "Jokuh is built for people and teams that need memory, identity, and agent workflows without losing control of the underlying record.",
  highlights: [
    "Sensitive context needs clear boundaries.",
    "Memory should be useful, reviewable, and scoped.",
    "Trust should come from architecture, evidence, and honest limits.",
  ],
  sections: [
    {
      heading: "The Short Version",
      paragraphs: [
        "AI is becoming the place where people think, plan, draft, coordinate, and make decisions. That makes the data boundary around AI more important than the interface around it.",
        "Jokuh is designed as a private workspace where conversation can become memory, memory can become structure, and structure can support action under explicit user and workspace controls.",
        "We do not treat privacy as a slogan. We treat it as a product constraint: encryption, scoped access, retention choices, reviewable logs, and clear separation between what is shipping now and what is still roadmap.",
      ],
    },
    {
      heading: "What We Are Building",
      paragraphs: [
        "Jokuh brings memory, messages, calls, profiles, and agent workflows into one operating surface. The goal is not to replace every tool. The goal is to keep the important context attached to the people, projects, and decisions that created it.",
        "Spine is the memory layer. Blurbs turns existing work into drafts and updates. Calls and Messages keep conversation tied to useful context. Profile gives identity a public surface without forcing every detail into public view.",
        "These products are in early access. Features, availability, pricing, and platform support may change as the architecture and rollout mature.",
      ],
    },
    {
      heading: "What We Will Not Overclaim",
      paragraphs: [
        "We will not say a system is impossible to access when real systems have exceptions, operators, bugs, backups, logs, legal duties, and customer-configured workflows.",
        "We will not collapse deployed capability, pilot behavior, and roadmap into one louder sentence.",
        "We will describe security and privacy in terms of design, controls, evidence, and limits. If a claim needs proof, it should be paired with proof or written more carefully.",
      ],
    },
    {
      heading: "How We Want Jokuh To Feel",
      paragraphs: [
        "A user should be able to ask what happened, why it mattered, who was involved, and what needs to happen next without rebuilding the whole story from scattered apps.",
        "A team should be able to keep the record close without making every employee, admin, model, or vendor an unrestricted reader of that record.",
        "A founder, operator, clinician, researcher, or builder should be able to move quickly while still knowing which claims are sourced, which actions need review, and which details should remain private.",
      ],
    },
    {
      heading: "The Standard",
      paragraphs: [
        "Pitch-ready means truthful under pressure. If a sentence would make counsel, security, or a serious customer ask for evidence, the sentence should either get evidence or get rewritten.",
        "That is the standard we want for the product and for the website describing it.",
        "Clear beats dramatic. Specific beats absolute. Verified beats impressive.",
      ],
    },
  ] satisfies ManifestoSection[],
} as const;
