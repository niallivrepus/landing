/** Homepage Stories: square tiles + one title each. */
export type HomeStory = {
  slug: string;
  href: string;
  image: string;
  /** Shown if primary `image` fails to load (e.g. removed from CDN). */
  imageFallback?: string;
  title: string;
};

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&w=800&h=800&fit=crop&q=80`;

const RAW_STORIES = [
  {
    slug: "treasury-inference-api-grid",
    image: IMG("photo-1558494949-ef010cbdcc31"),
    imageFallback: IMG("photo-1544197150-b99a580bb7a8"),
    title: "Treasury loops and the API grid",
  },
  {
    slug: "live-transcript-hooks-spine",
    image: IMG("photo-1516321318423-f06f85e504b3"),
    imageFallback: IMG("photo-1451187580459-43490279c0fa"),
    title: "Live transcript hooks on the spine",
  },
  {
    slug: "gooey-island-merge-hygiene",
    image: IMG("photo-1555066931-4365d14bab8c"),
    imageFallback: IMG("photo-1633356122544-f134324a6cee"),
    title: "The Gooey app as a design island",
  },
  {
    slug: "salvage-yard-nevada",
    image: IMG("photo-1504917595217-d4dc5ebe6122"),
    imageFallback: IMG("photo-1565193566173-7a0ee3dbe261"),
    title: "A salvage yard in Nevada",
  },
  {
    slug: "seed-farm-south-carolina",
    image: IMG("photo-1416339306562-f3d12fefd36f"),
    imageFallback: IMG("photo-1595855759920-86582396756a"),
    title: "A seed farm in South Carolina",
  },
  {
    slug: "tamale-shop-california",
    image: IMG("photo-1556910103-1c02745aae4d"),
    imageFallback: IMG("photo-1522071820081-009f0129c71c"),
    title: "A tamale shop in California",
  },
] as const;

export const HOME_STORIES: HomeStory[] = RAW_STORIES.map((s) => ({
  ...s,
  href: `/stories/${s.slug}`,
}));
