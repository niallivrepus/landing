# Gooey Page Architecture

## Goal

Turn `apps/gooey` from a monolithic showcase into a real application with:

- a stable app shell
- real page modules
- a left navigation system that stays visually rich
- shared fixtures and section blocks reused by both the app and Storybook
- faster navigation and simpler code ownership

## Current State

`apps/gooey` already has the right information model, but not the right architecture.

- Routing model exists in `apps/gooey/src/page-routing.ts`
- Page metadata exists in `apps/gooey/src/page-registry.ts`
- Sidebar behavior exists inside `CategorySidebar` in `apps/gooey/src/App.tsx`
- Actual page rendering is still a single conditional tree inside `ComponentsPage` in `apps/gooey/src/App.tsx`

That means the app is page-like, but not actually page-based.

## Problems

1. `App.tsx` owns shell, routing, sidebar, page composition, page content, and section internals.
2. Only the `components` category is expandable; the nav model is not general.
3. Page content is not isolated into route/page modules, so reuse and code-splitting are weak.
4. Storybook and `apps/gooey` still do not share one canonical page-fixture layer.
5. The current architecture makes every change more expensive than it needs to be.

## Target Architecture

### 1. App Shell

Create a real shell layer that owns only:

- current page state
- URL sync
- viewport scroll reset
- global overlays like `ComponentLibraryMetaLayer`
- layout chrome

Files:

- `apps/gooey/src/app-shell/GooeyAppShell.tsx`
- `apps/gooey/src/app-shell/GooeyHeader.tsx`
- `apps/gooey/src/app-shell/GooeySidebar.tsx`
- `apps/gooey/src/app-shell/GooeyContentFrame.tsx`

### 2. Real Page Modules

Every page becomes its own file.

Files:

- `apps/gooey/src/pages/overview-page.tsx`
- `apps/gooey/src/pages/colors-page.tsx`
- `apps/gooey/src/pages/typography-page.tsx`
- `apps/gooey/src/pages/grid-page.tsx`
- `apps/gooey/src/pages/iconography-page.tsx`
- `apps/gooey/src/pages/effects-page.tsx`
- `apps/gooey/src/pages/visuals-page.tsx`
- `apps/gooey/src/pages/components-page.tsx`

For component subcategories:

- `apps/gooey/src/pages/components/assets-page.tsx`
- `apps/gooey/src/pages/components/badges-page.tsx`
- `apps/gooey/src/pages/components/buttons-page.tsx`
- `apps/gooey/src/pages/components/cards-page.tsx`
- `apps/gooey/src/pages/components/decor-page.tsx`
- `apps/gooey/src/pages/components/flags-page.tsx`
- `apps/gooey/src/pages/components/input-page.tsx`
- `apps/gooey/src/pages/components/island-page.tsx`
- `apps/gooey/src/pages/components/menu-page.tsx`
- `apps/gooey/src/pages/components/payments-page.tsx`
- `apps/gooey/src/pages/components/pods-page.tsx`
- `apps/gooey/src/pages/components/spine-page.tsx`

### 3. Shared Page Sections

Move repeated page furniture into shared blocks.

Files:

- `apps/gooey/src/page-sections/PageHeader.tsx`
- `apps/gooey/src/page-sections/PageBreadcrumbs.tsx`
- `apps/gooey/src/page-sections/PageIntro.tsx`
- `apps/gooey/src/page-sections/SectionCard.tsx`
- `apps/gooey/src/page-sections/ExampleGrid.tsx`

### 4. Shared Data And Fixtures

All page demos should pull from reusable fixture modules instead of inline literals in page files.

Files:

- `apps/gooey/src/fixtures/assets.ts`
- `apps/gooey/src/fixtures/chat.tsx`
- `apps/gooey/src/fixtures/navigation.ts`
- `apps/gooey/src/fixtures/payments.ts`
- `apps/gooey/src/fixtures/pods.ts`
- `apps/gooey/src/fixtures/lordicon.ts`

This layer should be aligned with Storybook fixtures where possible.

## Left Navigation Spec

## Goal

