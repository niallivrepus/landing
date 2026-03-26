# Site Layer Architecture

## Objective

Define a clean page-tier system for Jokuh so the site can scale across:

- primary landing pages
- product and OS detail pages
- support pages
- article and story detail pages
- company and careers pages
- developer documentation
- legal and privacy pages with locale variants

The system should enforce information depth by layer instead of letting each page invent its own density.

The core principle is:

1. Customer-facing first.
2. Minimal before detailed.
3. Narrative before reference.
4. Documentation before legal depth.

## Recommended Tier Model

Use four primary layers.

### Tier 1: Overview / Customer-First Landing

Purpose:

- introduce Jokuh
- create resonance
- orient the visitor
- move people into the right next layer

Characteristics:

- minimal copy
- large visual rhythm
- strong punch lines
- few choices
- almost no dense paragraphs
- overview only, never exhaustive explanation

Examples:

- homepage
- top-level landing pages
- ecosystem overviews
- high-level platform overviews

Allowed content density:

- 1 headline
- 1 short support paragraph
- 1 primary CTA
- 1 to 3 secondary prompts
- strong card-led discovery

This is the "Apple keynote" layer.

### Tier 2: Focused Detail / Decision Layer

Purpose:

- explain one thing clearly
- help a customer evaluate
- deepen interest without overwhelming

Characteristics:

- still visual
- still brand-led
- more explanation than Tier 1
- still selective, not encyclopedic
- structured around focused questions:
  - what is it
  - why it matters
  - how it feels
  - why trust it
  - what next

Examples:

- product detail pages
- OS detail pages
- support overview pages
- article detail pages
- story detail pages
- about pages
- careers landing pages

Allowed content density:

- sectional narratives
- carousel cards
- split layouts
- testimonial or trust modules
- reading sections in moderate doses
- no reference-style walls of text

This is the "product story" layer.

### Tier 3: Developer Learning / Operational Docs

Purpose:

- teach developers gradually
- support integration and adoption
- reveal complexity on demand

Characteristics:

- app-like layout
- left nav plus content panel
- full-width working space
- progressive learning flow
- examples, code, recipes, reference links
- less brand theater, more utility

Examples:

- docs overview
- quickstart
- cookbook
- SDK/API docs
- apps platform docs

Allowed content density:

- medium to high
- code samples
- tabbed or sectional docs blocks
- step sequences
- reference callouts

This is the "workspace" layer, not the "marketing" layer.

### Tier 4: Trust / Legal / Regulatory Reference

Purpose:

- satisfy legal, policy, compliance, and regulatory needs
- support region and language specificity
- remain readable without pretending to be light content

Characteristics:

- highest information density
- strict structure
- clear versioning and locale context
- table of contents and anchors
- breadcrumbing
- long-form reading optimized for trust and clarity

Examples:

- privacy hub
- privacy policy documents by locale
- terms of service
- government request pages
- governance disclosures
- internet services policy pages

Allowed content density:

- high
- long-form sections
- bullet lists
- resource links
- policy metadata
- locale selector flows

This is the "reference record" layer.

## Page Families By Tier

### Tier 1 Page Families

- `OverviewLandingPageTemplate`
- `CategoryLandingPageTemplate`
- `MinimalCampaignLandingPageTemplate`

Maps to likely pages:

- `/`
- future top-level category landings

### Tier 2 Page Families

- `ProductDetailPageTemplate`
- `OsDetailPageTemplate`
- `SupportOverviewPageTemplate`
- `ArticleDetailPageTemplate`
- `StoryDetailPageTemplate`
- `CompanyNarrativePageTemplate`
- `CareersLandingPageTemplate`
- `CareerRoleDetailPageTemplate`

Maps to likely pages:

- `/pods`, `/blurbs`, `/spine`, `/vortex`
- future OS pages
- `/support`
- `/journal/:slug`
- `/stories/:slug`
- `/about`
- `/careers`
- future `/careers/:role`

### Tier 3 Page Families

- `DocsWorkspaceTemplate`
- `DocsGuideTemplate`
- `DocsReferenceTemplate`
- `DocsCookbookTemplate`

Maps to likely pages:

- `/developers/docs`
- `/developers/docs/quickstart`
- `/developers/docs/cookbook`
- future `/developers/sdk`

### Tier 4 Page Families

