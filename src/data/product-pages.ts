import type { ProductId } from "./products";

export type ValueCardAccent = "green" | "blue" | "purple" | "rose";

export type ProductHighlightCard = {
  title: string;
};

export type ProductPageData = {
  heroTitle: [string, string];
  highlightsTitle: string;
  highlightsAction: string;
  highlightCards: ProductHighlightCard[];
  bentoTitle: string;
  bentoLeft: string;
  bentoTopRight: string;
  bentoBottomRight: string;
  bannerQuote: string;
  spotlightTitle: string;
  spineTitle: string;
  privacyTitle: string;
  closingTitle: string;
  closingPrimaryCta: string;
  closingSecondaryCta: string;
  valueCards: { title: string; accent: ValueCardAccent }[];
};

export const PRODUCT_PAGES: Record<ProductId, ProductPageData> = {
  pods: {
    heroTitle: ["A profile that", "feels like you."],
    highlightsTitle: "Pods make identity usable.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Show more than a bio." },
      { title: "Keep every surface aligned." },
      { title: "Edit live." },
    ],
    bentoTitle: "Everything has a place.",
    bentoLeft: "Build your profile in pieces.",
    bentoTopRight: "Drop in context and keep moving.",
    bentoBottomRight: "Change the layout without losing yourself.",
    bannerQuote: "Your world, arranged your way.",
    spotlightTitle: "Pods make identity feel alive.",
    spineTitle: "What you share stays easy to trace.",
    privacyTitle: "Your profile stays yours.",
    closingTitle: "A simpler way to show your world.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "One profile, many surfaces", accent: "green" },
      { title: "Private by default", accent: "blue" },
      { title: "Flexible by nature", accent: "purple" },
      { title: "Made to travel", accent: "rose" },
    ],
  },
  blurbs: {
    heroTitle: ["From conversation", "to clean copy."],
    highlightsTitle: "Blurbs make posting feel easy.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Start with what was said." },
      { title: "Write for the right person." },
      { title: "Keep your own voice." },
    ],
    bentoTitle: "Say it once. Ship it well.",
    bentoLeft: "Turn talk into a draft.",
    bentoTopRight: "Rewrite without starting over.",
    bentoBottomRight: "Publish when it sounds right.",
    bannerQuote: "Good conversation deserves a clean second life.",
    spotlightTitle: "Blurbs turn speech into something shareable.",
    spineTitle: "Every draft keeps its place in time.",
    privacyTitle: "Your source stays private.",
    closingTitle: "A calmer way to turn talk into posts.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "Write from real context", accent: "green" },
      { title: "Keep control of the draft", accent: "blue" },
      { title: "Sound like yourself", accent: "purple" },
      { title: "Move from talk to publish", accent: "rose" },
    ],
  },
  spine: {
    heroTitle: ["See time", "more clearly."],
    highlightsTitle: "Spine makes memory easier to follow.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Jump to what mattered." },
      { title: "Pick up where you left off." },
      { title: "Keep signal over noise." },
    ],
    bentoTitle: "A timeline built for thinking.",
    bentoLeft: "Move through time on purpose.",
    bentoTopRight: "Ask your history a direct question.",
    bentoBottomRight: "Hold the long arc in view.",
    bannerQuote: "Context should not disappear when you scroll.",
    spotlightTitle: "Spine gives memory a clearer shape.",
    spineTitle: "Every important moment stays on the line.",
    privacyTitle: "Your history stays in your hands.",
    closingTitle: "A better way to remember what matters.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "Time stays readable", accent: "green" },
      { title: "Context stays intact", accent: "blue" },
      { title: "Noise falls away", accent: "purple" },
      { title: "Decisions keep their place", accent: "rose" },
    ],
  },
  vortex: {
    heroTitle: ["One place to", "ask across everything."],
    highlightsTitle: "Vortex brings scattered work into one question.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Search across the mess." },
      { title: "Route intent to the right tool." },
      { title: "Find the answer faster." },
    ],
    bentoTitle: "A single front door for messy systems.",
    bentoLeft: "Ask once across every surface.",
    bentoTopRight: "Stay in one conversation.",
    bentoBottomRight: "Keep complexity behind the glass.",
    bannerQuote: "You should not need twelve tabs to get one answer.",
    spotlightTitle: "Vortex makes your stack feel connected.",
    spineTitle: "Important answers stay easy to revisit.",
    privacyTitle: "Access stays scoped to you.",
    closingTitle: "A cleaner way to work across the tools you already use.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "One question, many sources", accent: "green" },
      { title: "Permissions stay tight", accent: "blue" },
      { title: "Your stack stays yours", accent: "purple" },
      { title: "Answers come with receipts", accent: "rose" },
    ],
  },
  passport: {
    heroTitle: ["Carry your identity", "everywhere you go."],
    highlightsTitle: "Passport makes trust portable.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Take your credentials anywhere." },
      { title: "Prove without oversharing." },
      { title: "One identity, every chain." },
    ],
    bentoTitle: "Identity that moves with you.",
    bentoLeft: "Pack credentials into one portable layer.",
    bentoTopRight: "Share selectively across platforms.",
    bentoBottomRight: "Recover your identity, always.",
    bannerQuote: "You should not have to rebuild trust from scratch every time.",
    spotlightTitle: "Passport makes identity feel effortless.",
    spineTitle: "Every credential keeps its history.",
    privacyTitle: "Your data stays under your control.",
    closingTitle: "A simpler way to be yourself across the internet.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "Portable by default", accent: "green" },
      { title: "Verifiable and private", accent: "blue" },
      { title: "Cross-chain ready", accent: "purple" },
      { title: "Recoverable always", accent: "rose" },
    ],
  },
  v1llains: {
    heroTitle: ["Antagonists that", "sharpen your thinking."],
    highlightsTitle: "V1llains make ideas battle-tested.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Stress-test before you ship." },
      { title: "Find the blind spots." },
      { title: "Argue the other side." },
    ],
    bentoTitle: "Pressure makes diamonds.",
    bentoLeft: "Adversarial agents that challenge every assumption.",
    bentoTopRight: "Surface weaknesses before the market does.",
    bentoBottomRight: "Clarity forged through opposition.",
    bannerQuote: "The best ideas survive their toughest critic.",
    spotlightTitle: "V1llains turn soft plans into sharp ones.",
    spineTitle: "Every challenge leaves a trail of stronger decisions.",
    privacyTitle: "Your sparring sessions stay private.",
    closingTitle: "A harder conversation now saves a harder lesson later.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "Adversarial by design", accent: "green" },
      { title: "Private sparring", accent: "blue" },
      { title: "Clarity through conflict", accent: "purple" },
      { title: "Stronger outcomes", accent: "rose" },
    ],
  },
  realms: {
    heroTitle: ["Spaces that shape", "themselves around you."],
    highlightsTitle: "Realms make presence personal.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Build a world, not a page." },
      { title: "Set the rules of your space." },
      { title: "Invite on your terms." },
    ],
    bentoTitle: "Your space. Your physics.",
    bentoLeft: "A persistent environment shaped by its creator.",
    bentoTopRight: "Visual language that adapts to intention.",
    bentoBottomRight: "Access and atmosphere you control.",
    bannerQuote: "The internet gave us pages. We want worlds.",
    spotlightTitle: "Realms turn profiles into places.",
    spineTitle: "Every realm remembers its own history.",
    privacyTitle: "Your realm stays sovereign.",
    closingTitle: "A new kind of space for a new kind of presence.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "Persistent by default", accent: "green" },
      { title: "Creator-controlled", accent: "blue" },
      { title: "Visually adaptive", accent: "purple" },
      { title: "Community-ready", accent: "rose" },
    ],
  },
  orb: {
    heroTitle: ["Live concerts from", "another dimension."],
    highlightsTitle: "Orb makes presence electric.",
    highlightsAction: "Watch the film",
    highlightCards: [
      { title: "Step inside the show." },
      { title: "Visuals that breathe with the music." },
      { title: "A crowd you can feel." },
    ],
    bentoTitle: "The stage is the entire world.",
    bentoLeft: "Generative environments that react in real time.",
    bentoTopRight: "Spatial audio that wraps around you.",
    bentoBottomRight: "Crowd energy that travels through the screen.",
    bannerQuote: "Presence should not require proximity.",
    spotlightTitle: "Orb turns a screen into a front row.",
    spineTitle: "Every show leaves a trace you can revisit.",
    privacyTitle: "Your presence stays yours.",
    closingTitle: "A new kind of concert for a world without walls.",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      { title: "Immersive by default", accent: "green" },
      { title: "Reactive visuals", accent: "blue" },
      { title: "Spatial audio", accent: "purple" },
      { title: "Crowd presence", accent: "rose" },
    ],
  },
};
