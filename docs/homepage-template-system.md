# Homepage Template System

## Goal

Systemize the main homepage so new content can be printed through a small set of hierarchical templates instead of bespoke section components.

The homepage should become:

1. A page shell.
2. A stack of section templates.
3. A set of card/block templates inside those sections.
4. Data schemas that feed those templates.

This keeps context distributed across layers:

- page-level intent
- section-level intent
- content-block intent
- item/card-level content

## Current Homepage Anatomy

The homepage in [src/pages/Home.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/Home.tsx) currently composes:

- `LandingHero`
- `RecentNewsSection`
- `StoriesSection`
- `IdentityBlock`
- `WaitlistSection`
- `PreFooterCta`

It already uses a shared shell through [src/components/system/MarketingPageFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/MarketingPageFrame.tsx), which is the right top-level abstraction.

The problem is one level lower:

- sections are still mostly bespoke
- content selection and layout are coupled together
- section templates are not yet formalized
- card patterns exist, but mostly as local one-offs

## What The Homepage Is Really Doing

Under the surface, the homepage has five repeating content jobs:

1. Hero / thesis
2. Featured feed / editorial stream
3. Multi-tile discovery grid
4. Brand or identity statement block
5. Conversion / capture CTA

That means the homepage should not be treated as one custom page. It should be treated as one composition of reusable template families.

## Recommended Hierarchical Template Stack

### Level 0: Page Shell Templates

These control chrome, backdrop, section order, and page rhythm.

Build:

- `MarketingShellTemplate`
- `ImmersiveLandingPageTemplate`
- `ContentHubPageTemplate`

Use:

- `MarketingShellTemplate` should stay close to the current `MarketingPageFrame`.
- `ImmersiveLandingPageTemplate` should wrap a hero-first page with atmospheric background and stacked section slots.
- `ContentHubPageTemplate` can later power journal, research, stories, or ecosystem landing pages.

Current fit:

- Homepage should become `ImmersiveLandingPageTemplate`.

### Level 1: Section Templates

These are the most important missing system layer.

Build:

- `HeroStatementSectionTemplate`
- `FeaturedFeedSectionTemplate`
- `TileGallerySectionTemplate`
- `CenteredManifestoSectionTemplate`
- `CaptureSectionTemplate`
- `ActionBandSectionTemplate`

What each one means:

- `HeroStatementSectionTemplate`
  - headline
  - optional subcopy
  - primary interactive module
  - quick links / prompt suggestions
- `FeaturedFeedSectionTemplate`
  - section header
  - one featured item
  - N secondary items
  - optional view-all action
- `TileGallerySectionTemplate`
  - section header
  - equal visual tiles
  - optional metadata below each tile
- `CenteredManifestoSectionTemplate`
  - central visual motif
  - one strong statement
  - supporting text
  - one CTA
- `CaptureSectionTemplate`
  - conversion heading
  - optional support copy
  - input action block
- `ActionBandSectionTemplate`
  - short headline
  - one strong CTA
  - optional alternate action

Current homepage mapping:

- `LandingHero` -> `HeroStatementSectionTemplate`
- `RecentNewsSection` -> `FeaturedFeedSectionTemplate`
- `StoriesSection` -> `TileGallerySectionTemplate`
- `IdentityBlock` -> `CenteredManifestoSectionTemplate`
- `WaitlistSection` -> `CaptureSectionTemplate`
- `PreFooterCta` -> `ActionBandSectionTemplate`

### Level 2: Block Templates

These should sit inside the section templates and be reusable across pages.

Build:

- `SectionHeaderBlock`
- `FeaturedCardBlock`
- `CompactStackCardBlock`
- `VisualTileBlock`
- `StatementWithVisualBlock`
- `InlineCaptureFormBlock`
- `PrimaryActionBlock`

Notes:

- `SectionHeaderRow` already exists and should likely evolve into `SectionHeaderBlock`.
- `RecentNewsSection` already contains two useful blocks hidden inside one file:
  - featured editorial card
  - compact stacked card
- `StoriesSection` contains a reusable visual tile pattern.
- `WaitlistSection` contains a reusable inline capture form pattern.

### Level 3: Content Schemas

