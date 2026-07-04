import { PRODUCTS, type ProductId } from "./products";

/** Subset of products shown as checkboxes on the share form (keeps the list scannable). */
export const STORY_FORM_PRODUCT_IDS: ProductId[] = [
  "blurbs",
  "spine",
  "calls",
  "messages",
  "profile",
  "vortex",
  "passport",
];

export function getStoryFormProductOptions(): { id: ProductId; label: string }[] {
  return STORY_FORM_PRODUCT_IDS.map((id) => ({ id, label: PRODUCTS[id].title }));
}

export const STORY_TEXT_MAX = 1000;
