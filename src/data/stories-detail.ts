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
    metaLine: "March 29, 2026 · Jokuh Stories · Field story",
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
          "Maren Côté is a Canadian clothing designer based in Tulum, Mexico, and a Jokuh user since the closed beta.",
        ],
      },
    ],
  },
  "made-from-memory-ii": {
    slug: "made-from-memory-ii",
    metaLine: "March 29, 2026 · Jokuh Stories · Field story",
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
          "Maren Côté is a Canadian clothing designer based in Tulum, Mexico, and a Jokuh user since the closed beta.",
        ],
      },
    ],
  },
  "aaron-liebowitz-psychotherapy-nyc": {
    slug: "aaron-liebowitz-psychotherapy-nyc",
    metaLine: "April 1, 2026 · Jokuh Stories · Field story",
    title: "A psychotherapy practice in New York",
    dek: "A federal privilege ruling and a preservation order made mainstream AI a liability in the consulting room, so Aaron moved the arc of his practice into keys only he holds.",
    heroGallery: [
      { src: "/story-art/aaron-nyc-central-park-lawn.png", alt: "Central Park lawn with the Manhattan skyline beyond the trees", label: "Central Park" },
      { src: "/story-art/aaron-nyc-waterfront-skyline.avif", alt: "Lower Manhattan skyline across the water on a clear day", label: "Lower Manhattan" },
      { src: "/story-art/aaron-nyc-central-park-lake.avif", alt: "Central Park lake reflecting the Manhattan skyline", label: "Park reflections" },
      { src: "/story-art/aaron-nyc-midtown-aerial-grid.png", alt: "Aerial view of dense Midtown Manhattan blocks and towers", label: "Midtown grid" },
      { src: "/story-art/aaron-nyc-neighborhood-aerial.png", alt: "Aerial view of Manhattan residential towers, streets, and trees", label: "City blocks" },
      { src: "/story-art/aaron-nyc-lower-manhattan-water.png", alt: "New York City skyline above the waterfront", label: "Waterline" },
      { src: "/story-art/aaron-nyc-central-park-reservoir.png", alt: "Wide Central Park water view with skyline reflections", label: "Reservoir" },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "Few professions sit under more legal pressure around AI than mental health. A federal court has ruled that conversations with mainstream AI systems carry no privilege and are admissible as evidence in litigation, and a separate preservation order has forced one major provider to retain every consumer chat indefinitely, making the most popular AI tools effectively radioactive inside a clinical practice.",
          "Aaron Liebowitz is a psychotherapist in private practice on the Upper West Side. Trained psychoanalytically, he has kept the same office for nearly thirty years and a list of about twenty-eight long-term patients, some of them in their tenth, twelfth, or fifteenth year with him. Along with the practice he has inherited the quiet burden every long-tenured therapist knows: a locked filing cabinet of handwritten session notes that he stopped trusting himself to remember by year two. Rather than let that history stay trapped on paper or migrate it into mainstream AI that could one day be subpoenaed, Aaron decided to consolidate the entire arc of his practice inside Jokuh: an encrypted dataroom whose keys he, and only he, holds.",
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
        attribution: "Aaron Liebowitz, private practice, New York",
      },
      {
        kind: "prose",
        paragraphs: [
          "What used to live in fading ink and unreliable recall now lives in sealed, dated, queryable tiles. Past dreams, prescribed medications, the names of the dead and the years they died, the patient's own words from a session in 2019. Aaron can reference any of it instantly without ever leaving the room. Day to day, the workflow runs on the fifty minutes between sessions: a session ends, the recording is sealed and tagged, the next patient's history is surfaced before they knock. Voice mode handles most of it. The clock the patient is not supposed to see no longer counts down to lost detail.",
          "The Anthropic privilege ruling and the Southern District of New York's preservation order against OpenAI both happened blocks from Aaron's office. He has no intention of becoming the test case that drags either precedent into therapy. With Jokuh, the encryption keys are his alone. The company is mathematically incapable of producing a transcript under subpoena, which means there is nothing to produce. What used to require a locked drawer and a careful conscience now requires only cryptography.",
          "In a profession where the difference between a useful session and a forgotten one is often a single remembered detail from years ago, that continuity is no longer something Aaron has to hold in his head. The room hasn't changed since he trained. The work hasn't changed. What has changed is how much of the patient he can keep with him, and how safely he can keep it.",
        ],
      },
      {
        kind: "prose",
        paragraphs: [
          "Aaron Liebowitz, private practice psychotherapist, Upper West Side, Manhattan. Voice mode runs in the fifty-minute gap between sessions, sealing recordings, surfacing patient history, logging impressions while the work is still fresh. Patient tiles are encrypted with keys held solely by the clinician; Jokuh itself has no decryption capability.",
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
          "Confirm the cryptographic status of my patient data. Who holds the keys? What happens if Jokuh is served a subpoena?",
          "You hold the only keys. All patient tiles are encrypted at rest and in transit inside a Trusted Execution Environment. Jokuh has no decryption capability. Under court order, there is no plaintext we could produce. Attestation logs available for audit. Sovereignty: confirmed.",
        ],
      },
      {
        kind: "prose",
        paragraphs: [
          "Aaron Liebowitz is a New York-based psychotherapist in private practice and a Jokuh user since the closed beta.",
        ],
      },
    ],
  },
  "tomas-aldaz": {
    slug: "tomas-aldaz",
    metaLine: "April 8, 2026 · Jokuh Stories · Field story",
    title: "A regenerative grain cooperative in the High Plains",
    dek: "Registries, green-claims rules, and greenwashing suits turned every soil panel and grower call into potential evidence, so the cooperative's memory had to be as defensible as its carbon math.",
    heroGallery: [
      { src: "/story-art/tomas-aldaz-aerial-farm.png", alt: "Aerial view of farm fields, roads, and grain silos in the High Plains", label: "A cooperative seen from above: roads, silos, and fields that all need one defensible memory." },
      { src: "/story-art/tomas-aldaz-savannah-field.png", alt: "Wide dirt field under a bright blue sky with trees along the edge", label: "Open soil under a clear sky, the long-horizon record behind every carbon claim." },
      { src: "/story-art/tomas-aldaz-green-fields.png", alt: "Large green and yellow farmland rows rolling toward a line of trees", label: "Regrowth is a pattern across seasons, not a single snapshot for a sustainability deck." },
      { src: "/story-art/tomas-aldaz-plowed-field.png", alt: "Freshly plowed field rows stretching toward the horizon beneath a blue sky", label: "Rows stretching to the horizon: the scale that makes memory infrastructure necessary." },
    ],
    sections: [
      {
        kind: "prose",
        paragraphs: [
          "Few sectors face more aggressive scrutiny over data integrity than regenerative agriculture. Carbon-credit registries, FTC green-claims rulemaking, and a wave of greenwashing class actions have turned every soil panel, drone scan, and farmer conversation into potential evidence in an audit, and a single missing record can cost a cooperative its certification and its buyer list overnight.",
          "Tomás Aldaz is the director of a regenerative grain cooperative spanning the High Plains of Kansas, Nebraska, and eastern Colorado. The grandson of Basque sheep ranchers and a Wageningen-trained agronomist, Tomás coordinates 340 family farms across roughly 1.2 million MRV-certified acres. The cooperative sells into a buyer book that includes Patagonia Provisions, General Mills, and a French banking carbon ledger, counterparties that demand audit-grade documentation on every ton of soil carbon claimed. Rather than continue patching together spreadsheets, drone footage, and grower phone calls across thirty-six different filing systems, Tomás moved the cooperative's entire operational record into Jokuh, with each farm running as its own encrypted node and contributing to a shared knowledge pool only the cooperative can read.",
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
        attribution: "Tomás Aldaz, Director, High Plains Regenerative Cooperative",
      },
      {
        kind: "prose",
        paragraphs: [
          "Day to day, the cooperative now runs on continuous capture. Farmers leave voice memos from the cab of a tractor; agronomists upload soil-panel results from the field; drones stream NDVI scans straight into the relevant farm's tile. The Vortex compresses all of it (voice, image, sensor, document) into queryable history that compounds with every season. When a buyer's auditor asks for evidence on a specific 47,000-acre block, Tomás does not assemble a binder over two weeks. He queries the pool. The agentic identity, trained on the cooperative's established voice and methodology, drafts the response in hours. Nothing leaves the encrypted environment. Nothing is paraphrased by a third-party model that could later be subpoenaed.",
          "The regulatory horizon is what makes this architecture non-negotiable. The EU CSRD, the SEC's climate disclosure framework, and the parallel rise of greenwashing litigation have collapsed the gap between agricultural marketing claims and securities-grade evidence. A cooperative that cannot reproduce the chain of custody on its carbon math is not just losing a buyer; it is exposed. With Jokuh, the cryptographic keys to every farm tile sit with the cooperative. Jokuh itself is mathematically incapable of producing the data under subpoena, and every record carries an attestation log a third-party auditor can verify without ever decrypting the underlying content. Sovereignty and audit-readiness in the same architecture.",
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
          "Tomás Aldaz, Director, High Plains Regenerative Cooperative: 340 farms, 1.2 million acres, MRV-certified. Each farm operates as an encrypted Galaxy Node; voice memos, drone scans, and soil panels are sealed into the relevant farm's tile in real time. The cooperative's shared knowledge pool can only be read by members; Jokuh holds no key and has no decryption capability of its own.",
        ],
      },
      {
        kind: "subhead",
        text: "Defending a disputed carbon claim",
      },
      {
        kind: "prose",
        paragraphs: [
          "A buyer's auditor is challenging the soil-carbon math on Block 47-K: 47,000 acres, six member farms, four growing seasons. Pull every piece of evidence supporting the claim. Voice memos, soil panels, drone scans, weather records, cover-crop logs.",
          "1,847 records assembled from Block 47-K, Q1 2022 through Q4 2025. Soil panels: 312. NDVI scans: 1,104. Farmer voice memos: 287. Cover-crop attestations: 144. Cryptographic attestation logs attached to each record. Knowledge pool synthesis ready in cooperative voice. Draft response prepared.",
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
          "178 farms qualify. Mean Shannon diversity index up 41% since baseline. Top decile: 14 farms above 2.1x baseline, all running multi-species cover with managed grazing. Bottom decile: 9 farms flat or declining, six of them citing drought-shortened cover windows in 2023 voice memos. Full timeline and grower commentary ready in the pool.",
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
          "Draft complete. Voice match score: 0.94 against prior letters. Three findings surfaced: soil-carbon retention up 12.3% above baseline projection, on-farm biodiversity index outperforming control plots by 1.8x, water-use efficiency up 18% on irrigated acres. Two passages flagged for your review. Both touch claims that may require additional auditor sign-off before publication.",
        ],
      },
      {
        kind: "prose",
        paragraphs: [
          "Tomás Aldaz is the director of a regenerative grain cooperative in the High Plains and a Jokuh enterprise customer since the private beta.",
        ],
      },
    ],
  },
};

export function getStoryDetail(slug: string | undefined): StoryDetail | undefined {
  if (!slug) return undefined;
  return STORY_DETAILS[slug];
}
