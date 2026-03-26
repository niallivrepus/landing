export const PRIVACY_DOC_KEYS = ["customer", "data-products", "governance", "gov-requests"] as const;
export type PrivacyDocKey = (typeof PRIVACY_DOC_KEYS)[number];

export function isPrivacyDocKey(s: string): s is PrivacyDocKey {
  return (PRIVACY_DOC_KEYS as readonly string[]).includes(s);
}

export type PrivacyResourceLink = { label: string; to?: string; href?: string };

export type PrivacySection = {
  title: string;
  body: string[];
  bullets?: string[];
  afterBullets?: string[];
  /** In-page anchor for deep links (e.g. resource link row). */
  anchor?: string;
};

export type PrivacyDocMeta = {
  key: PrivacyDocKey;
  cardTitle: string;
  selectTitle: string;
  documentH1: string;
  breadcrumbLabel: string;
  intro: string;
  introContinued?: string[];
  documentSubtitle?: string;
  resourceLinks?: PrivacyResourceLink[];
  counselNote?: string;
  sections: PrivacySection[];
};

/** Long-form customer policy — structure aligned with common global privacy pages (e.g. apple.com/legal/privacy/en-ww); Jokuh-specific wording. */
const CUSTOMER_SECTIONS: PrivacySection[] = [
  {
    title: "What is personal data at Jokuh?",
    body: [
      "We believe fundamental privacy rights should not depend on where you live. For purposes of this policy, we treat information that relates to an identified or identifiable person, or that can reasonably be linked to them by Jokuh, as “personal data,” wherever that person resides.",
      "That includes obvious identifiers (such as your name or email) and identifiers that do not name you directly but can be used to single you out in context (such as a persistent device identifier paired with your account). Aggregated or de-identified data that cannot reasonably be linked back to you is not personal data here.",
      "This policy describes how Jokuh and its affiliates handle personal data when you use our websites, downloadable apps, APIs, and related services. Third parties you connect or link to Jokuh may process data under their own policies; we encourage you to read those policies before you share information with them.",
    ],
  },
  {
    title: "Your privacy rights at Jokuh",
    body: [
      "Depending on where you live, you may have the right to access, correct, delete, or export personal data; to object to or restrict certain processing; to withdraw consent where processing is consent-based; and to lodge a complaint with a supervisory authority.",
      "We will not discriminate against you for exercising these rights in good faith. Where a third-party processor assists us, we remain responsible for personal data we entrust to them under contract and applicable law.",
      "To submit a request, use in-product privacy controls where available, or email privacy@jokuh.com from the address associated with your account. We may need to verify your identity before fulfilling a request. We will respond within the time required by law for your region.",
    ],
    afterBullets: [
      "We may decline requests that are manifestly unfounded, excessive, jeopardize others’ privacy, or conflict with our legal obligations (for example, retaining billing records where tax law requires).",
      "If you are unable to use self-service tools and need help, contact privacy@jokuh.com and describe the nature of your request.",
    ],
  },
  {
    title: "Personal data Jokuh collects from you",
    body: [
      "We strive to collect only the personal data we need. What we collect depends on how you use Jokuh—for example, browsing our marketing site, joining a waitlist, creating an account, using Pods or Spine, or contacting support.",
      "Examples of categories we may collect include:",
    ],
    bullets: [
      "Account information — identifiers, email, profile details, authentication factors, and preferences tied to your Jokuh account.",
      "Device and technical data — device type, OS version, app version, IP address, coarse locale, and diagnostic identifiers needed for security and reliability.",
      "Contact information — name, email, phone, or address when you provide them for support, billing, or legal notices.",
      "Payment and transaction information — billing contact, payment method tokens (processed by payment partners where applicable), and records of purchases or subscriptions.",
      "Usage and content you choose to sync — interactions with features you enable, prompts and outputs you store in your vault subject to your settings, and similar product telemetry where permitted.",
      "Support content — messages, attachments, and call or chat transcripts when you contact us.",
      "Communications preferences — marketing opt-ins or opt-outs where we offer them.",
    ],
    afterBullets: [
      "You are not required to provide all of the information we request, but some features may be unavailable without it.",
    ],
  },
  {
    title: "Personal data Jokuh receives from other sources",
    body: [
      "We may receive personal data from other people (for example, when someone invites you to a shared space), from partners assisting with fraud prevention or identity checks, from payment processors confirming a transaction, or from public sources where permitted by law.",
      "If you connect a third-party account, we receive the information you authorize through that connection, subject to the third party’s consent screen.",
    ],
  },
  {
    title: "Jokuh’s use of personal data",
    body: [
      "We process personal data to provide and improve Jokuh, secure our services, communicate with you, comply with law, and pursue other purposes described when we collect data or as allowed by applicable legal bases (such as contract, legitimate interests balanced against your rights, or consent where required).",
      "Typical purposes include:",
    ],
    bullets: [
      "Operating core services — authentication, synchronization across devices you approve, and delivery of features you request.",
      "Safety and integrity — detecting abuse, spam, malware, and fraud; enforcing our terms; and protecting users and Jokuh.",
      "Product improvement — troubleshooting, aggregate analytics, and quality metrics that do not require selling your data.",
      "Communications — transactional messages, security alerts, and (where you opt in) product updates or tips.",
      "Legal compliance — responding to lawful requests, preserving records where required, and defending legal claims.",
    ],
    afterBullets: [
      "We retain personal data only as long as needed for these purposes or as required by law, then delete or de-identify it where feasible.",
      "We do not sell your personal data as “sale” is commonly defined in U.S. state laws. We do not use your private vault content to train generalized models unless a feature clearly requests your consent and you provide it.",
    ],
  },
  {
    title: "Jokuh’s sharing of personal data",
    body: [
      "We may share personal data with Jokuh affiliates, service providers acting on our instructions (hosting, email, analytics, customer-support tooling, security vendors), professional advisers, and others when you direct us to share or when disclosure is required by law or necessary to protect vital interests.",
      "Providers must use data only to perform services for us and must protect it consistent with this policy and our agreements. We may also share information in connection with a merger, acquisition, or asset sale, with notice where required.",
    ],
  },
  {
    title: "Protection of personal data at Jokuh",
    body: [
      "We use administrative, technical, and physical safeguards designed to protect personal data appropriate to the sensitivity of the information and the risks involved. No method of transmission or storage is perfectly secure; we continuously work to improve our controls.",
    ],
  },
  {
    title: "Children and personal data",
    body: [
      "Jokuh is not directed to children under the age at which parental consent is required in their jurisdiction. We do not knowingly collect personal data from those children without verifiable parental consent where the law requires it.",
      "If you believe we have collected a child’s data improperly, contact privacy@jokuh.com and we will take appropriate steps, including deletion where appropriate.",
    ],
  },
  {
    title: "Cookies and similar technologies",
    body: [
      "We use cookies, local storage, and similar technologies on our websites and web clients to remember preferences, keep you signed in where you choose, measure basic traffic and campaign performance, and protect against abuse.",
      "You can control cookies through your browser settings. Blocking some cookies may limit certain features (for example, staying logged in). Where required, we will obtain consent before using non-essential cookies.",
    ],
  },
  {
    title: "Transfer of personal data between countries",
    body: [
      "Jokuh operates globally. Personal data may be processed in the United States and in other countries where we or our providers maintain facilities. When we transfer personal data from regions that require safeguards, we use mechanisms such as standard contractual clauses or other approved transfer tools, as applicable.",
      "The Jokuh entity responsible for your data may depend on your region and the product you use; region-specific addenda may apply as we publish them.",
    ],
  },
  {
    title: "Our companywide commitment to your privacy",
    body: [
      "We train employees on privacy and security expectations and apply access controls so that personal data is available internally only to those who need it for their roles.",
    ],
  },
  {
    title: "Privacy questions and changes to this policy",
    body: [
      "If you have questions about this Privacy Policy or our practices, contact privacy@jokuh.com. For regulatory or data-protection contacts in specific regions, we will publish dedicated addresses as our footprint expands.",
      "When we make material changes to this policy, we will post an updated version on this site and, where appropriate, provide additional notice (for example, by email or in-product message) before changes take effect.",
    ],
  },
  {
    anchor: "us-state-disclosures",
    title: "U.S. state privacy disclosures",
    body: [
      "Residents of certain U.S. states may have additional rights (including access, deletion, opt-out of sale/sharing, and appeal rights) under local law. State-specific disclosures and request channels will be published here as they are finalized for Jokuh.",
    ],
  },
  {
    anchor: "canada-messages",
    title: "Information regarding commercial electronic messages (Canada)",
    body: [
      "Where Canada’s anti-spam legislation (CASL) or similar rules apply, we obtain consent before sending commercial electronic messages where required, identify Jokuh in messages, and provide a working unsubscribe mechanism.",
    ],
  },
];

