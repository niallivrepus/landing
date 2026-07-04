/**
 * Product detail in-page nav sections. Some products omit the closer-look block;
 * keep nav links aligned with what ProductPage actually renders.
 */

export type ProductDetailSectionLink = {
  label: string;
  href: `#${string}`;
};

export const PRODUCT_DETAIL_SECTIONS_WITH_CLOSER_LOOK: ProductDetailSectionLink[] = [
  { label: "Highlights", href: "#highlights" },
  { label: "Closer look", href: "#closer-look" },
  { label: "Showcase", href: "#showcase" },
  { label: "FAQs", href: "#faqs" },
];

export const PRODUCT_DETAIL_SECTIONS_WITHOUT_CLOSER_LOOK: ProductDetailSectionLink[] = [
  { label: "Highlights", href: "#highlights" },
  { label: "Showcase", href: "#showcase" },
  { label: "FAQs", href: "#faqs" },
];

export function productDetailSectionsFor(productId: string): ProductDetailSectionLink[] {
  if (productId === "calls" || productId === "messages" || productId === "profile") {
    return PRODUCT_DETAIL_SECTIONS_WITHOUT_CLOSER_LOOK;
  }

  return PRODUCT_DETAIL_SECTIONS_WITH_CLOSER_LOOK;
}
