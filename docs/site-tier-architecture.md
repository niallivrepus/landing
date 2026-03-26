# Site Tier Architecture

## Purpose

Define a clean, scalable architecture for Jokuh’s public site so that:

- customer-facing pages stay minimal and emotionally clear
- deeper product and support pages add information without becoming overwhelming
- developer documentation feels like a full-screen product workspace
- legal and privacy content scales by topic, region, language, and version
- all of this still reads as one brand system

This is not just a page list. It is an information-density system.

## Core Principle

Jokuh should reveal information in layers.

- Layer 1 should sell the essence.
- Layer 2 should explain the product.
- Layer 3 should teach the product.
- Layer 4 should govern the product.

Each layer should feel intentionally different, while sharing the same global brand, typography, and navigation logic.

## Proposed Layer Model

### Layer 1: Overview / Brand Landing

Audience:

- new visitors
- customers evaluating the brand
- people who need orientation fast

Goal:

- communicate essence, confidence, and direction
- never overload
- create strong next steps

Information density:

- lowest
- punch lines first
- few decisions per screen
- visual rhythm and brand atmosphere matter more than exhaustive explanation

Examples:

- homepage
- primary product landing
- category overviews
- customer-facing support overview

Template family:

- `OverviewLandingPageTemplate`
- `MinimalOverviewSectionTemplate`
- `ShowcaseCarouselSectionTemplate`
- `PrimaryConversionSectionTemplate`

Current repo alignment:

- [src/pages/Home.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/Home.tsx)
- [src/components/landing/LandingHero.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/LandingHero.tsx)
- [src/components/landing/RecentNewsSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/RecentNewsSection.tsx)
- [src/components/landing/StoriesSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/StoriesSection.tsx)

### Layer 2: Detail / Customer Explanation

Audience:

- customers who already care
- buyers comparing surfaces
- users trying to understand one product or one workflow

Goal:

- explain one thing clearly
- preserve the minimal brand voice
- introduce more structure, but still keep tight edit discipline

Information density:

- medium
- more cards, comparisons, proof, and supporting copy
- still curated, not encyclopedic

Examples:

- product detail pages
- OS detail page
- support detail pages
- careers pages
- article detail pages
- story detail pages

Template family:

- `ProductDetailPageTemplate`
- `NarrativeDetailPageTemplate`
- `SupportDetailPageTemplate`
- `CareersDetailPageTemplate`

Current repo alignment:

- [src/pages/ProductPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/ProductPage.tsx)
- [src/pages/StoryDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StoryDetailPage.tsx)
- [src/pages/NewsDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsDetailPage.tsx)
- [src/pages/CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx)

### Layer 3: Developer Learning / Documentation Workspace

Audience:

- developers integrating with Jokuh
- technical evaluators
- builders who need progressive learning paths

Goal:

- teach gradually
- feel app-like, dense, navigable, and practical
- support deeper branching than customer pages

Information density:

- high, but structured
- utility-first
- persistent navigation
- strong “you are here” orientation

Examples:

- docs overview
- quickstart
- cookbook
- reference
- guides
- changelog / releases later

Template family:

- `DocsWorkspaceTemplate`
- `DocsGuideTemplate`
- `DocsReferenceTemplate`
- `DocsIndexTemplate`

Current repo alignment:

- [src/pages/docs/DocsLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsLayout.tsx)
- [src/pages/docs/DocsOverviewPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsOverviewPage.tsx)
- [src/data/docs-nav.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/docs-nav.ts)

### Layer 4: Policy / Legal / Compliance Reference

Audience:

- customers with legal questions
- regulators
- counsel
- support and operations

Goal:

- maximize clarity and traceability
- minimize confusion
- make dense information navigable without abandoning the brand

Information density:

- highest
- structured and scannable
- table-of-contents driven
- locale-aware

Examples:

- legal overview
- internet services policy hub
- terms of service
- privacy policy
- regional privacy variants
- support/purchase/refund policies

Template family:

- `LegalHubPageTemplate`
- `LegalTopicIndexTemplate`
- `LegalDocumentSelectorTemplate`
- `LegalReferenceDocumentTemplate`
- `SupportPolicyTemplate`

Current repo alignment:

- [src/pages/legal/LegalHomePage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalHomePage.tsx)
- [src/pages/legal/LegalInternetServicesPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalInternetServicesPage.tsx)
- [src/pages/legal/LegalPrivacyPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyPage.tsx)
- [src/pages/legal/LegalPrivacySelectPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacySelectPage.tsx)
- [src/pages/legal/LegalPrivacyDocumentPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyDocumentPage.tsx)
- [src/pages/legal/LegalTermsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalTermsPage.tsx)

## What This Means For The File Architecture

The current repo already has a solid shell base in:

- [src/components/system/MarketingPageFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/MarketingPageFrame.tsx)
- [src/components/system/shells.ts](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/shells.ts)
- [src/components/system/typography.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/typography.tsx)

