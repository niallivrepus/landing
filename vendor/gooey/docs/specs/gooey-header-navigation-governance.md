# Gooey Header And Navigation Governance

## Goal

Establish one governed system for:

- page headers
- overview hero / oversized headers
- left navigation
- mobile top bar and navigation sheet
- page metadata and navigation registry
- package vs app ownership

The point is simple:

- headers are not allowed to drift page by page
- navigation is not allowed to drift file by file
- metadata is not allowed to be duplicated across registries
- app composition and package primitives must have a clear boundary

## Current Problems

The current architecture is already partially extracted, but the governance layer is missing.

Observed drift:

- `apps/gooey/src/pages/shell.tsx` defines one page-header implementation
- `apps/gooey/src/page-sections/page-header.tsx` defines another header implementation
- `apps/gooey/src/pages/overview-page.tsx` defines a third, custom overview hero
- `apps/gooey/src/app-shell/GooeyHeader.tsx` defines a fourth text-header pattern
- `apps/gooey/src/navigation/gooey-sidebar-navigation.ts` builds sidebar entries from registry data
- `apps/gooey/src/fixtures/navigation.ts` defines a second navigation structure
- `apps/gooey/src/App.tsx` still contains legacy shell/page rendering and historical navigation/header logic

Result:

- light mode and dark mode behavior drift
- overview uses a custom header path instead of a governed variant
- page pages cannot share one header contract
- sidebar state, page metadata, and grouping rules are split across files
- package-level reuse is unclear, so app-only components and library candidates blur together

## Governance Rules

### Rule 1: One Header System

All top-of-page headers must be rendered through a single shared component family.

Canonical owner:

- `apps/gooey/src/page-sections/page-header.tsx`

`apps/gooey/src/pages/shell.tsx` must stop owning its own header surface logic. It may wrap layout, but it may not define another header rendering system.

`apps/gooey/src/pages/overview-page.tsx` must consume the same header family via an oversized variant, not a separate bespoke hero implementation.

`apps/gooey/src/app-shell/GooeyHeader.tsx` must either:

- be deleted, if redundant
- or become a thin adapter around the same canonical header primitives

### Rule 2: Header Variants Are Explicit

Headers must support explicit variants, not ad hoc custom markup.

Required variants:

- `oversized`
  - for overview / landing-style hero headers
- `hero`
  - for major page entries
- `section`
  - for section-level headers inside pages
- `compact`
  - for tight app-shell contexts if needed

Required header props:

- `variant`
- `title`
- `description`
- `eyebrow`
- `actions`
- `theme`
- `surface`
- `align`
- `media`
- `children`

Required theme behavior:

- light mode must never inherit dark-only overlays by accident
- dark mode may use richer lava / visual surfaces
- light mode must resolve to clean, readable, low-noise surfaces

### Rule 3: Overview Is Not Special-Cased Outside The System

The overview header is allowed to be visually richer, but not architecturally separate.

That means:

- overview uses `PageHeader variant="oversized"`
- any unique composition is passed in through governed slots like `media` or `children`
- overview must not re-implement a one-off hero structure in its page file

### Rule 4: One Navigation Model

There must be one canonical navigation registry that all shell/navigation renderers consume.

Canonical owner:

- `apps/gooey/src/page-registry.ts`

`apps/gooey/src/navigation/gooey-sidebar-navigation.ts` may derive view-model objects from the canonical registry, but it must not invent parallel product information.

`apps/gooey/src/fixtures/navigation.ts` is not allowed to remain a second source of truth for live app navigation.

Allowed future role for `fixtures/navigation.ts`:

- Storybook/demo fixtures only
- visual test scenarios only
- never canonical app metadata

### Rule 5: One Sidebar Component Tree

There must be one navigation composition tree for the app shell.

Canonical app-shell composition:

- `GooeySidebar`
- `GooeySidebarGroup`
- `GooeySidebarItem`
- `GooeyMobileTopbar`
- `GooeyNavigationSheet`

These are all app-shell components, not page-specific implementations.

No page may build its own left navigation or page list.

### Rule 6: Package vs App Boundary Is Strict

Ownership split:

- `packages/gooey`
  - reusable presentational primitives
  - low-level UI controls
  - tokens
  - hooks
  - cross-surface visual building blocks
- `apps/gooey`
  - app shell
  - page registry
  - navigation composition
  - page header composition
  - route-aware wrappers
  - app-specific metadata and content orchestration

