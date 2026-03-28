export const PRODUCT_IDS = ["pods", "blurbs", "spine", "vortex", "passport", "orb", "realms", "v1llains"] as const;
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
    summary: "Turn talk into clean copy.",
    body: [
      "Blurbs turn raw conversation—meetings, chats, voice—into drafts you can ship. The model understands context from how you already talk, not from a blank text box.",
      "Each blurb can land differently per follower: tighter for investors, warmer for friends, sharper for builders—without you rewriting the same story four times.",
      "The goal is not more posts; it is fewer tabs between what was said and what goes out.",
    ],
  },
  spine: {
    id: "spine",
    title: "Spine",
    summary: "See time more clearly.",
    body: [
      "The spine replaces endless feeds with time as bubbles: days, weeks, months, and years you can move through deliberately.",
      "It preserves where you have been and what mattered next, instead of washing context away with infinite scroll.",
      "When you move between pods and sessions—especially on desktop and web—the spine is the continuity layer that keeps the story intact.",
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
