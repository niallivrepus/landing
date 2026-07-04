# GooeySwift

Native SwiftUI package generated from the same design tokens and component contracts as `@jokuh/gooey` (React). React source files are never modified by the Swift pipeline.

## Platforms

| Surface | Package | Use |
|--------|---------|-----|
| Web | `@jokuh/gooey` | React 19 + Tailwind |
| iOS / macOS | `GooeySwift` | SwiftUI (this package) |
| Android | `@jokuh/gooey` | React Native until a native Compose track exists |

## Modules

- **GooeyTokens** — colors from `design-tokens.css` (dark + light)
- **GooeyFoundation** — theme environment, haptics, viewport, glass modifiers
- **GooeyControls** — button, input, switch, checkbox, radio, badge, icon button
- **GooeyPatterns** — card, skeleton
- **GooeyPreviewSupport** — preview matrix helpers

## Sync from React source of truth

```bash
pnpm swift:sync    # regenerate tokens + templated components
pnpm swift:build   # compile Swift package
pnpm swift:check   # token parity + file presence + swift build
pnpm swift:list    # template-ready vs needs-template
```

## Add to an Xcode project

```swift
.package(path: "../gooey/swift/GooeySwift")
```

```swift
import GooeyControls
import GooeyFoundation

GooeyButton("Continue", variant: .primary) { }
  .environment(\.gooeyTheme, GooeyTheme(mode: .dark, resolvedScheme: .dark))
```

## Parity status

See `platform-manifest.json` and `swift-conversion-report.json`. Only components with explicit SwiftUI templates in `scripts/convert-gooey-swift.mjs` are generated; the remaining React components stay web-only until a template is added.
