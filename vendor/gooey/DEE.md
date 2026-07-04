# DEE — Design Engineering Environment

> This file is the architectural constitution for Gooey's design token system.
> Every AI agent, human developer, and automated tool that touches styling, theming, or component creation in this codebase MUST follow these rules.

---

## System Identity

This is **Gooey** (`@jokuh/gooey`) — Jokuh's proprietary React component library, built as a **pnpm monorepo** with:
- **Tailwind CSS v4** (CSS-first config via `@theme` directives, no `tailwind.config.ts`)
- **120+ custom components** in `packages/gooey/src/components/ui/`
- **Storybook 10** for development and documentation
- **Vite** for the prototype app (`apps/prototype/`)

There are NO shadcn/ui components. Every component is custom-built for the Jokuh design system.

---

## Architecture: The Four-Layer Token Pipeline

```
Layer 1: Raw Palette ──────── Figma design tokens (hex values, type scale, spacing, grids)
         │                    Exported from Figma → design-tokens.css
         │
         ▼
Layer 2: design-tokens.css ── THE RAW VALUES
         │                    :root { --color-purple-4: #9327FF; ... }
         │                    :root.light { scales invert, glass swaps }
         │                    Energies, Materials, Minerals, Factions, Origins
         │                    Typography, Grid system, Effects
         │
         ▼
Layer 3: globals.css ──────── THE INTEGRATION LAYER
         │                    @import "tailwindcss";
         │                    @import "./design-tokens.css";
         │                    @theme inline { } — registers tokens with Tailwind
         │                    :root { } — semantic aliases (--primary, --surface, etc.)
         │                    .dark { } — dark mode semantic overrides (oklch)
         │                    @layer base { } — global resets and keyframes
         │
         ▼
Layer 4: Components ────────  packages/gooey/src/components/ui/*
                              All 120+ components consume tokens via Tailwind utilities
                              cn() for all className composition
```

---

## Navigating the Library

When asked about a **component**:
1. Implementation → `packages/gooey/src/components/ui/{component-name}.tsx`
2. Usage examples → `stories/{ComponentName}.stories.tsx`
3. Barrel export → `packages/gooey/src/index.ts` (every component must be here)

When asked about **design tokens**:
1. CSS variables → `packages/gooey/src/styles/design-tokens.css`
2. Hex values / gradient builders → `packages/gooey/src/lib/design-colors.ts`

When asked about **theming**:
1. ThemeProvider → `packages/gooey/src/hooks/use-theme.tsx`
2. Scale behavior → design-tokens.css (1=darker, 7=lighter in dark; INVERTED in light)

### Hooks
| Hook | Purpose |
|------|---------|
| `useTheme` | Theme state (dark/light/auto), `setTheme()`, `isDarkMode` |
| `useHaptics` | Haptic feedback triggers |
| `useReducedMotion` | Respects `prefers-reduced-motion` |
| `useTrayContext` | Tray/drawer state management |

---

## Component Library (117 components)

### Action
`action-button` · `action-circle-button` · `action-card-contacts` · `action-card-users`

### Display
`badge` · `badge-drop-zone` · `card` · `avatar` · `avatar-wheel` · `avatar-hype-train` · `skeleton` · `verified` · `numbers` · `step-counter`

### Input
`button` · `checkbox` · `input` · `input-secondary` · `radio` · `switch` · `slider-point` · `value-slider` · `prompt-bar` · `search-indication`

### Navigation
`bottom-bar` · `chevron-right` · `navigation-button` · `crumb` · `edit-bar` · `edit-bar-icons`

### Media
`album-art` · `album-art-cover` · `music-controls` · `music-cover-title` · `music-timer` · `track-info` · `soundwave` · `play-button` · `play-pause` · `record-button` · `voice-memo`

### Communication
`message-bubble` · `message-preview` · `message-preview-item` · `chat-bubble-button` · `chat-feed` · `notification` · `notification-preview-card` · `human-speech` · `reactions` · `react` · `contact-item` · `direct-message-head`

### Effects & Animation
`confetti` · `fireworks` · `mineral-effect` · `ripple-effect` · `sequin-effect` · `shooting-star` · `portal-animation` · `custom-cursor`

