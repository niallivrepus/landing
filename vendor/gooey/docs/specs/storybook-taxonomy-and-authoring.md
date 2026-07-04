# Storybook Taxonomy And Authoring

## Goal

Replace gallery-style demos with stories that document real usage.

## Canonical Taxonomy

- `Foundations/*`
- `Components/Buttons/*`
- `Components/Inputs/*`
- `Components/Cards/*`
- `Components/Messaging/*`
- `Components/Overlays/*`
- `Components/Media/*`
- `Components/Effects/*`
- `Internal/*`

## Story Rules

- Every public component gets one realistic usage story.
- No empty required payloads.
- No repeated asset paths when fixtures can provide them.
- No inline wrapper styles when a shared story surface can express the same layout.

## First Rewrite Batch

- `Avatar`
- `ChatFeed`
- `Lordicon`
- `Popover`
- `PromptBar`
- `Tray`
- `DynamicIsland`
- `MessageBubble`

## Acceptance

- Story titles follow one taxonomy.
- Real scenarios exist for high-traffic components.
- Inline story scaffolding is materially reduced.
