/**
 * Long-form story pages — editorial layout (hero, gallery, prose, media, quote, CTA).
 */

export type StoryGalleryImage = {
  src: string;
  alt: string;
};

export type StoryImageCaptioned = {
  src: string;
  alt: string;
  caption: string;
};

export type StorySection =
  | { kind: "prose"; paragraphs: string[] }
  | { kind: "subhead"; text: string }
  | {
      kind: "imagesAsymmetric";
      large: StoryImageCaptioned;
      small: StoryImageCaptioned;
    }
  | { kind: "quote"; text: string; attribution: string }
  | { kind: "cta"; title: string; body: string; buttonLabel: string; buttonHref: string };

export type StoryDetail = {
  slug: string;
  metaLine: string;
  title: string;
  dek: string;
  heroGallery: StoryGalleryImage[];
  sections: StorySection[];
};

const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80`;

export const STORY_DETAILS: Record<string, StoryDetail> = {
  "gooey-island-merge-hygiene": {
    slug: "gooey-island-merge-hygiene",
    metaLine: "March 24, 2026 · Engineering · Design systems",
    title: "The Gooey app as a design island",
    dek: "A React shell can silently defeat a library if tokens and globals interleave. We treat `apps/gooey` as the canonical surface for the `@jokuh/gooey` package—so Storybook and Vite stay the source of truth.",
    heroGallery: [
      { src: u("photo-1555066931-4365d14bab8c", 1200, 800), alt: "" },
      { src: u("photo-1633356122544-f134324a6cee", 1200, 800), alt: "" },
      { src: u("photo-1460925895917-afdab827c52f", 1200, 800), alt: "" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "Gooey is not a theme sprinkle—it is a four-layer pipeline: raw palette → `design-tokens.css` → `globals.css` with `@theme inline` → components that only speak in Tailwind utilities and `cn()`. When a product app imports the package but also ships aggressive global CSS, the cascade rewrites micro-details: focus rings, glass blurs, purple accents. The UI still “renders,” but it is no longer the library you tested.",
          "The mitigation is operational as much as technical: keep the demo application (`apps/gooey`) mergeable as a unit. Pull requests should move the island together—prototype routes, asset manifests, and package pins—without dragging unrelated host layouts. Designers need a folder they can zip, drop into a clean tree, and run with the same hashes engineers used in CI.",
        ],
      },
      {
        kind: "subhead",
        text: "Barrel exports, token drift, and the cascade",
      },
      {
        kind: "prose",
        paragraphs: [
          "Every primitive must live under `packages/gooey/src/components/ui/` and surface through the barrel (`packages/gooey/src/index.ts`). That single export plane is how we grep for API breaks and how automated refactors stay bounded.",
          "Tailwind v4’s CSS-first configuration means there is no `tailwind.config.ts` escape hatch—if semantic aliases diverge between consumer and package, you debug computed styles, not JSON. Treat `:root.light` inversions and dark-mode `oklch` blocks as part of the public contract, versioned like any other API.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: u("photo-1555066931-4365d14bab8c", 1600, 1000),
          alt: "",
          caption: "Component work stays inside the package; the demo app is the integration harness.",
        },
        small: {
          src: u("photo-1460925895917-afdab827c52f", 900, 900),
          alt: "",
          caption: "Token diffs should be reviewable without opening Figma.",
        },
      },
      {
        kind: "quote",
        text: "If the host thinks it is “logical” to include one more global layer, the library loses a pixel at a time. Isolate first, integrate second.",
        attribution: "Design-engineering notes, Gooey monorepo",
      },
      {
        kind: "prose",
        paragraphs: [
          "For downstream teams, the playbook is blunt: import Gooey, do not fork tokens. Wire `ThemeProvider`, respect `prefers-reduced-motion`, and keep product-specific chrome in namespaced wrappers. When something looks wrong, diff the demo app before you diff the package—odds are the cascade, not the primitive.",
        ],
      },
      {
        kind: "cta",
        title: "Building on Gooey?",
        body: "If you are integrating `@jokuh/gooey` and hitting cascade conflicts, send a minimal repro against `apps/gooey`—we can codify the boundary as lint or Storybook guards.",
        buttonLabel: "Email engineering",
        buttonHref: "mailto:hello@jokuh.com",
      },
    ],
  },

  "live-transcript-hooks-spine": {
    slug: "live-transcript-hooks-spine",
    metaLine: "March 25, 2026 · Product · Realtime",
    title: "Live transcript hooks on the spine",
    dek: "Live ASR subtitles are human-facing. Hooks are machine-facing: typed spans aligned to diarization ids so agents can attach goals, decisions, and entities to a durable session spine.",
    heroGallery: [
      { src: u("photo-1516321318423-f06f85e504b3", 1200, 800), alt: "" },
      { src: u("photo-1451187580459-43490279c0fa", 1200, 800), alt: "" },
      { src: u("photo-1550751827-4bd374c3f58b", 1200, 800), alt: "" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "A transcript stream is cheap to display and expensive to reason about. Without structure, retrieval falls back to naive substring search—fine for captions, inadequate for orchestration. Hooks mark moments where humans telegraph intent: “the goal is…”, “let’s ship…”, “blocker on…”. Visually they surface as alternating highlight bubbles so participants notice them; under the hood they serialize as records `{type, t0, t1, speakerId, confidence, text}` committed to the spine graph.",
          "The spine is not the chat log. It is the typed projection: edges for decisions, nodes for artifacts, weights for recency and verification state. Hooks become first-class edges so downstream agents do not hallucinate continuity—they read the same graph the UI annotates.",
        ],
      },
      {
        kind: "subhead",
        text: "Latency, false positives, and motion policy",
      },
      {
        kind: "prose",
        paragraphs: [
          "Hook detection runs on partial hypotheses; you trade precision vs recall against UX. High-contrast cues help humans correct mistakes, but accessibility demands a non-motion path: color and iconography must carry meaning when `prefers-reduced-motion` is set.",
          "PII and retention policies apply twice: to raw audio and to hook payloads. If a hook lifts a proper noun into the spine, redaction rules need to travel with the edge, not just the caption tile.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: u("photo-1516321318423-f06f85e504b3", 1600, 1000),
          alt: "",
          caption: "Subtitles for people; spans and types for agents.",
        },
        small: {
          src: u("photo-1550751827-4bd374c3f58b", 900, 900),
          alt: "",
          caption: "Spine graph edges accumulate across yields and tool batches.",
        },
      },
      {
        kind: "quote",
        text: "The bubble is not decoration—it is a commit point the model can cite later.",
        attribution: "Realtime product spec draft",
      },
      {
        kind: "prose",
        paragraphs: [
          "Implementation sketch: ASR partials → lightweight classifier (or rules + LM verifier) → hook queue with debounce → spine writer with idempotent keys. Clients subscribe to hook events separately from token deltas so UI can animate without thrashing the graph store.",
        ],
      },
      {
        kind: "cta",
        title: "Shipping realtime features?",
        body: "We are hiring engineers who care about streaming protocols, graph stores, and honest accessibility—not just demo polish.",
        buttonLabel: "View careers",
        buttonHref: "/journal",
      },
    ],
  },

  "treasury-inference-api-grid": {
    slug: "treasury-inference-api-grid",
    metaLine: "March 26, 2026 · Engineering · Platform",
    title: "Treasury loops and the API grid",
    dek: "When usage settles to treasury and treasury buys inference, the product needs an API grid: adapters per provider, uniform metering, and fee lines users can audit—not a black box labeled “AI.”",
    heroGallery: [
      { src: u("photo-1558494949-ef010cbdcc31", 1200, 800), alt: "" },
      { src: u("photo-1544197150-b99a580bb7a8", 1200, 800), alt: "" },
      { src: u("photo-1551288049-bebda4e38f71", 1200, 800), alt: "" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "The prompt bar is the billing origin: it captures intent, entitlement tier, and the selected model route. From there, jobs fan out across providers with consistent request envelopes—temperature caps, tool allowlists, tracing ids—so finance and reliability see one ledger, not N vendor dashboards stitched in spreadsheets.",
          "Treasury feedback matters architecturally. Reinvesting settlement surplus into reserved inference capacity changes tail latency; documenting that loop publicly keeps incentives aligned. Users should see *why* a month costs what it costs: base subscription, burst tokens, bridge fees when crypto rails participate, and policy surcharges when safety classifiers engage.",
        ],
      },
      {
        kind: "subhead",
        text: "Fee decomposition and governance latency",
      },
      {
        kind: "prose",
        paragraphs: [
          "Cross-asset flows (e.g., user-settled crypto → fiat settlement → third-party booking) explode fee surfaces: network gas, liquidity spread, treasury spread, partner take. The UX can stay one-tap; the receipt must expand into a line-item trace engineers can replay. That is how you answer support tickets without myth-making.",
          "When policy changes—new model, new rate card, new safety gate—it should surface as a proposal object: title, diff summary, risk notes, effective date. Fast teams still review; automated agents can pre-score impact on P95 latency and projected burn.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: u("photo-1544197150-b99a580bb7a8", 1600, 1000),
          alt: "",
          caption: "Adapters normalize auth, streaming, and errors across providers.",
        },
        small: {
          src: u("photo-1551288049-bebda4e38f71", 900, 900),
          alt: "",
          caption: "Metering joins product analytics with finance-grade ids.",
        },
      },
      {
        kind: "quote",
        text: "If you cannot trace fees, you cannot iterate on pricing—or trust the reinvestment story.",
        attribution: "Platform architecture review",
      },
      {
        kind: "prose",
        paragraphs: [
          "Hard requirements for v1 of the grid: idempotent job ids, streaming byte accounting, per-route circuit breakers, and a kill switch that degrades to cached templates instead of silent provider failovers. Observability stacks (traces + cost tags) are not optional—they are the control plane.",
        ],
      },
      {
        kind: "cta",
        title: "Integrating with Jokuh APIs?",
        body: "Tell us about your throughput, compliance tier, and whether you need dedicated capacity—we map routes accordingly.",
        buttonLabel: "Contact platform",
        buttonHref: "mailto:hello@jokuh.com",
      },
    ],
  },

  "seed-farm-south-carolina": {
    slug: "seed-farm-south-carolina",
    metaLine: "March 26, 2026 · Jokuh Stories",
    title: "A seed farm in South Carolina",
    dek: "Farming today means juggling weather shifts, equipment upkeep, labor planning, and tight timelines—with decisions that can't wait.",
    heroGallery: [
      { src: u("photo-1625246333195-78d9c38ad447", 1200, 800), alt: "" },
      { src: u("photo-1500382017468-9049fed747ef", 1200, 800), alt: "" },
      { src: u("photo-1464226184884-fa280b87c399", 1200, 800), alt: "" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "When the forecast swings from drought to deluge in a single week, every choice on the farm compounds. Seed inventory, field windows, and crew schedules have to stay in sync—or the season pays the price.",
          "For Sharp & Sharp Certified Seed, the work is as much coordination as cultivation. Varieties are tracked by lot, customers expect purity and traceability, and there is no quiet month when you are both grower and supplier.",
        ],
      },
      {
        kind: "subhead",
        text: "Clarity when the season won't slow down",
      },
      {
        kind: "prose",
        paragraphs: [
          "The team started using structured prompts to draft equipment checklists, summarize supplier emails, and turn field notes into next-day plans. The goal was never to replace judgment—it was to buy back minutes for the decisions only a grower can make.",
          "What changed first was friction. Fewer threads lost in inboxes. Fewer half-remembered tasks. More of the day spent where it matters: walking rows, reading the weather, and keeping the operation honest.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: u("photo-1500382017468-9049fed747ef", 1600, 1000),
          alt: "",
          caption: "Harvest window: timing the pick so moisture and quality line up.",
        },
        small: {
          src: u("photo-1625246333195-78d9c38ad447", 900, 900),
          alt: "",
          caption: "Rachael Sharp, Sharp & Sharp Certified Seed",
        },
      },
      {
        kind: "prose",
        paragraphs: [
          "On paper it sounds small—cleaner lists, tighter summaries, faster replies. In practice it is the difference between reacting and steering. The farm still runs on experience; the layer on top just makes room for it.",
        ],
      },
      {
        kind: "quote",
        text: "Before, I would wonder, where can I get this, who can help me with that. And now it's like, okay, I can do this.",
        attribution: "Rachael Sharp, Sharp & Sharp Certified Seed",
      },
      {
        kind: "prose",
        paragraphs: [
          "Seasons will keep shortening the margin for error. The tools that win here are the ones that stay out of the way—fast to use, easy to trust, and respectful of how much is already on the line.",
        ],
      },
      {
        kind: "cta",
        title: "Share how you're building with Jokuh",
        body: "We're interested in real stories from real teams: how you're planning, shipping, and staying human at work. Big or small, we'd love to hear it.",
        buttonLabel: "Tell us your story",
        buttonHref: "mailto:hello@jokuh.com",
      },
    ],
  },

  "salvage-yard-nevada": {
    slug: "salvage-yard-nevada",
    metaLine: "March 22, 2026 · Jokuh Stories",
    title: "A salvage yard in Nevada",
    dek: "Between incoming lots, part lookups, and buyers who need an answer now, a yard moves faster when knowledge doesn't stay trapped in one person's head.",
    heroGallery: [
      { src: u("photo-1504917595217-d4dc5ebe6122", 1200, 800), alt: "" },
      { src: u("photo-1581092160562-40aa08f7880a", 1200, 800), alt: "" },
      { src: u("photo-1565043589221-1a6fd9ae45c7", 1200, 800), alt: "" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "Sparks fly, metal stacks, and someone always needs a VIN match before close. The yard runs on memory and hustle—until the day those don't line up.",
          "This team started turning repeat questions into short, searchable notes: interchange hints, pricing guardrails, and the oddball exceptions that only come up once a season—but matter when they do.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: u("photo-1504917595217-d4dc5ebe6122", 1600, 1000),
          alt: "",
          caption: "Cutting and sorting: where a few seconds of clarity saves hours.",
        },
        small: {
          src: u("photo-1581092160562-40aa08f7880a", 900, 900),
          alt: "",
          caption: "Floor lead, afternoon shift",
        },
      },
      {
        kind: "quote",
        text: "We still trust the old hands. We just don't ask them the same question for the tenth time.",
        attribution: "Yard operations lead",
      },
      {
        kind: "prose",
        paragraphs: [
          "The floor is still loud. The work is still physical. What's different is how fast new people ramp—and how often customers get a straight answer on the first call.",
        ],
      },
      {
        kind: "cta",
        title: "Share how you're building with Jokuh",
        body: "We're interested in real stories from real teams: how you're planning, shipping, and staying human at work. Big or small, we'd love to hear it.",
        buttonLabel: "Tell us your story",
        buttonHref: "mailto:hello@jokuh.com",
      },
    ],
  },

  "tamale-shop-california": {
    slug: "tamale-shop-california",
    metaLine: "March 18, 2026 · Jokuh Stories",
    title: "A tamale shop in California",
    dek: "Catering orders, prep lists, and family recipes don't leave much room for admin—unless you carve it out on purpose.",
    heroGallery: [
      { src: u("photo-1522071820081-009f0129c71c", 1200, 800), alt: "" },
      { src: u("photo-1556910103-1c02745aae4d", 1200, 800), alt: "" },
      { src: u("photo-1555939594-58d7cb561ad1", 1200, 800), alt: "" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "Morning is masa and meat. Afternoon is pickups, deliveries, and the spreadsheet no one wants to admit they hate. The shop grew from a counter to a small team, and with it came the usual growing pains: who's ordering what, and when.",
        ],
      },
      {
        kind: "subhead",
        text: "Recipes in muscle memory—schedules in plain language",
      },
      {
        kind: "prose",
        paragraphs: [
          "They began using simple prompts to turn messy notes into week-ahead prep sheets and customer-ready summaries. Spanish and English side by side where it helped. Nothing fancy—just fewer dropped balls during the Friday rush.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: u("photo-1522071820081-009f0129c71c", 1600, 1000),
          alt: "",
          caption: "The kitchen after lunch service—still moving.",
        },
        small: {
          src: u("photo-1556910103-1c02745aae4d", 900, 900),
          alt: "",
          caption: "Co-owner, catering & wholesale",
        },
      },
      {
        kind: "quote",
        text: "Our customers feel the calm before they know why. That's enough.",
        attribution: "Kitchen co-owner",
      },
      {
        kind: "cta",
        title: "Share how you're building with Jokuh",
        body: "We're interested in real stories from real teams: how you're planning, shipping, and staying human at work. Big or small, we'd love to hear it.",
        buttonLabel: "Tell us your story",
        buttonHref: "mailto:hello@jokuh.com",
      },
    ],
  },
};

export function getStoryDetail(slug: string | undefined): StoryDetail | undefined {
  if (!slug) return undefined;
  return STORY_DETAILS[slug];
}
