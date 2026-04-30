# Jokuh Copy Handoff Pack — 2026-03-29

Use this with [route-audit-2026-03-29.md](/Users/sonadin/Documents/code/jokuh/landing/docs/route-audit-2026-03-29.md).

Goal: give a follow-up agent enough structure to write page copy fast, in priority order, without re-auditing the repo.

## Working assumptions

- Jokuh is positioning itself as a serious product + platform company, not only a marketing shell.
- The strongest missing story is tooling: platform, agents, apps, SDK, docs, and ecosystem support.
- Dark-first visual language stays intact for marketing/product/platform.
- Legal pages stay light, structured, direct.
- No placeholder tone. No “coming soon” unless the route is explicitly meant to be a status placeholder.

## Sitemap priority map

### Tier 1 — build next

These are already exposed by the site and should get real copy first.

| Route | Type | Why first |
| --- | --- | --- |
| `/platform/gooey` | New real page replacing stub | Gooey is already a real design-system dependency and brand surface |
| `/developers/agents` | New real page replacing stub | High-value platform story already exposed in IA |
| `/developers/apps` | New real page replacing stub | Docs already send traffic here |
| `/developers/forum` | New real page replacing stub | Docs, learn, and blog all imply community depth |
| `/waitlist` | New real conversion page replacing stub | Multiple CTAs already point here |
| `/platform/identity` | New real page replacing stub | Needed to support Passport / Realms / V1llains narrative |

### Tier 2 — build after Tier 1

| Route | Type | Why |
| --- | --- | --- |
| `/platform` | New overview route | Parent landing for platform cluster |
| `/ecosystem` | New overview route | Parent landing for ecosystem cluster |
| `/developers` | New overview route | Parent landing for docs, SDK, apps, agents, forum |
| `/platform/wallet` | Replace stub | Supports platform completeness |
| `/platform/galaxy-nodes` | Replace stub | Supports infra/runtime story |
| `/ecosystem/community` | Replace stub | Community needs a real destination |
| `/ecosystem/partnerships` | Replace stub | Partnership story is missing |
| `/developers/open-models` | Replace stub | Model-platform story is currently absent |
| `/developers/accessibility` | Replace stub | Important trust/documentation support page |
| `/account` | Replace stub or remove | Support page already points here |
| `/rss` | Replace stub or remove | Sitemap/footer already expose it |
| `/system-status/history` | New route | Status parity is incomplete without history |

### Tier 3 — legal completeness

| Route | Type | Why |
| --- | --- | --- |
| `/legal/sla` | New route | Enterprise buyers will expect it |
| `/legal/sales-support` | New route | Needed for enterprise/legal operations completeness |
| `/legal/intellectual-property` | New route | Common legal cluster branch |
| `/legal/warranty` | New route | Apple-style legal parity |
| `/legal/more-resources` | New route | Catch-all legal resources index |

### Tier 4 — existing pages that need real copy, not routing

| Route | Current state |
| --- | --- |
| `/safety/approach` | Structurally real, copy is temporary filler |
| `/safety/security-privacy` | Structurally real, copy is temporary filler |
| `/safety/trust-transparency` | Structurally real, copy is temporary filler |
| `/chatgpt/explore` | Structurally real, copy is temporary filler |
| `/chatgpt/business` | Structurally real, copy is temporary filler |
| `/chatgpt/enterprise` | Structurally real, copy is temporary filler |
| `/chatgpt/education` | Structurally real, copy is temporary filler |
| `/pricing` | Structurally real, copy is temporary filler |

## Page briefs

Each brief is written for copy generation, not UI redesign.

### 1. `/platform/gooey`

- Job: explain Gooey as Jokuh’s interface system and motion/design foundation
- Audience: designers, frontend engineers, technical buyers, curious partners
- Promise: Gooey makes Jokuh interfaces feel coherent, fast, expressive, and reusable
- Must prove:
  - shared components
  - iconography and motion system
  - theme handling
  - how Gooey helps ship faster across products
- Recommended sections:
  1. Hero: what Gooey is
  2. System pillars: components, motion, tokens, accessibility
  3. In production at Jokuh: where Gooey appears today
  4. Why it matters for speed and consistency
  5. CTA into docs / platform / waitlist
- Tone: productized, confident, not overly internal

### 2. `/developers/agents`

- Job: explain Jokuh’s agent stack
- Audience: developers building agent workflows and product teams evaluating orchestration
- Promise: Jokuh helps developers build agents with tools, memory, orchestration, and product-ready controls
- Must prove:
  - tool calling / integrations
  - orchestration patterns
  - MCP or tool bridge story
  - where agents live across Jokuh products