### Cards
`passport-card` · `onboarding-card` · `storage-pricing-card` · `connect-socials-card` · `connection-request-card` · `preview-card` · `theme-selector-card` · `document-card` · `add-bank-info-card` · `active-calls`

### Identity & Social
`claim-identity` · `pass-photo` · `password-safety` · `social-icons` · `server-avatar` · `email-avatar`

### Layout & Surface
`squircle` · `tray` · `tooltip-bubble` · `corner-dragger` · `dynamic-island` · `popover` · `context-menu` · `portal-context-menu` · `component-library-context-menu` · `component-library-meta-layer` · `menu-context` · `menu-context-icons` · `library-menu`

### Visual & Buttons
`glass-button` · `glass-icon-button` · `color-only-button` · `color-swatch` · `special-button` · `icon-only-button` · `power-button` · `right-hand-button` · `play-button`

### Tags
`medium-tag` · `small-tag` · `spine-tag`

### Brand & Icons
`logo` · `nexus-logo` · `oo` · `lordicon` · `payment-method-icon` · `location-point`

### Misc
`pet` · `plus` · `star` · `timer` · `motivator` · `image-preview` · `image-stack` · `bad` · `make-it-strong`

---

## Hard Rules (Never Violate)

### Rule 1: No hardcoded colors in components
```tsx
// ❌ NEVER
<div className="bg-[#9327FF]">
<div style={{ color: '#FF4D00' }}>
<div className="bg-purple-600">  // ← generic Tailwind palette, not our tokens

// ✅ ALWAYS
<div className="bg-primary">
<div className="text-purple-4">         // ← our registered token
<div className="bg-dark-glass-20">      // ← our glass token
<div className="bg-surface">            // ← our semantic alias
<div style={{ background: 'var(--gradient-flame)' }}>  // ← only if no utility exists
```

### Rule 2: Tailwind v4 — no tailwind.config.ts
```css
/* Gooey uses @theme inline { } in globals.css to register tokens */
/* There is NO tailwind.config.ts or tailwind.config.js */

/* ❌ NEVER — this file does not exist in Gooey */
// tailwind.config.ts
colors: { primary: 'hsl(var(--primary))' }

/* ✅ THIS IS HOW IT WORKS — in globals.css */
@theme inline {
  --color-primary: var(--primary);
  --color-purple-4: var(--color-purple-4);
}
/* Then use: className="bg-primary" or className="text-purple-4" */
```

### Rule 3: New tokens go in CSS FIRST
When you need a new design token:
1. Add the raw value to `:root { }` in `design-tokens.css`
2. Add the light mode counterpart to `:root.light { }` in `design-tokens.css`
3. Register it with Tailwind via `@theme inline { }` in `globals.css`
4. Use the Tailwind utility class in components

Never skip steps. Never go straight to step 4.

### Rule 4: Use cn() for ALL className composition
```tsx
// ❌ NEVER
className={`base-class ${isActive ? 'active' : ''}`}

// ✅ ALWAYS
import { cn } from "@/lib/utils"    // or from the barrel: import { cn } from "@jokuh/gooey"
className={cn('base-class', isActive && 'active')}
```

### Rule 5: oklch for semantic tokens, hex for palette tokens
```css
/* Semantic tokens in globals.css use oklch */
:root {
  --primary: var(--color-purple-4);     /* ← alias to palette token */
  --background: oklch(1 0 0);           /* ← or direct oklch value */
  --muted-foreground: oklch(0.556 0 0);
}

/* Palette tokens in design-tokens.css use hex */
:root {
  --color-purple-4: #9327FF;
  --color-smoke-2: #141414;
}

/* ❌ NEVER — hsl channel format (that's the old shadcn v3 pattern) */
--primary: 263 70% 58%;
```

### Rule 6: Dark/light theming uses TWO mechanisms
```
design-tokens.css:
  :root { }           ← dark theme palette values (default)
  :root.light { }     ← light theme palette values (scales invert)

globals.css:
  :root { }           ← semantic aliases (used in both themes)
  .dark { }           ← dark mode oklch overrides for semantic tokens
```

The Jokuh design system is **dark-first**: `:root` in `design-tokens.css` defines dark theme values. Light theme is `:root.light` where energy scales invert (1↔7, 2↔6, 3↔5), glass bases swap, and eclipse colors flip.

