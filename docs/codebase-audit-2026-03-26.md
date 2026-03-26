# Codebase Audit

Date: 2026-03-26

This document captures a point-in-time audit of the Jokuh landing codebase, focused on architecture, delivery risk, code health, and product completeness.

## Executive Summary

The codebase has a strong structural foundation:

- clear page families
- thoughtful shared layout primitives
- centralized navigation data
- solid design-system intent
- good architecture documentation for a marketing repo

The biggest weaknesses are not visual polish. They are operational:

- production behavior is easy to mis-deploy
- type safety is not currently trustworthy end-to-end
- search is not production-backed
- the information architecture exposes too many unfinished surfaces
- some page-level patterns are drifting away from the shared system

## What Is Strong

### Architecture and organization

- Shared chrome and layout composition are centralized through `MarketingPageFrame` and related system components.
- Navigation and sitemap structure are driven from a single source in `src/data/rigid-sitemap.ts`.
- Product, story, legal, and news content are split into data modules instead of being fully embedded in page components.
- The repo includes substantial architecture notes in `docs/`, which is unusually helpful and gives the codebase a coherent direction.

### Product structure

- The site is already organized into recognizable families: landing, products, stories, news, docs, legal, support, and company pages.
- The recent route-level scroll fix gives page-to-page navigation a more predictable UX baseline.

### Build health

- `npm run build` succeeds.
- `npm run build:landing` succeeds.

## Priority Findings

### P1: Site search is not production-ready

The search overlay posts to `/api/site-search`, but that endpoint currently exists only as Vite dev/preview middleware.

Relevant files:

- `src/components/SiteSearchFullscreenOverlay.tsx`
- `vite.config.ts`
- `site-search-middleware.ts`

Impact:

- Search can appear complete in local development while failing in a normal static production deployment.
- This creates a gap between the UI contract and the actual deployment model.

Recommendation:

- Move search to a real server or edge function.
- Pass grounded site content into the summarization layer instead of relying on a generic assistant prompt.
- Add explicit production fallback behavior if the endpoint is unavailable.

### P1: The production build contract is confusing and risky

By default, `npm run build` produces the mask-only experience. The full landing site requires `npm run build:landing`.

Relevant files:

- `package.json`
- `src/main.tsx`
- `src/bootstrap-prod.tsx`
- `src/ProdMaskPage.tsx`

Impact:

- A perfectly valid production build can ship the wrong product if environment expectations are misunderstood.
- This is a deployment footgun.

Recommendation:

- Make the intended production target unambiguous.
- Either rename scripts to make the split explicit, or make the full landing build the default and reserve the mask build for a clearly named special case.
- Add CI checks around the intended deployment mode.

### P1: Type safety is not green

The repo is configured as strict TypeScript, but `npx tsc --noEmit` currently fails.

Observed failure categories:

- app-local errors
- local `@jokuh/gooey` dependency errors
- missing type declarations for `three` add-ons and WebGPU modules

Relevant files:

- `tsconfig.json`
- `package.json`
- `src/components/GoogleTranslateHost.tsx`
- `src/components/LanguageSelectModal.tsx`
- `src/components/SiteTopBar.tsx`
- `src/components/VortexMindMap.tsx`

Impact:

- Strict mode no longer functions as a trustworthy guardrail.
- Refactors become riskier because failures are buried inside known-red type output.

Recommendation:

- Restore a clean typecheck baseline as a top engineering priority.
- Decide whether `@jokuh/gooey` should be typechecked as part of this app or consumed as a cleaner built artifact.
- Add missing declarations or wrappers for `three` ecosystem imports.

### P2: Search summaries are not grounded in site content

The search result list is ranked locally, but the generated summary is not derived from those ranked documents. It is generated from a generic model prompt plus the user query.

Relevant files:

- `src/components/SiteSearchFullscreenOverlay.tsx`
- `site-search-middleware.ts`

Impact:

- The summary can drift from the actual contents of the site.
- This will become more visible as the content corpus grows.

Recommendation:

- Move toward retrieval-augmented search.
- Feed the assistant explicit snippets or structured article hits so the answer stays tied to real site content.

### P2: Information architecture is overexposed relative to implementation

The navigation advertises many surfaces that are still generic stubs or placeholder pages.

Examples include:

- waitlist
- contact
- research
- account
- parts of the developer surface
- docs sections that still say “coming soon”

Relevant files:

- `src/data/rigid-sitemap.ts`
- `src/App.tsx`
- `src/pages/StubPage.tsx`
- `src/pages/docs/DocsQuickstartPage.tsx`

Impact:

- Users can reach incomplete surfaces from first-class navigation.
- This weakens trust more than simply hiding unfinished routes.

Recommendation:

- Hide incomplete routes from primary navigation until they are real.
- If placeholder pages must exist, distinguish them clearly from production-ready sections.
- Add a maturity pass across all routed pages.

### P2: Theme handling is not fully systemized

Most of the app uses a shared theme provider, but some pages still manipulate root classes and body background directly.

Relevant file:

- `src/pages/SupportPage.tsx`

Impact:

- One-off theming patterns can diverge over time.
- This increases the chance of visual regressions, cleanup leaks, and inconsistent page transitions.

Recommendation:

- Move page theme overrides into a shared abstraction.
- Avoid imperative DOM theme mutations in individual pages unless absolutely necessary.

### P3: Metadata and SEO coverage are inconsistent

Only some major pages set document titles explicitly.

Relevant files:

- `src/hooks/useDocumentTitle.ts`
- `src/pages/AboutPage.tsx`
- `src/pages/CareersPage.tsx`
- `src/pages/NewsPage.tsx`
- `src/pages/ProductPage.tsx`
- `src/pages/StoryDetailPage.tsx`
- `index.html`

Impact:

- Many pages likely fall back to generic metadata.
- This weakens discoverability and page clarity.

Recommendation:

- Add a consistent metadata strategy across route families.
- At minimum, ensure every routed page has a page-specific title.
- Prefer route-family helpers over ad hoc page-by-page setup.

## Structural Risks To Watch

### Large bespoke components

Some components are becoming major maintenance surfaces:

- `src/components/VortexMindMap.tsx`
- `src/components/SiteTopBar.tsx`
- `src/components/SiteSearchFullscreenOverlay.tsx`
- `src/pages/NewsPage.tsx`
- `src/pages/ProductPage.tsx`

These are not necessarily wrong, but they are the components most likely to benefit from further decomposition, dedicated tests, or tighter contracts.

### Bundle pressure

The full landing build currently emits large chunks, especially around:

- Three/WebGPU
- news detail
- app bootstrap

Impact:

- initial load and route-level performance may degrade as more content and interactions are added

Recommendation:

- do a focused bundle audit
- isolate heavy interactive surfaces more aggressively
- consider chunking strategy for large route families

## Recommended Next Steps

1. Fix the deployment contract so the intended production target is obvious and safe.
2. Get typecheck green and keep it green in CI.
3. Decide which incomplete routes should be hidden versus completed.
4. Replace dev-only search middleware with a real production-backed endpoint.
5. Add a metadata pass across all routed pages.
6. Do a bundle and performance review, especially for Vortex and long-form content pages.

## Verification Notes

Commands run during this audit:

- `npm run build` -> passed
- `npm run build:landing` -> passed
- `npx tsc --noEmit` -> failed

Notes:

- Typecheck failures came from both app-local files and the local `@jokuh/gooey` dependency.
- This audit was based on source review and build/type health checks, not a full manual browser QA sweep of every route.
