# Site Template Implementation Plan

## Purpose

Turn the tier architecture into a concrete repo structure and migration order.

This document assumes the conceptual model in:

- [site-tier-architecture.md](/Users/sonadin/Documents/code/jokuh/landing/docs/site-tier-architecture.md)
- [site-layer-architecture.md](/Users/sonadin/Documents/code/jokuh/landing/docs/site-layer-architecture.md)
- [homepage-template-system.md](/Users/sonadin/Documents/code/jokuh/landing/docs/homepage-template-system.md)

## Canonical Layer System

Use four layers only.

### Layer 1

`overview`

Use for:

- homepage
- high-level product or platform landings
- support entry landing
- category overviews

Rule:

- essence before explanation

### Layer 2

`detail`

Use for:

- product detail
- OS detail
- support detail
- article detail
- story detail
- company detail
- careers overview
- role detail

Rule:

- focused explanation without reference-style density

### Layer 3

`workspace`

Use for:

- docs overview
- quickstart
- guides
- cookbook
- API/reference
- support task guides if they become procedural and tool-heavy

Rule:

- navigable learning workspace

### Layer 4

`reference`

Use for:

- legal hub
- legal topic index
- legal document selector
- legal document reader
- privacy locale variants
- policy-heavy support/compliance surfaces

Rule:

- precision, retrieval, and version clarity

## Canonical Page Families

Every route should declare both a `PageTier` and a `PageFamily`.

Suggested types:

```ts
export type PageTier = "overview" | "detail" | "workspace" | "reference";

export type PageFamily =
  | "landing"
  | "categoryLanding"
  | "productDetail"
  | "osDetail"
  | "supportOverview"
  | "supportDetail"
  | "editorialArticle"
  | "storyArticle"
  | "companyDetail"
  | "careersOverview"
  | "careerRoleDetail"
  | "docsIndex"
  | "docsGuide"
  | "docsReference"
  | "legalHub"
  | "legalTopicIndex"
  | "legalDocumentSelector"
  | "legalDocument";
```

## Route To Family Mapping

### Current routes

- `/` -> `overview` / `landing`
- `/pods`, `/blurbs`, `/spine`, `/vortex` -> `detail` / `productDetail`
- `/about` -> `detail` / `companyDetail`
- `/careers` -> `detail` / `careersOverview`
- `/journal/:slug` -> `detail` / `editorialArticle`
- `/stories/:slug` -> `detail` / `storyArticle`
- `/developers/docs` -> `workspace` / `docsIndex`
- `/developers/docs/quickstart` -> `workspace` / `docsGuide`
- `/developers/docs/cookbook` -> `workspace` / `docsGuide`
- `/legal` -> `reference` / `legalHub`
- `/legal/privacy` -> `reference` / `legalTopicIndex`
- `/legal/privacy/:docKey` -> `reference` / `legalDocumentSelector`
- `/legal/privacy/:docKey/read/:locale` -> `reference` / `legalDocument`
- `/legal/terms` -> `reference` / `legalDocument`

### Future routes

- `/support` -> `overview` or `detail` / `supportOverview`
- `/support/:slug` -> `detail` or `workspace` / `supportDetail`
- `/os/:slug` -> `detail` / `osDetail`
- `/careers/:role` -> `detail` / `careerRoleDetail`
- `/developers/sdk` -> `workspace` / `docsReference`

## File Architecture

Recommended structure:

```text
src/
  components/
    system/
      page-meta/
        page-types.ts
      templates/
        pages/
          OverviewLandingPageTemplate.tsx
          ProductDetailPageTemplate.tsx
          NarrativeDetailPageTemplate.tsx
          SupportDetailPageTemplate.tsx
          CareersOverviewPageTemplate.tsx
          CareerRoleDetailPageTemplate.tsx
          DocsWorkspaceTemplate.tsx
          DocsGuidePageTemplate.tsx
          DocsReferencePageTemplate.tsx
          LegalHubPageTemplate.tsx
          LegalDocumentSelectorPageTemplate.tsx
          LegalReferenceDocumentTemplate.tsx
        sections/
          HeroStatementSectionTemplate.tsx
          HeroVisualSectionTemplate.tsx
          ShowcaseCarouselSectionTemplate.tsx
          FeatureGridSectionTemplate.tsx
          SplitNarrativeSectionTemplate.tsx
          ProofStripSectionTemplate.tsx
          StickySidebarContentSectionTemplate.tsx
          DocsIntroSectionTemplate.tsx
          StepSequenceSectionTemplate.tsx
          ReferenceTableSectionTemplate.tsx
          LocaleSelectorSectionTemplate.tsx
          LegalSectionGroupTemplate.tsx
          CaptureSectionTemplate.tsx
          ActionBandSectionTemplate.tsx
        blocks/
          SectionHeaderBlock.tsx
          CarouselCardBlock.tsx
          FeatureCardBlock.tsx
          VisualTileBlock.tsx
          QuoteBlock.tsx
          TocBlock.tsx
          DocumentMetaBlock.tsx
          LocalePickerBlock.tsx
          ResourceLinkListBlock.tsx
          InlineCaptureFormBlock.tsx
  data/
    page-meta/
      page-types.ts
    pages/
      home.ts
      products/
        pods.ts
        blurbs.ts
        spine.ts
        vortex.ts
      docs/
        overview.ts
        quickstart.ts
        cookbook.ts
      legal/
        privacy/
        terms/
      careers/
        overview.ts
        roles/
```

