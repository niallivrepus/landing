# Gooey Shell Governance

## Goal

Create one governed shell system for Gooey so headers, navigation, and page chrome are defined once, reused everywhere, and migrated out of ad hoc page-local implementations.

This spec is the operating contract for:

- shared page headers
- left navigation and mobile navigation
- app shell composition
- ownership between `apps/gooey` and `packages/gooey`
- review rules that stop visual and architectural drift

## Why This Spec Exists

The current repo already has the right direction, but it still has duplicate shell systems.

Current duplication:

- `apps/gooey/src/pages/shell.tsx`
- `apps/gooey/src/page-sections/page-header.tsx`
- `apps/gooey/src/app-shell/GooeyHeader.tsx`
- `apps/gooey/src/overview-page.tsx` hero-specific behavior
- legacy header and navigation copies inside `apps/gooey/src/App.tsx`

Current navigation duplication and drift:

- `apps/gooey/src/app-shell/GooeySidebar.tsx`
- `apps/gooey/src/app-shell/GooeySidebarGroup.tsx`
- `apps/gooey/src/app-shell/GooeySidebarItem.tsx`
- `apps/gooey/src/app-shell/GooeyMobileTopbar.tsx`
- `apps/gooey/src/app-shell/GooeyNavigationSheet.tsx`
- `apps/gooey/src/navigation/gooey-sidebar-navigation.ts`
- `apps/gooey/src/fixtures/navigation.ts`

Current governance failure:

- shell visuals are partly app-local
- metadata is split across multiple registries
- overview uses a separate hero implementation instead of a governed variant
- light/dark behavior is being patched per page instead of owned by one component system

## Governance Outcome

After this spec lands, Gooey must behave like this:

1. Headers are one component family with explicit variants.
2. Navigation is one component family with explicit item/group types.
3. App pages never invent their own shell visuals.
4. `apps/gooey` owns content and routing.
5. `packages/gooey` owns reusable shell UI and behavior.
6. New pages can only compose governed shell primitives.

## Source Of Truth

### Canonical metadata owner

`apps/gooey/src/page-registry.ts` becomes the only canonical source for:

- page label
- page description
- page count
- dot color
- category/group membership
- aliases
- default page for expandable groups
- header variant metadata
- navigation visibility metadata

`apps/gooey/src/page-routing.ts` remains the canonical source for route ids and URL behavior.

### Required derived layer

Add a derived helper layer, for example:

- `apps/gooey/src/page-derived.ts`

This layer may derive:

- page id arrays
- alias maps
- page groups
- sidebar nav entries
- overview category cards
- render route helpers

This layer may not invent new labels, descriptions, counts, colors, or grouping rules.

### Files that must stop being treated as canonical

- `apps/gooey/src/fixtures/navigation.ts`
- any inline nav literals inside page files
- any inline header copy that duplicates page-registry copy

### Rule

If header copy or nav structure differs from the registry, the registry is correct and the page implementation is wrong.

## Ownership Boundary

### `packages/gooey` owns

Reusable visual shell primitives and interaction behavior:

- `GooeyPageHeader`
- `GooeySidebarNav`
- `GooeySidebarNavItem`
- `GooeySidebarNavGroup`
- `GooeyMobileNavSheet`
- `GooeyTopbar`
- shared nav/header types
- theme behavior for shell components
- accessibility behavior for shell components

These should live under a new namespace:

- `packages/gooey/src/components/shell/`

### `apps/gooey` owns

App-specific composition and metadata:

- `page-registry.ts`
- `page-routing.ts`
- registry-to-nav adapters
- registry-to-header-props adapters
- runtime navigation callbacks
- which page uses which header variant
- which page is shown in which shell context

### Hard rule

If a shell component can render in more than one page or more than one app state, it does not belong in `apps/gooey/src/app-shell` long term.

## Unified Header System

## Objective

All page headers must be one component family. The overview header is not a special implementation. It is a variant.

### Canonical component

`GooeyPageHeader`

### Variants

- `compact`
- `standard`
- `oversized`
- `hero`

### Variant intent

- `compact`: small internal pages or utility surfaces
- `standard`: default foundation/component page header
- `oversized`: overview-scale title with stronger visual emphasis
- `hero`: campaign-like or highly visual top section, still governed

