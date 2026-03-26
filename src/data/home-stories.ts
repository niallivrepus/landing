/** Homepage Stories row: full-bleed portrait photos + one-line captions (editorial feature). */
export type HomeStory = {
  href: string;
  image: string;
  caption: string;
};

export const HOME_STORIES: HomeStory[] = [
  {
    href: "/news",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&h=1200&fit=crop&q=80",
    caption: "A salvage yard in Nevada",
  },
  {
    href: "/news",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad447?w=900&h=1200&fit=crop&q=80",
    caption: "A seed farm in South Carolina",
  },
  {
    href: "/news",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=1200&fit=crop&q=80",
    caption: "A tamale shop in California",
  },
];