### Rule 7: Every component is custom — there are no shadcn imports
```
// ❌ WRONG — shadcn does not exist in this project
npx shadcn@latest add button

// ✅ CORRECT — build it in components/ui/
packages/gooey/src/components/ui/button.tsx
```

If you need a new component, build it. Use Radix UI primitives for accessible behavior when applicable (Dialog, Popover, Select, Tooltip, Context Menu, Scroll Area are already dependencies).

### Rule 8: Color scale direction matters
```
Design tokens use a 1-7 scale with specific semantics:
  Dark theme: 1 = darkest, 7 = lightest (natural reading)
  Light theme: scales INVERT — 1 = lightest, 7 = darkest

The midpoint (4) stays constant across themes.
This is handled automatically by design-tokens.css.
```

---

## Token Taxonomy

### Eclipse (absolute)
| Token | Dark | Light | Use |
|-------|------|-------|-----|
| `--color-dark-space` | `#000000` | `#FFFFFF` | App background (inverts) |
| `--color-light-space` | `#FFFFFF` | `#000000` | Primary text (inverts) |
| `--color-dark-solid` | `#000000` | `#000000` | Always black |
| `--color-light-solid` | `#FFFFFF` | `#FFFFFF` | Always white |

### Energies (7-step scales × 8 hues)
Pink, Purple, Blue, Cyan, Green, Yellow, Orange, Red — each with steps 1-7.
Usage: `bg-purple-4`, `text-red-3`, `border-cyan-5`.

### Shades
Smoke 1-7: neutral grays from near-black to near-white.

### Glass
Dark glass 5-90%, Light glass 5-90%: transparency layers.
Usage: `bg-dark-glass-20`, `bg-light-glass-50`.

### Materials (Precious Metals)
Two-stop gradients: Vanadium, Crude Copper, Copper, Bronze, Steel, Rose Gold, Gold, Silver, Platinum, Jaskmarr.

### Materials (Fantasy Scales)
Multi-step palettes: Gronk'sh, Plata, Orro, Drakzul, Slyvir, Adamant, Mithrill, Rune, Liktir, Amfrill.

### Minerals
Multi-stop gradient palettes: Rulgor, Veltryne, Zharuk, Kaleidyx.

### Factions
Two-color identity pairs: Nautilus, Pica, Odin, Aladar, Eclipse, Onyx, Omega, Epsilon.

### Origins (Omni-referenced — same in both themes)
Gradient pairs: Fruta, Flame, Solar, Life, Aether, Insight, Spirit.
Usage: `bg-gradient-flame`, or via CSS `var(--gradient-flame)`.

### Semantic Aliases (in globals.css :root)
| Variable | Points to | Controls |
|----------|-----------|----------|
| `--primary` | `var(--color-purple-4)` | Primary actions |
| `--secondary` | `var(--color-purple-3)` | Secondary actions |
| `--background` | `var(--color-dark-space)` | Page background |
| `--surface` | `var(--color-smoke-2)` | Elevated surfaces |
| `--text` | `var(--color-light-space)` | Primary text |
| `--text-secondary` | `var(--color-smoke-5)` | Secondary text |
| `--border` | `var(--color-smoke-3)` | Borders |
| `--squircleBorder` | `var(--color-smoke-3)` | Squircle borders |
| `--squircleFill` | `var(--color-smoke-2)` | Squircle fills |
| `--squircleFocus` | `var(--color-purple-3)` | Squircle focus ring |

### Typography
- **Sans**: Satoshi (300-900)
- **Display**: Rock Salt
- **Mono**: Red Hat Mono (400-700)
- Headlines H1-H8, Paragraphs lg/md/sm, Labels, Mono sizes
- Scalable via `--text-size-scale` CSS variable

### Grid System
| Breakpoint | Columns | Gap | Content | Margin |
|------------|---------|-----|---------|--------|
| Desktop Wide (≥1440) | 12 | 12px | 1440px | 240px |
| Desktop (1024-1439) | 12 | 12px | 1024px | 16px |
| Tablet (600-1023) | 6 | 12px | 768px | 16px |
| Phone (<600) | 6 | 4px | 320px | 16px |

---

## File Responsibilities