### Required props

```ts
type GooeyPageHeaderVariant = "compact" | "standard" | "oversized" | "hero";

type GooeyHeaderSurface = "adaptive" | "lava" | "plain";

type GooeyPageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  variant: GooeyPageHeaderVariant;
  surface?: GooeyHeaderSurface;
  accent?: "default" | "flame" | "solar" | "life" | "aether" | "insight" | "spirit";
  seed?: string;
  mediaSlot?: ReactNode;
  metaSlot?: ReactNode;
  className?: string;
};
```

### Header rules

1. Theme behavior is internal.
2. Light mode must never require page-local overrides to achieve a clean header background.
3. Oversized header is the overview solution.
4. Pages may pass content slots, but may not replace the surface implementation.
5. Header title scale, padding, radius, and light/dark behavior must be variant-driven only.
6. If a page needs a new header treatment, it must first become a new governed variant rather than a custom page header.

### Light mode behavior

- `adaptive` surface must resolve to a clean light surface in light mode
- dark overlays must not leak into light mode
- text color must be component-owned
- border treatment must be component-owned

### Immediate consolidation targets

- replace `apps/gooey/src/pages/shell.tsx` header surface logic
- replace `apps/gooey/src/page-sections/page-header.tsx`
- replace overview-specific hero implementation in `apps/gooey/src/pages/overview-page.tsx`
- deprecate `apps/gooey/src/app-shell/GooeyHeader.tsx`

## Unified Navigation System

## Objective

Menu items are defined once and rendered through one component family across rail, sheet, and mobile.

### Canonical components

- `GooeySidebarNav`
- `GooeySidebarNavGroup`
- `GooeySidebarNavItem`
- `GooeyMobileNavSheet`
- `GooeyTopbar`

### Canonical nav data types

```ts
type GooeyNavDotColor =
  | "default"
  | "aether"
  | "crimson"
  | "flame"
  | "insight"
  | "life"
  | "solar"
  | "spirit"
  | "terra";

type GooeyNavPageItem = {
  kind: "page";
  id: string;
  label: string;
  description: string;
  dotColor: GooeyNavDotColor;
  count?: string;
  href?: string;
};

type GooeyNavGroup = {
  kind: "group";
  id: string;
  label: string;
  description: string;
  count?: string;
  defaultPageId: string;
  items: GooeyNavPageItem[];
};

type GooeyNavEntry = GooeyNavPageItem | GooeyNavGroup;
```

### Navigation rules

1. The visual nav renderer lives in `packages/gooey`.
2. The app only passes a typed entry tree and active state.
3. Menu items are not duplicated per presentation.
4. Rail, sheet, and mobile all render from the same entry model.
5. Active state, hover behavior, and keyboard behavior are shared behavior, not page-local logic.
6. If the app needs a new nav presentation, it wraps the same governed item/group components.

### Registry to nav adapter

`apps/gooey/src/navigation/gooey-sidebar-navigation.ts` becomes an adapter, not a second source of truth.

It may:

- normalize page-registry metadata into nav entries
- attach current location URLs
- map group expansion defaults

It may not:

- redefine labels
- redefine descriptions
- redefine counts
- invent group structure absent from registry

## App Shell Composition

## Objective

The shell should compose governed pieces, not own bespoke variants.

### App shell responsibilities

`apps/gooey/src/app-shell/GooeyAppShell.tsx` should own only:

- active page state
- viewport selection
- desktop vs mobile shell decision
- open/close state for mobile nav
- placement of shell components

### App shell may not own

- custom header visuals
- custom nav item visuals
- duplicated hover/focus/selection logic
- page-local brand implementations

## Library Inclusion Policy

## Objective

Headers and navigation are part of the component library. They are not just app scaffolding.

### Required library exports

Add explicit shell exports from `packages/gooey/src/index.ts` after migration:

- `./components/shell/gooey-page-header`
- `./components/shell/gooey-sidebar-nav`
- `./components/shell/gooey-sidebar-nav-item`
- `./components/shell/gooey-sidebar-nav-group`
- `./components/shell/gooey-mobile-nav-sheet`
- `./components/shell/gooey-topbar`

