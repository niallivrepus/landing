# Jokuh Route Audit — 2026-03-29

Scope: full route inventory from [src/App.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/App.tsx), plus missing page backlog implied by current IA, docs, sitemap, and legal parity files.

## Classification rubric

- `real`: implemented route with a real page shell and intentional site presence
- `stub`: route renders [StubPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StubPage.tsx) / `SimpleMarketingPageTemplate` placeholder
- `hidden`: valid route, but not a primary IA destination; used for aliases, redirects, slug detail pages, locale/document branches, or internal utility paths
- `missing`: not currently routed in `App.tsx`, but clearly implied by the current site architecture or parity files

## Executive read

- App health: route targets are currently resolvable. No missing lazy-import page targets remain in `App.tsx`.
- Main problem: exposed stubs. The biggest gaps are platform, developer tooling, and ecosystem support pages.
- Secondary problem: several `real` pages are structurally fine but still carry temporary editorial filler and need real copy.
- IA issue: `App.tsx` contains a dead duplicate stub declaration for `/developers/sdk`, while the real route is registered later as [DeveloperSdkPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/DeveloperSdkPage.tsx). Remove the duplicate from `STUB_ROUTES`.

## Route inventory from `App.tsx`

### Real routes

| Route | Notes |
| --- | --- |
| `/` | Real marketing homepage |
| `/download` | Real conversion page |
| `/sitemap` | Real sitemap page |
| `/legal` | Canonical legal hub |
| `/legal/internet-services` | Canonical legal subpage |
| `/legal/terms` | Canonical terms page |
| `/legal/privacy` | Canonical privacy hub |
| `/newsroom` | Real newsroom index |
| `/stories` | Real stories index |
| `/safety/approach` | Real route, but copy is temporary filler in [resource-detail-pages.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/resource-detail-pages.ts) |
| `/safety/security-privacy` | Real route, but copy is temporary filler |
| `/safety/trust-transparency` | Real route, but copy is temporary filler |
| `/chatgpt/explore` | Real route, but copy is temporary filler |
| `/chatgpt/business` | Real route, but copy is temporary filler |
| `/chatgpt/enterprise` | Real route, but copy is temporary filler |
| `/chatgpt/education` | Real route, but copy is temporary filler |
| `/pricing` | Real route, but copy is temporary filler |
| `/pods` | Real product page |
| `/blurbs` | Real product page |
| `/spine` | Real product page |
| `/vortex` | Real product page |
| `/passport` | Real product page |
| `/realms` | Real product page |
| `/orb` | Real product page |
| `/ecosystem/v1llains` | Real product/ecosystem page |
| `/contact` | Real contact sales page |
| `/support` | Real support page |
| `/system-status` | Real status page, but still thin relative to status parity intent |
| `/ethics` | Real trust page |
| `/developers/sdk` | Real developer page; duplicate dead stub entry exists in `STUB_ROUTES` |
| `/developers/learn` | Real developer page |
| `/developers/blog` | Real developer page |
| `/brand` | Real brand page |
| `/about` | Real company page |
| `/charter` | Real company page |
| `/careers` | Real careers page |
| `/developers/docs` | Real docs hub shell |
| `/developers/docs/models` | Real docs page |
| `/developers/docs/quickstart` | Real docs page |
| `/developers/docs/cookbook` | Real docs page |

### Stub routes

These are the routes currently rendering [StubPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StubPage.tsx).

| Route | Why it matters |
| --- | --- |
| `/platform/identity` | Core platform story is implied in sitemap, but page is not built |
| `/platform/gooey` | Core platform/tooling page is exposed in sitemap, still a stub |
| `/platform/wallet` | Platform capability exposed, not represented |
| `/platform/galaxy-nodes` | Platform capability exposed, not represented |
| `/ecosystem/community` | Ecosystem cluster exists, but community destination is empty |
| `/ecosystem/partnerships` | Ecosystem partnership story is missing |
| `/waitlist` | Conversion route exists, but destination is still a stub |
| `/developers/agents` | High-value tooling page exposed across IA, still a stub |
| `/developers/open-models` | Implied model-platform story, still a stub |
| `/developers/apps` | Docs already link here; currently a stub |
| `/developers/forum` | Docs + sitemap point here; currently a stub |
| `/developers/accessibility` | Developer trust/documentation support route, still a stub |
| `/startups` | Business/program route exists, but no real page |
| `/account` | Support page points here; currently a stub |
| `/livestreams` | Media route exists, but no real page |
| `/podcast` | Media route exists, but no real page |
| `/rss` | Linked in sitemap/footer; currently a stub |

### Hidden routes

| Route | Hidden reason |
| --- | --- |
| `/privacy` | Compatibility alias; canonical route is `/legal/privacy` |
| `/terms` | Compatibility alias; canonical route is `/legal/terms` |
| `/legal/privacy/:docKey` | Document branch page, not a primary IA destination |
| `/legal/privacy/:docKey/read/:locale` | Deep locale/document reader route |
| `/newsroom/:slug` | Detail page reached from newsroom cards |
| `/journal` | Legacy alias redirect to `/newsroom` |
| `/journal/:slug` | Legacy detail alias redirect |
| `/news` | Legacy alias redirect to `/newsroom` |
| `/news/:slug` | Legacy detail alias redirect |
| `/stories/:slug` | Detail page reached from stories index |
| `/prompt` | Anchor redirect utility route |
| `/research` | Legacy redirect to `/about` |
| `/brand-guidelines` | Alias redirect to `/brand` |
| `/developers/documentation` | Alias redirect to `/developers/docs` |

