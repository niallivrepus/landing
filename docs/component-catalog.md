# Component Catalog

This file is the clean internal reference for the Jokuh landing repo component system.

It is meant to answer four questions quickly:

1. What reusable components already exist?
2. Where do they live?
3. What should each one be used for?
4. Which files are the structural primitives versus page-specific helpers?

## Reuse Order

When building new UI in this repo, prefer this order:

1. `src/components/system/*`
2. `src/components/landing/*` or `src/components/product/*`
3. shared site components in `src/components/*`
4. specialized `legal/*` or `news-detail/*`
5. page-local one-off markup only if nothing reusable fits

## Architecture Map

| Layer | Purpose | Primary Files |
| --- | --- | --- |
| System | Page shells, section spacing, typography, shared templates | `src/components/system/*` |
| Landing | Homepage-specific narrative blocks and prompt styling | `src/components/landing/*` |
| Product | Product-detail storytelling sections and media surfaces | `src/components/product/*` |
| Shared Site | Nav, footer, overlays, links, utility visuals | `src/components/*` |
| Legal | Legal layout and trust/document cards | `src/components/legal/*` |
| Editorial Detail | Article-detail charts, listen bar, rich sections | `src/components/news-detail/*` |

## System Components

These are the base primitives. Prefer these first before creating a new layout pattern.

| Component | File | Purpose | Use When |
| --- | --- | --- | --- |
| `MarketingPageFrame` | `src/components/system/MarketingPageFrame.tsx` | Global marketing page wrapper with theme-aware background and layout slots | A whole marketing page needs a consistent frame |
| `SimplePageMain` | `src/components/system/SimplePageMain.tsx` | Centered simple page content area | Building a sparse marketing or stub page |
| `MarketingPageSection` | `src/components/system/sections.tsx` | Standard section wrapper with spacing | A page needs normal section rhythm |
| `SectionHeaderRow` | `src/components/system/sections.tsx` | Reusable top row for section heading + action | A section needs title plus link/action alignment |
| `SimpleMarketingPageTemplate` | `src/components/system/templates/SimpleMarketingPageTemplate.tsx` | Default simple marketing page template | A page is mostly title, description, and a small amount of content |
| `EditorialArticleTemplate` | `src/components/system/templates/EditorialArticleTemplate.tsx` | Full article-detail shell with back link and editorial hero | Rendering long-form article detail pages |
| `EditorialArticleMeasure` | `src/components/system/templates/EditorialArticleTemplate.tsx` | Reading-width container | Long-form content needs a consistent reading measure |
| `EditorialArticleShellSection` | `src/components/system/templates/EditorialArticleTemplate.tsx` | Full-width article shell section | Editorial pages need full-width non-prose sections |
| `EditorialArticleProseSection` | `src/components/system/templates/EditorialArticleTemplate.tsx` | Standard prose spacing block | Editorial body copy needs consistent rhythm |
| `EditorialArticleHeadingSection` | `src/components/system/templates/EditorialArticleTemplate.tsx` | Article subsection heading block | Editorial detail pages need a heading break |
| `MarketingEyebrow` | `src/components/system/typography.tsx` | Small eyebrow text | A section truly needs an eyebrow label |
| `MarketingDisplayTitle` | `src/components/system/typography.tsx` | Large display headline | Marketing hero/display headings |
| `MarketingSimplePageTitle` | `src/components/system/typography.tsx` | Simpler page title | Stub and low-density pages |
| `MarketingSectionHeading` | `src/components/system/typography.tsx` | Section heading style | General section titles |
| `MarketingSectionLabel` | `src/components/system/typography.tsx` | Small section label | Small grouped labels |
| `MarketingProseMuted` | `src/components/system/typography.tsx` | Muted paragraph text | Supporting copy |
| `MarketingProseLead` | `src/components/system/typography.tsx` | Lead paragraph style | Intro paragraphs |
| `MarketingStubDescription` | `src/components/system/typography.tsx` | Stub/placeholder description | Simple incomplete pages |
| `CONTENT_SHELL_COMPANY` | `src/components/system/shells.ts` | Company page content width | Company/about/careers pages |
| `CONTENT_SHELL_WIDE` | `src/components/system/shells.ts` | Wide page shell width | Landing sections and wide marketing blocks |
| `CONTENT_SHELL_NARROW` | `src/components/system/shells.ts` | Narrow content width | Reading-friendly or constrained sections |
| `CONTENT_READING_MEASURE` | `src/components/system/shells.ts` | Reading-width max measure | Long-form text |
| `PAGE_TOP_PAD` | `src/components/system/shells.ts` | Default page top spacing | Standard page entry spacing |
| `PAGE_TOP_PAD_DENSE` | `src/components/system/shells.ts` | Denser page top spacing | Denser top-of-page layouts |
| `MARKETING_ROOT_CLASS` | `src/components/system/shells.ts` | Shared root class string | Frame-level marketing pages |
| `EDITORIAL_MEDIA_RADIUS_CLASS` | `src/components/system/editorialMedia.ts` | Shared media radius token | Editorial images/charts should match the same rounding |