What is missing is the next layer up: explicit page-tier templates.

Recommended structure:

```text
src/components/system/templates/
  pages/
    OverviewLandingPageTemplate.tsx
    ProductDetailPageTemplate.tsx
    NarrativeDetailPageTemplate.tsx
    SupportDetailPageTemplate.tsx
    CareersDetailPageTemplate.tsx
    DocsWorkspaceTemplate.tsx
    DocsGuideTemplate.tsx
    DocsReferenceTemplate.tsx
    LegalHubPageTemplate.tsx
    LegalDocumentSelectorTemplate.tsx
    LegalReferenceDocumentTemplate.tsx
  sections/
    HeroStatementSectionTemplate.tsx
    ShowcaseCarouselSectionTemplate.tsx
    FeatureGridSectionTemplate.tsx
    NarrativeSectionTemplate.tsx
    StickyTocSectionTemplate.tsx
    LocaleSelectorSectionTemplate.tsx
    PolicyResourceLinksSectionTemplate.tsx
    CaptureSectionTemplate.tsx
  blocks/
    SectionHeaderBlock.tsx
    FeatureCardBlock.tsx
    CarouselCardBlock.tsx
    DenseNavBlock.tsx
    TocBlock.tsx
    DocumentMetaBlock.tsx
    LocalePickerBlock.tsx
    ResourceLinkListBlock.tsx
```

This matters because the current system jumps from generic shell straight to bespoke pages. That works for a small repo, but it will get expensive once support, OS detail, and multi-family legal content land.

## Brand Behavior By Layer

The brand should not be uniform in density. It should be uniform in principles.

Shared brand principles:

- restrained typography
- strong spacing discipline
- concise headings
- premium motion and surfaces
- clear hierarchy

How each layer should behave:

- Layer 1: cinematic, minimal, large statements, very few choices
- Layer 2: still elegant, but more explanatory and card-driven
- Layer 3: product-like, functional, persistent nav, more compact layouts
- Layer 4: calm, neutral, trustworthy, dense but highly indexed

The mistake to avoid is forcing landing-page styling onto docs and legal. Those layers should inherit the brand, not the same visual density.

## Template Hierarchy By Page Type

### 1. Landing / Overview Pages

Use for:

- homepage
- product category landing
- support overview

Structure:

- hero statement
- 2 to 5 overview sections
- one strong conversion band

Section types:

- hero statement
- feature carousel
- featured feed
- visual tile gallery
- manifesto / brand statement
- conversion band

Rule:

- no dense sidebars
- no more than one major ask per section
- no long-form prose blocks

### 2. Product / OS / Support Detail Pages

Use for:

- product detail
- OS detail
- support detail
- careers detail

Structure:

- focused hero
- proof / feature band
- one or more deep-dive sections
- resource links
- CTA or next step

Section types:

- hero with support copy
- feature cards or carousel cards
- comparison or principles block
- FAQ or support routes
- resource list
- CTA band

Rule:

- the page should answer one main question well
- add structure, not noise
- use cards and subheads instead of long walls of text

### 3. Docs Workspace

Use for:

- docs overview
- quickstart
- guides
- reference

Structure:

- app-like layout
- persistent left nav
- optional right rail for on-page headings
- wider content measure than marketing pages
- reusable content blocks for code, callouts, steps, resource cards

Docs should feel closer to ChatGPT/OpenAI Developers than to a marketing blog.

That means:

- full-height feel
- denser spacing scale
- stronger nav persistence
- clearer active states
- utility components for code/reference layouts

The current [DocsLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsLayout.tsx) is directionally correct but still too close to a marketing page shell. It needs its own page template family, not just a custom layout wrapper.

### 4. Legal / Privacy / Support Policy Pages

Use for:

- terms
- privacy
- policy selectors
- support policies
- refund / purchase / subscription terms

Structure:

- legal hub
- topic index
- document selector
- document reader

This is already visible in the current privacy flow:

- topic hub in [LegalPrivacyPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyPage.tsx)
- topic + locale selection in [LegalPrivacySelectPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacySelectPage.tsx)
- long-form reader in [LegalPrivacyDocumentPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyDocumentPage.tsx)

That flow should become the model for all policy families.

## Recommended Route Families

Keep route semantics aligned with the tier model.

Suggested families:

```text
/
/products/:productId
/os/:osId
/support
/support/:topic
/journal/:slug
/stories/:slug
/careers
/careers/:roleId
/developers/docs
/developers/docs/:docSlug
/developers/reference/:apiSlug
/legal
/legal/:family
/legal/:family/:docKey
/legal/:family/:docKey/read/:locale
```

If region needs to be explicit later:

```text
/legal/:family/:docKey/:region/:locale
```

Do not mix policy-family routing with ad hoc one-off pages. Once more legal/support material lands, route inconsistency will become expensive.

## Legal And Privacy Content Model