```
packages/gooey/src/styles/
  design-tokens.css         ← RAW PALETTE VALUES
                               Generated from Figma
                               :root { } (dark) and :root.light { }
                               Energies, Materials, Minerals, Factions, Origins
                               Typography, Grid, Effects
                               Font face declarations (Satoshi, Rock Salt, Red Hat Mono)

  globals.css               ← INTEGRATION LAYER
                               @import "tailwindcss" + design-tokens.css
                               @theme inline { } — registers tokens with Tailwind v4
                               :root { } — semantic aliases
                               .dark { } — dark mode oklch overrides
                               @layer base { } — resets, keyframes, global styles
                               Component-specific CSS (liquid-glass, spectral-border, etc.)

  mineral-effect.css        ← Mineral effect component styles

packages/gooey/src/lib/
  utils/cn.ts               ← cn() utility (clsx + tailwind-merge)
  utils/animations.ts       ← Animation utilities
  design-colors.ts          ← Hex lookups for Color Library UI
                               Materials, Minerals, Factions, Origins
                               Gradient CSS string builders

packages/gooey/src/hooks/
  use-theme.tsx             ← ThemeProvider + useTheme hook
                               Manages dark/light/auto via .dark class on <html>
                               localStorage persistence

packages/gooey/src/components/ui/
  *.tsx                     ← All 120+ Gooey components
                               Every component is custom-built
                               Uses cn() for className composition
                               Consumes design tokens via Tailwind utilities
```

---

## When Creating New Components

### Component checklist:
- [ ] Lives in `packages/gooey/src/components/ui/`
- [ ] Uses `cn()` for all className composition
- [ ] Uses token-based classes (`bg-primary`, `text-smoke-5`, `bg-dark-glass-20`) — never raw hex/rgb
- [ ] No hardcoded color values anywhere in the file
- [ ] Dark/light mode handled automatically via CSS variable swap, not conditional logic
- [ ] If new tokens needed: added to `design-tokens.css` (`:root` + `:root.light`) first, then registered in `globals.css` `@theme inline { }`
- [ ] Exported from `packages/gooey/src/index.ts` barrel
- [ ] Has a Storybook story in `gooey/stories/`

### Component template:
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
      variant === "glass" && "bg-light-glass-10 backdrop-blur-xl",
      className
    )}>
      {children}
    </div>
  );
}
```

### Design constraints:
- Glass morphism: translucent surfaces with `backdrop-blur`
- Touch targets: minimum 44px
- Consistent radius from design tokens (`--radius`)
- Clear hover, active, disabled states
- No arbitrary border-radius — use token values

### When using Radix UI primitives:
Already available as dependencies — use them for accessible compound components:
- `@radix-ui/react-dialog`
- `@radix-ui/react-popover`
- `@radix-ui/react-select`
- `@radix-ui/react-tooltip`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-scroll-area`

---

## When Updating the Theme

### Changing a palette value:
1. Update the hex in `design-tokens.css` `:root { }`
2. Update the light counterpart in `:root.light { }`
3. Done. Everything downstream inherits automatically.

### Changing a semantic alias:
1. Update the variable in `globals.css` `:root { }`
2. If it has a dark override, update `.dark { }` too.
3. Done.

### Adding a new token:
1. Add raw value to `design-tokens.css` `:root { }`
2. Add light value to `design-tokens.css` `:root.light { }`
3. Register in `globals.css` `@theme inline { --color-new-token: var(--new-token); }`
4. Use via Tailwind: `bg-new-token`

---

## Dark Mode Implementation

Dark mode is CSS-class-driven. The `ThemeProvider` in `use-theme.tsx` adds/removes `.dark` and `.light` classes on `<html>`:

```tsx
// ThemeProvider handles this at the app root — not per-component
// Supports: "dark" | "light" | "auto" (system preference)

// Components NEVER do this:
// ❌ className={isDark ? 'bg-gray-900' : 'bg-white'}
// ❌ const { isDarkMode } = useTheme(); if (isDarkMode) ...

// Components ALWAYS do this:
// ✅ className="bg-background text-foreground"
// ✅ className="bg-surface text-text"
// The values swap automatically via CSS variable overrides
```

Two theme mechanisms work together:
- `design-tokens.css`: `:root` (dark) vs `:root.light` — palette scales invert
- `globals.css`: `.dark { }` — semantic tokens get oklch dark overrides

---

