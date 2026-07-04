# Storybook API Parity

## Goal

Keep Storybook aligned with the real public surface of `@jokuh/gooey`.

## Rules

- Public stories import from `@jokuh/gooey`.
- Internal-only stories must move under `Internal/*`.
- Stories must not reference symbols missing from `packages/gooey/src/index.ts`.

## Current Gap

- `Fireworks` story referenced a missing public export.

## Follow-Up Work

- Add a parity check script that compares `stories/*` imports against the barrel.
- Report:
  - missing public exports with stories
  - exports without public stories
  - internal stories importing private modules

## Acceptance

- Public Storybook is a valid browser for the package API.
- Build catches missing export mismatches before release.
