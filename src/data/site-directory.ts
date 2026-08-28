import { SITE_PRODUCT_SENTENCE } from "./landing-hero-copy";

/**
 * Data-room: bottom signature above the legal/meta row.
 * First line is the canonical product sentence; second line expands the Jokuh acronym.
 */
export const FOOTER_SIGNATURE = `${SITE_PRODUCT_SENTENCE}\nJoining Our Knowledge Unifying Humanity.`;

/** Multi-paragraph fine print (Apple-style) above mega footer link columns. */
export const FOOTER_FINE_PRINT = {
  paragraphs: [
    "Jokuh is in early access. Access, features, availability, pricing, and offers may change and may vary by region, device, account, or plan.",
    "Use of Jokuh requires a compatible device, a network connection, and current software. Some capabilities may require a subscription, separate license, third-party account, or partner service.",
    "Previews and beta features may be limited, experimental, or unavailable in some regions. Website descriptions are provided for informational purposes and are not a guarantee of future availability.",
  ] as const,
};