The privacy system is already data-driven in:

- [src/data/privacy-docs.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/privacy-docs.ts)
- [src/data/legal-locales.ts](/Users/sonadin/Documents/code/jokuh/landing/src/data/legal-locales.ts)

This should be generalized into a reusable legal document model.

Recommended schema layers:

### Legal Family

Examples:

- privacy
- terms
- support-policy
- subscription-policy
- refunds

### Document Record

Fields:

- `family`
- `docKey`
- `title`
- `breadcrumbLabel`
- `summary`
- `appliesTo`
- `defaultRegion`
- `availableLocales`
- `versions`

### Region Pack

Fields:

- `regionCode`
- `label`
- `legalEntity`
- `specialDisclosures`
- `availableLocales`

### Locale Variant

Fields:

- `localeCode`
- `nativeLabel`
- `translatedTitle`
- `version`
- `effectiveDate`
- `sections`

### Section Model

Fields:

- `id`
- `title`
- `summary`
- `body`
- `bullets`
- `callouts`
- `resources`

This would let one policy family support:

- one hub
- many documents
- many regions
- many locales
- explicit versions

without changing the page code every time.

## How To Keep Dense Pages Navigable

### 1. Always provide a hub before a document

Do not drop users directly into raw policy text unless they arrived from search or a deep link.

Every dense content family should have:

- overview hub
- selector/index page
- document page

### 2. Always provide local navigation for dense pages

Use:

- sticky table of contents
- jump links
- resource links
- breadcrumb
- related documents rail

Current terms page already does this well via the sticky “On this page” nav in [LegalTermsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalTermsPage.tsx).

The privacy document page should adopt the same pattern instead of only offering a jump link to `#sections`.

### 3. Make metadata explicit

Every legal/support document page should show:

- effective date
- locale
- governing entity if relevant
- version if relevant
- related policies

### 4. Separate reading width from navigation width

Dense content should use:

- narrow reading column
- wider outer shell
- separate nav rail

The repo already does this for terms and for article-style content. That pattern should become standardized.

### 5. Use selector flows instead of giant mixed pages

For privacy especially:

- topic
- region
- language
- document

is better than one endless mega-page trying to serve every jurisdiction at once.

## Support Architecture Recommendation

Support should not be treated as a stub or as legal. It needs to sit between customer-facing detail and policy reference.

Recommended support layers:

- support overview
- topic detail pages
- policy/reference pages

Suggested support templates:

- `SupportOverviewPageTemplate`
- `SupportTopicPageTemplate`
- `SupportPolicyTemplate`

Support overview should remain Layer 1 or Layer 2 depending on intent:

- “How can we help?” overview = Layer 1/2
- refund, subscription, warranty, account transfer policy = Layer 4

This distinction matters. Otherwise support becomes a messy mix of marketing, FAQ, and policy in one place.

## Careers Architecture Recommendation

Careers should also be split:

- careers overview page = Layer 2
- role detail page = Layer 2/3
- hiring policies and compliance pages = Layer 4 if needed

Current [CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx) is already a good detail-page foundation. What it needs later is a deeper role-detail template rather than more content piled onto the same page.

## Current Strengths In The Repo

- shared shell is strong
- typography primitives are forming
- legal is already data-aware
- privacy has a useful hub -> selector -> reader flow
- docs already have their own nav dataset
- narrative/article detail pages prove the repo can support denser page families

## Main Gaps To Fix

### 1. No explicit page-tier template layer

There is a shell layer and a page layer, but not enough in between.

### 2. Docs still inherit too much from marketing

Docs need a distinct workspace template family.

### 3. Privacy document reader is too linear

It should gain:

- sticky TOC
- document metadata block
- related resources block
- visible locale/version information

### 4. Support has no dedicated architecture yet

It currently appears in navigation and footer language, but not in a real page family.

### 5. Legal family modeling is still privacy-first

The privacy pattern should be generalized so terms, support policies, and other legal families can use the same system.

## Recommended Build Order

### Phase 1

Codify the tier system and template families.

- create page templates
- do not change visuals yet

### Phase 2

Separate docs into a true workspace template.

- left nav
- optional right rail
- denser content blocks

### Phase 3

Generalize legal into reusable family/index/document templates.

- privacy
- terms
- support policies
- account and subscription policies later

### Phase 4

Build support as its own family.

- support overview
- support topic detail
- policy/reference branch

### Phase 5

Refactor product, OS, careers, story, and article pages onto the tier templates.

## Bottom Line

Jokuh needs one architecture with four intentional information layers:

- overview
- detail
- learning
- governance

The site should stay customer-facing first, but that only works if deeper layers are allowed to behave differently.

The cleanest system is:

- one global shell and IA backbone
- one explicit page-tier template layer
- reusable section/block templates under that
- data models that understand documents, locales, versions, and families

That is the structure that will let the site scale without collapsing customer marketing, documentation, support, and legal into one visual mode.
