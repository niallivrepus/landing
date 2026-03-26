import type { ProductId } from "./products";

export type ValueCardAccent = "green" | "blue" | "purple" | "rose";

export type ProductHighlightCard = {
  kicker: string;
  title: string;
  description: string;
};

export type ProductPageData = {
  heroTitle: [string, string];
  heroSubtitle: string;
  highlightsTitle: string;
  highlightsAction: string;
  highlightCards: ProductHighlightCard[];
  bentoTitle: string;
  bentoLeft: { title: string; body: string };
  bentoTopRight: { title: string; body: string };
  bentoBottomRight: { title: string; body: string };
  bannerQuote: string;
  spotlightTitle: string;
  spotlightSubtitle: string;
  spineTitle: string;
  spineSubtitle: string;
  privacyTitle: string;
  privacyBody: string[];
  closingTitle: string;
  closingPrimaryCta: string;
  closingSecondaryCta: string;
  valueCards: { title: string; body: string; accent: ValueCardAccent }[];
};

export const PRODUCT_PAGES: Record<ProductId, ProductPageData> = {
  pods: {
    heroTitle: ["Say hello to", "your little pods."],
    heroSubtitle:
      "Where your profile stays modular, privacy stays local-first, and every surface shares one craft language—built for people, tuned with intelligence.",
    highlightsTitle: "Get the highlights.",
    highlightsAction: "Watch the film",
    highlightCards: [
      {
        kicker: "Layout",
        title: "Glass that scales",
        description: "Pods resize from phone to desktop without breaking the grid you designed.",
      },
      {
        kicker: "Identity",
        title: "One handle, many faces",
        description: "Music, files, badges, and bio blocks all read as one continuous you.",
      },
      {
        kicker: "Ship",
        title: "Edit in place",
        description: "Inline authoring with the same Gooey primitives we ship in product.",
      },
    ],
    bentoTitle: "Explore how pods help you write, focus, and show who you are.",
    bentoLeft: {
      title: "Your profile is the canvas",
      body: "Stack pods like instruments on a board—each one a focused surface for a part of your life, always under your control.",
    },
    bentoTopRight: {
      title: "Prompt meets surface",
      body: "Jump from the bar into a pod: ask, paste, or drop media and keep context on the same glass plane.",
    },
    bentoBottomRight: {
      title: "Modular by default",
      body: "Swap layouts without losing identity. Pods are the grid; your story stays centered.",
    },
    bannerQuote: "All your powerful surfaces, organized in one humane place.",
    spotlightTitle: "Meet Pods.",
    spotlightSubtitle:
      "Create your digital universe with Pods—an interactive modular grid that lets you build, customize, and express your identity.",
    spineTitle: "See your activity in the spine of your timeline",
    spineSubtitle:
      "Pods write events you care about into the spine—so jumps between days and weeks stay legible, not lost to infinite scroll.",
    privacyTitle: "No one else can read your data. Only you.",
    privacyBody: [
      "Pods inherit the same trust boundaries as the rest of Jokuh: your handles, files, and preferences stay keyed to you.",
      "We design for encryption at rest, least-privilege access, and clear consent—so modular never means opaque.",
    ],
    closingTitle: "Why Jokuh is the best place to learn, connect, and find freedom",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      {
        title: "Connect meaningfully, beyond borders",
        body: "Pods travel with your identity—same glass, same trust, whether someone meets you on web or mobile.",
        accent: "green",
      },
      {
        title: "Your data and privacy, your ultimate asset",
        body: "Modular layout does not mean scattered custody. You choose what surfaces, what stays private.",
        accent: "blue",
      },
      {
        title: "Experience true digital freedom",
        body: "Compose the profile you want—not the template a network picked for you.",
        accent: "purple",
      },
      {
        title: "Build once, express everywhere",
        body: "Gooey keeps craft consistent so pods feel native on every screen you ship to.",
        accent: "rose",
      },
    ],
  },
  blurbs: {
    heroTitle: ["From voice", "to feed-ready blurbs."],
    heroSubtitle:
      "Meetings, DMs, and voice memos become drafts you can ship—personalized per follower so one update lands four different right ways.",
    highlightsTitle: "Get the highlights.",
    highlightsAction: "Watch the film",
    highlightCards: [
      {
        kicker: "Drafts",
        title: "Transcript to thread",
        description: "Pull context from what was already said—no blank page paralysis.",
      },
      {
        kicker: "Audience",
        title: "Per-follower tone",
        description: "Investors get crisp; friends get warm; builders get sharp—automatically.",
      },
      {
        kicker: "Iterate",
        title: "Stay on voice",
        description: "Blurbs inherit your phrasing so posts still sound like you.",
      },
    ],
    bentoTitle: "Explore tools that help you write, focus, and communicate.",
    bentoLeft: {
      title: "Blurbs start from real conversation",
      body: "Feed the composer transcripts and chats; inference proposes cuts, hooks, and CTAs you can accept in one tap.",
    },
    bentoTopRight: {
      title: "Prompt bar as co-writer",
      body: "Tighten tone, expand an idea, or translate intent for another audience without leaving the flow.",
    },
    bentoBottomRight: {
      title: "Ship with confidence",
      body: "See variants side by side, compare reach assumptions, and publish when it feels right—not when the tab limit breaks.",
    },
    bannerQuote: "Every conversation deserves a respectful path to the feed.",
    spotlightTitle: "Meet Blurbs.",
    spotlightSubtitle:
      "Turn raw dialogue into social-ready posts—tuned for each follower, always editable, never generic.",
    spineTitle: "See drafts evolve on your spine",
    spineSubtitle:
      "Every blurb you ship anchors in time—rewind the spine to see how your voice landed across weeks and launches.",
    privacyTitle: "No one else can read your data. Only you.",
    privacyBody: [
      "Source threads stay in your boundary; blurbs only train on what you authorize.",
      "We separate inference from distribution—drafts are yours until you explicitly send them outward.",
    ],
    closingTitle: "Why Jokuh is the best place to learn, connect, and find freedom",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      {
        title: "Connect meaningfully, beyond borders",
        body: "The same blurb engine respects locale, language, and cultural tone when you ask it to.",
        accent: "green",
      },
      {
        title: "Your data and privacy, your ultimate asset",
        body: "Transcripts and outputs inherit Jokuh’s encryption and access policies by default.",
        accent: "blue",
      },
      {
        title: "Experience true digital freedom",
        body: "Post on your terms—no forced viral templates, no mystery algorithms rewriting you.",
        accent: "purple",
      },
      {
        title: "Ideas move at the speed of conversation",
        body: "Blurbs close the gap between what was decided in the room and what the world hears.",
        accent: "rose",
      },
    ],
  },
  spine: {
    heroTitle: ["Navigate time", "like bubbles—not feeds."],
    heroSubtitle:
      "The spine replaces infinite scroll with days, weeks, months, and years you can traverse deliberately—context preserved, noise throttled.",
    highlightsTitle: "Get the highlights.",
    highlightsAction: "Watch the film",
    highlightCards: [
      {
        kicker: "Time",
        title: "Bubble navigation",
        description: "Zoom out to eras, zoom in to the afternoon that mattered.",
      },
      {
        kicker: "Continuity",
        title: "Cross-device handoff",
        description: "Pick up the same thread on desktop, web, or pocket without losing place.",
      },
      {
        kicker: "Signal",
        title: "What mattered next",
        description: "The spine surfaces what you flagged—not what engagement hacked.",
      },
    ],
    bentoTitle: "Explore tools that help you remember, refocus, and move forward.",
    bentoLeft: {
      title: "Memory with intent",
      body: "Every pod, blurb, and prompt event can land on the spine with the fidelity you choose.",
    },
    bentoTopRight: {
      title: "Prompt from history",
      body: "Ask across weeks: “What did we decide?” and let the spine narrow the search space.",
    },
    bentoBottomRight: {
      title: "Designed for long arcs",
      body: "Founders, creatives, and crews all need timelines that survive quarter-scale work.",
    },
    bannerQuote: "All your powerful moments, threaded in one continuous spine.",
    spotlightTitle: "Meet the Spine.",
    spotlightSubtitle:
      "A vertical axis for your digital life—ticks for launches, rests for reflection, color for energy at a glance.",
    spineTitle: "See your activity in the spine of your timeline",
    spineSubtitle:
      "Branches extend from the center line: messages, files, pods, and prompts each find their moment without crowding the rest.",
    privacyTitle: "No one else can read your data. Only you.",
    privacyBody: [
      "Timeline entries respect the same encryption and keys as the rest of your Jokuh graph.",
      "You control retention windows—what ages off the spine and what stays pinned.",
    ],
    closingTitle: "Why Jokuh is the best place to learn, connect, and find freedom",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      {
        title: "Connect meaningfully, beyond borders",
        body: "Shared spines for teams are coming—same clarity, collective consent.",
        accent: "green",
      },
      {
        title: "Your data and privacy, your ultimate asset",
        body: "The spine is a view over your data—not a separate copy someone else mines.",
        accent: "blue",
      },
      {
        title: "Experience true digital freedom",
        body: "Scroll when you want to; spine when you need to think across time.",
        accent: "purple",
      },
      {
        title: "Truth lives in context",
        body: "See the order of decisions, not just the latest notification.",
        accent: "rose",
      },
    ],
  },
  vortex: {
    heroTitle: ["One converged", "layer for every inbox."],
    heroSubtitle:
      "Query across messengers, wallets, calendars, and agents—so “what did everyone decide?” has a single address instead of twelve tabs.",
    highlightsTitle: "Get the highlights.",
    highlightsAction: "Watch the film",
    highlightCards: [
      {
        kicker: "Search",
        title: "Cross-surface answers",
        description: "Unified retrieval without copy-pasting screenshots between apps.",
      },
      {
        kicker: "Agents",
        title: "Same bar, many backends",
        description: "Vortex routes intent to the right tool while you stay in one conversation.",
      },
      {
        kicker: "Clarity",
        title: "Less tab fatigue",
        description: "Reconstruct decisions from one pane—built for operators and obsessives alike.",
      },
    ],
    bentoTitle: "Explore tools that help you query, decide, and delegate.",
    bentoLeft: {
      title: "Vortex is the switchboard",
      body: "Plug calendars, chats, and on-chain signals into one inference-friendly surface.",
    },
    bentoTopRight: {
      title: "Prompt bar integration",
      body: "Natural language becomes structured pulls across connectors you have already trusted.",
    },
    bentoBottomRight: {
      title: "Built for messy reality",
      body: "Hybrid work means hybrid stacks—vortex embraces the sprawl without glorifying it.",
    },
    bannerQuote: "All your powerful tools, reachable from one converged layer.",
    spotlightTitle: "Meet Vortex.",
    spotlightSubtitle:
      "Spin up answers across silos—avatars, connectors, and context orbit the same command center.",
    spineTitle: "Vortex writes back to your spine",
    spineSubtitle:
      "Important pulls and resolutions land as spine events so you can audit what changed and when.",
    privacyTitle: "No one else can read your data. Only you.",
    privacyBody: [
      "Connectors use scoped tokens; vortex never implies blanket access to every thread.",
      "Audit trails show what was queried, when, and under which policy—transparency by design.",
    ],
    closingTitle: "Why Jokuh is the best place to learn, connect, and find freedom",
    closingPrimaryCta: "Join waitlist",
    closingSecondaryCta: "View home",
    valueCards: [
      {
        title: "Connect meaningfully, beyond borders",
        body: "Bridge global teams without everyone standardizing on a single chat monopoly.",
        accent: "green",
      },
      {
        title: "Your data and privacy, your ultimate asset",
        body: "Least privilege per connector; revoke access and vortex forgets the bridge.",
        accent: "blue",
      },
      {
        title: "Experience true digital freedom",
        body: "Ask freely across stacks you already chose—no new cage required.",
        accent: "purple",
      },
      {
        title: "Decisions deserve receipts",
        body: "Vortex summarizes with citations so you can trust the merge, not just the vibe.",
        accent: "rose",
      },
    ],
  },
};
