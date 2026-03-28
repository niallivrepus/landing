/** Jokuh website terms — original drafting; structure inspired by standard site terms. */

export type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  cta?: {
    label: string;
    to?: string;
    href?: string;
  };
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "ownership",
    title: "Ownership of site; agreement to terms",
    paragraphs: [
      'These Terms of Use (“Terms”) govern your access to and use of the Jokuh website, preview pages, documentation subsites, and other web properties we operate and link to from jokuh.com (collectively, the “Site”). The Site is owned and operated by Jokuh and its licensors. BY USING THE SITE, YOU AGREE TO THESE TERMS; IF YOU DO NOT AGREE, DO NOT USE THE SITE.',
      "We may change these Terms at any time. We will post the updated Terms on the Site. Your continued use after changes means you accept the revised Terms. Subject to these Terms, Jokuh grants you a personal, non-exclusive, non-transferable, limited right to access and use the Site.",
    ],
  },
  {
    id: "content",
    title: "Content",
    paragraphs: [
      'Text, graphics, interfaces, photographs, trademarks, logos, audio, video, code, and layout on the Site (“Content”) are owned by Jokuh or our licensors and protected by intellectual property laws.',
      "Except where we expressly permit it, you may not copy, reproduce, republish, upload, post, publicly display, encode, translate, transmit, distribute, or mirror the Site or Content for commercial purposes without our prior written consent.",
      "You may use materials we intentionally offer for download (for example, brand assets or spec sheets) only in accordance with any accompanying license or notice, for lawful, non-misleading purposes.",
    ],
  },
  {
    id: "your-use",
    title: "Your use of the site",
    paragraphs: [
      "You may not use automated means (including scrapers, bots, or bulk harvesters) to access or collect Content except through documented APIs or with our written permission.",
      "You may not attempt unauthorized access to the Site, our networks, or other users’ accounts; probe or stress systems in ways that could impair availability; forge headers; impersonate others; or use the Site for unlawful activity or to violate third-party rights.",
      "You may not impose unreasonable loads on our infrastructure or interfere with others’ use of the Site.",
    ],
  },
  {
    id: "purchases",
    title: "Purchases; other terms",
    paragraphs: [
      "Additional terms apply to specific offerings (waitlist, betas, paid plans, promotions). If those terms conflict with these Terms for a specific service, the service terms control for that service.",
      "Descriptions, pricing, and availability on the Site may change and may not reflect every jurisdiction. Nothing on the Site overrides a separate signed or click-through agreement for a product you purchase.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts, passwords, and security",
    paragraphs: [
      "Some features require an account. You are responsible for safeguarding credentials and for activity under your account. Notify us promptly of unauthorized use.",
      "You may not use another person’s account without permission. Jokuh is not liable for losses arising from your failure to protect your account.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    paragraphs: [
      "Our Privacy Policy describes how we handle personal data in connection with the Site and is incorporated into these Terms by reference.",
      "Internet transmissions are not completely secure. You acknowledge that information you send to the Site may be intercepted despite encryption where we employ it.",
    ],
    cta: {
      label: "Read the Jokuh Privacy Policy.",
      to: "/legal/privacy",
    },
  },
  {
    id: "links",
    title: "Links to other sites",
    paragraphs: [
      "The Site may link to independent third-party sites. Those sites are not under our control; we are not responsible for their content. Your use of third-party sites is at your discretion.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      'JOKUH DOES NOT WARRANT THAT THE SITE OR CONTENT WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF HARMFUL COMPONENTS. THE SITE AND CONTENT ARE PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL IMPLIED WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
      "We may modify, suspend, or discontinue the Site or any part of it without notice.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, Jokuh and its affiliates, officers, directors, employees, and suppliers will not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or goodwill, arising from your use of the Site.",
      "Our aggregate liability for claims relating to the Site (except where prohibited by law) shall not exceed the greater of (a) amounts you paid Jokuh for the specific service giving rise to the claim in the six months before the claim, or (b) one hundred U.S. dollars (US$100). Some jurisdictions do not allow certain limitations; in those jurisdictions, our liability is limited to the minimum permitted.",
    ],
  },
  {
    id: "indemnity",
    title: "Indemnity",
    paragraphs: [
      "You agree to indemnify and hold harmless Jokuh and its affiliates from claims, damages, losses, and expenses (including reasonable attorneys’ fees) arising from your misuse of the Site, violation of these Terms, or violation of third-party rights.",
    ],
  },
  {
    id: "violation",
    title: "Violation of these terms",
    paragraphs: [
      "We may investigate suspected violations and cooperate with law enforcement. We may suspend or terminate access if we believe you have violated these Terms or pose a risk to the Site or others.",
      "We may preserve and disclose information if required by law or to enforce these Terms.",
    ],
  },
  {
    id: "law",
    title: "Governing law; dispute resolution",
    paragraphs: [
      "Unless mandatory local law provides otherwise, these Terms are governed by the laws of the State of Delaware, USA, without regard to conflict-of-law rules. Courts in Delaware (or the U.S. federal courts located there) have exclusive jurisdiction, except that consumers in the European Union may bring claims in the courts of their country of residence.",
      "You and Jokuh will attempt good-faith informal resolution before commencing litigation. Claims must be brought within one year of the event giving rise to the claim unless a longer period is required by law.",
    ],
  },
  {
    id: "void",
    title: "Void where prohibited",
    paragraphs: [
      "The Site is operated from the United States. Access from other regions is at your initiative; you are responsible for compliance with local laws. We may restrict features or services by geography.",
    ],
  },
  {
    id: "misc",
    title: "Miscellaneous",
    paragraphs: [
      "If any provision is unenforceable, the remainder stays in effect. These Terms are the entire agreement regarding the Site (aside from separate purchase agreements). Failure to enforce a provision is not a waiver.",
      "You may not export or re-export Site Content in violation of export control laws.",
    ],
  },
  {
    id: "feedback",
    title: "Feedback and information",
    paragraphs: [
      "Unless we agree otherwise in writing, feedback you provide about the Site is non-confidential and may be used by Jokuh without restriction or compensation.",
      "Information on the Site may change without notice.",
    ],
  },
];