Headers and navigation should move into `packages/gooey` only if they become truly product-agnostic primitives.

Current recommendation:

- keep shell-aware navigation in `apps/gooey`
- promote only the reusable presentational pieces to `packages/gooey` later

Examples of things that may graduate to package level later:

- branded wordmark button
- nav pill primitive
- nav dot badge
- header surface primitive
- header visual background primitive

Examples that must remain app-level:

- page registry resolution
- route-aware navigation state
- overview default routing
- component-category grouping rules

### Rule 7: No Duplicate Metadata

Counts, labels, descriptions, aliases, and category/group relationships must be defined once.

Canonical data fields must live in the page registry and derive:

- sidebar entries
- mobile navigation labels
- overview explore cards
- breadcrumbs
- header defaults

If a page label or description changes, all consumers must inherit it from the registry rather than copy it.

### Rule 8: Header And Nav Must Be In The Design-System Surface

The app shell and page furniture are part of the product system and must be visible as governed system pieces.

That does not mean the whole routed shell belongs in the package today.

It means:

- header variants must be documented as system primitives
- nav item/group/pill patterns must be documented as system primitives
- stories or demos must exist for those primitives
- the app must consume the same primitives it documents

## Target Component Model

### Header Family

Recommended structure:

- `PageHeader`
- `HeaderSurface`
- `HeaderContent`
- `HeaderEyebrow`
- `HeaderTitle`
- `HeaderDescription`
- `HeaderActions`
- `HeaderMedia`

Recommended public API:

```tsx
<PageHeader
  variant="oversized"
  title="Gooey."
  description="The visual language of Jokuh..."
  eyebrow="Overview"
  theme="adaptive"
  surface="editorial"
  media={<OverviewHeaderArtwork />}
/>
```

Variant responsibilities:

- `oversized`
  - large type scale
  - optional art/media slot
  - tuned for overview
- `hero`
  - large page entry header
  - reusable across foundation/component pages
- `section`
  - internal page grouping
- `compact`
  - optional shell/local contexts

Surface responsibilities:

- `plain`
  - minimal clean background
- `glass`
  - translucent product surface
- `editorial`
  - richer branded surface

Theme responsibilities:

- `adaptive`
  - clean light mode, richer dark mode
- `light`
  - force clean light surface
- `dark`
  - force dark surface

### Navigation Family

Recommended structure:

- `AppNavigation`
- `AppNavigationGroup`
- `AppNavigationTrigger`
- `AppNavigationItem`
- `AppNavigationMobileSheet`
- `AppNavigationTopbar`

Route-aware adapters may stay in `apps/gooey`, but these components must consume one normalized nav model.

Recommended normalized nav shape:

```ts
type AppNavNode =
  | {
      kind: "page";
      id: PageId;
      label: string;
      description: string;
      count?: string;
      dotColor: GooeyDotColor;
      href: string;
    }
  | {
      kind: "group";
      id: string;
      label: string;
      description: string;
      count?: string;
      defaultPageId: PageId;
      children: AppNavNode[];
    };
```

## Canonical Ownership

### Canonical Sources

- page ids and category relationships:
  - `apps/gooey/src/page-routing.ts`
- page metadata:
  - `apps/gooey/src/page-registry.ts`
- app-shell navigation rendering:
  - `apps/gooey/src/app-shell/*`
- shared page header primitives:
  - `apps/gooey/src/page-sections/page-header.tsx`

### Derived Layers

- `apps/gooey/src/navigation/gooey-sidebar-navigation.ts`
  - may derive nav view-models only
- `apps/gooey/src/pages/*`
  - may configure header variants only
- `apps/gooey/src/fixtures/navigation.ts`
  - demo/story-only after cleanup

## Required Refactor Decisions

### Decision 1

Delete header duplication between:

- `pages/shell.tsx`
- `page-sections/page-header.tsx`
- `overview-page.tsx`
- `app-shell/GooeyHeader.tsx`

Target:

- one header family
- zero parallel header renderers

### Decision 2

Delete live-navigation duplication between:

- `navigation/gooey-sidebar-navigation.ts`
- `fixtures/navigation.ts`

Target:

- one canonical registry
- one nav derivation layer

### Decision 3

Formally classify app-shell components as:

- app-level composition
- optionally backed by package-level visual primitives later

