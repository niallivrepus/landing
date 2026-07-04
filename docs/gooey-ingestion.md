# Gooey Ingestion

This repo does not copy Gooey UI components into `landing`.

The contract is:

1. `gooey` is the single source of truth for shared UI primitives.
2. `landing` consumes Gooey directly from the sibling repo source.
3. Any shared primitive that should be reused here must be added to Gooey first, then exported through `packages/gooey/src/index.ts`.
4. `landing` may add local wrappers, page sections, and theme overrides, but not fork Gooey primitives.

## Current Wiring

### Dependency

`package.json` keeps a local package dependency:

```json
"@jokuh/gooey": "file:../gooey/packages/gooey"
```

This is still useful for dependency installation and package resolution.

### Source Resolution

`vite.config.ts` resolves Gooey directly to the sibling source tree:

- `@jokuh/gooey` → `../gooey/packages/gooey/src/index.ts`
- `@jokuh/gooey/styles/globals.css` → `../gooey/packages/gooey/src/styles/globals.css`
- `@gooey` → `../gooey/packages/gooey/src`

This avoids treating the copied `node_modules/@jokuh/gooey` directory as the effective source of truth during development.

### Tailwind v4 Source Scanning

`src/styles/app.css` scans Gooey source directly:

```css
@source "../../../gooey/packages/gooey/src/**/*.tsx";
```

This means Tailwind class discovery follows the real Gooey source instead of a copied install artifact.

### TypeScript

`tsconfig.json` maps Gooey imports to the sibling source tree so editor/type resolution follows the same boundary as Vite.

## Working Rule

If `landing` needs a Gooey primitive:

1. build or refine it in `gooey/packages/gooey/src/components/ui/*`
2. export it from `gooey/packages/gooey/src/index.ts`
3. consume it in `landing`

Do not paste or clone the component into `landing`.

## What Stays Local To Landing

The following should remain local to this repo:

- route-level pages
- landing-page sections
- product-detail storytelling sections
- landing-specific prompt and theme overrides
- content models in `src/data/*`

These are product-surface concerns, not design-system primitives.