## Landing Components

These are the homepage/landing-section building blocks.

| Component | File | Purpose | Notes |
| --- | --- | --- | --- |
| `LandingHero` | `src/components/landing/LandingHero.tsx` | Homepage hero with large headline, interactive prompt, and quick links | Uses scroll fade and shared prompt chrome |
| `HeroQuickPills` | `src/components/landing/HeroQuickPills.tsx` | Row/wrap of hero action pills | Keep actions lightweight and consistent with the prompt bar |
| `GooeyBackdrop` | `src/components/landing/GooeyBackdrop.tsx` | Ambient hero/background effect | Visual atmosphere only |
| `IdentityBlock` | `src/components/landing/IdentityBlock.tsx` | Signature identity/handle visual storytelling section | Theme-aware center glow already wired for dark mode |
| `StoriesSection` | `src/components/landing/StoriesSection.tsx` | Homepage story/article discovery block | Use for story-driven landing discovery |
| `RecentNewsSection` | `src/components/landing/RecentNewsSection.tsx` | Newsroom section with sticky featured article and compact stack | Current behavior: featured card stays sticky until the right column ends |
| `FundersStrip` | `src/components/landing/FundersStrip.tsx` | Social proof / funders row | Small trust band |
| `ClaimIdentityCta` | `src/components/landing/ClaimIdentityCta.tsx` | Identity-focused CTA block | Product/identity conversion section |
| `PreFooterCta` | `src/components/landing/PreFooterCta.tsx` | CTA before the footer | Final marketing push before footer |
| `WaitlistSection` | `src/components/landing/WaitlistSection.tsx` | Waitlist email capture block | Shares prompt chrome styling with the hero prompt |
| `promptChrome` tokens | `src/components/landing/promptChrome.ts` | Shared classes for prompt and waitlist input chrome | Update this file when prompt-border/button dark-mode treatment changes |
| `landing/index.ts` | `src/components/landing/index.ts` | Barrel exports for landing layer | Prefer importing from here when possible |

## Product Detail Components

These are the reusable product-detail storytelling modules. They are the current reference system for product pages like Pods.

