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
    summary: "Your voice, without the noise.",
    body: [
      "A feed that feels like your world. Post a photo, drop a video, share a thought, tell a story — to the whole world, to your group of friends, or to one person who'll get it.",
      "Blurbs is built around the people who actually matter to you. OO holds the context — who you're close to, who you're not, what you want shared and what stays in.",
      "Every scroll feels personal. Every post lands right. The noise of the old internet finally goes quiet.",
    ],
  },
  spine: {
    id: "spine",
    title: "Spine",
    summary: "Every memory you've ever made. Held in one place.",
    body: [
      "The Spine is where your life lives. Conversations, the people you shared them with, photos, moments, things that caught your eye, midnight notes, plans you made and ones you almost forgot.",
      "OO holds all of it — quietly, completely, and only for you. Nothing slips through. Nothing gets lost.",
      "The more you live, the more your Spine becomes a second memory — one that actually remembers.",
    ],
  },
  calls: {
    id: "calls",
    title: "Calls",
    summary: "Talk freely. Truly private.",
    body: [
      "HD voice and video native to Jokuh — deal rooms, live captions, translation, guest knock queues, host recording, and in-call reactions. Every room is end-to-end encrypted.",
      "Infinity Dialog tier lets you ask from call context: who decided what, what you owe, and what happens next — without replaying an hour of video.",
      "When the room ends, OO writes transcript, action items, and follow-up drafts back to your Spine timeline. Schedule from a DM, invite via thread, and show up on time with native reminders.",
    ],
  },
  messages: {
    id: "messages",
    title: "Texts",
    summary: "Messages only you two can see. Private. Actually private.",
    body: [
      "E2EE DMs with read receipts, link previews, voice messages, and rich attachments — GIF picker, resumable uploads, and doc vault cards in-thread.",
      "@mentions and @oo in one composer: loop people in, tap suggestion pills, and let your private agent draft without leaving the chat.",
      "Calls and messages share a unified Spine transcript — searchable, shared with Together, and ready for OO context. You just talked; the thread remembers.",
    ],
  },
  profile: {
    id: "profile",
    title: "Profile",
    summary: "It knows you. The way you'd want to be known.",
    body: [
      "Your identity inside Jokuh isn't a username or a handle — it's you. Your voice, your relationships, your rhythms, your boundaries, the way you show up differently with your mom than with your team.",
      "OO understands all of it. Not by watching you. By being yours.",
      "The more you live, the deeper it knows — and the more effortlessly everything around you bends to fit who you actually are.",
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
    summary: "Step inside your bubble. Where your people live.",
    body: [
      "A Realm is more than a group chat. It's a place where conversations turn into companies, ideas turn into launches, friendships turn into collaborations. Livestream together. Build together. Joke together. Ship together.",
      "OO holds the whole room — remembering what was said, who said it, what needs doing next — so the energy of the conversation never gets lost in the work that follows.",
      "The fun stays. The work happens. Everyone moves forward.",
    ],
  },
};

export const PRODUCT_ORDER: ProductId[] = [...PRODUCT_IDS];
