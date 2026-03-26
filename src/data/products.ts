export const PRODUCT_IDS = ["pods", "blurbs", "spine", "vortex"] as const;
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
    summary:
      "Building blocks on your profile—music, files, crypto, resumes—authored with the same Gooey glass system. Edit inline, keep layout consistent from phone to desktop.",
    body: [
      "Pods are composable surfaces on your identity: the pieces of life you want visible—audio, documents, on-chain badges, CVs—without breaking the visual language of Jokuh.",
      "They are authored with the same Gooey glass system as the rest of the app, so you can edit inline and keep layout consistent from phone to desktop.",
      "Together, pods turn a profile from a static bio into a living workspace visitors can actually use—not just scroll past.",
    ],
  },
  blurbs: {
    id: "blurbs",
    title: "Blurbs",
    summary:
      "Feed conversations from meetings and chats into inference that writes social posts for you—personalized per follower so the same update lands differently for investors, builders, and friends.",
    body: [
      "Blurbs turn raw conversation—meetings, chats, voice—into drafts you can ship. The model understands context from how you already talk, not from a blank text box.",
      "Each blurb can land differently per follower: tighter for investors, warmer for friends, sharper for builders—without you rewriting the same story four times.",
      "The goal is not more posts; it is fewer tabs between what was said and what goes out.",
    ],
  },
  spine: {
    id: "spine",
    title: "Spine",
    summary:
      "Navigate time as simple bubbles—days, weeks, months, years—instead of an infinite scroll that erases context. The spine is how you see where you have been and what matters next.",
    body: [
      "The spine replaces endless feeds with time as bubbles: days, weeks, months, and years you can move through deliberately.",
      "It preserves where you have been and what mattered next, instead of washing context away with infinite scroll.",
      "When you move between pods and sessions—especially on desktop and web—the spine is the continuity layer that keeps the story intact.",
    ],
  },
  vortex: {
    id: "vortex",
    title: "Vortex",
    summary:
      "One converged layer to query across messengers, wallets, calendars, and agents—so “what did everyone decide?” has a single address instead of twelve tabs.",
    body: [
      "Vortex is the converged layer for questions that cut across messengers, wallets, calendars, and agents.",
      "Instead of opening a dozen threads to reconstruct a decision, you ask once and work from a single address.",
      "Over time it becomes the place where “what did we decide?” and “what do I owe?” have the same front door.",
    ],
  },
};

export const PRODUCT_ORDER: ProductId[] = [...PRODUCT_IDS];