- `LegalHubTemplate`
- `LegalDocumentIndexTemplate`
- `LegalDocumentTemplate`
- `LocaleSelectorTemplate`

Maps to likely pages:

- `/legal`
- `/legal/privacy`
- `/legal/privacy/:docKey`
- `/legal/privacy/:docKey/read/:locale`
- `/legal/terms`
- `/legal/internet-services`

## Information-Density Rules

These rules matter more than visual style because they keep the hierarchy coherent.

### Tier 1 rules

- no section should answer more than one question
- paragraphs should rarely exceed 2 to 3 lines
- cards should sell curiosity, not completeness
- every section must create a next step
- avoid technical nouns unless they are already familiar

### Tier 2 rules

- one page should explain one subject deeply enough to decide
- use narrative sequencing
- keep each section focused on one meaning
- use cards and media to break conceptual load
- keep the number of major sections limited

### Tier 3 rules

- optimize for completion, not seduction
- structure content into progressive steps
- keep code and examples first-class
- make side navigation persistent
- allow deeper nesting without losing orientation

### Tier 4 rules

- optimize for precision and retrieval
- separate summary from full text
- expose version, locale, and scope clearly
- anchor every section cleanly
- never compress legal meaning for style

## Current Repo Mapping

The current repo already hints at this split:

- [src/pages/Home.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/Home.tsx) is a Tier 1 page.
- [src/pages/ProductPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/ProductPage.tsx) is a Tier 2 page.
- [src/pages/NewsDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsDetailPage.tsx) and [src/pages/StoryDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StoryDetailPage.tsx) are Tier 2 detail families.
- [src/pages/AboutPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/AboutPage.tsx) and [src/pages/CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx) are Tier 2 company-family pages.
- [src/pages/docs/DocsLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsLayout.tsx) is the start of Tier 3.
- [src/components/legal/LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx) and [src/pages/legal/LegalPrivacyDocumentPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyDocumentPage.tsx) are Tier 4.

The problem is that the repo has width shells and page wrappers, but not a formal tier system tying those page types together.

## Recommended Template Hierarchy

The architecture should be hierarchical at three levels:

1. page templates
2. section templates
3. content schemas

### Level A: Page Templates

Create these canonical page templates:

- `OverviewLandingPageTemplate`
- `DetailNarrativePageTemplate`
- `ContentIndexPageTemplate`
- `DocsWorkspaceTemplate`
- `ReadingDetailPageTemplate`
- `LegalHubTemplate`
- `LegalDocumentTemplate`

What they should do:

- define width rules
- define nav behavior
- define section rhythm
- define allowed density
- define optional sidebar or breadcrumb behavior

### Level B: Section Templates

These should be reusable across page families.

- `HeroStatementSection`
- `HeroVisualSection`
- `CardCarouselSection`
- `FeaturedFeedSection`
- `TileGallerySection`
- `ComparisonSection`
- `ProofStripSection`
- `SplitNarrativeSection`
- `CenteredManifestoSection`
- `CaptureSection`
- `ActionBandSection`
- `DocIntroSection`
- `StepSequenceSection`
- `ReferenceTableSection`
- `LegalSectionGroup`

Use by tier:

- Tier 1 uses `HeroStatementSection`, `CardCarouselSection`, `TileGallerySection`, `CenteredManifestoSection`, `CaptureSection`, `ActionBandSection`
- Tier 2 uses `HeroVisualSection`, `SplitNarrativeSection`, `ComparisonSection`, `ProofStripSection`, `CardCarouselSection`
- Tier 3 uses `DocIntroSection`, `StepSequenceSection`, `ReferenceTableSection`
- Tier 4 uses `LegalSectionGroup`, locale selectors, resource link groups, document metadata blocks

### Level C: Content Schemas

Every page should become data-driven by page family.

Suggested schemas:

- `overview-page.ts`
- `detail-page.ts`
- `article-page.ts`
- `story-page.ts`
- `docs-page.ts`
- `legal-doc.ts`

At minimum, each schema should include:

- page tier
- page family
- hero content
- ordered section list
- CTA model
- routing metadata
- SEO metadata

## Architecture By User Intent

This is the cleanest way to think about routing and information flow.

### Intent 1: "What is Jokuh?"

Serve Tier 1.

Pages:

- homepage
- category overviews

Output:

- resonance
- orientation
- one next step

### Intent 2: "Tell me about this specific thing."

Serve Tier 2.

