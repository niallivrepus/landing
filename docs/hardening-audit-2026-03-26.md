# Hardening Audit

Date: 2026-03-26

This document captures a stricter multi-agent hardening audit of the Jokuh landing repo. The focus here is not feature expansion. It is delivery safety, product-surface integrity, maintainability, and streamlining.

## Executive Summary

The repo is in a better structural place than it was earlier:

- navigation is more centralized
- metadata coverage improved
- search is more resilient
- some heavy routes were already split more intelligently

The next phase should be discipline, not expansion.

The main risks are now:

- the repo does not yet have a trustworthy validation contract
- the production build contract is still easy to misuse
- polished discovery surfaces still imply more product maturity than actually exists
- search still overpromises scope and intelligence
- several page-level exceptions and oversized files are undermining streamlining work

## What Improved

### Structural direction

- Shared page chrome, layout shells, and route families are more coherent than before.
- Navigation, footer, sitemap, and search are increasingly driven from shared data.
- The site feels more like one system than a collection of disconnected pages.

### Hardening already in motion

- Route-level scroll behavior is more predictable.
- Search now has better fallback behavior instead of simply failing.
- Metadata coverage is materially better than it was in the earlier audit.
- Some expensive surfaces are now lazy-loaded instead of always paying the cost upfront.

## Priority Findings

### P1: The repo still lacks a real quality gate

There are no dedicated `typecheck`, `lint`, or `test` scripts in `package.json`, and the only GitHub workflow is the Medium sync workflow.

Relevant files:

- `package.json`
- `.github/workflows/medium-feed-sync.yml`

Observed verification results:

- `npm run build:landing` passed
- `npx tsc --noEmit` failed

Current local typecheck failures include:

- repo-local issues in `src/components/product/ProductCloserLookExplorer.tsx`
- repo-local issues in `src/components/SiteSearchFullscreenOverlay.tsx`
- a larger set of failures inside the sibling `../gooey` dependency

Impact:

- The repo can look healthy while shipping regressions.
- Strict TypeScript no longer acts as a dependable signal.
- There is no automated contract stopping drift.

Recommendation:

- Add `typecheck`, `lint`, and at least one smoke-level verification script.
- Add a CI workflow that runs those checks on every change.
- Treat “clean typecheck” as a hardening milestone, not a nice-to-have.

### P1: The production build contract is still a deployment footgun

The repo still has an ambiguous production story. The default `build` script does not clearly represent the intended shipping surface, and runtime entry selection still depends on `VITE_SITE_ENTRY`.

Relevant files:

- `package.json`
- `src/main.tsx`
- `src/bootstrap-prod.tsx`
- `README.md`

Impact:

- It is still too easy to ship the wrong product.
- Documentation and runtime behavior do not fully agree.

Recommendation:

- If the landing site is the real product, make that the default production build.
- Rename the mask-only path so it cannot be confused with the main deployment target.
- Update docs so the runtime/build contract has one clear answer.

### P1: Type coverage does not include the runtime-critical Node/Vite layer

`tsconfig.json` currently includes only `src`, which means important runtime files are outside the typechecked surface.

Relevant files:

- `tsconfig.json`
- `vite.config.ts`
- `site-search-middleware.ts`
- `contact-sales-middleware.ts`

Impact:

- Runtime behavior can drift without TypeScript catching it.
- The repo appears stricter than it actually is.

Recommendation:

- Add a Node/Vite TypeScript config or expand the existing contract to cover runtime files.
- Keep browser app types and runtime types both green.

### P1: Search still overpromises what it really is

The search UI presents itself as a broad, intelligent assistant, but the actual corpus and conversation behavior are much narrower.

Observed issues:

- the UI says it searches products, newsroom, stories, company information, and developer resources
- the actual corpus is mostly news, products, and a small curated list
- “Ask a follow-up” is not true conversational memory because each request only sends the latest query and local context
- the backend still exists as Vite middleware rather than a production-backed runtime

Relevant files:

- `src/components/SiteSearchFullscreenOverlay.tsx`
- `src/lib/site-search-articles.ts`
- `site-search-middleware.ts`

Impact:

- The interface implies more intelligence and coverage than the implementation provides.
- This creates trust debt.

Recommendation:

- Reduce the UI contract to match current reality, or fully finish the missing parts:
- real corpus coverage
- real follow-up memory
- real production runtime
- grounded, citation-friendly retrieval behavior

### P1: Primary discovery still exposes too many unfinished surfaces

The repo has better surface filtering than before, but first-class discovery still points at routes that are stubbed or obviously unfinished.

Examples:

- waitlist
- research
- ethics
- SDK/API
- forum
- accessibility
- brand guidelines
- several docs surfaces

Relevant files:

- `src/data/rigid-sitemap.ts`
- `src/App.tsx`
- `src/pages/StubPage.tsx`
- `src/pages/docs/DocsQuickstartPage.tsx`
- `src/pages/docs/DocsOverviewPage.tsx`
- `src/pages/docs/DocsCookbookPage.tsx`
- `src/pages/DownloadPage.tsx`

