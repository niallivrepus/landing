# Storybook Performance

## Goal

Make default Storybook pages fast enough for daily design-system work.

## Hotspots

- `dynamic-island.tsx`
- `prompt-bar.tsx`
- `pet.tsx`
- `email-avatar.tsx`
- `fireworks.tsx`
- `badge-drop-zone.tsx`

## Strategy

- Default docs stories should be static.
- Expensive motion, audio, portals, physics, and loops should be opt-in.
- Heavy stories should be split into:
  - default docs story
  - live effects story
  - stress story when needed

## Next Changes

- Add story-safe flags like `disableAnimation`, `static`, or `reducedMotion`.
- Audit cleanup for listeners, timers, and portals.
- Measure cold-build and navigation improvements after story cleanup.

## Acceptance

- Heavy stories do not autoplay by default.
- Storybook navigation remains responsive.
- Expensive components clean up correctly on unmount.