## Ownership Boundaries

This is the part that keeps the system clean.

### `src/data/pages`

Owns:

- words
- card content
- ordered sections
- page metadata
- page tier/family declarations

Should not own:

- visual layout logic

### `src/components/system/templates/pages`

Owns:

- page-family behavior
- spacing model
- sidebar or rail behavior
- breadcrumb placement
- docs vs legal vs landing shell behavior

Should not own:

- page copy
- route-specific data fetching choices

### `src/components/system/templates/sections`

Owns:

- section-level layout
- section-level rhythm
- internal composition of blocks

Should not own:

- route wiring

### `src/components/system/templates/blocks`

Owns:

- smallest reusable branded units
- cards
- headers
- TOCs
- metadata rows
- forms

Should not own:

- section orchestration

### `src/pages`

Owns:

- route binding
- selecting data module
- selecting page template

Should not own:

- long inline layout systems
- bespoke content objects

## What To Refactor First

Build these page templates first:

1. `OverviewLandingPageTemplate`
2. `ProductDetailPageTemplate`
3. `DocsWorkspaceTemplate`
4. `LegalReferenceDocumentTemplate`

Then these section templates:

1. `HeroStatementSectionTemplate`
2. `ShowcaseCarouselSectionTemplate`
3. `FeatureGridSectionTemplate`
4. `StickySidebarContentSectionTemplate`
5. `LegalSectionGroupTemplate`

Then these blocks:

1. `SectionHeaderBlock`
2. `CarouselCardBlock`
3. `FeatureCardBlock`
4. `TocBlock`
5. `DocumentMetaBlock`

## Migration Order

### Phase 1

Add page metadata types.

- create `PageTier`
- create `PageFamily`
- start tagging page data modules with both

### Phase 2

Extract page-family templates without changing visuals.

- homepage -> `OverviewLandingPageTemplate`
- product detail -> `ProductDetailPageTemplate`
- docs layout -> `DocsWorkspaceTemplate`
- legal document -> `LegalReferenceDocumentTemplate`

### Phase 3

Move page content into explicit page data modules.

- homepage data
- product page data
- docs page data
- legal page data
- careers page data

### Phase 4

Extract section templates from existing pages.

- landing hero
- recent news
- stories gallery
- product feature sections
- story/article detail blocks
- legal section groups

### Phase 5

Introduce new families.

- support overview/detail
- OS detail
- career role detail
- docs reference pages

## Specific Guidance By Surface

### Landing

Stay sparse.

Use:

- strong hero
- carousel or tile-led discovery
- minimal copy
- one dominant CTA path

Avoid:

- long explanatory sections

### Product / OS / Support Detail

Stay selective.

Use:

- narrative hero
- visual proof
- carousel cards
- comparison/value sections
- targeted CTA

Avoid:

- dumping all support/legal/reference detail into the same page

### Docs

Should feel operational, not theatrical.

Use:

- wider canvas
- persistent left nav
- optional right rail for anchors
- code blocks and steps as first-class blocks

Avoid:

- reusing narrow marketing content widths as the primary docs experience

### Legal

Should feel calm and exact.

Use:

- hub -> selector -> document flow
- clear locale/version metadata
- strong anchors and table of contents
- restrained visuals

Avoid:

- trying to make dense legal content behave like marketing storytelling

## Bottom Line

The repo should stop growing as:

- generic shell -> bespoke page

and start growing as:

- page tier
- page family
- section template
- block template
- page data

That is the clean layer system that will let Jokuh scale across landing, detail, docs, support, careers, and legal without losing clarity.
