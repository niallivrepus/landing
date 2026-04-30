# Jokuh Landing Page — Information Architecture

**Version:** 1.0
**Owner:** Hyke (UX/UI), Sean Rock (CEO)
**Purpose:** Single source of truth for the public marketing site. Every MD file in this folder maps to one rendered page. The agent shipping the site should read each file as the canonical content + intent for that route.

---

## Site map

```
/                                            → 02-HOMEPAGE.md

/products
  /products/spine                            → products/spine.md
  /products/blurbs                           → products/blurbs.md
  /products/calls                            → products/calls.md
  /products/messages                         → products/messages.md
  /products/profile                          → products/profile.md

/company
  /company/about                             → company/about-us.md
  /company/stories                           → company/stories.md
  /company/share-your-story                  → company/share-your-story.md
  /company                                   → company/company.md
  /company/news                              → company/news.md
  /company/career                            → company/career.md

/business
  /business                                  → business/overview.md
  /business/pricing                          → business/pricing.md
  /business/customer-stories                 → business/customer-stories.md
  /business/resources                        → business/resources.md
  /business/contact                          → business/contact-sales.md

  /business/jokuh-business                   → business/jokuh-business.md
  /business/jokuh-enterprise                 → business/jokuh-enterprise.md
  /business/sdk-api                          → business/sdk-api.md

/developers
  /developers                                → developers/jokuh-sdk.md
  /developers/quickstart                     → developers/quickstart.md
  /developers/docs                           → developers/docs.md
```

---

## Navigation taxonomy (matches the screenshots)

**PRODUCTS (top nav, consumer)**
Spine · Blurbs · Calls · Messages · Profile

**COMPANY (footer column)**
About us · Stories · Share your story · Company · News · Career

**BUSINESS (top nav)**
Overview · Pricing · Customer Stories · Resources ↗ · Contact Sales
Sub-products: Jokuh Business · Jokuh Enterprise · SDK & API

**EXPLORE DEVELOPERS (footer)**
Jokuh SDK ↗ · Quickstart ↗ · Docs ↗

---

## How the agent should use this folder

1. Read `01-VOICE-AND-FACTS.md` first. It is the ground-truth doc — voice, claims that are safe to publish, claims that are NOT, naming, capitalization, taglines.
2. Each page MD has the same structure: **Purpose**, **Audience**, **Hero**, **Body sections**, **CTAs**, **Internal links**, **SEO meta**, **Asset slots**.
3. Treat copy in MD as *seed copy* — the page must respect the prescribed voice, but the agent has license to tighten line breaks, splice transitions, and compose components. Do not invent product surface that is not listed here.
4. If a fact does not appear in `01-VOICE-AND-FACTS.md`, it is not public. Do not publish it.
5. Asset slots reference `/_assets/...` paths — those are placeholders. Final assets are produced separately.

---

## Build order recommendation

1. Voice & facts file → cement vocabulary
2. Homepage → set hero/positioning that all sub-pages echo
3. Products (Spine first — it is the conceptual anchor for everything else)
4. Company → About us, Career — these earn trust
5. Business overview + Pricing → conversion surface
6. Developers → Jokuh SDK + Quickstart link target
7. Long-tail (Stories, News, Customer Stories, Share your story) — content-fed; ship as templates first, fill over time

---

## Hard rules for the agent

- **Never** publish: raise amount, valuation, cap-table specifics, ARR, burn rate, internal milestones with dates, employee compensation, NDA-protected partner names, unreleased product surface.
- **Always** publish: manifesto frame, mission, the five consumer products by name (Spine, Blurbs, Calls, Messages, Profile), founder names already on the cover sheet (Sean Rock, Hyke Vlas), public backers (Red Beard Ventures, Denarii Labs), public grants (Avalanche, RunPod, Hume AI, Kihew), TestFlight stage, contact `sean@sierri.com`.
- **Never** quote the manifesto in 30+ word blocks. Paraphrase. Originality > extraction.
- **Always** capitalize: Jokuh, Spine, Blurbs, Sigil, Knowledge Pool, ARC Terminal, Sovereign Agentic Operating System.
- **Tone**: Mitchell × Martin merged — manifesto-grade, joyful, sharp. See `01-VOICE-AND-FACTS.md`.