### Storybook requirement

Every governed shell primitive must have Storybook coverage for:

- dark mode
- light mode
- mobile
- desktop
- active/inactive nav states
- expanded/collapsed nav groups
- oversized header variant

## Migration Plan

## Phase 0: Freeze drift

- no new page-local header implementations
- no new page-local sidebar item implementations
- no new metadata copies outside registry

## Phase 1: Normalize metadata

- extend `page-registry.ts` to include all nav/header metadata needed
- reduce `fixtures/navigation.ts` to compatibility or remove it
- ensure `gooey-sidebar-navigation.ts` becomes adapter-only

## Phase 2: Build package shell primitives

- move header surface logic into `packages/gooey/src/components/shell/`
- move sidebar item/group/renderers into `packages/gooey/src/components/shell/`
- move shared shell types with them

## Phase 3: Rewire app shell

- make `apps/gooey/src/app-shell/*` consume package shell components
- keep `GooeyAppShell.tsx` as app composition only

## Phase 4: Unify headers

- replace `pages/shell.tsx` header visuals with `GooeyPageHeader`
- replace `page-sections/page-header.tsx`
- replace overview hero with `variant="oversized"`
- remove `GooeyHeader.tsx` or make it a thin adapter temporarily

## Phase 5: Delete duplicates

- remove obsolete app-local shell copies
- remove duplicate nav metadata definitions
- remove legacy header implementations from `App.tsx`

## Phase 6: Enforce governance

- Storybook stories exist for all shell primitives
- spec is referenced in PR review
- shell additions require design-system review

## Stop Conditions

Stop the migration if:

- the registry cannot express a shell requirement cleanly
- a page needs page-local header CSS to look correct
- mobile and desktop nav diverge in structure
- light and dark mode require separate component implementations

In those cases, the shell API is incomplete and must be fixed before more migration.

## Acceptance Criteria

The governance work is complete only when all of the following are true:

1. Overview uses the same governed header component family as every other page.
2. Light mode header behavior is owned by the shared header component.
3. Desktop rail and mobile sheet use the same governed nav item/group components.
4. All nav labels/descriptions/counts are derived from the canonical registry.
5. `packages/gooey` exports shell components as first-class library primitives.
6. `apps/gooey` no longer owns unique visual implementations of shared shell parts.
7. Legacy header/nav copies in `App.tsx` are deleted or isolated behind a migration fence.

## Review Checklist

Every PR touching header or navigation must answer yes to all of these:

- Does this reuse the governed header component family?
- Does this reuse the governed nav component family?
- Is page metadata sourced from `page-registry.ts`?
- Does light mode render cleanly without page-local overrides?
- Does dark mode still preserve the intended contrast and atmosphere?
- Does the behavior match on desktop rail and mobile sheet?
- Is the component living in the correct package boundary?
- Is Storybook coverage present or updated?

## Test Matrix

Must be verified for every shell release:

- dark mode desktop
- dark mode mobile
- light mode desktop
- light mode mobile
- overview oversized header
- standard foundation/component headers
- nav group expand/collapse
- keyboard focus behavior
- `aria-expanded` and `aria-current`
- package primitive rendered in Storybook
- app consuming the package primitive inside `apps/gooey`

## File Targets

### Canonical targets after migration

- `packages/gooey/src/components/shell/*`
- `apps/gooey/src/page-registry.ts`
- `apps/gooey/src/page-routing.ts`
- `apps/gooey/src/navigation/gooey-sidebar-navigation.ts`
- `apps/gooey/src/app-shell/GooeyAppShell.tsx`

### Files expected to be removed or reduced

- `apps/gooey/src/app-shell/GooeyHeader.tsx`
- `apps/gooey/src/pages/shell.tsx` header-specific surface logic
- `apps/gooey/src/page-sections/page-header.tsx`
- duplicated nav metadata inside `apps/gooey/src/fixtures/navigation.ts`
- legacy shell/header/nav copies in `apps/gooey/src/App.tsx`

## Decision

Gooey will treat shell primitives as part of the design system, not just app scaffolding.

That means:

- one header system
- one navigation system
- one canonical metadata model
- one ownership boundary
- one review contract

Anything outside that is drift and should be rejected in review.
