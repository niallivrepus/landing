# Gooey Cross-Platform

Gooey ships one design system across three consumer surfaces without forking tokens or breaking the React library.

## Source of truth

| Layer | Path | Owned by |
|-------|------|----------|
| Color tokens | `packages/gooey/src/styles/design-tokens.css` | Design / DEE |
| React components | `packages/gooey/src/components/ui/*.tsx` | `@jokuh/gooey` |
| SwiftUI components | `swift/GooeySwift/Sources/**` | Generated + reviewed templates |

**Rule:** Never hand-edit generated Swift under `swift/GooeySwift` except via `scripts/convert-gooey-swift.mjs`. React files are not touched by the Swift pipeline.

## Platform map

```mermaid
flowchart LR
  tokens[design-tokens.css]
  react[@jokuh/gooey React]
  swift[GooeySwift SwiftUI]
  rn[React Native Android]
  tokens --> react
  tokens --> swift
  react --> rn
```

- **Apple (iOS, macOS):** `GooeySwift` SPM package — native SwiftUI, haptics via `GooeyHaptics` environment.
- **Web:** `@jokuh/gooey` — unchanged React 19 library.
- **Android:** `@jokuh/gooey` through React Native for UI parity today; a future Compose module would follow the same token export pattern as Swift.

## Swift readiness checklist

1. `pnpm swift:sync` — tokens and templated components match CSS.
2. `pnpm swift:check` — CI guard (token counts, files on disk, `swift build`).
3. `swift/GooeySwift/platform-manifest.json` — React ↔ Swift parity map.
4. New native component — add `render*` template in `convert-gooey-swift.mjs`, register in `SUPPORTED_COMPONENTS`, run sync.

## Incremental component coverage

120+ React components exist; Swift converts only those with explicit SwiftUI templates (see `pnpm swift:list`). Categories blocked until adapters exist:

- State machines (dynamic island, tray, prompt bar)
- Runtime effects (fireworks, lordicon, custom cursor)
- Asset-heavy views (avatars, image pickers)

This is intentional: partial native parity beats incorrect auto-translation.

## Commands

```bash
pnpm swift:sync
pnpm swift:check
pnpm --filter @jokuh/gooey check-types   # React unchanged
```