## Quick Decision Tree

```
Need to change how a component LOOKS?
  └─→ Is it a color/spacing/radius issue?
       ├─ YES → Is it a palette color (energy, material, glass)?
       │    ├─ YES → Change in design-tokens.css (:root + :root.light). Done.
       │    └─ NO  → Change the semantic alias in globals.css :root. Done.
       └─ NO  → Is it structural/layout?
            ├─ YES → Edit the component file in components/ui/.
            └─ NO  → Is it a new visual concept we don't have a token for?
                 └─ YES → 1. Add to design-tokens.css (:root + :root.light)
                          2. Register in globals.css @theme inline { }
                          3. Use in component.

Need to add a new component?
  └─→ Build it in packages/gooey/src/components/ui/.
       Use Radix primitives for accessible behavior if applicable.
       Export from index.ts. Add a Storybook story.

Something looks wrong in a specific theme?
  └─→ Check design-tokens.css — is the :root.light value correct?
       Check globals.css — is the .dark { } override correct?

Need a new animation?
  └─→ Motion (Framer Motion) for component-level animations.
       CSS @keyframes in globals.css @layer base for global animations.
       anime.js for complex sequenced animations.
```

---

## Dependencies

### Runtime (in package.json):
```
clsx                    — conditional class composition
tailwind-merge          — Tailwind class deduplication (via cn())
class-variance-authority — component variant management (cva)
tailwindcss v4          — CSS-first configuration
tailwindcss-animate     — animation utilities
motion (Framer Motion)  — component animations
animejs                 — complex sequenced animations
lottie-react            — Lottie animation playback
matter-js               — physics simulations
figma-squircle          — iOS-style squircle shapes
sonner                  — toast notifications
@radix-ui/*             — accessible primitive components
@mantine/hooks          — utility hooks
hugeicons-react         — icon set
lucide-react            — icon set
```

### Design-time (NOT in package.json):
```
Figma                   — source of truth for design tokens
                          Tokens exported to design-tokens.css
```

---

## Glossary

| Term | Definition |
|------|-----------|
| **DEE** | Design Engineering Environment — this entire token pipeline |
| **Gooey** | `@jokuh/gooey` — the component library package |
| **Raw palette** | Hex values in design-tokens.css. Input to the system. |
| **Semantic token** | A design alias (`--primary` = "color for primary actions"). Points to a palette token. |
| **Energy** | A 7-step color scale (pink, purple, blue, cyan, green, yellow, orange, red) |
| **Material** | Precious metal or fantasy-themed color sets |
| **Mineral** | Multi-stop gradient-based color sets |
| **Origin** | Omni-referenced gradient pairs (same in dark and light) |
| **Faction** | Two-color identity pairs for game/social factions |
| **Eclipse** | The absolute black/white pair that inverts with theme |
| **Glass** | Transparency layers (dark-glass, light-glass) at opacity steps |
| **@theme inline** | Tailwind v4 directive that registers CSS variables as utility classes |
| **cn()** | clsx + tailwind-merge. Used for all className composition. |

---

## Rendering Model: HUD, Not Pages

Jokuh is a decentralized operating system. The UI is not a website with pages — it is a **heads-up display (HUD)** layered on top of ongoing activity, like a game engine renders its interface.

### Surfaces (Z-Index Layers)

The HUD is composed of **five surfaces** stacked by depth. Every component exists on exactly one surface. This is the law — no exceptions.

```
z-40 ─ ACTION SURFACE ──────────────────────── always on top
       TopBar (ActionButtons + DynamicIsland)
       BottomBar (Profile + PromptBar + Spine)
       These never get occluded by anything.

z-30 ─ FOCUS SURFACE ───────────────────────── lists & cards
       Messages List, Contacts List, etc.
       Appears when an action button triggers a list.
       Stretches from 12px below island to bottom edge.
       Content scrolls behind the Action surface.

z-20 ─ OVERLAY SURFACE ─────────────────────── dims lower layers
       Semi-transparent black (bg-black/50).
       Appears with the Focus surface. Click to dismiss.

z-10 ─ CONTENT SURFACE ─────────────────────── the activity
       PromptBar, main content components.
       Hidden (unmounted) when Focus surface is active.

z-0  ─ ENVIRONMENT SURFACE ─────────────────── the world
       3D models (Spline), backgrounds, ambient visuals.
       Always present, always lowest.
```

