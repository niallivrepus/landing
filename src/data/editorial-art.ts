const human = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&w=1200&h=1200&fit=crop&q=85`;

export const JOURNAL_NEWS_ART_ROTATION: readonly string[] = [
  "/journal-art/news-sunburst.png",
  "/journal-art/news-orb-violet.png",
  "/journal-art/news-glass-ribbon.png",
  "/journal-art/news-blue-lens.png",
  "/journal-art/news-green-flow.png",
  "/journal-art/news-coral-wash.png",
  "/journal-art/news-blue-berries.png",
  "/journal-art/news-prism-fold.png",
];

export const STORY_CARD_IMAGE_BY_SLUG: Record<string, string> = {
  "treasury-inference-api-grid": "/story-art/story-office-collab.png",
  "live-transcript-hooks-spine": "/story-art/story-office-focus.png",
  "gooey-island-merge-hygiene": "/story-art/story-office-smile.png",
  "salvage-yard-nevada": human("photo-1504917595217-d4dc5ebe6122"),
  "seed-farm-south-carolina": human("photo-1625246333195-78d9c38ad447"),
  "tamale-shop-california": human("photo-1522071820081-009f0129c71c"),
};

export const STORY_CARD_IMAGE_FALLBACK_BY_SLUG: Record<string, string> = {
  "treasury-inference-api-grid": human("photo-1516321318423-f06f85e504b3"),
  "live-transcript-hooks-spine": human("photo-1516321165247-4aa89a48be28"),
  "gooey-island-merge-hygiene": human("photo-1497366754035-f200968a6e72"),
  "salvage-yard-nevada": human("photo-1581092160562-40aa08f7880a"),
  "seed-farm-south-carolina": human("photo-1500382017468-9049fed747ef"),
  "tamale-shop-california": human("photo-1556910103-1c02745aae4d"),
};
