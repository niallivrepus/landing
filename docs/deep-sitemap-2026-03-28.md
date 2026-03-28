# Jokuh Deep Sitemap

Generated: 2026-03-28  
Source of truth reviewed:
- `src/App.tsx`
- `src/data/rigid-sitemap.ts`
- `src/data/products.ts`
- `src/data/resource-detail-pages.ts`
- `src/data/stories-detail.ts`
- `src/data/news.ts`
- `src/data/docs-nav.ts`

## Snapshot

- Router type: React Router inside the landing app
- Primary nav model: `Product`, `Company`, `Business`, `Developers`
- Footer-only nav groups: `More`, `Safety`, `Terms & Policies`
- Sitemap-only nav groups: `Platform`, `Ecosystem`, `ChatGPT`
- Product detail pages: 8
- Resource detail pages: 8
- Story detail pages: 6
- On-site newsroom detail pages: 9
- Legal/privacy document families: 4
- Stub routes still present: 16

## Root-Level Pages

- `/` — Home
- `/download` — Download
- `/sitemap` — Sitemap
- `/about` — About us
- `/charter` — Company / charter page
- `/careers` — Careers
- `/brand` — Brand
- `/contact` — Contact Sales
- `/support` — Support
- `/system-status` — System Status
- `/ethics` — Ethics

## Product Detail Pages

- `/pods`
- `/blurbs`
- `/spine`
- `/vortex`
- `/passport`
- `/realms`
- `/orb`
- `/ecosystem/v1llains`

## Business / Resource Detail Pages

- `/safety/approach` — Safety Approach
- `/safety/security-privacy` — Security & Privacy
- `/safety/trust-transparency` — Trust & Transparency
- `/chatgpt/explore` — Explore ChatGPT
- `/chatgpt/business` — Business
- `/chatgpt/enterprise` — Enterprise
- `/chatgpt/education` — Education
- `/pricing` — Pricing

## Stories

Index:
- `/stories`

Detail pages:
- `/stories/gooey-island-merge-hygiene`
- `/stories/live-transcript-hooks-spine`
- `/stories/treasury-inference-api-grid`
- `/stories/seed-farm-south-carolina`
- `/stories/salvage-yard-nevada`
- `/stories/tamale-shop-california`

## Newsroom

Index:
- `/newsroom`

On-site detail pages:
- `/newsroom/introducing-jokuh-cortex`
- `/newsroom/jokuh-spine-tighter-sync`
- `/newsroom/waitlist-regional-rollout-next-quarter`
- `/newsroom/gooey-accessible-focus-rings-motion-prefs`
- `/newsroom/responsible-use-guidelines-v1llains-lab`
- `/newsroom/blurbs-composer-markdown-tables-paste-cleanup`
- `/newsroom/open-office-hours-identity-claim-flow`
- `/newsroom/hiring-design-systems-realtime-infra`
- `/newsroom/pod-encryption-at-rest-what-changed`

Notes:
- Medium sync currently has `0` imported items.
- One additional static ethics article resolves to `/ethics`, not `/newsroom/:slug`.

## Developers

Top-level developer pages:
- `/developers/sdk`
- `/developers/learn`
- `/developers/blog`
- `/developers/forum` — stub
- `/developers/agents` — stub
- `/developers/open-models` — stub
- `/developers/apps` — stub
- `/developers/accessibility` — stub

Docs section:
- `/developers/docs`
- `/developers/docs/models`
- `/developers/docs/quickstart`
- `/developers/docs/cookbook`

Important route note:
- `/developers/sdk` exists twice in `src/App.tsx`: once as a real page and once in `STUB_ROUTES`.
- Because the real route is declared first, `/developers/sdk` resolves to the real `DeveloperSdkPage`.

## Legal / Privacy

Core legal pages:
- `/privacy`
- `/terms`
- `/legal`
- `/legal/internet-services`
- `/legal/terms`
- `/legal/privacy`

Privacy document selector routes:
- `/legal/privacy/customer`
- `/legal/privacy/data-products`
- `/legal/privacy/governance`
- `/legal/privacy/gov-requests`

Locale reader route pattern:
- `/legal/privacy/:docKey/read/:locale`

Current privacy document families:
- `customer` — Customer Privacy
- `data-products` — Product Privacy
- `governance` — Privacy Governance
- `gov-requests` — Information Requests

## Redirects

- `/journal` → `/newsroom`
- `/journal/:slug` → `/newsroom/:slug`
- `/news` → `/newsroom`
- `/news/:slug` → `/newsroom/:slug`
- `/prompt` → `/#prompt`
- `/research` → `/about`
- `/brand-guidelines` → `/brand`
- `/developers/documentation` → `/developers/docs`

## Stub Routes

Platform:
- `/platform/identity`
- `/platform/gooey`
- `/platform/wallet`
- `/platform/galaxy-nodes`

Ecosystem:
- `/ecosystem/community`
- `/ecosystem/partnerships`

Other product / account / marketing:
- `/waitlist`
- `/startups`
- `/account`
- `/livestreams`
- `/podcast`
- `/rss`

Developers:
- `/developers/agents`
- `/developers/open-models`
- `/developers/apps`
- `/developers/forum`
- `/developers/accessibility`

## Navigation Architecture

### Primary Nav

#### Product

Main:
- Pods
- Blurbs
- Spine
- Vortex
- Orb

Identity:
- Passport
- V1llains
- Realms

Get started:
- Waitlist

#### Company

- About us
- Stories
- Company
- News
- Career

Current route mapping:
- `Company` points to `/charter`

#### Business

Main:
- Overview
- Pricing
- Customer Stories
- Resources
- Contact Sales

Side menu: Products
- Jokuh Business
- Jokuh Enterprise
- API Platform

Side menu: Solutions
- Coding
- Agents

Current route mapping:
- `Overview` → `/chatgpt/business`
- `Jokuh Business` → `/chatgpt/business`
- `Jokuh Enterprise` → `/chatgpt/enterprise`
- `API Platform` → `/developers/sdk`
- `Coding` → `/developers/sdk`
- `Agents` → `/developers/agents`

#### Developers

Explore Developers:
- Jokuh SDK
- Agents of Chaos

Resources:
- Pods API
- Cookbooks
- Community
- Docs

### Footer Nav

Product:
- Pods
- Blurbs
- Spine
- Vortex
- Orb
- Realms

Company:
- About us
- Stories
- Company
- News
- Career

Business:
- Overview
- Pricing
- Customer Stories
- Resources
- Contact Sales
- Jokuh Business
- Jokuh Enterprise
- API Platform
- Coding
- Agents

More:
- News
- Stories
- RSS

Safety:
- Safety Approach
- Security & Privacy
- Trust & Transparency

Terms & Policies:
- Terms of Use
- Privacy Policy
- Other Policies

### Sitemap-Only Nav Branches

Platform:
- Identity
- Gooey
- Wallet
- Galaxy Nodes

Ecosystem:
- V1llains
- Community
- Partnerships

ChatGPT:
- Explore ChatGPT
- Business
- Enterprise
- Education
- Pricing
- Download

## Structural Notes

- `rigid-sitemap.ts` is the nav source for top nav, footer, search, and `/sitemap`.
- `src/App.tsx` is the actual route source of truth.
- Some nav labels intentionally point to placeholders or temporary resource pages.
- `Company` in nav is not a dedicated `/company` route right now; it is mapped to `/charter`.
- `Resources` in the `Business` menu points into developer docs.
- Several marketing branches exist in nav or sitemap even though their destination pages are still stub-backed.
