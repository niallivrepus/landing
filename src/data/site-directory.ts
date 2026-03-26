/** Multi-paragraph fine print (Apple-style) above mega footer link columns. */
export const FOOTER_FINE_PRINT = {
  paragraphs: [
    "1. Waitlist placement, early access, and any account credits or promotional offers are limited, subject to eligibility, and may expire or change without notice. Additional terms apply when you join the waitlist or redeem offers through Jokuh.",
    "Use of Jokuh requires a compatible device, a network connection, and software versions that meet our published requirements. Subscriptions, paid add-ons, and payment plans require valid billing information and are subject to approval or issuer terms where applicable.",
    "Jokuh services may be provided by Jokuh, its affiliates, and designated service providers and subprocessors as described in our legal documentation.",
    "Customer communications and primary documentation are offered in English unless otherwise indicated for your region. Response times and phone or chat availability may vary by location.",
    {
      before: "For more on how we evaluate waitlist applications, roll out features, and manage beta access, see our ",
      linkLabel: "support overview",
      href: "/support",
    },
    "Some Jokuh capabilities—including select Pods, Spine or Vortex features, and certain partner integrations—may require a paid subscription, separate license, or third-party account.",
    "Features, interfaces, and availability are subject to change, may be offered as previews or betas, and may not be available in all regions or on all devices. Jokuh is in early access; product details may vary.",
  ] as const,
};
