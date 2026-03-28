# Responsive Template Audit

Date: 2026-03-26

This document captures a multi-agent audit focused on responsive template scalability, breakpoint behavior, and the cleanliness of shared component architecture across the Jokuh landing repo.

## Executive Summary

The repo has a solid base shell and a coherent visual system, but the responsive contract is still too weak above the shell layer.

The main issue is not that pages are unresponsive. The issue is that responsiveness is still being solved too locally:

- shells are too primitive
- page-family templates are still too thin
- shared chrome uses coarse breakpoint jumps
- several route files still hand-author layout behavior instead of inheriting it

The result is a codebase that can look polished page by page, but is not yet rigid enough to scale cleanly as more surfaces are added.

## What Is Strong

### Shared shell foundation

- `MarketingPageFrame` provides a strong global wrapper for top bar, footer, and main content.
- The repo already uses shared shell primitives in `src/components/system/shells.ts`.
- The architecture docs clearly describe the intended page-tier system and already identify the missing template layer.

### Responsive intent is present

- Many pages do use Tailwind breakpoint ramps consistently.
- Width caps and spacing are not completely random.
- Shared chrome is already unified enough that a stronger responsive contract can be introduced without redesigning the site from scratch.

## Priority Findings

### P1: The shared shell layer is too thin

The current shell system only gives the site a small set of width and spacing primitives, which forces route files and complex shared components to invent their own breakpoint behavior.

Relevant file:

- `src/components/system/shells.ts`

Impact:

- Responsive behavior is not rigid enough across page families.
- Pages can drift while still technically “using the system.”

Recommendation:

- Expand shell primitives into a stronger responsive layout contract:
- content widths by page family
- section spacing scales
- top padding scales
- tablet-specific layout tokens

### P1: The frame is strong, but the template layer above it is missing

`MarketingPageFrame` handles global chrome well, but it does not enforce responsive density or layout behavior at the page-family level.

Relevant files:

- `src/components/system/MarketingPageFrame.tsx`
- `docs/site-tier-architecture.md`
- `docs/site-layer-architecture.md`

Impact:

- Route files still solve their own breakpoint behavior.
- The repo jumps from generic shell to bespoke page implementation too often.

Recommendation:

- Add explicit responsive page-family templates:
- landing template
- narrative/detail template
- docs workspace template
- legal/reference template
- utility/simple template

### P1: The top navigation is not scalable on tablet widths

The top bar switches to its desktop system too early at `md`, while still depending on hidden horizontal overflow and a rigid three-zone layout.

Relevant file:

- `src/components/SiteTopBar.tsx`

Observed issues:

- desktop nav appears at `md`
- nav labels can overflow into hidden scroll regions
- centered logo and right-side actions continue consuming fixed space
- mega menu jumps quickly into desktop-style column layouts

Impact:

- Tablet behavior is brittle rather than intentionally designed.

Recommendation:

- Add a real tablet nav mode instead of a binary mobile/desktop split.
- Delay full desktop layout until a wider breakpoint.
- Give the mega menu an intermediate tablet layout.

### P1: The footer uses the same coarse breakpoint model

The footer remains accordion-only until `lg`, then jumps directly to a five-column desktop grid.

Relevant file:

- `src/components/MegaFooter.tsx`

Impact:

- There is no clean tablet state.
- The shared chrome feels abrupt instead of progressively responsive.

Recommendation:

- Introduce a middle layout between accordion and five-column desktop:
- 2-column or 3-column tablet grid
- cleaner footer bottom-rail behavior

### P1: The docs layout is binary instead of scalable

The docs experience switches from wrapped pills on mobile to a fixed sidebar at `md`, with no progressive navigation behavior between those states.

Relevant file:

- `src/pages/docs/DocsLayout.tsx`

Impact:

- Hierarchy is weak on small screens.
- Tablet orientation feels abrupt.
- The docs template will become harder to scale as documentation grows.

Recommendation:

- Add a more progressive docs navigation model:
- mobile pills or collapsible nav
- tablet sticky compact nav
- desktop sidebar

## P2 Findings

### Shared high-complexity components still define their own responsive systems

Several important shared components independently define width caps, spacing ramps, and breakpoint behavior.

Relevant files:

- `src/components/SiteSearchFullscreenOverlay.tsx`
- `src/components/MegaFooter.tsx`
- `src/components/system/templates/EditorialArticleTemplate.tsx`

Impact:

- Responsive cleanup becomes expensive.
- Shared behavior is harder to standardize later.

Recommendation:

- Move more responsive behavior into template and shell primitives.
- Reduce one-off width/spacing logic inside shared components.

### Some route sections still depend on bespoke fixed measurements

There are several places where responsiveness is tuned by hand through specific width caps, scale values, and fixed geometry.

Examples:

- `src/components/landing/LandingHero.tsx`
- `src/components/landing/IdentityBlock.tsx`
- `src/pages/ContactSalesPage.tsx`

Impact:

- These pages may still look good, but they are not very composable.
- Future layout changes are more likely to create breakpoint regressions.

Recommendation:

- Replace route-local sizing heuristics with shared responsive tokens where possible.
- Reserve fixed geometry for truly special art direction only.

### Route files still carry too much layout authorship

Several pages are still defining too much responsive rhythm themselves rather than using stronger templates.

Relevant files:

- `src/pages/ProductPage.tsx`
- `src/pages/SupportPage.tsx`
- `src/pages/ContactSalesPage.tsx`
- `src/pages/docs/DocsLayout.tsx`

Impact:

- The codebase is less “super clean” than it appears.
- Responsiveness is harder to audit systematically.

Recommendation:

- Route files should mostly compose sections and templates, not invent responsive layout logic.

## Structural Risks To Watch

### Binary breakpoint systems

Several important surfaces still switch directly between mobile and desktop states without a purposeful tablet mode.

Most important examples:

- top bar
- mega menu
- footer
- docs navigation

### Template drift

If new pages continue to solve spacing, width, and breakpoint behavior locally, the repo will slowly accumulate page-specific responsive systems that are expensive to unify later.

## Recommended Next Steps

1. Create explicit page-family templates above `MarketingPageFrame`.
2. Add real tablet states for shared chrome.
3. Expand shell tokens to cover width, spacing, and page density more precisely.
4. Pull responsive rules out of route files and into shared template primitives.
5. Refactor the most bespoke responsive surfaces first:
- `SiteTopBar`
- `MegaFooter`
- `DocsLayout`
- `LandingHero`
- `ContactSalesPage`

## Verification Notes

This audit used:

- parallel sub-agent review
- local code inspection
- local repo verification

Additional note:

- A live Playwright browser pass was attempted, but the session was blocked by a Chrome process conflict, so route-level hotspot findings were completed through code inspection rather than screenshot-based visual QA.

## Bottom Line

The repo is responsive enough to ship, but it is not yet rigid enough to scale cleanly.

The right next move is not visual redesign. It is strengthening the responsive contract so new pages inherit cleanliness instead of hand-authoring it.