**Rules:**
- The Action surface is **always visible**. Nothing covers it.
- The Focus surface replaces the Content surface — they never coexist.
- The Overlay surface only exists when the Focus surface is active.
- The Environment surface is passive — it never receives interaction when higher surfaces are present.
- When switching between Focus lists (messages → contacts), use `AnimatePresence mode="wait"` for clean crossfade.

### Core Principle
The application **loads components into a shell**, not static pages into a router. Each state is a **situation** — a named component composition that describes what the HUD looks like right now. The shell has three logical layers within the surfaces:

```
┌─────────────────────────────────────┐
│          TopBar layer               │  ← ACTION surface (z-40)
│   [ActionButton]  [Island]  [Action]│     variant determines buttons + island state
├─────────────────────────────────────┤
│                                     │
│          Content layer              │  ← CONTENT surface (z-10) or FOCUS surface (z-30)
│     Components load in here         │     the "activity" area
│                                     │
├─────────────────────────────────────┤
│          BottomBar layer            │  ← ACTION surface (z-40)
│   [Profile] [PromptBar] [Spine]     │     variant determines layout
└─────────────────────────────────────┘
```

### Situations

A **situation** is the unit of UI state. It is not a route, not a page — it is a **component loadout** that the HUD adopts in response to what is happening.

```ts
type Situation = {
  name: string;                    // "home", "messaging", "profile", etc.
  topBar: {
    variant: TopBarVariant;        // "empty" | "default" | "oo"
    island: DynamicIslandVariant;  // "idle" | "oo" | "greetings" | "messages" | ...
    islandProps?: Record<string, unknown>;
  };
  content: React.ReactNode;        // what loads into the content layer
  bottomBar: {
    variant: BottomBarVariant;     // "empty" | "default" | "landing" | ...
    phoneVariant?: BottomBarPhoneVariant;
  };
};
```

The user doesn't "navigate to a page" — the system **enters a situation**. The HUD reconfigures itself: the island morphs, action buttons swap, content components mount/unmount, the bottom bar adapts. Each layer transitions independently.

### Why This Matters

1. **No page transitions** — Components animate in/out independently. The TopBar can morph its island while the content swaps and the BottomBar stays put.
2. **Agile and adaptive** — The HUD reshapes itself to the situation. Phone gets `BottomBarPhone`, desktop gets `BottomBar`. The shell is the same, the loadout adapts.
3. **Game-like rendering** — Components mount when needed, unmount when not. The UI is a living overlay on top of whatever the user is doing.
4. **Environment-dimensional** — The layout responds to its container, not to breakpoints. Components are self-contained units that work at any dimension.

### Rules for Building Situations

- **Never build a "page component"** that contains its own TopBar/BottomBar. Those belong to the shell.
- **Content components are the activity** — they fill the middle layer and know nothing about the bars above and below them.
- **Situation transitions are component-level** — each component animates itself in/out (via Motion). The shell doesn't orchestrate transitions.
- **The island is the status indicator** — it reflects system state (idle, messages, calls, etc.), not navigation state.
- **The action buttons are contextual** — they change based on what the user can do right now, not where they "are" in a nav tree.

### Defined Situations

| Situation | TopBar | Island | Content | BottomBar |
|-----------|--------|--------|---------|-----------|
| **Home** | `default` | `idle` | PromptBar (desktop only) | `default` / `BottomBarPhone` |
| **OO** | `default` | `oo` | — | `default` |
| **Contacts** | — | — | — | — |
| **Messages** | — | — | — | — |
| **Profile** | — | — | — | — |
| **Spine** | — | — | — | — |

*Situations marked with — are mapped but not yet defined. Fill in as they are built.*

---

## Commands

```bash
pnpm dev              # Start demo app (localhost:6062)
pnpm dev:prototype    # Start prototype app
pnpm storybook        # Start Storybook (localhost:6006)
pnpm build            # Build library
pnpm check-types      # TypeScript type checking
pnpm fmt              # Format with Prettier
pnpm fmt:check        # Check formatting
```

---

*This file is maintained by Hyke. Last updated: March 2026.*
*When in doubt, the answer is in globals.css — or one layer deeper, in design-tokens.css.*
