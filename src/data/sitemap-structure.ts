import type { ProductId } from "./products";
import { PRODUCT_ORDER, PRODUCTS } from "./products";

export type SitemapLink = { label: string; href: string };

export type SitemapTopSection = {
  id: string;
  heading: string;
  links: SitemapLink[];
};

/** Apple-style top-of-page directory: Jokuh-wide categories before product blocks. */
export const SITEMAP_TOP_SECTIONS: SitemapTopSection[] = [
  {
    id: "about-jokuh",
    heading: "About Jokuh",
    links: [
      { label: "What we are building", href: "/#journal" },
      { label: "Newsroom", href: "/news" },
      { label: "Leadership", href: "#" },
      { label: "Career opportunities", href: "#" },
      { label: "Contact Jokuh", href: "#" },
      { label: "Legal", href: "/legal" },
      { label: "Ethics & compliance", href: "/legal#ethics" },
      { label: "Site map", href: "/sitemap#sitemap-top" },
    ],
  },
  {
    id: "jokuh-values",
    heading: "Jokuh values",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Security", href: "#" },
      { label: "Accessibility", href: "#" },
      { label: "Research & safety", href: "/#journal" },
    ],
  },
  {
    id: "where-to-buy",
    heading: "Where to buy",
    links: [
      { label: "Try Jokuh", href: "/#start" },
      { label: "Download", href: "/download" },
      { label: "Find a partner", href: "#" },
      { label: "Why join from Jokuh", href: "/#start" },
      { label: "Trade in & credits", href: "#" },
    ],
  },
  {
    id: "account",
    heading: "Account",
    links: [
      { label: "Manage your Jokuh account", href: "#" },
      { label: "Waitlist status", href: "/#start" },
      { label: "Billing & subscriptions", href: "#" },
      { label: "Jokuh.com", href: "/" },
    ],
  },
  {
    id: "for-education",
    heading: "For education",
    links: [
      { label: "Jokuh and education", href: "#" },
      { label: "Programs for schools", href: "#" },
      { label: "Programs for students", href: "#" },
    ],
  },
  {
    id: "for-business",
    heading: "For business",
    links: [
      { label: "Jokuh and business", href: "#" },
      { label: "Shop for teams", href: "#" },
      { label: "Developers overview", href: "#" },
      { label: "API & integrations", href: "#" },
    ],
  },
  {
    id: "store-services",
    heading: "Store services",
    links: [
      { label: "Shopping help", href: "#" },
      { label: "Community & get help", href: "#" },
      { label: "Jokuh Care", href: "#" },
      { label: "Personal setup", href: "#" },
      { label: "Order status", href: "#" },
    ],
  },
  {
    id: "jokuh-events",
    heading: "Jokuh events",
    links: [
      { label: "Event archive", href: "/news" },
      { label: "Live sessions", href: "#" },
      { label: "RSS feeds", href: "#" },
      { label: "Press & partnerships", href: "#" },
    ],
  },
];

export type SitemapProductSubsection = {
  id: string;
  heading: string;
  links: SitemapLink[];
};

export type SitemapProductBlock = {
  id: ProductId;
  title: string;
  subsections: SitemapProductSubsection[];
};

function productHref(id: ProductId): string {
  return `/${id}`;
}

/** Per-product blocks: Shop and learn, Accessories, More, Applications, Support. */
export const SITEMAP_PRODUCT_BLOCKS: SitemapProductBlock[] = PRODUCT_ORDER.map((id) => {
  const p = PRODUCTS[id];
  const title = p.title;
  return {
    id,
    title,
    subsections: [
      {
        id: `${id}-shop`,
        heading: "Shop and learn",
        links: [
          { label: `All ${title}`, href: productHref(id) },
          { label: "Compare experiences", href: "/#journal" },
          { label: "Help me choose", href: "/#prompt" },
          { label: "Join waitlist", href: "/#start" },
        ],
      },
      {
        id: `${id}-accessories`,
        heading: `${title} accessories`,
        links: [
          { label: `All ${title} accessories`, href: "#" },
          { label: "Cases & protection", href: "#" },
          { label: "Power & cables", href: "#" },
          { label: "Made for Jokuh", href: "#" },
        ],
      },
      {
        id: `${id}-more`,
        heading: `More ${title}`,
        links: [
          { label: `Why ${title}`, href: productHref(id) },
          { label: "Intelligence in Jokuh", href: "/#journal" },
          { label: "Better with Spine", href: "/spine" },
          { label: "Gooey UI kit", href: "/#journal" },
          { label: "Accessibility", href: "#" },
        ],
      },
      {
        id: `${id}-applications`,
        heading: "Applications",
        links: [
          { label: "Apps by Jokuh", href: "#" },
          { label: "Prompt bar", href: "/#prompt" },
          { label: "Documentation", href: "#" },
          { label: "SDK", href: "#" },
        ],
      },
      {
        id: `${id}-support`,
        heading: "Support",
        links: [
          { label: `${title} support`, href: "#" },
          { label: "Manuals", href: "#" },
          { label: "Jokuh Care", href: "#" },
          { label: "Community discussions", href: "#" },
        ],
      },
    ],
  };
});
