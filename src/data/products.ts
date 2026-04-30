export const PRODUCT_IDS = [
  "pods",
  "blurbs",
  "spine",
  "calls",
  "messages",
  "profile",
  "vortex",
  "passport",
  "orb",
  "realms",
  "v1llains",
] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

export type Product = {
  id: ProductId;
  title: string;
  summary: string;
  body: string[];
};

export const PRODUCTS: Record<ProductId, Product> = {
  pods: {
    id: "pods",
    title: "Pods",
    summary: "Build your profile in pieces.",
    body: [
      "Pods are composable surfaces on your identity: the pieces of life you want visible (audio, documents, on-chain badges, CVs) without breaking the visual language of Jokuh.",
      "They are authored with the same Gooey glass system as the rest of the app, so you can edit inline and keep layout consistent from phone to desktop.",
      "Together, pods turn a profile from a static bio into a living workspace visitors can actually use, not just scroll past.",
    ],
  },
  blurbs: {
    id: "blurbs",
    title: "Blurbs",
    summary: "Seeds of thought from what you already said.",
    body: [
      "Blurbs are short, AI-crystallized seeds pulled from the conversations you are already having. You choose what stays private and what you publish.",
      "Posting becomes a routing decision, not a creation chore. Private by default. Public only when you say so.",
      "They inherit Spine’s confidentiality: source material is processed the same way the rest of your memory is—yours, not the company’s.",
    ],
  },
  spine: {
    id: "spine",
    title: "Spine",
    summary: "The encrypted memory layer at the core of Jokuh.",
    body: [
      "Spine is persistent memory your agents read and write. Conversations, decisions, documents, and signals you keep—encrypted at rest, in motion, and in compute—crystallize into your Knowledge Pool.",
      "It is built so the company that ships it cannot read what it stores. Keys are yours. Forgetting is one click, and it is real.",
      "From Calls and Messages to Blurbs and connected tools, Spine is the vault that learns on your terms.",
    ],
  },
  calls: {
    id: "calls",
    title: "Calls",
    summary: "Encrypted voice that flows into your Knowledge Pool.",
    body: [
      "End-to-end encrypted voice: audio is private on the wire, and the transcript and summary live in your Spine, not a vendor’s model farm.",
      "Transcription and crystallization run in a trusted execution path so plaintext never becomes someone else’s product.",
      "Search past calls, spin Blurbs from highlights, and let your Sidekick join quietly—all without giving up the room.",
    ],
  },
  messages: {
    id: "messages",
    title: "Messages",
    summary: "Encrypted threads that compound in your Spine.",
    body: [
      "The wire is end-to-end encrypted; the thread persists in your Spine where only you and the people you addressed can read it.",
      "Text, files, voice memos, and value can share one thread. Your agent can search and act inside the same confidentiality model as the rest of Jokuh.",
      "Forget a thread and the keys are gone. The pattern mainstream messengers use—encrypted today, forgotten tomorrow—is not the trade here.",
    ],
  },
  profile: {
    id: "profile",
    title: "Profile",
    summary: "Where your Sigil (your living identity) shows up.",
    body: [
      "Profile is the public surface for your Sigil: a self-owned, evolving digital identity that compounds from how you actually think, not a leased bio.",
      "Public blurbs, verifiable proofs, and your glyph sit beside facets you can scope to collaborators, friends, or anonymity.",
      "It is not a Linktree or a static page; it is the seat of identity for an operating system that runs on you.",
    ],
  },
  vortex: {
    id: "vortex",
    title: "Vortex",
    summary: "Ask across everything.",
    body: [
      "Vortex is the converged layer for questions that cut across messengers, wallets, calendars, and agents.",
      "Instead of opening a dozen threads to reconstruct a decision, you ask once and work from a single address.",
      "Over time it becomes the place where “what did we decide?” and “what do I owe?” have the same front door.",
    ],
  },
  passport: {
    id: "passport",
    title: "Passport",
    summary: "Carry your identity everywhere.",
    body: [
      "Passport is a portable, verifiable identity layer that travels with you across apps, chains, and contexts.",
      "Instead of rebuilding trust from scratch on every new platform, Passport lets credentials, reputation, and preferences follow you\u2014privately and selectively.",
      "Think of it as the bridge between who you are on Jokuh and how you show up everywhere else.",
    ],
  },
  orb: {
    id: "orb",
    title: "Orb",
    summary: "Live concerts from another dimension.",
    body: [
      "Orb is a digital concert experience that feels like an alien spaceship touching down in your city\u2014immersive spatial audio, reactive visuals, and crowd energy that travels through the screen.",
      "Artists perform inside generative environments that respond to the music in real time: light bends, the ground shifts, and the audience becomes part of the architecture.",
      "It is not a livestream with a chat box. It is the show itself, rebuilt for a world where presence does not require proximity.",
    ],
  },
  v1llains: {
    id: "v1llains",
    title: "V1llains",
    summary: "Antagonists that sharpen your thinking.",
    body: [
      "V1llains are adversarial agents that stress-test your ideas, strategies, and decisions before the real world does.",
      "They argue the other side, find the holes, and force clarity—not to tear things down, but to make what survives stronger.",
      "Think of them as the sparring partner every builder needs but rarely has access to.",
    ],
  },
  realms: {
    id: "realms",
    title: "Realms",
    summary: "Spaces that shape themselves around you.",
    body: [
      "Realms are persistent, themed environments where identity, content, and community converge into a single living space.",
      "Each realm adapts to its creator—visual language, layout rules, and access controls shift to match the intention behind the space.",
      "Think of it as the difference between renting a page and owning a world.",
    ],
  },
};

export const PRODUCT_ORDER: ProductId[] = [...PRODUCT_IDS];