### Missing routes in `App.tsx`

There are no currently broken route targets in [src/App.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/App.tsx). The missing work is not broken imports; it is missing page coverage.

## Exact page backlog in priority order

### P0 — convert exposed stubs that already have IA pressure

These are the most urgent because the site already points users to them in sitemap, docs, search, footer, or product framing.

1. `/platform/gooey`
   - Reason: Gooey is a real dependency and branding surface already used by the site.
   - Needed page shape: platform overview, components/tokens/icons, motion system, how Gooey powers Jokuh surfaces.

2. `/developers/agents`
   - Reason: linked in [rigid-sitemap.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/rigid-sitemap.ts) across business + developers surfaces.
   - Needed page shape: agent runtime, tools, MCP, orchestration, examples, CTA into docs/SDK.

3. `/developers/apps`
   - Reason: directly linked from [DocsOverviewPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsOverviewPage.tsx) and [DocsCookbookPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsCookbookPage.tsx).
   - Needed page shape: apps platform, extension model, auth/data/tooling, deployment path.

4. `/developers/forum`
   - Reason: linked from docs nav, learn page, blog data, and sitemap.
   - Needed page shape: community hub, discussion categories, office hours/events, contribution norms.

5. `/waitlist`
   - Reason: used as a CTA target in topbar, docs app frame, product pages, and hero flows.
   - Needed page shape: actual conversion page, product access framing, minimal form CTA, qualification copy.

6. `/platform/identity`
   - Reason: identity is structurally core to Passport / Realms / V1llains.
   - Needed page shape: account graph, portable identity, permissions, trust/privacy framing.

### P1 — convert the rest of the exposed platform and ecosystem stubs

7. `/platform/wallet`
8. `/platform/galaxy-nodes`
9. `/ecosystem/community`
10. `/ecosystem/partnerships`
11. `/developers/open-models`
12. `/developers/accessibility`
13. `/startups`
14. `/account`
15. `/rss`

Notes:
- `/account` matters because [SupportPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/SupportPage.tsx) already sends people there.
- `/rss` matters because it is exposed in sitemap/footer. If no real RSS feed exists yet, remove it from IA until it does.

### P2 — add missing pages that the current architecture clearly implies

These are not currently routed, but the repo itself says they should exist.

1. `/platform`
   - Reason: platform cluster exists, but has no overview landing page.

2. `/ecosystem`
   - Reason: ecosystem cluster exists, but no parent overview page ties V1llains, community, and partnerships together.

3. `/developers`
   - Reason: docs exist, but there is no first-class developer hub landing page that unifies docs, SDK, agents, apps, blog, learn, and forum.

4. `/system-status/history`
   - Reason: [ecosystem-framework.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/ecosystem-framework.ts) explicitly references status parity with incident history.

5. `/legal/warranty`
6. `/legal/sla`
7. `/legal/sales-support`
8. `/legal/intellectual-property`
9. `/legal/more-resources`
   - Reason: the same parity file explicitly names these Apple-style legal branches.

### P3 — real routes that need copy overhaul, not new routing

These pages exist, but another agent should treat them as copy-critical because they still read like temporary scaffolding.

1. `/safety/approach`
2. `/safety/security-privacy`
3. `/safety/trust-transparency`
4. `/chatgpt/explore`
5. `/chatgpt/business`
6. `/chatgpt/enterprise`
7. `/chatgpt/education`
8. `/pricing`

Source note:
- [resource-detail-pages.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/resource-detail-pages.ts) explicitly labels these as temporary filler / editorial placeholders.

## Recommended route policy

- Keep aliases hidden:
  - `/privacy` → keep as compatibility alias only
  - `/terms` → keep as compatibility alias only
  - `/journal*`, `/news*`, `/research`, `/brand-guidelines`, `/developers/documentation` → keep hidden redirects unless a branding reason appears

- Remove or convert exposed stubs:
  - if a route appears in sitemap, docs nav, footer, support, or product CTA flows, it should not remain a stub

- Prefer parent overview pages for clusters:
  - add `/platform`
  - add `/ecosystem`
  - add `/developers`

- Keep legal canonical:
  - all user-facing legal links should continue pointing to `/legal/*`

## Copy-agent handoff

If a follow-up copy agent is taking this file, the recommended order is:

1. Write real page briefs for `/platform/gooey`, `/developers/agents`, `/developers/apps`, `/developers/forum`, `/waitlist`
2. Replace temporary filler on the safety and chatgpt/business cluster
3. Draft parent overview pages for `/platform`, `/ecosystem`, `/developers`
4. Draft enterprise legal extensions for `/legal/sla`, `/legal/sales-support`, `/legal/intellectual-property`

## Immediate implementation cleanup

1. Remove the dead `/developers/sdk` entry from `STUB_ROUTES` in [src/App.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/App.tsx)
2. Decide whether `/rss` should become a real feed page or disappear from IA
3. Decide whether `/account` should become a real account-help page or be removed from support links until the product route exists