- Recommended sections:
  1. Hero
  2. What agents can do in Jokuh
  3. Core primitives
  4. Build flow
  5. Example use cases
  6. CTA into SDK / cookbook / apps
- Tone: technical, credible, specific

### 3. `/developers/apps`

- Job: explain the apps platform layer
- Audience: developers building embedded or connected product experiences
- Promise: apps can plug into Jokuh with a clear runtime, auth, tool, and UI model
- Must prove:
  - app lifecycle
  - data/auth boundaries
  - embedding / invocation model
  - path from prototype to production
- Recommended sections:
  1. Hero
  2. Why apps exist in Jokuh
  3. App runtime model
  4. Auth and data flow
  5. Example app patterns
  6. CTA into docs and agents
- Tone: practical, platform-minded

### 4. `/developers/forum`

- Job: give community an actual home
- Audience: developers, early adopters, partners
- Promise: Jokuh has a place for questions, builds, requests, and release discussion
- Must prove:
  - discussion categories
  - support boundaries
  - where to share builds or feedback
  - how the forum connects to docs/blog/learn
- Recommended sections:
  1. Hero
  2. What the forum is for
  3. Main discussion categories
  4. Community norms
  5. CTA into docs and learn
- Tone: welcoming but structured

### 5. `/waitlist`

- Job: convert interest into signups
- Audience: curious users, partners, developers, early teams
- Promise: early access to Jokuh products, updates, and launch invites
- Must prove:
  - what they are signing up for
  - why now
  - what access means
  - what products are in the pipeline
- Recommended sections:
  1. Hero with strong CTA
  2. What access unlocks
  3. Who it is for
  4. Why join now
  5. Final CTA
- Tone: direct, desirable, low-friction

### 6. `/platform/identity`

- Job: explain identity as a core platform layer
- Audience: users, developers, ecosystem partners
- Promise: identity at Jokuh is portable, permissioned, and product-aware
- Must prove:
  - relation to Passport
  - relation to Realms and V1llains
  - trust/privacy angle
  - account portability
- Recommended sections:
  1. Hero
  2. Identity graph
  3. Permissions and portability
  4. Product surfaces powered by identity
  5. CTA into Passport / platform
- Tone: crisp, systemic

### 7. `/platform`

- Job: overview page for the platform cluster
- Audience: technical buyers, developers, partners
- Promise: Jokuh’s platform is not one feature; it is a set of system layers
- Must prove:
  - identity
  - Gooey
  - wallet
  - galaxy nodes
- Recommended sections:
  1. Hero
  2. Platform layer cards
  3. How the layers work together
  4. CTA into docs / waitlist

### 8. `/ecosystem`

- Job: overview page for ecosystem participation
- Audience: community, partners, creators
- Promise: Jokuh is building a network, not only a product catalog
- Must prove:
  - V1llains
  - community
  - partnerships
  - how to participate
- Recommended sections:
  1. Hero
  2. Ecosystem branches
  3. Participation model
  4. CTA into community / partnerships / waitlist

### 9. `/developers`

- Job: overview page for the developer universe
- Audience: developers landing before docs
- Promise: one place to understand what to build with Jokuh
- Must prove:
  - docs
  - SDK
  - agents
  - apps
  - learn/blog/forum
- Recommended sections:
  1. Hero
  2. Start building cards
  3. Learn resources
  4. Community/status
  5. CTA into docs

### 10. `/system-status/history`

- Job: archive and explain incidents, uptime changes, and prior events
- Audience: customers, enterprise evaluators, operators
- Promise: operational transparency is visible over time, not only in the moment
- Must prove:
  - incident log
  - component view
  - subscription / follow flow
- Tone: very plain, factual

### 11. `/legal/sla`

- Job: service-level commitments
- Audience: business and enterprise buyers
- Promise: response, uptime, and service commitments are stated clearly
- Tone: legal-operational, direct

### 12. `/legal/sales-support`

- Job: sales, fulfillment, returns, and support process terms
- Audience: business buyers and legal reviewers
- Tone: procedural, readable

### 13. `/legal/intellectual-property`

- Job: trademarks, brand use, claims process, infringement reporting
- Audience: partners, press, legal reviewers
- Tone: formal, clear

### 14. `/legal/warranty`

- Job: product and service warranty disclosures
- Audience: buyers and legal reviewers
- Tone: formal, clear

### 15. `/legal/more-resources`

- Job: aggregate legal/support/resource links not strong enough for top-level nav
- Audience: legal reviewers and support operations
- Tone: structured index page