| Component | File | Purpose | Notes |
| --- | --- | --- | --- |
| `ProductStorySection` | `src/components/product/ProductDetailPrimitives.tsx` | Standard section wrapper for product-detail blocks | Use as the default section shell |
| `ProductSectionIntro` | `src/components/product/ProductDetailPrimitives.tsx` | Product section intro with title/body alignment options | Supports left/center and dark/light presentation |
| `ProductShowcaseSurface` | `src/components/product/ProductDetailPrimitives.tsx` | Shared rounded surface for product stages | Base large-surface container |
| `ProductDetailMedia` | `src/components/product/ProductDetailMedia.tsx` | Media renderer for product-detail sections | Current rule: real images fill the surface; non-image media falls back to a clean placeholder |
| `ProductHighlightsCarousel` | `src/components/product/ProductHighlightsCarousel.tsx` | Desktop-first highlights carousel with progress nodes and play/pause | Shows active full-size panel plus next full-size panel extending to the right |
| `ProductCloserLookExplorer` | `src/components/product/ProductCloserLookExplorer.tsx` | Full-surface closer-look explorer with image background, pill rail, accordion behavior, and contextual controls | Buttons animate in on view; accordion copy lives in the pills; top-right close button is present |
| `ProductCenteredShowcase` | `src/components/product/ProductCenteredShowcase.tsx` | Single-surface centered message and CTA block | Intentionally flattened with no nested inner panel |
| `ProductFullBleedReveal` | `src/components/product/ProductFullBleedReveal.tsx` | Scroll-driven narrow-to-full-bleed reveal block | Used for edge-to-edge storytelling transitions |
| `ProductPurpleCta` | `src/components/product/ProductGlowCtas.tsx` | Stylized CTA link | Specialized accent CTA |
| `ProductGreenGlowLink` | `src/components/product/ProductGlowCtas.tsx` | Alternate stylized CTA link | Specialized accent CTA |

## Product Configuration Files

These are not components, but they are the content model that powers the reusable product-detail sections.

| File | Purpose | Notes |
| --- | --- | --- |
| `src/data/product-detail-blueprints.ts` | Canonical section config for product detail pages | Holds highlights, closer-look items, centerpiece content, and reveal content |
| `src/data/product-pages.ts` | Product page registry/content | Page-level product metadata |
| `src/data/products.ts` | Product identifiers and product map | Product IDs should stay aligned with blueprint keys |

## Shared Site Components

These are reusable outside one single page family.

| Component | File | Purpose | Use When |
| --- | --- | --- | --- |
| `SiteTopBar` | `src/components/SiteTopBar.tsx` | Global top navigation/header | Standard site chrome |
| `TryJokuhCta` | `src/components/SiteTopBar.tsx` | Header CTA | Need the header CTA in isolation |
| `MegaFooter` | `src/components/MegaFooter.tsx` | Global site footer | Standard footer |
| `SiteLink` | `src/components/SiteLink.tsx` | Smart internal/external link primitive | Prefer this over ad-hoc anchor logic |
| `SecondaryLink` | `src/components/SecondaryLink.tsx` | Secondary link treatment | Lightweight supporting link |
| `TopNavAnchor` | `src/components/TopNavAnchor.tsx` | Anchor helper that cooperates with top-nav behavior | Same-page section links and controlled navigation |
| `StoryRowLink` | `src/components/StoryRowLink.tsx` | Horizontal story/news row link | Story list rows |
| `NewsCardArt` | `src/components/NewsCardArt.tsx` | Shared newsroom/story art renderer | News cards and editorial teasers |
| `CookieBanner` | `src/components/CookieBanner.tsx` | Cookie consent banner | Site-level legal/compliance notice |
| `LanguageSelectModal` | `src/components/LanguageSelectModal.tsx` | Language switch modal | Locale/language selection |
| `SiteSearchFullscreenOverlay` | `src/components/SiteSearchFullscreenOverlay.tsx` | Full-screen site search UI | Global site search experience |
| `SearchPanelToggleGlyph` | `src/components/SearchPanelToggleGlyph.tsx` | Search toggle icon/glyph | Search triggers |
| `GoogleTranslateHost` | `src/components/GoogleTranslateHost.tsx` | Deferred Google Translate host injection | Translation integration |
| `CompanyPageLayout` | `src/components/CompanyPageLayout.tsx` | Shared company/careers page shell | About, careers, company narrative pages |
| `CompanyPageHero` | `src/components/CompanyPageLayout.tsx` | Company-page hero block | Company page top section |
| `CompanyPageClosingCta` | `src/components/CompanyPageLayout.tsx` | Company-page closing CTA | End of company/careers pages |
| `ExplainerTriad` | `src/components/ExplainerTriad.tsx` | Three-column explanatory module | Structured explainer content |
| `EndorsementSeal` | `src/components/EndorsementSeal.tsx` | Trust/endorsement visual module | Social proof or award-style callouts |
| `OffSiteGlyph` | `src/components/OffSiteGlyph.tsx` | External-link glyph | Off-site links |
| `footer-social-icons` | `src/components/footer-social-icons.tsx` | Social icon primitives | Footer and social lists |

