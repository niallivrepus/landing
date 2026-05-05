/**
 * Long-form story pages: editorial layout (hero, gallery, prose, media, quote, CTA).
 */

export type StoryGalleryImage = {
  src: string;
  alt: string;
  label?: string;
};

export type StoryImageCaptioned = {
  src: string;
  alt: string;
  caption: string;
  hidden?: boolean;
  /** Single-image (`small.hidden`) blocks: portrait suits tall editorial photos. */
  imageLayout?: "landscape" | "portrait";
};

export type StoryImageNarrative = {
  src: string;
  alt: string;
  text: string;
};

export type StorySection =
  | { kind: "prose"; paragraphs: string[] }
  | { kind: "subhead"; text: string }
  | { kind: "featureText"; title: string; subtitle: string; paragraphs: string[] }
  | {
      kind: "imagesAsymmetric";
      large: StoryImageCaptioned;
      small: StoryImageCaptioned;
    }
  | {
      kind: "triptych";
      items: [StoryImageNarrative, StoryImageNarrative, StoryImageNarrative];
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

export const STORY_DETAILS: Record<string, StoryDetail> = {
  "made-from-memory": {
    slug: "made-from-memory",
    metaLine: "March 29, 2026 · Jokuh Stories · Illustrative scenario",
    title: "Made from Memory",
    dek: "How a Tulum designer keeps every word her clients ever told her.",
    heroGallery: [
      { src: "/story-art/maren-tulum-coast.png", alt: "", label: "Tulum" },
      { src: "/story-art/maren-tulum-kitchen.png", alt: "", label: "Workspace" },
      { src: "/story-art/maren-tulum-call.png", alt: "", label: "Call" },
      { src: "/story-art/maren-tulum-bungalow.png", alt: "", label: "Retreat" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "My name is Maren. I'm Canadian, but I've lived in Tulum for the last four years, and I make clothing here: slow, made-to-measure pieces for a small list of women I work with closely. Some of them I've dressed for years. The thing that makes my work different is that I never lose context. Every conversation, every fitting, every offhand comment about a trip or a fabric or a feeling becomes part of how I design for them. Jokuh is what makes that possible. It's where my entire dataroom lives.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/maren-workspace.png",
          alt: "",
          caption: "Maren's work is built from remembered details, not a blank page.",
        },
        small: {
          src: "/story-art/maren-portrait.png",
          alt: "",
          caption: "Maren Côté, Tulum",
        },
      },
      {
        kind: "subhead",
        text: "Every client has her own private tile",
      },
      {
        kind: "prose",
        paragraphs: [
          "When I get on a call with a client, about a new piece, a wedding, a wardrobe refresh, anything, I record it inside Jokuh. Not for compliance, not for a paper trail. Because I know that somewhere in that hour, she's going to mention the dress her grandmother wore in Marseille, or the fabric she touched in Kyoto, or the fact that she's stopped wearing anything with a hard waistband since her second child.",
          "Those details are the entire job. Before Jokuh, I lost most of them. Now they're saved, transcribed, and tagged the moment we hang up.",
        ],
      },
      {
        kind: "subhead",
        text: "A dataroom for every woman I design for",
      },
      {
        kind: "prose",
        paragraphs: [
          "Every client has her own private tile inside my dataroom. Inside that tile is everything. Transcripts of every call we've ever had. Photos she's sent me of pieces she loves and pieces she hates. Her measurements over the years, because bodies change. Notes on how a fabric felt against her skin in a fitting. Voice memos I leave myself at midnight when I have an idea for her.",
          "When I sit down to design a new piece, I don't start from a blank page. I ask Jokuh to remind me of everything she's said about silhouette, every fabric she's been drawn to, every event she's getting dressed for in the next six months. In thirty seconds I have a brief that no other designer could write for her.",
        ],
      },
      {
        kind: "featureText",
        title: "The second dress fits better than the first",
        subtitle:
          "A few of my clients have joined me on Jokuh. The others still feel the difference.",
        paragraphs: [
          "They share a private tile with me, encrypted between us, where everything we make together lives: sketches, photos from their wardrobe, the dresses I've made them, the trips they're packing for.",
          "When one of them messages me from Mexico City asking what to wear to a friend's wedding in Cartagena, I can see her whole closet, every piece I've ever made her, and our last three conversations. I answer her in two minutes.",
          "The other clients, the ones who aren't on the platform yet, still feel the difference. They notice that I remember the small things. They notice that the second dress fits better than the first, and the third better than the second.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/maren-call-window.png",
          alt: "",
          caption: "Jokuh keeps the client history close while Maren designs.",
        },
        small: {
          src: "/story-art/maren-walk.png",
          alt: "",
          caption: "The work follows her without pulling her back into scattered messages.",
          hidden: true,
        },
      },
      {
        kind: "quote",
        text: "Every call I take adds to a dataroom that only grows richer.",
        attribution: "Maren Côté",
      },
      {
        kind: "subhead",
        text: "Made from memory",
      },
      {
        kind: "prose",
        paragraphs: [
          "The clothes I make are simple. Linen, cotton, hand-finished, nothing flashy. But the depth behind each piece, the years of conversations, the remembered details, the context that never gets lost, that's the thing my clients pay for, and that's the thing I couldn't deliver without Jokuh.",
          "I don't worry about forgetting anymore. I don't search through old messages. I don't lose what someone told me a year ago. I just listen, save it, and let it become part of how I see her. That's the work. That's the whole thing.",
          "This is an illustrative designer scenario for client-memory workflows, not a published customer claim.",
        ],
      },
    ],
  },
  "made-from-memory-ii": {
    slug: "made-from-memory-ii",
    metaLine: "March 29, 2026 · Jokuh Stories · Illustrative scenario",
    title: "Made from Memory",
    dek: "How a Tulum designer keeps every word her clients ever told her.",
    heroGallery: [
      { src: "/story-art/maren-tulum-coast.png", alt: "", label: "Tulum" },
      { src: "/story-art/maren-tulum-kitchen.png", alt: "", label: "Workspace" },
      { src: "/story-art/maren-tulum-call.png", alt: "", label: "Call" },
      { src: "/story-art/maren-tulum-bungalow.png", alt: "", label: "Retreat" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "My name is Maren. I'm Canadian, but I've lived in Tulum for the last four years, and I make clothing here: slow, made-to-measure pieces for a small list of women I work with closely. Some of them I've dressed for years. The thing that makes my work different is that I never lose context. Every conversation, every fitting, every offhand comment about a trip or a fabric or a feeling becomes part of how I design for them. Jokuh is what makes that possible. It's where my entire dataroom lives.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/maren-workspace.png",
          alt: "",
          caption: "Maren's work is built from remembered details, not a blank page.",
        },
        small: {
          src: "/story-art/maren-portrait.png",
          alt: "",
          caption: "Maren Côté, Tulum",
        },
      },
      {
        kind: "subhead",
        text: "Every client has her own private tile",
      },
      {
        kind: "prose",
        paragraphs: [
          "When I get on a call with a client, about a new piece, a wedding, a wardrobe refresh, anything, I record it inside Jokuh. Not for compliance, not for a paper trail. Because I know that somewhere in that hour, she's going to mention the dress her grandmother wore in Marseille, or the fabric she touched in Kyoto, or the fact that she's stopped wearing anything with a hard waistband since her second child.",
          "Those details are the entire job. Before Jokuh, I lost most of them. Now they're saved, transcribed, and tagged the moment we hang up.",
        ],
      },
      {
        kind: "subhead",
        text: "A dataroom for every woman I design for",
      },
      {
        kind: "prose",
        paragraphs: [
          "Every client has her own private tile inside my dataroom. Inside that tile is everything. Transcripts of every call we've ever had. Photos she's sent me of pieces she loves and pieces she hates. Her measurements over the years, because bodies change. Notes on how a fabric felt against her skin in a fitting. Voice memos I leave myself at midnight when I have an idea for her.",
          "When I sit down to design a new piece, I don't start from a blank page. I ask Jokuh to remind me of everything she's said about silhouette, every fabric she's been drawn to, every event she's getting dressed for in the next six months. In thirty seconds I have a brief that no other designer could write for her.",
        ],
      },
      {
        kind: "featureText",
        title: "The second dress fits better than the first",
        subtitle:
          "A few of my clients have joined me on Jokuh. The others still feel the difference.",
        paragraphs: [
          "They share a private tile with me, encrypted between us, where everything we make together lives: sketches, photos from their wardrobe, the dresses I've made them, the trips they're packing for.",
          "When one of them messages me from Mexico City asking what to wear to a friend's wedding in Cartagena, I can see her whole closet, every piece I've ever made her, and our last three conversations. I answer her in two minutes.",
          "The other clients, the ones who aren't on the platform yet, still feel the difference. They notice that I remember the small things. They notice that the second dress fits better than the first, and the third better than the second.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/maren-call-window.png",
          alt: "",
          caption: "Jokuh keeps the client history close while Maren designs.",
        },
        small: {
          src: "/story-art/maren-walk.png",
          alt: "",
          caption: "The work follows her without pulling her back into scattered messages.",
          hidden: true,
        },
      },
      {
        kind: "quote",
        text: "Every call I take adds to a dataroom that only grows richer.",
        attribution: "Maren Côté",
      },
      {
        kind: "subhead",
        text: "Made from memory",
      },
      {
        kind: "prose",
        paragraphs: [
          "The clothes I make are simple. Linen, cotton, hand-finished, nothing flashy. But the depth behind each piece, the years of conversations, the remembered details, the context that never gets lost, that's the thing my clients pay for, and that's the thing I couldn't deliver without Jokuh.",
          "I don't worry about forgetting anymore. I don't search through old messages. I don't lose what someone told me a year ago. I just listen, save it, and let it become part of how I see her. That's the work. That's the whole thing.",
          "This is an illustrative designer scenario for client-memory workflows, not a published customer claim.",
        ],
      },
    ],
  },
  "aaron-liebowitz-psychotherapy-nyc": {
    slug: "aaron-liebowitz-psychotherapy-nyc",
    metaLine: "April 1, 2026 · Jokuh Stories · Illustrative scenario",
    title: "A psychotherapy practice in New York",
    dek: "Recent AI privilege and preservation rulings raised new confidentiality questions for clinical notes, so this scenario explores what safer memory infrastructure could look like.",
    heroGallery: [
      { src: "/story-art/aaron-nyc-waterfront-skyline.avif", alt: "Lower Manhattan skyline across the water on a clear day", label: "Lower Manhattan" },
      { src: "/story-art/aaron-nyc-central-park-lake.avif", alt: "Central Park lake reflecting the Manhattan skyline", label: "Park reflections" },
      { src: "/story-art/aaron-nyc-neighborhood-aerial.png", alt: "Aerial view of Manhattan residential towers, streets, and trees", label: "City blocks" },
      { src: "/story-art/aaron-nyc-lower-manhattan-water.png", alt: "New York City skyline above the waterfront", label: "Waterline" },
      { src: "/story-art/aaron-nyc-central-park-reservoir.png", alt: "Wide Central Park water view with skyline reflections", label: "Reservoir" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "Few professions sit under more legal pressure around AI than mental health. Recent privilege and preservation rulings have raised serious confidentiality questions for clinical workflows, especially when notes or transcripts are handed to consumer AI systems without a clear data boundary.",
          "In this illustrative scenario, Aaron Liebowitz is a psychotherapist in private practice on the Upper West Side. Trained psychoanalytically, he has kept the same office for nearly thirty years and a small list of long-term patients. Along with the practice he has inherited the quiet burden every long-tenured therapist knows: a locked filing cabinet of handwritten session notes that he stopped trusting himself to remember by year two. Rather than let that history stay trapped on paper or migrate it into tools with unclear retention, Aaron explores consolidating the arc of his practice inside Jokuh: an encrypted workspace designed around clinician-held access.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/aaron-nyc-desk.png",
          alt: "Aaron writing session notes at his desk in his office",
          caption:
            "The work is built from remembered details, session by session, year after year.",
        },
        small: {
          src: "/story-art/aaron-nyc-portrait.png",
          alt: "Aaron Liebowitz",
          caption: "Aaron Liebowitz, Upper West Side",
        },
      },
      {
        kind: "quote",
        text: "My memory used to be the bottleneck. The cabinet used to be a liability. Jokuh is the first piece of software I have ever trusted enough to put a patient's name into.",
        attribution: "Illustrative clinician scenario",
      },
      {
        kind: "prose",
        paragraphs: [
          "What used to live in fading ink and unreliable recall now lives in sealed, dated, queryable tiles. Past dreams, prescribed medications, the names of the dead and the years they died, the patient's own words from a session in 2019. Aaron can reference any of it instantly without ever leaving the room. Day to day, the workflow runs on the fifty minutes between sessions: a session ends, the recording is sealed and tagged, the next patient's history is surfaced before they knock. Voice mode handles most of it. The clock the patient is not supposed to see no longer counts down to lost detail.",
          "Recent privilege and preservation rulings make the risk concrete enough to change behavior. With Jokuh, the intended data boundary is narrower: protected notes are designed to stay encrypted and outside routine company plaintext access. What used to require a locked drawer and a careful conscience now requires a workflow that makes access, retention, and review explicit.",
          "In a profession where the difference between a useful session and a forgotten one is often a single remembered detail from years ago, that continuity is no longer something Aaron has to hold in his head. The room hasn't changed since he trained. The work hasn't changed. What has changed is how much of the patient he can keep with him, and how safely he can keep it.",
        ],
      },
      {
        kind: "prose",
        paragraphs: [
          "Illustrative private-practice workflow, Upper West Side, Manhattan. Voice mode runs in the fifty-minute gap between sessions, sealing recordings, surfacing patient history, and logging impressions while the work is still fresh. Patient tiles are designed for clinician-scoped access rather than routine company plaintext access.",
        ],
      },
      {
        kind: "subhead",
        text: "Sealing a session",
      },
      {
        kind: "prose",
        paragraphs: [
          "Session with Patient 07 just ended. Seal the recording, transcribe it, and tag it with today's themes inside her tile.",
          "Sealed inside her private tile. Transcript complete. Tags added: recurring father dream, work anxiety, sister relationship. Encryption confirmed. Only your key can open this tile.",
        ],
      },
      {
        kind: "subhead",
        text: "Cross-referencing a recurring theme",
      },
      {
        kind: "prose",
        paragraphs: [
          "She told me again today that she had \"the dream.\" Pull every prior reference to it across our entire history together. Dates, contexts, what was happening in her life around each one.",
          "Found 14 references across 9 years. First mentioned March 11, 2017, the week after her father's hospitalization. Pattern: the dream surfaces within 4–6 weeks of a major caregiving event. Last appearance: 11 weeks ago. Full timeline ready in her tile.",
        ],
      },
      {
        kind: "subhead",
        text: "Verifying sovereignty",
      },
      {
        kind: "prose",
        paragraphs: [
          "Confirm the status of my patient data. Who can access this tile, and what logs are available for review?",
          "Patient tiles are designed for encrypted storage and scoped key handling. Jokuh is designed not to retain plaintext patient tiles in company-accessible systems. Attestation and access logs can be reviewed where enabled for the workspace.",
        ],
      },
      {
        kind: "prose",
        paragraphs: [
          "This is an illustrative clinical-memory scenario, not a published customer claim.",
        ],
      },
    ],
  },
  "tomas-aldaz": {
    slug: "tomas-aldaz",
    metaLine: "April 8, 2026 · Jokuh Stories · Illustrative scenario",
    title: "A regenerative grain cooperative in the High Plains",
    dek: "Registries, green-claims rules, and greenwashing suits can turn soil panels and grower calls into evidence, so this scenario explores defensible cooperative memory.",
    heroGallery: [
      { src: "/story-art/tomas-aldaz-aerial-farm.png", alt: "Aerial view of farm fields, roads, and grain silos in the High Plains", label: "A cooperative seen from above: roads, silos, and fields that all need one defensible memory." },
      { src: "/story-art/tomas-aldaz-savannah-field.png", alt: "Wide dirt field under a bright blue sky with trees along the edge", label: "Open soil under a clear sky, the long-horizon record behind every carbon claim." },
      { src: "/story-art/tomas-aldaz-plowed-field.png", alt: "Freshly plowed field rows stretching toward the horizon beneath a blue sky", label: "Rows stretching to the horizon: the scale that makes memory infrastructure necessary." },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "Few sectors face more scrutiny over data integrity than regenerative agriculture. Carbon-credit registries, green-claims rules, and greenwashing litigation can turn soil panels, drone scans, and farmer conversations into evidence in an audit, and a missing record can undermine buyer confidence.",
          "In this illustrative scenario, Tomás Aldaz directs a regenerative grain cooperative spanning the High Plains of Kansas, Nebraska, and eastern Colorado. The cooperative manages a large MRV program across many farms and sells into buyer relationships that require audit-grade documentation for soil-carbon claims. Rather than continue patching together spreadsheets, drone footage, and grower phone calls across disconnected filing systems, Tomás evaluates moving the cooperative's operational record into Jokuh, with farm records scoped into encrypted workspaces and contributing to a shared knowledge pool for authorized cooperative users.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/tomas-aldaz-field-notes.png",
          alt: "Tomás Aldaz writing field notes beside a laptop and drone on a High Plains farm",
          caption: "Tomás Aldaz keeps field notes, drone context, and cooperative records together at the edge of the work.",
        },
        small: {
          src: "/story-art/tomas-aldaz-portrait.png",
          alt: "Tomás Aldaz standing in a High Plains field with grain silos in the distance",
          caption: "Tomás Aldaz, High Plains Regenerative Cooperative.",
        },
      },
      {
        kind: "quote",
        text: "Soil takes decades to remember anything. Our software finally takes the same view. Every acre, every season, every farmer's voice, sealed, indexed, ours.",
        attribution: "Illustrative cooperative director",
      },
      {
        kind: "prose",
        paragraphs: [
          "Day to day, the cooperative runs on continuous capture. Farmers leave voice memos from the cab of a tractor; agronomists upload soil-panel results from the field; drones stream imagery into the relevant farm's tile. The workspace compresses voice, image, sensor, and document inputs into queryable history that compounds with every season. When a buyer's auditor asks for evidence on a specific block, Tomás does not assemble a binder from scratch. He queries the pool and reviews a draft response against the underlying records.",
          "The regulatory horizon is what makes this architecture important. The EU CSRD, climate-disclosure rules, and the parallel rise of greenwashing litigation have narrowed the gap between agricultural marketing claims and evidence. A cooperative that cannot reproduce the chain of custody on its carbon math is exposed. With Jokuh, farm records are designed for scoped access, reviewable logs, and evidence packets that can be shared without exposing unrelated cooperative data.",
          "In a discipline where the most important records take half a century to mature, what changed was not the science. The science is older than the cooperative. What changed is that the cooperative now has a memory as long as the soil it stewards, and a confidentiality envelope strong enough to defend it.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/tomas-aldaz-barn-cat.png",
          alt: "A barn cat sleeping in hay with High Plains grain silos beyond the barn",
          caption: "The cooperative's record stretches from quiet daily details to audit-grade evidence across every farm tile.",
        },
        small: {
          src: "/story-art/tomas-aldaz-silo-meter.png",
          alt: "Tomás Aldaz checking a control meter mounted on a grain silo",
          caption: "Operational checks become part of the same encrypted history as voice memos, soil panels, and drone scans.",
        },
      },
      {
        kind: "prose",
        paragraphs: [
          "Illustrative High Plains cooperative workflow: each farm record can be scoped into its own workspace; voice memos, drone scans, and soil panels are attached to the relevant farm tile as they arrive. The cooperative's shared knowledge pool is designed for authorized users and reviewable access.",
        ],
      },
      {
        kind: "imagesAsymmetric",
        large: {
          src: "/story-art/tomas-aldaz-handshake.png",
          alt: "Tomás Aldaz shaking hands with a member farmer beside a grain silo at sunset",
          caption: "Trust between Tomás and member farmers is the human layer the cooperative's encrypted record is built to defend.",
        },
        small: {
          src: "/story-art/tomas-aldaz-savannah-field.png",
          alt: "Wide dirt field under a bright blue sky with trees along the edge",
          caption: "Every handshake at the silo connects to seasons of soil panels, drone scans, and voice memos in the same pool.",
        },
      },
      {
        kind: "subhead",
        text: "Defending a disputed carbon claim",
      },
      {
        kind: "prose",
        paragraphs: [
          "A buyer's auditor is challenging the soil-carbon math on Block 47-K: 47,000 acres, six member farms, four growing seasons. Pull every piece of evidence supporting the claim. Voice memos, soil panels, drone scans, weather records, cover-crop logs.",
          "Supporting records assembled from the block history, including soil panels, imagery, farmer voice memos, weather records, and cover-crop attestations. Access logs and source links are attached for review. Draft response prepared for human approval.",
        ],
      },
      {
        kind: "subhead",
        text: "Querying a multi-year soil trend",
      },
      {
        kind: "prose",
        paragraphs: [
          "Show me the microbial-diversity trajectory across all member farms running cover-crop-plus-no-till since the 2019 baseline. Surface the outliers in both directions and what those farmers said about their seasons.",
          "Qualifying farms surfaced with trend lines, outlier groups, and the grower notes attached to each season. Full timeline and commentary ready for agronomist review.",
        ],
      },
      {
        kind: "subhead",
        text: "Drafting in the cooperative's voice",
      },
      {
        kind: "prose",
        paragraphs: [
          "Draft the buyer's annual sustainability letter using our 2025 data. Match the voice we established in the 2022 and 2023 letters. Surface the three highest-conviction findings and flag anything I should review before it goes out.",
          "Draft complete. Three evidence-backed findings surfaced with source links. Two passages are flagged for review because they touch claims that may require auditor sign-off before publication.",
        ],
      },
      {
        kind: "prose",
        paragraphs: [
          "This is an illustrative cooperative scenario for regulated evidence workflows, not a published customer claim.",
        ],
      },
    ],
  },
};

export function getStoryDetail(slug: string | undefined): StoryDetail | undefined {
  if (!slug) return undefined;
  return STORY_DETAILS[slug];
}