Impact:

- The site feels more mature than the actual product surface.
- Placeholder content behind polished UI is more damaging than clearly hidden routes.

Recommendation:

- Remove unfinished routes from primary discovery until they are real.
- Stop docs, search, and download pages from linking into placeholders.
- Prefer fewer strong surfaces over a broad but misleading information architecture.

## P2 Findings

### Theme handling is still not systemized enough

Some pages still mutate root theme classes and body background directly instead of working through a shared page-theme abstraction.

Relevant files:

- `src/pages/SupportPage.tsx`
- `src/pages/ContactSalesPage.tsx`
- `src/bootstrap-dev.tsx`

Impact:

- One-off theme behavior will keep multiplying.
- This makes the shared system less trustworthy.

Recommendation:

- Create a sanctioned page-theme override pattern.
- Remove imperative theme mutations from individual pages.

### Large route files are still carrying too much responsibility

Several files still combine rendering, interaction, data shaping, animation, and route logic in one place.

Most likely candidates:

- `src/pages/ContactSalesPage.tsx`
- `src/components/SiteSearchFullscreenOverlay.tsx`
- `src/components/SiteTopBar.tsx`
- `src/pages/NewsPage.tsx`
- `src/components/VortexMindMap.tsx`

Impact:

- These files are harder to reason about and easier to regress.
- Streamlining gets slower because every change touches too much logic at once.

Recommendation:

- Break these into smaller feature-focused components and selectors.
- Move repeated data shaping into shared helpers.

### Bundle hardening is incomplete

The build is healthier than before, but still heavy in important areas.

Observed during `build:landing`:

- `bootstrap-dev` remains over 500 kB
- `ContactSalesPage` remains a large route chunk
- Vite warns about `eval` inside `lottie-web`

Relevant files:

- `src/pages/ContactSalesPage.tsx`
- `package.json`

Impact:

- Streamlining work is real, but not finished.
- The main bundle and a few routes still carry more weight than they should.

Recommendation:

- Reevaluate the contact page dependency stack first.
- Consider replacing or isolating Lottie where it is not essential.
- Continue shrinking route-level responsibilities before adding more interactivity.

### Content is still too code-bound

Large editorial and product content lives directly in TypeScript modules.

Relevant files:

- `src/data/news.ts`
- `src/data/stories-detail.ts`
- `src/data/privacy-docs.ts`
- `src/data/product-detail-blueprints.ts`

Impact:

- Content changes remain coupled to code deploys and bundle shape.
- Search and content indexing require extra manual transforms.

Recommendation:

- Move toward a build-time content pipeline or at least a clearer content/data normalization layer.

## P3 Findings

### Navigation/search/footer projection still has duplication

The repo has one better data source, but multiple surfaces still re-project it independently.

Relevant files:

- `src/components/SiteTopBar.tsx`
- `src/components/SiteSearchFullscreenOverlay.tsx`
- `src/components/MegaFooter.tsx`

Impact:

- This is not the worst issue today, but it is a future drift risk.

Recommendation:

- Centralize sitemap-to-surface selectors so all shells consume the same projection logic.

### Metadata is better, but still shallow

The repo improved page titles, but metadata still mostly stops at `document.title`.

Relevant files:

- `src/hooks/useDocumentTitle.ts`
- `index.html`

Impact:

- The site still lacks a full metadata contract for descriptions, canonical links, and social sharing.

Recommendation:

- Add a route-family metadata helper instead of leaving metadata at title-only coverage.

## Recommended Order Of Work

1. Make the repo verifiable.
   - add `typecheck`, `lint`, and smoke checks
   - add CI
   - fix the current repo-local TypeScript failures

2. Make the production target unambiguous.
   - make the real landing build the default if that is the product
   - rename or isolate the mask-only build
   - align README, scripts, and runtime behavior

3. Clean up the boundary with `../gooey`.
   - decide whether it is part of this repo’s validation contract
   - either isolate it cleanly or fix it as part of the shared engineering baseline

4. Reduce overpromising surfaces.
   - remove or demote unfinished routes from discovery
   - tighten the search contract to what actually exists
   - stop polished placeholder pages from posing as finished product areas

5. Centralize the remaining exceptions.
   - shared page-theme handling
   - shared nav/search/footer selectors
   - shared route metadata helpers

6. Streamline the heaviest files and routes.
   - start with contact, search, docs, support, and Vortex-related surfaces

## Verification Notes

Commands run during this audit:

- `git status --short` -> clean
- `npm run build:landing` -> passed
- `npx tsc --noEmit` -> failed

Important current verification notes:

- `build:landing` still shows chunk-size warnings
- the build warns about `eval` in `lottie-web`
- `tsc` fails in both this repo and the sibling `../gooey` package

## Bottom Line

The codebase is no longer suffering from pure structural chaos. That is real progress.

The current risk is different: the repo now presents itself like a mature system, but the engineering contract, production contract, and surface maturity are not yet equally mature.

The right next move is to harden and simplify what already exists before adding more feature surface.
