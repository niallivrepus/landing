# Storybook Foundation

## Goal

Make Storybook buildable, deterministic, and visually consistent enough to become the primary review surface for `@jokuh/gooey`.

## Problems

- Storybook did not build cleanly.
- Static assets were incomplete for fonts and shared images.
- Stories used ad hoc wrappers instead of a shared runtime contract.
- Preview was not wrapped in the same theme/provider stack as the package.

## Scope

- `.storybook/main.ts`
- `.storybook/preview.tsx`
- `stories/story-helpers.tsx`
- `stories/fixtures/*`

## Deliverables

- Static dirs include prototype assets.
- Preview uses `ThemeProvider` with dark mode by default.
- Shared story surfaces replace repeated inline layout wrappers.
- Stories can rely on shared fixtures instead of duplicating asset paths.

## Acceptance

- `pnpm build-storybook` passes.
- No unresolved `/fonts/*` warnings remain.
- New stories use shared helpers instead of raw wrapper styles.
