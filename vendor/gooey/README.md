# Gooey

The design system and component library for [Jokuh](https://jokuh.com).

Gooey is not a UI kit. It is the visual language of a platform built to express human identity — where every color carries mood, every shape carries conviction, and every space between them creates the peace that lets people feel something real through a screen.

---

## Vision

Jokuh is building a platform where digital identity is not a profile page — it's a living portrait. A mosaic of self-contained visual moments called Pods, arranged in bento grids, reflecting who you are through what you choose to show. Gooey is the material that makes this portrait feel alive.

The components in this library are designed for a world where:

- **Humans and AI coexist in the interface** — monospace typography matters because an agentic workforce is working alongside you, and its presence should be visually represented
- **Identity is expressed through atoms of design** — every badge, every card, every pod is a deliberate visual statement, not a generic container
- **Communication feels like an extension of self** — message bubbles, reactions, voice memos, and spine timelines are built to carry emotional weight, not just data
- **The interface understands you** — AI-suggested pods generate hyper-detailed visual gifts based on your patterns, not generic stock imagery

Gooey exists because the current generation of design systems optimizes for developer productivity at the cost of emotional resonance. We chose the opposite — components that feel like something, even if that means building each one for exactly one purpose.

> *"Some people say they don't know what design is, they feel a certain way. That feeling creates potential action — it's the small percentage of emotion that could bring a person to feel more or less for a certain product."*

---

## The HYKE Principle

**Healing Your Key Elements**

Design reduces to three fundamental elements. Everything else derives from their interaction.

```
COLORS       →  Mood, tone, emotional resonance
SHAPES       →  Direction, conviction, energy
WHITE SPACE  →  Resonance, ambiance, interpretation
```

> *"Those three elements already are a system. Collectively, they're able to generate any visualization in the world."*

**Colors** aren't decoration — they're emotional infrastructure. The Jokuh color system maps to chakra energies, precious metals, and glass transparencies because color should resonate with the feelings of the human, not just pass accessibility checks.

**Shapes** carry conviction through the Kiki and Bouba effect — sharp edges create direct, necessary tones; rounded shapes create calm, comfort. Different people around the world resonate differently with those shapes.

**White space** is the peacemaker. It creates the resonance and ambiance that allows interpretation to spread wild.

> *"The goal is to not overdo that either. You gotta stay simplistic with that system, to not overdo certain patterns in order to be delicately available to the viewer."*

---

## Philosophy

### Peaceful Resonance

The most critical principle. Every component exists for exactly what it will be used for — nothing more. No S, M, L variants "just in case." Remove until it breaks, then add back one thing.

> *"If the user doesn't understand, it's not a user interface — it's just an interface, but no users."*

### Stupid Simple

Three paragraph types. Purpose-built buttons. Intentional constraints. The right amount of complexity is the minimum needed.

> *"Do everything stupid simple."*

### Knowing and Feeling

There are two ways to understand a message. Through **knowing** — you read something and understand. Through **feeling** — something gives you a sort of magic feeling. Gooey designs for both.

### The Bird on Canvas

> *"Paint one small bird in the top right corner, and you have a very simplistic, clean look that allows for interpretation to spread wild."*

White space follows the **Table of Eights**: 2px, 4px, 8px, 16px, 24px, 32px, 48px, 64px. Double or halve. Never arbitrary.

---

## Architecture

Gooey operates as a two-library system — like the relationship between ROM and RAM.

```
┌──────────────────┐         ┌──────────────────┐
│   CORE LIBRARY   │         │ PATTERN LIBRARY  │
│   (Design Tokens)│────────>│  (Components)    │
│                  │         │                  │
│  Typography      │         │  Buttons         │
│  Colors          │         │  Badges          │
│  Effects         │         │  Cards           │
│  Spacing         │         │  Inputs          │
│                  │         │  Menus           │
│                  │         │  Pods            │
│                  │         │  Island          │
│                  │         │  Spine           │
└──────────────────┘         └──────────────────┘
```

The Core Library sends foundational data. The Pattern Library receives and compiles it into interfaces.

---

## Color System

### Theme Inversion

Colors follow a theme-aware inversion rule. Scales read 1 (darkest) to 7 (lightest) in dark mode, and invert in light mode.

### Categories

| Category | Purpose |
|----------|---------|
| **Eclipse** | Black and white foundations — inverted and solid variants |
| **Balance** | Yin/Yang gradients for subtle transitions |
| **Energies** | 8 color scales (Pink, Purple, Blue, Cyan, Green, Yellow, Orange, Red) with 7 steps each |
| **Materials** | Precious metals — Vanadium, Copper, Bronze, Steel, Rose Gold, Gold, Silver, Platinum |
| **Minerals** | Crystal and gemstone gradients |
| **Glass** | Transparency scales from 5% to 90% opacity |
| **Smoke** | Neutral grayscale scale |

### Badge Color Semantics

Colors carry functional meaning:

```
Red      →  Something wrong, error state
Orange   →  Action needed
Yellow   →  Alert, potential issue
Green    →  Success, building up
Blue     →  Communication, wisdom
Purple   →  Mysticism, special
Neutral  →  Glass variants
```

The color logic formula: Fill uses Color 1, Stroke uses Color 3, Text uses Color 4 — the neutral balance point.

---

## Typography

Satoshi as the primary typeface. Rock Salt for expressive moments. Geist Mono for code.

| Category | Purpose | Range |
|----------|---------|-------|
| **Headline** | Display text | H1 (72px) → H7 (16px) |
| **Paragraph** | Body text | 14px and 16px, regular and semi-bold |
| **Label** | UI elements | Buttons, tags, badges |
| **Monospace** | Code display | Agentic workforce representation |

---

## Effects

Inner light effects create the illusion of light hitting elevated surfaces:

```css
--effect-light-big: inset 0 2px 2px 0 rgba(255, 255, 255, 0.15);
--effect-light-small: inset 0 1px 1px 0 rgba(255, 255, 255, 0.15);
--effect-light-xs: inset 0 0.5px 1px 0 rgba(255, 255, 255, 0.15);
```

---

## Components

117 components built for the Jokuh platform. Every button has four states (default, disabled, hover, pressed). Every component is purpose-built — made for exactly what it will be used for.

### Highlights

- **Avatar** — with hype trains, wheels, and custom borders
- **Badge** — color-semantic with stroke and filled variants
- **Dynamic Island** — contextual card that scales between 6 states
- **Prompt Bar** — sacred input field, pill-shaped, expandable
- **Pod** — atomic unit of visual expression in bento grid layouts
- **Spine** — 33 vertebrae timeline with fixed center time indicator
- **Message Bubble** — conversation interface with reactions
- **Tray** — contextual action surface
- **Mineral Effect** — crystallized light reflection

---

## Pods

A pod is an atomic unit of visual expression — a self-contained visual moment that communicates something specific about a person.

```
A pod does ONE thing.
It does that thing beautifully.
Then it disappears into the grid.
```

Four canonical sizes in a responsive bento grid:

| Size | Grid Units | Best For |
|------|-----------|----------|
| 1x1 small | 1 col x 1 row | Icons, status, quick actions |
| 1x2 wide | 2 col x 1 row | Cards, previews, links |
| 2x1 tall | 1 col x 2 row | Lists, stacked content |
| 2x2 big | 2 col x 2 row | Media, galleries, rich content |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the component preview app
pnpm dev

# Open http://localhost:5173
```

### Using in your project

```tsx
import { Button, Avatar, Badge } from "@jokuh/gooey";
import "@jokuh/gooey/styles/globals.css";
```

---

## Project Structure

```
gooey/
├── apps/gooey/              # Vite preview app
│   ├── src/App.tsx          # Component showcase
│   └── public/              # Fonts and images
├── packages/gooey/          # @jokuh/gooey component library
│   ├── src/
│   │   ├── index.ts         # Barrel exports
│   │   ├── components/ui/   # 117 components
│   │   ├── hooks/           # Theme, haptics, motion, tray
│   │   ├── lib/             # Utilities, animations, colors
│   │   ├── styles/          # Design tokens, globals
│   │   └── assets/          # Lordicon animations
│   └── package.json
└── packages/typescript-config/
```

---

## Tech Stack

- **React 19** — UI framework
- **TailwindCSS 4** — utility-first styling
- **Radix UI** — accessible primitives
- **Motion** — physics-based animations
- **Vite** — development and build tooling
- **pnpm** — workspace management

---

## Design Tokens

Generated from Figma. All tokens live in `packages/gooey/src/styles/design-tokens.css` as CSS custom properties — covering the full color system, material gradients, grid system, spacing, and typography.

Font families: **Satoshi** (300–900), **Rock Salt**, **Geist Mono**

---

> *"The Hyke Principle states that by understanding this principle, we are able to create anything in the world. We are making sure here that we are creating with those core principles at hand, and from that, systems appear."*

*Colors + Shapes + White Space = System*