## Copy prompts per page

Use these prompts directly with another copy agent.

### Prompt 1 — `/platform/gooey`

Write production-ready website copy for Jokuh’s `/platform/gooey` page. The page should present Gooey as Jokuh’s interface system: components, motion, tokens, theme handling, accessibility, and cross-product consistency. Keep the tone premium, technical, and productized. Do not mention internal repo details. Output a full page structure with hero, section headings, body copy, proof bullets, and final CTA copy.

### Prompt 2 — `/developers/agents`

Write production-ready website copy for Jokuh’s `/developers/agents` page. Position Jokuh as a platform for building agents with tools, orchestration, memory, and product-ready controls. The audience is technical and skeptical. Avoid hype language. Output a full page structure with hero, core primitives, workflow explanation, example use cases, and CTA copy.

### Prompt 3 — `/developers/apps`

Write production-ready website copy for Jokuh’s `/developers/apps` page. Explain how developers build and run apps on Jokuh, including runtime model, auth/data boundaries, extension points, and how apps connect to agents and docs. Keep it concrete and platform-minded. Output section-by-section page copy and CTA copy.

### Prompt 4 — `/developers/forum`

Write production-ready website copy for Jokuh’s `/developers/forum` page. It should feel like a real developer community hub with discussion categories, feedback culture, office hours, launch notes, and support boundaries. Make it inviting but structured. Output hero, sections, category descriptions, and CTA copy.

### Prompt 5 — `/waitlist`

Write production-ready website copy for Jokuh’s `/waitlist` page. The goal is conversion. Explain what signing up gives access to, who it is for, why now, and what kinds of launches or early access people can expect. Keep it direct and desirable. Output a short, high-conviction page with hero, qualification copy, reassurance copy, and CTA variants.

### Prompt 6 — `/platform/identity`

Write production-ready website copy for Jokuh’s `/platform/identity` page. Explain identity as a platform layer that powers Passport, Realms, and ecosystem participation. Emphasize portability, permissions, trust, and product continuity. Output a full page structure with clear sections and CTA copy.

### Prompt 7 — `/platform`

Write production-ready website copy for Jokuh’s `/platform` overview page. The page should unify Gooey, Identity, Wallet, and Galaxy Nodes into one coherent platform narrative. Make it useful for technical buyers and developers. Output the full page copy and card copy for each platform branch.

### Prompt 8 — `/ecosystem`

Write production-ready website copy for Jokuh’s `/ecosystem` overview page. Explain how V1llains, community participation, and partnerships fit into one ecosystem story. Keep it strategic, not fluffy. Output hero, branch descriptions, participation framing, and CTA copy.

### Prompt 9 — `/developers`

Write production-ready website copy for Jokuh’s `/developers` landing page. It should act as the top-level hub for docs, SDK, agents, apps, learn, blog, and forum. The page should help a developer choose a starting path fast. Output hero, quick-start options, resource groups, and CTA copy.

### Prompt 10 — `/system-status/history`

Write production-ready website copy for Jokuh’s `/system-status/history` page. Keep the tone operational and factual. Explain incident history, component timelines, and how users can track updates. Output a lean, trust-first page with hero, sections, and utility copy.

### Prompt 11 — legal expansion set

Write production-ready website copy outlines for these Jokuh legal pages: `/legal/sla`, `/legal/sales-support`, `/legal/intellectual-property`, `/legal/warranty`, and `/legal/more-resources`. Keep the tone formal, readable, and structured. For each page, output: purpose, short hero, section list, and intro copy.

### Prompt 12 — replace filler on existing real pages

Rewrite the copy for Jokuh’s existing pages that are structurally real but currently use temporary filler: `/safety/approach`, `/safety/security-privacy`, `/safety/trust-transparency`, `/chatgpt/explore`, `/chatgpt/business`, `/chatgpt/enterprise`, `/chatgpt/education`, and `/pricing`. Keep the current route structure, but replace all placeholder/editorial-filler language with real copy that sounds intentional and product-specific.

## Output order for the next agent

Best sequence:

1. `/waitlist`
2. `/platform/gooey`
3. `/developers/agents`
4. `/developers/apps`
5. `/developers/forum`
6. `/platform/identity`
7. `/platform`
8. `/developers`
9. filler replacement set
10. legal expansion set

## One-line editorial rules

- Prefer clarity over slogan density
- Sound like a real platform company
- Avoid generic “future of” language
- Every page needs one strong CTA, not many weak ones
- Keep product terms consistent with existing Jokuh routes and clusters