## Specialized Visual Components

These are more unique than the standard layout system.

| Component | File | Purpose | Notes |
| --- | --- | --- | --- |
| `VortexMindMap` | `src/components/VortexMindMap.tsx` | Heavy interactive visual/mind-map module | Keep isolated and lazy where possible |
| `vortexMindMapData` | `src/components/vortexMindMapData.ts` | Data and palette for the vortex map | Paired with `VortexMindMap` |

## Legal Components

| Component | File | Purpose |
| --- | --- | --- |
| `LegalLayout` | `src/components/legal/LegalLayout.tsx` | Legal page shell |
| `LegalBreadcrumb` | `src/components/legal/LegalLayout.tsx` | Legal breadcrumb row |
| `DocumentTopicCard` | `src/components/legal/DocumentTopicCard.tsx` | Document/topic card for legal/trust pages |
| `JokuhMark` | `src/components/legal/JokuhMark.tsx` | Jokuh mark/logo helper for legal pages |

## Editorial / News Detail Components

| Component | File | Purpose |
| --- | --- | --- |
| `ArticleListenBar` | `src/components/news-detail/ArticleListenBar.tsx` | Listen/share bar for article detail pages |
| `BenchmarkTable` | `src/components/news-detail/BenchmarkTable.tsx` | Reusable benchmark data table |
| `ChartFrame` | `src/components/news-detail/ChartFrame.tsx` | Shared frame for charts and footnotes |
| `GdpvalStackedChart` | `src/components/news-detail/NewsBenchmarkCharts.tsx` | Benchmark chart |
| `SweBenchLineChart` | `src/components/news-detail/NewsBenchmarkCharts.tsx` | Benchmark chart |
| `OsworldLineChart` | `src/components/news-detail/NewsBenchmarkCharts.tsx` | Benchmark chart |
| `NewsFeatureDetailSection` | `src/components/news-detail/NewsFeatureDetailSection.tsx` | Large featured detail block within article pages |
| `RichParagraph` | `src/components/news-detail/RichParagraph.tsx` | Rich paragraph renderer |
| `TestimonialPanels` | `src/components/news-detail/TestimonialPanels.tsx` | Testimonial stack/panel section |

## Current Guidance

### Prefer Existing Product Blocks

For product detail pages, the current preferred section set is:

1. `ProductHighlightsCarousel`
2. `ProductCloserLookExplorer`
3. `ProductCenteredShowcase`
4. `ProductFullBleedReveal`

These are the primary reusable detail-page modules and should be extended before inventing a new one-off product section.

### Prefer Shared Prompt Chrome

For any prompt-like input or email capture surface, reuse:

- `LANDING_PROMPT_BORDER_CLASS`
- `LANDING_PROMPT_SHELL_CLASS`
- `LANDING_PROMPT_INPUT_CLASS`
- `LANDING_PROMPT_SEND_BUTTON_CLASS`
- `LANDING_PROMPT_INNER_SHADOW_CLASS`

These live in `src/components/landing/promptChrome.ts` and are the shared source of truth for hero prompt and waitlist input styling.

### Keep New Components Lean

Before adding a new component:

1. Check whether a `system` primitive already solves the spacing/shell problem.
2. Check whether an existing `landing` or `product` block can be extended instead.
3. Prefer a data/config change in `src/data/*` over a new bespoke UI file when the structure already exists.

## Maintenance Rule

When a new reusable component is introduced, add it to this file in the same PR so this catalog stays current.
