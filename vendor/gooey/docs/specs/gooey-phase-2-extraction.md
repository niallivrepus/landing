# Gooey Phase 2 Extraction

## Goal

Turn `apps/gooey` into a real page-based app one route at a time, while keeping the current shell stable and leaving non-extracted pages on the legacy path until each batch is proven.

## Non-goals

- No full visual redesign of every page in one pass
- No big-bang replacement of `App.tsx`
- No Storybook taxonomy rewrite in this batch

## Batch Order

1. Overview page
2. Foundation pages: colors, typography, grid
3. Foundation pages: iconography, effects, visuals
4. Component category pages in small clusters
5. Delete legacy page switch from `App.tsx`

## Runtime Pattern

- Extracted pages live under `apps/gooey/src/pages`
- `App.tsx` keeps the shell and routing state
- Extracted pages render through `pages/render.tsx`
- Non-extracted pages keep the legacy branch until migrated
- Page modules receive a runtime object for navigation and doc-modal actions

## Acceptance Criteria

- At least one route renders from a real page module
- `App.tsx` no longer owns the extracted route body
- Build passes
- Browser verification passes
- No extracted page depends on prototype app assets

## Stop Conditions

- If page props need new runtime data, add it once in `pages/types.ts`
- If a page extraction would duplicate too much shared UI, pause and extract shared primitives before moving the next page
- If a batch changes shell behavior, stop and fix the shell before extracting more pages

## Risks

- Mixed legacy/new page paths can drift if shared copy is duplicated
- `App.tsx` will remain heavy until at least the foundation pages are extracted
- Storybook will still drift unless extracted pages and story fixtures start sharing data sources
