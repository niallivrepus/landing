# Gooey — Jokuh Component Library

You are working inside Gooey, Jokuh's design system and component library. Follow this guide to navigate and build correctly.

## Repo Structure

```
gooey/
├── packages/gooey/src/       ← THE LIBRARY (this is what you build)
│   ├── components/ui/         ← 117 React components
│   ├── hooks/                 ← useTheme, useHaptics, useReducedMotion, useTrayContext
│   ├── lib/                   ← design-colors.ts, utils, animations
│   ├── styles/                ← design-tokens.css, globals.css
│   └── index.ts               ← barrel exports (every component must be exported here)
├── swift/GooeySwift/          ← SwiftUI package (generated from tokens + templates)
├── apps/gooey/                ← DEMO APP (localhost:6062)
│   └── src/                   ← pages that showcase components
├── stories/                   ← STORYBOOK stories (localhost:6006)
└── pnpm-workspace.yaml        ← monorepo config
```

## Cross-Platform (React + Swift + Android)

- **React** (`@jokuh/gooey`): web and React Native — source components live in `packages/gooey/`.
- **Swift** (`GooeySwift`): iOS/macOS SwiftUI — generated; do not edit by hand. See `docs/specs/gooey-cross-platform.md`.
- **Android**: use `@jokuh/gooey` via React Native until a native Compose track exists.

```bash
pnpm swift:sync      # regenerate Swift from design-tokens.css + templates
pnpm swift:check     # verify token parity + swift build
pnpm swift:list      # which React components have Swift templates
```

## How to Navigate

When asked about a component:
1. Check `packages/gooey/src/components/ui/{component-name}.tsx` for the implementation
2. Check `stories/{ComponentName}.stories.tsx` for usage examples and props
3. Check `packages/gooey/src/index.ts` to confirm it's exported

When asked about design tokens:
1. Read `packages/gooey/src/styles/design-tokens.css` for CSS variables
2. Read `packages/gooey/src/lib/design-colors.ts` for hex values and gradients

When asked about theming:
1. Read `packages/gooey/src/hooks/use-theme.tsx` for ThemeProvider
2. Design tokens use scale 1-7 (1=darker, 7=lighter in dark theme, INVERTED in light theme)

## Design System Rules

### Colors
- 8 energy scales: Pink, Purple, Blue, Cyan, Green, Yellow, Orange, Red — each with 7 steps
- Material gradients: vanadium, copper, bronze, steel, rose-gold, gold, silver, platinum, jaskmarr
- Fantasy materials: gronksh, plata, orro, drakzul, slyvir, adamant, mithrill, liktir, amfrill
- Glass colors flip between dark/light themes
- Scale direction: 1 = darker, 7 = lighter (dark theme reads naturally, light theme inverts)

### Typography
- Satoshi — headlines and body (300, 400, 500, 700, 900)
- Rock Salt — display/accent
- Geist Mono — code
- H1 (80px) → H8 (16px), Paragraphs: Large 18px, Medium 16px, Small 14px
- Negative tracking (-5px) on large headlines, zero on body

### Components
- Glass morphism: translucent surfaces with backdrop blur
- Touch targets: minimum 44px
- Consistent radius from design tokens
- Clear hover, active, disabled states
- All components use `cn()` utility for className merging

### Grid
- 12 columns desktop, 6 columns tablet/phone
- 12px gap desktop/tablet, 4px gap phone
- 1440px max content width, 16px edge margins

## Creating a New Component

1. Create `packages/gooey/src/components/ui/{component-name}.tsx`
2. Use design tokens from CSS variables (never hardcode colors)
3. Use `cn()` for className merging
4. Export from `packages/gooey/src/index.ts`
5. Create `stories/{ComponentName}.stories.tsx`
6. Test in Storybook: `pnpm storybook`

## Component Template

```tsx
import { cn } from "../../lib/utils";

interface MyComponentProps {
  children: React.ReactNode;
  variant?: "default" | "glass" | "solid";
  className?: string;
}

export function MyComponent({ children, variant = "default", className }: MyComponentProps) {
  return (
    <div className={cn(
      "base-styles-here",
      variant === "glass" && "glass-styles",
      className
    )}>
      {children}
    </div>
  );
}
```

## Commands

```bash
pnpm dev              # Start demo app (localhost:6062)
pnpm storybook        # Start Storybook (localhost:6006)
pnpm build            # Build library
pnpm test             # Run tests
pnpm swift:sync       # Sync GooeySwift from tokens
pnpm swift:check      # CI: Swift parity + build
```

## Existing Components (117)

Action: action-button, action-circle-button, action-card-contacts, action-card-users
Display: badge, card, avatar, avatar-wheel, avatar-hype-train, skeleton, verified
Input: button, checkbox, input, input-secondary, radio, switch, slider-point, value-slider
Navigation: bottom-bar, chevron-right, navigation-button, crumb
Media: album-art, album-art-cover, music-controls, music-cover-title, music-timer, track-info, soundwave, play-button
Communication: message-bubble, message-preview, chat-bubble-button, chat-feed, notification, notification-preview-card, voice-memo, record-button, human-speech, reactions
Effects: confetti, fireworks, mineral-effect, ripple-effect, sequin-effect, shooting-star, portal-animation
Cards: passport-card, onboarding-card, storage-pricing-card, connect-socials-card, connection-request-card, preview-card, theme-selector-card, document-card, add-bank-info-card
Identity: claim-identity, pass-photo, password-safety
Layout: squircle, tray, tooltip-bubble, corner-dragger, dynamic-island
Visual: color-swatch, glass-button, glass-icon-button, color-only-button, special-button, icon-only-button, power-button, right-hand-button
Tags: medium-tag, small-tag, spine-tag
Other: logo, nexus-logo, oo, pet, plus, star, timer, step-counter, numbers, search-indication, motivator, prompt-bar, edit-bar, image-preview, image-stack, social-icons, server-avatar, email-avatar, location-point, payment-method-icon, contact-item, direct-message-head

## Do Not

- Never hardcode hex colors — always use CSS variables from design-tokens.css
- Never use arbitrary border-radius — use token values
- Never skip the barrel export in index.ts
- Never create components outside packages/gooey/src/components/ui/
- Never modify design-tokens.css without checking Figma source
