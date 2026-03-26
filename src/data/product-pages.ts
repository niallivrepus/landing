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
};