This is the layer that will let you print more content without touching layout code.

Build data schemas for:

- `HeroStatementSectionData`
- `FeaturedFeedSectionData<T>`
- `TileGallerySectionData<T>`
- `ManifestoSectionData`
- `CaptureSectionData`
- `ActionBandSectionData`

The homepage should become a data-driven section list rather than hardcoded component imports.

Example direction:

- `src/data/homepage.ts`
  - hero
  - journalSection
  - storiesSection
  - identitySection
  - captureSection
  - preFooterAction

Then:

- `Home.tsx` becomes page composition
- section templates become generic renderers
- content modules own the actual words, links, and item choices

## Current Structural Issues

### 1. Data selection is mixed with rendering

Example:

- [src/components/landing/RecentNewsSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/RecentNewsSection.tsx) sorts, slices, maps, and renders in one component.

That should be split into:

- data adapter
- section template
- card blocks

### 2. Similar section structures are not yet formalized

`RecentNewsSection` and `StoriesSection` are different visually, but both are really:

- section wrapper
- header row
- repeatable content items
- action link

That means they belong in the same template family, not as unrelated custom sections.

### 3. The homepage is composable, but not yet schema-driven

[src/pages/Home.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/Home.tsx) is clean, but it composes concrete components rather than template instances with data.

That is good for readability, but not yet good enough for scalable content printing.

### 4. Visual atmosphere is reusable, but currently page-specific

[src/components/landing/GooeyBackdrop.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/GooeyBackdrop.tsx) is really a page-atmosphere primitive.

It should stay reusable at the page-shell level rather than being thought of as homepage-only decoration.

## Proposed File System Direction

Suggested structure:

```text
src/
  components/
    system/
      templates/
        pages/
          ImmersiveLandingPageTemplate.tsx
          ContentHubPageTemplate.tsx
        sections/
          HeroStatementSectionTemplate.tsx
          FeaturedFeedSectionTemplate.tsx
          TileGallerySectionTemplate.tsx
          CenteredManifestoSectionTemplate.tsx
          CaptureSectionTemplate.tsx
          ActionBandSectionTemplate.tsx
        blocks/
          SectionHeaderBlock.tsx
          FeaturedCardBlock.tsx
          CompactStackCardBlock.tsx
          VisualTileBlock.tsx
          InlineCaptureFormBlock.tsx
  data/
    templates/
      homepage.ts
      section-types.ts
```

If you want to keep the current `landing/` folder, that is also fine, but the hierarchy should still be:

- page templates
- section templates
- block templates

not just a flat folder of homepage pieces.

## What To Build First

Build these first because they unlock the most reuse with the least churn:

1. `HeroStatementSectionTemplate`
2. `FeaturedFeedSectionTemplate`
3. `TileGallerySectionTemplate`
4. `CaptureSectionTemplate`
5. `ActionBandSectionTemplate`

Then extract these block templates:

1. `SectionHeaderBlock`
2. `FeaturedCardBlock`
3. `CompactStackCardBlock`
4. `VisualTileBlock`
5. `InlineCaptureFormBlock`

After that, move homepage copy and config into `src/data/homepage.ts`.

## Recommended Refactor Order

### Phase 1

Keep visuals the same. Only separate data from rendering.

- create `src/data/homepage.ts`
- move section copy and link config there
- keep current landing components as renderers

### Phase 2

Extract reusable section templates.

- convert `LandingHero`
- convert `RecentNewsSection`
- convert `StoriesSection`
- convert `IdentityBlock`
- convert `WaitlistSection`
- convert `PreFooterCta`

### Phase 3

Extract reusable blocks.

- news cards
- visual tiles
- section headers
- capture form

### Phase 4

Create other page families from the same templates.

- research landing
- ecosystem landing
- developer landing
- press or journal landing

## Bottom Line

The homepage is already close to a system, but the missing layer is the section template layer.

Right now the repo has:

- a strong page shell
- some useful block patterns
- good data habits in other parts of the site

What it still needs is:

- formal section templates
- data schemas for those sections
- a hierarchy that separates page, section, block, and content concerns

That is the structure that will let you print more content while preserving clarity, reuse, and context distribution.