export const PRIVACY_DOCS: Record<PrivacyDocKey, PrivacyDocMeta> = {
  customer: {
    key: "customer",
    cardTitle: "Jokuh Customer Privacy Policy",
    selectTitle: "Jokuh Customer Privacy Policy",
    documentH1: "Jokuh Privacy Policy",
    breadcrumbLabel: "Customer Privacy",
    documentSubtitle: "Updated March 26, 2026",
    intro:
      "Jokuh’s Privacy Policy describes how Jokuh collects, uses, and shares your personal data when you use our products and services.",
    introContinued: [
      "Beyond this policy, individual Jokuh features may show concise data notices when they ask to use sensitive categories of information. Those notices are designed to be read at the moment of choice; you can revisit them in product settings where available.",
      "You can explore our practices using the section headings below. If anything is unclear, contact us using the details at the end of this document.",
    ],
    resourceLinks: [
      { label: "Download a copy of this Privacy Policy", href: "#print-policy" },
      { label: "U.S. state privacy disclosures", href: "#us-state-disclosures" },
      { label: "Commercial email & messaging (Canada)", href: "#canada-messages" },
      { label: "Product privacy library (coming soon)", href: "/legal/privacy/data-products" },
    ],
    counselNote:
      "This English (Global) page is a detailed example layout for the marketing site. Have counsel review and localize before production use.",
    sections: CUSTOMER_SECTIONS,
  },
  "data-products": {
    key: "data-products",
    cardTitle: "Data & privacy in products",
    selectTitle: "Data & privacy in products",
    documentH1: "Data & Privacy in Jokuh Products",
    breadcrumbLabel: "Data in products",
    intro:
      "This disclosure summarizes categories of data processed by Jokuh software and connected services, and how in-product controls relate to our customer privacy policy.",
    sections: [
      {
        title: "Purpose",
        body: [
          "Jokuh surfaces privacy information when a feature needs access to sensitive categories (microphone, contacts, location, health-related inferences, etc.). This document complements the Customer Privacy Policy.",
        ],
      },
      {
        title: "Pods, Spine, and Vortex",
        body: [
          "Session transcripts, embeddings, and file references may be processed to provide continuity across devices you authorize. You can revoke device keys and export or delete associated vault material where the product supports it.",
        ],
      },
      {
        title: "Analytics and diagnostics",
        body: [
          "We may collect crash logs and coarse performance metrics. Where analytics could relate to an identifiable account, we provide opt-outs or aggregate reporting as described in each client’s settings.",
        ],
      },
      {
        title: "Third-party integrations",
        body: [
          "When you connect a third-party OAuth provider or API, their terms and privacy policy apply to data they process. Jokuh passes through only the scopes you approve.",
        ],
      },
      {
        title: "Contact",
        body: ["Product-specific questions: privacy@jokuh.com."],
      },
    ],
  },
  governance: {
    key: "governance",
    cardTitle: "Privacy governance",
    selectTitle: "Privacy governance",
    documentH1: "Jokuh Privacy Governance",
    breadcrumbLabel: "Governance",
    intro:
      "How Jokuh operationalizes privacy by design, vendor risk, and accountability across engineering, security, and legal.",
    sections: [
      {
        title: "Program overview",
        body: [
          "Our privacy office maintains records of processing activities, coordinates DPIAs for high-risk launches, and reviews subprocessors before onboarding.",
        ],
      },
      {
        title: "Training and access",
        body: [
          "Employees with access to production systems complete recurring privacy and security training. Access follows least-privilege and is logged.",
        ],
      },
      {
        title: "Incidents",
        body: [
          "We maintain an incident response plan including notification workflows where required by law. Users may report concerns to privacy@jokuh.com.",
        ],
      },
      {
        title: "Assurance",
        body: [
          "We pursue independent assessments where they materially reduce risk for customers. Certificates and reports will be published here when available.",
        ],
      },
    ],
  },
  "gov-requests": {
    key: "gov-requests",
    cardTitle: "Government information requests",
    selectTitle: "Government information requests",
    documentH1: "Government & Civil Information Requests",
    breadcrumbLabel: "Gov. requests",
    intro:
      "Transparency principles for law enforcement, national security, and civil requests relating to Jokuh user data.",
    sections: [
      {
        title: "Process",
        body: [
          "We review requests for legal validity and narrowness. We push back on overbroad orders where permitted and notify users when not prohibited.",
        ],
      },
      {
        title: "Types of disclosure",
        body: [
          "Categories may include subscriber information, transactional metadata, and content stored on Jokuh systems. End-to-end encrypted payloads that Jokuh cannot decrypt are identified in transparency reporting.",
        ],
      },
      {
        title: "Reporting",
        body: [
          "We will publish aggregate statistics on request volumes by jurisdiction as our legal obligations and scale allow.",
        ],
      },
      {
        title: "Emergency requests",
        body: [
          "We may preserve or disclose information where we reasonably believe it necessary to prevent imminent harm, subject to documentation and follow-up legal process where applicable.",
        ],
      },
    ],
  },
};

export const PRIVACY_TOPIC_ROWS: { key: PrivacyDocKey | "account"; title: string; to: string }[] = [
  { key: "customer", title: "Jokuh Customer Privacy Policy", to: "/legal/privacy/customer" },
  { key: "data-products", title: "Data & privacy in products", to: "/legal/privacy/data-products" },
  { key: "governance", title: "Privacy governance", to: "/legal/privacy/governance" },
  { key: "gov-requests", title: "Government information requests", to: "/legal/privacy/gov-requests" },
  { key: "account", title: "Manage your account", to: "/#start" },
];