Keep the left rail visually close to what exists now, but make it generic and page-driven.

## Required Behavior

- Left rail remains fixed.
- Primary categories remain pill-like and compact.
- Expandable groups open on hover and stay open while pointer focus is inside the group.
- Clicking still performs navigation.
- Active category/subpage stays visibly selected.
- Accordion uses spring motion, not generic fade-only motion.
- Keyboard navigation must work without hover.

## Interaction Model

There are two separate states:

- `activeGroupId`: selected group based on current page
- `openGroupId`: group currently expanded due to hover, focus, or explicit click

Rules:

- Hovering a group opens it.
- Leaving the full group region closes it unless that group contains the active page.
- Clicking a collapsed group navigates to its default page and opens it.
- Clicking an already-open active group toggles collapse only if it is not required for the current page.
- Focus within a group keeps it open.

## Animation Model

Use a proper accordion body rather than ad hoc `height: auto` everywhere.

Recommended motion:

- spring open/close for group container
- staggered fade/slide for subitems
- soft scale/translate emphasis on active item

Suggested values:

- open/close spring: medium stiffness, medium damping
- item stagger: 20ms to 35ms
- hover lift: subtle only

## Accessibility

- Use buttons for group triggers.
- Use `aria-expanded` on expandable categories.
- Use `aria-current="page"` on the active page item.
- Ensure focus styles are visible.
- Hover behavior must not be the only way to open a section.

## Sidebar Structure

Split the current sidebar into:

- `GooeySidebar`
- `SidebarGroup`
- `SidebarGroupTrigger`
- `SidebarAccordion`
- `SidebarPageLink`
- `SidebarMascotButton`

## Routing Spec

Keep the current `?page=` URL model for now. It is good enough for the refactor and minimizes churn.

Do not add a full router before the page split lands.

Short term:

- central page resolver
- central page registry
- central `renderPage(pageId)` mapping

Later option:

- move to file-based router or proper route objects only if needed

## Rendering Spec

Replace the long conditional render in `ComponentsPage` with a page registry.

Shape:

- `PAGE_COMPONENTS: Record<PageId, React.ComponentType<PageProps>>`
- app shell resolves `activePage`
- shell renders the matching page module

This gives:

- clean ownership
- lazy page loading
- simpler testing
- simpler sidebar logic

## Performance Spec

## Immediate Wins

- isolate page modules so inactive pages are not constantly part of one render path
- lazy-load heavy pages such as iconography, visuals, and some component subpages
- move large literals and sample datasets into fixtures
- stop importing every demo helper into one top-level file

## Heavy Targets

- iconography page
- dynamic island surfaces
- prompt bar examples
- pod editing scenes
- visuals/effects pages

## Strategy

- ship shell and page split first
- lazy-load heavy page modules second
- harden heavy demo sections third

## Storybook Alignment

The same fixture and section layers should feed:

- `apps/gooey`
- Storybook stories

Rule:

- if a component demo is important enough for the Gooey app, it should not live only in `App.tsx`

## Migration Plan

### Phase 1

- extract shell and sidebar without changing visuals
- keep all existing page content in place
- replace `ComponentsPage` conditional tree with page-module mapping

### Phase 2

- extract foundation pages
- extract component subpages
- move repeated header and breadcrumb code into shared page sections

### Phase 3

- replace sidebar hard-coding with generic expandable group model
- add hover accordion behavior
- add keyboard-safe focus retention

### Phase 4

- move demo literals into fixtures
- align Storybook fixtures with app fixtures
- lazy-load heavy pages

## Acceptance Criteria

- `apps/gooey` no longer depends on one monolithic `App.tsx` for page content
- every page has a dedicated module
- the left nav supports generic expandable groups, not a one-off components block
- hover accordion is bouncy, accessible, and preserves the current visual tone
- Storybook and `apps/gooey` share fixtures for major demo surfaces
- heavy pages can be lazy-loaded without breaking deep links

## Non-Goals

- moving the app to Next.js during this refactor
- redesigning the Gooey visual language
- replacing query-param routing before the page split is complete
