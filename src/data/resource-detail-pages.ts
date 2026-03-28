export type ResourcePageId =
  | "safety-approach"
  | "security-privacy"
  | "trust-transparency"
  | "explore-chatgpt"
  | "business"
  | "enterprise"
  | "education"
  | "pricing";

export type ResourceDetailPageDocument = {
  id: ResourcePageId;
  metaLine: string;
  title: string;
  subtitle: string;
  highlights: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  cta: {
    title: string;
    body: string;
    label: string;
    href: string;
  };
};

// Temporary editorial filler for the newly added footer destinations.
// Keep this copy polished but generic until final approved content is ready.
export const RESOURCE_DETAIL_PAGES: Record<ResourcePageId, ResourceDetailPageDocument> = {
  "safety-approach": {
    id: "safety-approach",
    metaLine: "Safety · Draft overview",
    title: "Safety Approach",
    subtitle:
      "This temporary page outlines how Jokuh wants to talk about product restraint, review, and user trust while the final language is still being prepared.",
    highlights: [
      "The page should feel credible without sounding final.",
      "Safety language should stay simple, calm, and readable.",
      "The route is ready now even if the final copy is not.",
    ],
    sections: [
      {
        heading: "A careful starting point",
        paragraphs: [
          "Jokuh should eventually explain safety in a way that feels product-first rather than abstract. For now, this page acts as a stable placeholder for that future framing.",
          "The goal is not to publish a finished position too early. The goal is to keep the site structure clean while making room for stronger approved content later.",
        ],
      },
      {
        heading: "Designed to stay legible",
        paragraphs: [
          "As the product expands, the explanation around it should remain easy to follow. People should not need dense policy language just to understand the general direction of the platform.",
          "This interim version keeps the tone composed and lightweight so the page feels intentional without turning draft language into a hard commitment.",
        ],
      },
      {
        heading: "Built for later precision",
        paragraphs: [
          "A fuller version of this page will likely become more exact over time. That is why the structure is in place now: hero, key points, sections, and a related next step.",
          "When the final text is ready, it can drop into the same shell with minimal implementation work.",
        ],
      },
    ],
    cta: {
      title: "Continue to trust and transparency",
      body: "The next page uses the same temporary editorial tone and helps keep the broader safety section coherent for now.",
      label: "Trust & Transparency",
      href: "/safety/trust-transparency",
    },
  },
  "security-privacy": {
    id: "security-privacy",
    metaLine: "Safety · Temporary page",
    title: "Security & Privacy",
    subtitle:
      "This page is temporary filler for how Jokuh may frame privacy, security, and confidence in the product once final wording has been approved.",
    highlights: [
      "Privacy should read as part of the product experience.",
      "Security copy should be specific later, not prematurely now.",
      "Temporary language still needs to feel clean and intentional.",
    ],
    sections: [
      {
        heading: "A placeholder with the right tone",
        paragraphs: [
          "This page exists so the site can support a complete footer and sitemap without relying on empty routes or obvious stubs. The copy stays measured so it can be replaced cleanly later.",
          "That gives Jokuh a usable destination now while keeping detailed claims, controls, and operational language open for a more formal version.",
        ],
      },
      {
        heading: "Product-facing trust",
        paragraphs: [
          "Eventually, privacy and security should feel visible in the product itself, not only in formal documentation. This draft points toward that outcome without trying to define it too narrowly yet.",
          "For the current stage, the page should simply read as thoughtful, branded, and intentionally unfinished.",
        ],
      },
      {
        heading: "Ready for a stronger revision",
        paragraphs: [
          "The implementation is meant to stabilize the route, the shell, and the reading rhythm first. Copy precision can come later, once the exact language is ready to be locked.",
          "That separation keeps the build cleaner and avoids rewriting layout decisions every time the wording changes.",
        ],
      },
    ],
    cta: {
      title: "Return to the broader safety page",
      body: "The safety overview keeps the same lighter temporary tone and serves as the cleaner top-level entry for this section.",
      label: "Safety Approach",
      href: "/safety/approach",
    },
  },
  "trust-transparency": {
    id: "trust-transparency",
    metaLine: "Safety · Editorial placeholder",
    title: "Trust & Transparency",
    subtitle:
      "Trust at Jokuh should eventually feel visible in both the product and the language around it. This page is a temporary placeholder for that broader story.",
    highlights: [
      "Trust starts with clarity, not ornament.",
      "This draft is directional rather than definitive.",
      "The structure is ready before the final wording is ready.",
    ],
    sections: [
      {
        heading: "Clarity before complexity",
        paragraphs: [
          "Jokuh should explain trust in a way that feels direct and easy to scan. This temporary version keeps that reading experience intact while leaving room for better final language later.",
          "The page is here to hold the system together now, not to overstate what has already been formally written or approved.",
        ],
      },
      {
        heading: "A visible product posture",
        paragraphs: [
          "In the long run, trust should feel embedded in controls, expectations, and how the interface behaves. Right now, this placeholder simply signals that the space exists and has a deliberate role in the site.",
          "That makes the experience feel more complete without introducing unnecessary specificity too early.",
        ],
      },
      {
        heading: "Easy to replace later",
        paragraphs: [
          "This page is intentionally lightweight because it is expected to evolve. The shell, spacing, and route can remain stable while the wording becomes sharper over time.",
          "That is the main benefit of this version: it is polished enough to belong, but neutral enough to revise quickly.",
        ],
      },
    ],
    cta: {
      title: "Visit the privacy placeholder",
      body: "The security and privacy page follows the same temporary pattern and keeps the section feeling coherent from end to end.",
      label: "Security & Privacy",
      href: "/safety/security-privacy",
    },
  },
  "explore-chatgpt": {
    id: "explore-chatgpt",
    metaLine: "ChatGPT · Overview",
    title: "Explore ChatGPT",
    subtitle:
      "This temporary overview page gives the footer a real destination while leaving final product framing, audience language, and positioning open for later refinement.",
    highlights: [
      "The route exists now so the navigation feels complete.",
      "The copy is broad on purpose.",
      "The page should feel polished, not locked.",
    ],
    sections: [
      {
        heading: "A flexible overview layer",
        paragraphs: [
          "This page acts as the top of a temporary content cluster. It introduces the section without forcing an early decision on the exact story Jokuh wants to tell here.",
          "That keeps the system easy to ship now and easy to tighten later.",
        ],
      },
      {
        heading: "Structure before specificity",
        paragraphs: [
          "The shell, spacing, and reading rhythm are already valuable even before the final messaging is ready. This lets the footer link to something that feels intentional rather than incomplete.",
          "For now, the language stays soft and replaceable while the route remains stable.",
        ],
      },
      {
        heading: "Prepared for final copy",
        paragraphs: [
          "When final approved content arrives, it can be dropped into the same framework with minimal implementation work. That is the main purpose of this temporary version.",
          "It gives the site a complete shape today without closing off future direction.",
        ],
      },
    ],
    cta: {
      title: "Continue into business",
      body: "The business page follows the same placeholder treatment and shows how this section can branch by audience later.",
      label: "Business",
      href: "/chatgpt/business",
    },
  },
  business: {
    id: "business",
    metaLine: "ChatGPT · Business",
    title: "Business",
    subtitle:
      "This is temporary brand filler for how a business-facing page may eventually be presented once the final tone and messaging direction are approved.",
    highlights: [
      "Business content usually needs sharper positioning later.",
      "For now, the page stays broad and calm.",
      "The layout is stable even while the wording is provisional.",
    ],
    sections: [
      {
        heading: "A clean interim destination",
        paragraphs: [
          "This page gives the site a complete business branch without pretending the final narrative already exists. That helps the build stay organized while product messaging continues to evolve.",
          "The current version is intentionally simple, readable, and easy to replace.",
        ],
      },
      {
        heading: "Placeholder, not stub",
        paragraphs: [
          "The difference matters: the page should feel designed and considered even if the copy is not final. That keeps the experience premium without forcing unnecessary copy decisions too early.",
          "It also means the footer can point somewhere real without creating follow-up cleanup work later.",
        ],
      },
      {
        heading: "Built for future detail",
        paragraphs: [
          "If this page later becomes more specific about teams, workflows, or adoption, the structure already supports that direction. Only the content needs to change.",
          "That is the cleanest path for now: stable implementation, flexible message.",
        ],
      },
    ],
    cta: {
      title: "Move into enterprise",
      body: "The enterprise page continues the same temporary pattern and keeps the whole ChatGPT cluster consistent for now.",
      label: "Enterprise",
      href: "/chatgpt/enterprise",
    },
  },
  enterprise: {
    id: "enterprise",
    metaLine: "ChatGPT · Enterprise",
    title: "Enterprise",
    subtitle:
      "This temporary enterprise page marks where more specific rollout, governance, and product language could live once final content decisions have been made.",
    highlights: [
      "Enterprise pages usually need stronger precision later.",
      "This version stays intentionally neutral.",
      "The route and shell can stabilize first.",
    ],
    sections: [
      {
        heading: "A stable enterprise route",
        paragraphs: [
          "The main job of this page right now is structural. It gives the site a complete enterprise destination while keeping future content decisions open.",
          "That makes the implementation cleaner and keeps navigation from feeling unfinished.",
        ],
      },
      {
        heading: "Calm, replaceable language",
        paragraphs: [
          "The copy aims to sound deliberate without sounding final. That balance is useful at this stage because it prevents the site from feeling empty while avoiding overcommitment.",
          "When stronger messaging is ready, it can be introduced without changing the route or layout.",
        ],
      },
      {
        heading: "Ready for a later upgrade",
        paragraphs: [
          "This page is intentionally lightweight because it is expected to sharpen over time. The supporting system is already in place, which makes future revision much simpler.",
          "For now, it does exactly what it should: it completes the structure and keeps the build tidy.",
        ],
      },
    ],
    cta: {
      title: "Continue to education",
      body: "Education uses the same temporary approach and helps close out this group of footer-linked pages cleanly.",
      label: "Education",
      href: "/chatgpt/education",
    },
  },
  education: {
    id: "education",
    metaLine: "ChatGPT · Education",
    title: "Education",
    subtitle:
      "This temporary page gives the education branch a polished destination while leaving final audience framing, use cases, and approved messaging open for later work.",
    highlights: [
      "The page should feel thoughtful and composed.",
      "The copy stays intentionally broad.",
      "The route is stable even while the story is not final.",
    ],
    sections: [
      {
        heading: "Holding the place cleanly",
        paragraphs: [
          "This route exists so the footer and sitemap can feel complete right now. The content is intentionally provisional, which keeps later revisions simple and predictable.",
          "That is better than leaving the page empty or filling it with language that sounds prematurely final.",
        ],
      },
      {
        heading: "Designed for easy revision",
        paragraphs: [
          "The page already has the right reading rhythm and content hierarchy. Later, it can become more specific without any need to revisit layout or navigation choices.",
          "For now, the copy only needs to feel coherent, branded, and calm.",
        ],
      },
      {
        heading: "A lighter temporary tone",
        paragraphs: [
          "This version is deliberately lighter than a final education page would be. It should read as a real page, but still signal that sharper wording will come later.",
          "That makes it a good interim state for the current build.",
        ],
      },
    ],
    cta: {
      title: "Move to pricing",
      body: "Pricing closes the temporary ChatGPT set and keeps the same polished-but-generic editorial treatment.",
      label: "Pricing",
      href: "/pricing",
    },
  },
  pricing: {
    id: "pricing",
    metaLine: "ChatGPT · Pricing",
    title: "Pricing",
    subtitle:
      "This pricing page is temporary editorial filler that gives the footer a complete destination while leaving final package language and commercial framing open.",
    highlights: [
      "The route is real even if the pricing copy is not final.",
      "Temporary content should still feel premium.",
      "The system is complete first; the sharper wording can follow.",
    ],
    sections: [
      {
        heading: "A complete endpoint",
        paragraphs: [
          "Pricing often changes late, so this page is intentionally flexible. It gives the footer a stable endpoint without forcing product packaging decisions into the build too early.",
          "That makes the current implementation cleaner and easier to maintain.",
        ],
      },
      {
        heading: "Neutral by design",
        paragraphs: [
          "The copy is broad enough to avoid unnecessary rework later. At the same time, it still feels composed enough to belong inside the site without reading like a plain placeholder.",
          "That is the balance this version is meant to hold.",
        ],
      },
      {
        heading: "Ready for the final draft",
        paragraphs: [
          "Once pricing language is approved, the structure here can support it immediately. Until then, the page exists to complete the navigation system and keep the build-up clean.",
          "That is exactly what a good interim page should do.",
        ],
      },
    ],
    cta: {
      title: "Return to the overview",
      body: "The overview page stays at the top of this temporary set and makes a clean loop back through the section.",
      label: "Explore ChatGPT",
      href: "/chatgpt/explore",
    },
  },
};

export function getResourceDetailPage(id: string | undefined) {
  if (!id) return null;
  return RESOURCE_DETAIL_PAGES[id as ResourcePageId] ?? null;
}
