# Hover Sound Guidelines

Date: 2026-03-26

## Purpose

Capture the hover-sound direction decided today so the sonic behavior stays intentional, sparse, and consistent as the landing site evolves.

This is not meant to create a broad sonic UI. It is meant to protect a very specific feeling:

- extremely gentle
- soft and premium
- more "inside the experience" than "UI feedback"
- never arcade-like, 8-bit, BIOS-like, sharp, or attention-seeking

## Interaction Philosophy

Hover sound should feel rare and earned.

It should reinforce only the highest-intent conversion moments, not ordinary navigation or utility interactions.

The sound should read as:

- soft air
- light glass
- felt touch
- subtle shimmer

It should not read as:

- click
- beep
- pop
- chirp
- game UI

## Where Hover Sound Belongs

Hover sound is allowed on super primary CTA buttons only.

Current intended CTA tier:

- `Claim identity`
- `Try Jokuh`
- `Download` in the homepage pre-footer action band
- product-page primary CTA buttons
- company-page primary-neutral CTA buttons

Current implementation references:

- [src/components/landing/ClaimIdentityCta.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/ClaimIdentityCta.tsx)
- [src/components/SiteTopBar.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/SiteTopBar.tsx)
- [src/components/SiteSearchFullscreenOverlay.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/SiteSearchFullscreenOverlay.tsx)
- [src/components/landing/PreFooterCta.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/PreFooterCta.tsx)
- [src/components/product/ProductGlowCtas.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/product/ProductGlowCtas.tsx)
- [src/components/CompanyPageLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CompanyPageLayout.tsx)
- [src/pages/AboutPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/AboutPage.tsx)
- [src/pages/CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx)

## Where Hover Sound Should Stay Silent

Do not spread hover sound to general navigation or repeated interaction surfaces.

Keep these silent:

- footer links
- hero quick pills
- story tiles
- journal cards
- search button
- menu buttons
- close buttons
- carousel dots
- filter controls
- form fields
- most secondary links
- utility buttons

Rule of thumb:

- if a user may pass over many of them quickly, keep them silent
- if the action is informational rather than decisive, keep it silent
- if the sound would make the site feel "instrumented," keep it silent

## Motion Relationship

The hover sound should support the same soft visual language as the hover states:

- slower easing
- minimal scale change
- subtle opacity or shadow shifts
- no abrupt brightness flashes

Sound and motion should feel like the same design voice.

## Implementation Notes

Shared sound engine:

- [src/lib/gentle-hover-sfx.ts](/Users/sonadin/Documents/code/jokuh/landing/src/lib/gentle-hover-sfx.ts)

Shared hook:

- [src/hooks/useGentleHoverSound.ts](/Users/sonadin/Documents/code/jokuh/landing/src/hooks/useGentleHoverSound.ts)

Current implementation details:

- procedural Web Audio, not a media asset file
- one shared audio context
- primed after first real interaction
- global hover cooldown to prevent chatter
- local per-element cooldown to avoid double-firing
- mouse and pen only for pointer entry
- reduced-motion users do not get hover sound
- disabled when the document is not visible

## Browser Constraint

A completely fresh page load may not play sound on the very first hover.

This is expected browser behavior.

Browsers typically require one real interaction first, such as:

- click
- tap
- key press

After that first interaction, hover sound should work normally on supported CTA surfaces.

## Tuning Notes From Today

The sound was intentionally tuned to be more audible than the first pass while staying soft.

Current tuning goals:

- audible on normal laptop speakers
- still low-volume
- no harsh transient
- no aggressive top-end
- short and restrained

If future tuning is needed, prefer:

- tiny changes in presence
- tiny changes in shimmer
- tiny changes in brightness

Avoid:

- louder attack
- longer tail
- more frequent triggering
- per-button novelty sounds

## Future Guardrails

Before adding hover sound to any new element, ask:

1. Is this one of the page's highest-intent CTAs?
2. Would repeated hover passes become annoying?
3. Does the sound make the experience feel more immersive, or just more busy?

If the answer is not clearly in favor of immersion, do not add the sound.