Do not prematurely push route-aware shell logic into `packages/gooey`.

## Review Checklist

Every PR touching headers/navigation must pass this review checklist.

### Architecture

- Is there still exactly one canonical header system?
- Is this change using an existing header variant instead of inventing markup?
- Does the page registry remain the single source of truth?
- Did the change avoid adding new duplicated nav metadata?
- Is package vs app ownership still correct?

### Visual Behavior

- Does light mode render a clean light header surface?
- Does dark mode render the intended richer surface without harming readability?
- Does the oversized overview header use the same base system as other headers?
- Do nav items look and behave the same in rail and sheet contexts?

### Accessibility

- Are nav groups keyboard-openable and keyboard-navigable?
- Does the active nav item use `aria-current="page"`?
- Do expandable groups use `aria-expanded`?
- Are focus rings visible in both light and dark mode?
- Does the mobile sheet trap focus and close on `Escape`?

### Reuse

- Can the same header variant be reused by at least two pages?
- Can the same nav item primitive be reused by rail and mobile sheet?
- If a new primitive was added, is it generic enough to justify its existence?

## Acceptance Criteria

### Header Acceptance Criteria

- All page headers render through the same shared header family.
- Overview uses the governed `oversized` variant.
- No page file owns a bespoke top-of-page header implementation.
- Light mode header surfaces are clean and intentional.
- Dark mode header surfaces remain branded and readable.

### Navigation Acceptance Criteria

- Desktop rail and mobile sheet consume the same normalized nav model.
- No app navigation labels/counts/descriptions are hard-coded outside the canonical registry.
- Group open/close behavior is identical across pages.
- Active-page highlighting is consistent everywhere.

### Registry Acceptance Criteria

- Page metadata exists once.
- Overview explore cards derive from canonical registry data or a registry-backed selector layer.
- Breadcrumbs and headers use the same labels as navigation.

### Library Boundary Acceptance Criteria

- Route-aware shell logic remains in `apps/gooey`.
- Any package-level additions are presentational and documented.
- No package component imports app registry data.

## Test Matrix

### Theme

Must verify:

- light mode
- dark mode

For each:

- overview oversized header
- standard page header
- section header
- desktop sidebar
- mobile top bar
- mobile navigation sheet

### Viewport

Must verify:

- 320px
- 390px
- 768px
- 1024px
- 1440px

### Interaction

Must verify:

- click navigation
- keyboard navigation
- hover-open groups on desktop
- focus-open groups without pointer
- mobile sheet open/close
- focus restoration after closing mobile sheet

### Content Consistency

Must verify:

- page label matches header title where intended
- overview card labels match registry labels
- nav descriptions match registry descriptions
- counts do not diverge across surfaces

### Boundary Safety

Must verify:

- `packages/gooey` exports do not depend on app files
- app shell does not duplicate presentational primitives that already exist in package scope

## Migration Plan

### Phase 1: Freeze Drift

- No new header implementations
- No new navigation data files
- No new duplicated page labels/descriptions/counts

### Phase 2: Canonical Header Extraction

- move all top-of-page header logic into `page-sections/page-header.tsx`
- convert `pages/shell.tsx` to consume it
- convert overview to `variant="oversized"`
- either delete or adapt `app-shell/GooeyHeader.tsx`

### Phase 3: Canonical Navigation Registry

- keep `page-registry.ts` as source of truth
- reduce `gooey-sidebar-navigation.ts` to derivation only
- demote `fixtures/navigation.ts` to demo/story-only

### Phase 4: Library Surface Documentation

- document header and nav primitives in stories/specs
- identify which visual primitives should move to package level
- keep route-aware shell logic app-local

### Phase 5: Legacy Removal

- remove obsolete header logic from `App.tsx`
- remove obsolete nav logic from `App.tsx`
- delete dead adapters once all pages consume the governed system

## Stop Conditions

Stop the migration if:

- a page needs a bespoke header outside the governed API
- a second metadata source is introduced
- package components begin importing app registry data
- overview diverges from the shared header system again
- light/dark mode behavior forks across header implementations

## Enforcement

This spec is not optional.

For headers/navigation:

- no new component lands without an ownership decision
- no new metadata lands outside the canonical registry
- no page ships with a bespoke header unless the shared API was first extended

If a requested design cannot be expressed through the governed header/nav API, the API must be improved first.