Pages:

- product detail
- OS detail
- story detail
- article detail
- support overview
- company pages

Output:

- understanding
- confidence
- decision support

### Intent 3: "I want to build with it."

Serve Tier 3.

Pages:

- docs overview
- guides
- quickstart
- API/reference

Output:

- progressive learning
- successful integration

### Intent 4: "I need the exact policy or legal record."

Serve Tier 4.

Pages:

- privacy
- terms
- governance
- region/language specific documents

Output:

- trust
- traceability
- precise interpretation

## Support Architecture

Support should not go straight to legal density.

Support needs its own split:

- Tier 2 support overview pages
- Tier 3 operational help guides
- Tier 4 policy or compliance pages only when necessary

Recommended support families:

- `SupportOverviewPageTemplate`
- `SupportCategoryPageTemplate`
- `SupportTaskGuideTemplate`
- `SupportPolicyEscalationTemplate`

That keeps "how do I fix this?" separate from "what is the contract or policy?"

## Careers Architecture

Careers should also split by depth.

- Tier 2: careers landing
- Tier 2 or Tier 3 hybrid: role detail pages
- Tier 4 only when linking to policy, employment disclosures, or legal notes

Recommended families:

- `CareersLandingPageTemplate`
- `CareerRoleDetailPageTemplate`
- `CareersProcessPageTemplate`

This avoids turning careers into one oversized company page.

## Docs Architecture

The current docs layout is too narrow for the stated goal.

If docs should feel more like the ChatGPT/OpenAI developer experience, they need:

- fuller-width content canvas
- persistent sidebar
- dedicated docs chrome behavior
- docs-specific typography and code blocks
- page families for guide, quickstart, cookbook, and reference

So Tier 3 should stop sharing the same spatial assumptions as marketing pages, even if it still shares brand tokens and top-level navigation logic.

## Legal Architecture

Legal is already closest to the correct model.

What it needs is formalization:

- one legal hub template
- one locale-selection flow template
- one document template
- one section metadata pattern

This should remain brand-aligned but not visually overloaded. Legal should feel calm, exact, and retrievable.

## Navigation Architecture

Navigation should reflect tiers without exposing the tiers explicitly.

Recommended top-level nav groups:

- Product
- Platform
- Company
- Developers
- Support
- Legal

Internally, the nav model should know:

- audience
- tier
- page family

The existing [src/data/rigid-sitemap.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/rigid-sitemap.ts) is the correct place to evolve that contract.

## Proposed System Directory Direction

```text
src/
  components/
    system/
      templates/
        pages/
          OverviewLandingPageTemplate.tsx
          DetailNarrativePageTemplate.tsx
          ContentIndexPageTemplate.tsx
          DocsWorkspaceTemplate.tsx
          ReadingDetailPageTemplate.tsx
          LegalHubTemplate.tsx
          LegalDocumentTemplate.tsx
        sections/
          HeroStatementSection.tsx
          HeroVisualSection.tsx
          CardCarouselSection.tsx
          FeaturedFeedSection.tsx
          TileGallerySection.tsx
          ComparisonSection.tsx
          ProofStripSection.tsx
          SplitNarrativeSection.tsx
          CaptureSection.tsx
          ActionBandSection.tsx
          DocIntroSection.tsx
          StepSequenceSection.tsx
          ReferenceTableSection.tsx
          LegalSectionGroup.tsx
  data/
    page-models/
      overview-page.ts
      detail-page.ts
      article-page.ts
      story-page.ts
      docs-page.ts
      legal-doc.ts
```

## Build Order

Build in this order:

1. Formalize the four tiers in routing and data models.
2. Extract page templates for Tier 1, Tier 2, Tier 3, and Tier 4.
3. Extract section templates used repeatedly across Tier 1 and Tier 2.
4. Widen and harden the docs workspace as a distinct Tier 3 system.
5. Normalize legal into hub, selector, and document templates.
6. Split careers and support into their own page families instead of leaving them as generic detail pages.

## Bottom Line

The clean architecture is not "marketing pages plus docs plus legal."

It is:

- Tier 1 overview pages for resonance
- Tier 2 detail pages for understanding
- Tier 3 docs pages for learning and building
- Tier 4 legal pages for exact trust and policy reference

If this tier model is enforced in templates, the site will scale cleanly and context will stay distributed in the right places instead of collapsing into oversized pages.
