# Jokuh Landing — Complete Sitemap

> Every route in the app, organized by section. ~128 unique addressable routes.

---

## 1. Home & Top-Level Pages

| URL | Component | Description |
|-----|-----------|-------------|
| `/` | `Home` | Main landing — hero, news, stories, identity wheel, waitlist CTA |
| `/download` | `DownloadPage` | Desktop & mobile download with QR codes, platform badges, FAQ |
| `/sitemap` | `SitemapPage` | Full HTML sitemap generated from rigid-sitemap data |
| `/brand` | `BrandPage` | Brand guidelines — logo, Gooey identity, colors, typography, tokens, OO mascot |
| `/charter` | `CharterPage` | Company charter — 9 founding principles |
| `/ethics` | `EthicsPage` | Ethics & compliance — operational controls, human review, privacy |
| `/about` | `AboutPage` | Company about — what Jokuh builds, how they work, quick links |
| `/careers` | `CareersPage` | Careers — values, principles, benefits, open roles, FAQ |
| `/contact` | `ContactSalesPage` | Enterprise contact form — interest, company size, needs |
| `/support` | `SupportPage` | Support hub — docs, sales, billing, products, status links |
| `/system-status` | `SystemStatusPage` | Redirects to `status.jokuh.com` or placeholder |
| `/pricing` | `ResourceDetailPage` | Pricing overview (editorial article template) |

---

## 2. Product Pages

Dynamic — driven by `src/data/products.ts` + `src/data/product-detail-blueprints.ts`.

| URL | productId | Product | Description |
|-----|-----------|---------|-------------|
| `/pods` | `pods` | Pods | Composable identity profile surfaces |
| `/blurbs` | `blurbs` | Blurbs | Conversation → clean copy/drafts |
| `/spine` | `spine` | Spine | Timeline view — time as navigable bubbles |
| `/vortex` | `vortex` | Vortex | Converged question layer across messengers/wallets/calendars |
| `/passport` | `passport` | Passport | Identity passport system |
| `/realms` | `realms` | Realms | Multi-realm identity spaces |
| `/orb` | `orb` | Orb | Identity orb system |
| `/ecosystem/v1llains` | `v1llains` | V1llains | Experimental agent ecosystem (honeycomb hero) |

---

## 3. Resource Detail Pages

Static data — driven by `src/data/resource-detail-pages.ts`. Each renders an editorial article template.

| URL | resourceId | Description |
|-----|------------|-------------|
| `/safety/approach` | `safety-approach` | Safety approach overview |
| `/safety/security-privacy` | `security-privacy` | Security & privacy practices |
| `/safety/trust-transparency` | `trust-transparency` | Trust & transparency principles |
| `/chatgpt/explore` | `explore-chatgpt` | Explore the Jokuh product |
| `/chatgpt/business` | `business` | Jokuh Business offering |
| `/chatgpt/enterprise` | `enterprise` | Jokuh Enterprise offering |
| `/chatgpt/education` | `education` | Jokuh for Education |
| `/pricing` | `pricing` | Pricing information |

---

## 4. Newsroom

Dynamic — driven by `src/data/news.ts` + `src/data/news-detail.ts`.

| URL | Component | Type |
|-----|-----------|------|
| `/newsroom` | `NewsPage` | Archive with category tabs, topic/year filters, sort, grid/list view |
| `/newsroom/:slug` | `NewsDetailPage` | Article detail — supports "brief" and "feature" kinds |

### Known article slugs

| Slug | Kind |
|------|------|
| `/newsroom/introducing-jokuh-cortex` | Feature (benchmarks, charts, testimonials) |
| `/newsroom/jokuh-spine-tighter-sync` | Brief |
| `/newsroom/waitlist-regional-rollout-next-quarter` | Brief |
| `/newsroom/gooey-accessible-focus-rings-motion-prefs` | Brief |
| `/newsroom/responsible-use-guidelines-v1llains-lab` | Brief |
| `/newsroom/blurbs-composer-markdown-tables-paste-cleanup` | Brief |
| `/newsroom/open-office-hours-identity-claim-flow` | Brief |
| `/newsroom/hiring-design-systems-realtime-infra` | Brief |
| `/newsroom/pod-encryption-at-rest-what-changed` | Brief |

Additional items from Medium RSS (`medium-feed.json`) link externally.

---

## 5. Stories

Dynamic — driven by `src/data/home-stories.ts` + `src/data/stories-detail.ts`.

| URL | Component | Type |
|-----|-----------|------|
| `/stories` | `StoriesPage` | Archive grid |
| `/stories/:slug` | `StoryDetailPage` | Detail — gallery, prose, images, triptych, quotes, CTAs |

### Known story slugs

- `/stories/treasury-inference-api-grid`
- `/stories/live-transcript-hooks-spine`
- `/stories/gooey-island-merge-hygiene`
- `/stories/salvage-yard-nevada`
- `/stories/seed-farm-south-carolina`
- `/stories/tamale-shop-california`

---

## 6. Legal Pages

| URL | Component | Description |
|-----|-----------|-------------|
| `/legal` | `LegalHomePage` | Legal hub — links to privacy, terms, internet services, ethics |
| `/legal/terms` | `LegalTermsPage` | Website terms with TOC sidebar (data: `terms-sections.ts`) |
| `/legal/privacy` | `LegalPrivacyPage` | Privacy hub — topic card grid |
| `/legal/internet-services` | `LegalInternetServicesPage` | Internet services policies |
| `/legal/privacy/:docKey` | `LegalPrivacySelectPage` | Privacy doc topic + region + language selector |
| `/legal/privacy/:docKey/read/:locale` | `LegalPrivacyDocumentPage` | Full privacy document with TOC |
| `/privacy` | `LegalPrivacyPage` | Alias for `/legal/privacy` |
| `/terms` | `LegalTermsPage` | Alias for `/legal/terms` |

### Privacy doc keys

`customer` · `data-products` · `governance` · `gov-requests`

### Privacy locales (12)

`en-ww` · `de-de` · `es-es` · `fr-fr` · `it-it` · `ja-jp` · `ko-kr` · `pt-br` · `zh-cn` · `zh-tw` · `ar-sa` · `nl-nl`

**→ 4 keys × 12 locales = 48 unique privacy document URLs + 4 selector pages = 52 total**

---

## 7. Developer Pages

| URL | Component | Description |
|-----|-----------|-------------|
| `/developers/sdk` | `DeveloperSdkPage` | SDK & API hub — install snippets, capabilities, pillars |
| `/developers/learn` | `DeveloperLearnPage` | Learn hub — developer routes grid, FAQ |
| `/developers/blog` | `DeveloperBlogPage` | Blog archive — featured/compact cards (6+ entries) |
| `/developers/docs` | `DocsOverviewPage` | Docs overview (Agent Portal) — model cards, quickstart |
| `/developers/docs/models` | `DocsModelsPage` | All models — searchable/filterable table |
| `/developers/docs/quickstart` | `DocsQuickstartPage` | Quickstart — API key, SDK install, first request |
| `/developers/docs/cookbook` | `DocsCookbookPage` | Cookbook — recipe index with pattern cards |

---

## 8. Stub Pages (Placeholders)

| URL | Title |
|-----|-------|
| `/platform/identity` | Identity |
| `/platform/gooey` | Gooey |
| `/platform/wallet` | Wallet |
| `/platform/galaxy-nodes` | Galaxy Nodes |
| `/ecosystem/community` | Community |
| `/ecosystem/partnerships` | Partnerships |
| `/waitlist` | Waitlist |
| `/developers/agents` | Agents of Chaos |
| `/developers/open-models` | Open models |
| `/developers/apps` | Apps platform |
| `/developers/forum` | Developer forum |
| `/developers/accessibility` | Accessibility |
| `/startups` | Jokuh for startups |
| `/account` | Account |
| `/livestreams` | Livestreams |
| `/podcast` | Podcast |
| `/rss` | RSS |

---

## 9. Redirects

| From | To |
|------|----|
| `/journal` | `/newsroom` |
| `/journal/:slug` | `/newsroom/:slug` |
| `/news` | `/newsroom` |
| `/news/:slug` | `/newsroom/:slug` |
| `/prompt` | `/#prompt` |
| `/research` | `/about` |
| `/brand-guidelines` | `/brand` |
| `/developers/documentation` | `/developers/docs` |

---

## 10. Hash / Anchor Sections

### Homepage (`/`)
`#prompt` · `#start` · `#pods` · `#vortex` · (any `#<productId>`)

### Brand (`/brand`)
`#logo` · `#gooey` · `#colors` · `#typography` · `#token-avatars` · `#oo` · `#best-practices`

### Careers (`/careers`)
`#open-roles`

### Sitemap (`/sitemap`)
`#sitemap-top`

### Privacy documents
TOC anchors generated per-section (e.g. `#us-state-disclosures`, `#canada-messages`)

---

## 11. External / Subdomain Destinations

Configured via env vars in `src/config/site-subdomains.ts`:

| Env Var | Subdomain | Purpose |
|---------|-----------|---------|
| `VITE_ORIGIN_DEVELOPERS` | `developers.jokuh.com` | Developer portal |
| `VITE_ORIGIN_STATUS` | `status.jokuh.com` | Status portal |
| `VITE_ORIGIN_HELP` | `help.jokuh.com` | Help center |

---

## Route Count Summary

| Category | Count |
|----------|-------|
| Static top-level pages | 12 |
| Product pages | 8 |
| Resource detail pages | 8 |
| Newsroom (index + 9 detail) | 10 |
| Stories (index + 6 detail) | 7 |
| Legal pages (static) | 6 |
| Legal privacy dynamic (4 keys × 12 locales + 4 selectors) | 52 |
| Developer pages | 7 |
| Stub pages | 16 |
| Redirects | 8 |
| **Total unique addressable routes** | **~128** |
