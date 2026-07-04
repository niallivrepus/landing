# Light/Dark Theme Audit

Date: March 26, 2026
Scope: Code-only multi-agent audit. No Playwright. No visual regression pass.

## Summary

The main diagnosis is structural: the repo mixes dark-default page frames, scattered `light:` overrides, and a few explicitly light pages. That creates split-brain screens where containers stay dark but children switch to dark ink, or light cards appear with dark-only text.

This is not mainly a token problem. It is a mode-intent problem.

## Priority Findings

1. `P0` Theme ownership is split in the shell itself.

- [MarketingPageFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/MarketingPageFrame.tsx#L15) defaults every page to `theme="dark"`.
- The global provider still applies theme classes at [bootstrap-dev.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/bootstrap-dev.tsx#L13).
- Result: dark containers with light-mode child text, or light cards inside dark-first shells.

2. `P0` Company pages are structurally dark while shared typography already flips to light-mode ink.

- [CompanyPageLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CompanyPageLayout.tsx#L12) always uses the dark-default frame.
- Shared text primitives in [typography.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/typography.tsx#L7) already use `light:text-zinc-*`.
- About and Careers can render dark text over dark surfaces in light theme.

3. `P0` Home editorial sections are partially converted.

- [Home.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/Home.tsx#L18) uses the dark-default frame.
- [RecentNewsSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/RecentNewsSection.tsx#L71) and [StoriesSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/StoriesSection.tsx#L39) stay dark.
- Shared section headers/actions in [sections.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/sections.tsx#L39) switch to dark ink in light mode.

4. `P1` Docs are effectively dark-only.

- [DocsLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsLayout.tsx#L17)
- [DocsOverviewPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsOverviewPage.tsx#L9)
- [DocsQuickstartPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsQuickstartPage.tsx#L8)
- [DocsCookbookPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsCookbookPage.tsx#L12)

These files rely on `text-light-space` and translucent dark-style cards with no real light branch.

5. `P1` Legal is only half converted.

- [LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx#L7)
- [LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx#L69)
- [LegalTermsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalTermsPage.tsx#L22)
- [DocumentTopicCard.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/DocumentTopicCard.tsx#L18)

The shell has started moving, but helper tokens, breadcrumb chrome, and some content cards still assume a black canvas.

6. `P1` News index and news detail are not coherently theme-aware.

- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L367)
- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L458)
- [RichParagraph.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/RichParagraph.tsx#L15)
- [ChartFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/ChartFrame.tsx#L13)
- [ArticleListenBar.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/ArticleListenBar.tsx#L74)

Panels are beginning to go light, but their content layers remain dark-first.

7. `P1` Some visually light pages are not actually light-themed.

- [DownloadPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/DownloadPage.tsx#L152) paints a pastel/light page without setting `theme="light"`.
- [promptChrome.ts](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/promptChrome.ts#L3) keeps blur and glossy inset treatment in light mode.

8. `P1` Shared chrome still has important conversion gaps.

- [CookieBanner.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CookieBanner.tsx#L109) keeps a heavy blurred black scrim in light mode.
- [SiteTopBar.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/SiteTopBar.tsx#L146) still has a dark-only mobile hamburger control.
- [LanguageSelectModal.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/LanguageSelectModal.tsx#L58) and [MegaFooter.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/MegaFooter.tsx#L86) still preserve the glassy-on-white feel.

9. `P2` Product detail controls are still frosted glass in both themes.

- [ProductHighlightsCarousel.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/product/ProductHighlightsCarousel.tsx#L102)
- [ProductCloserLookExplorer.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/product/ProductCloserLookExplorer.tsx#L76)

Light mode never becomes truly crisp because these controls keep `bg-white/*` plus `backdrop-blur-xl`.

## Content/Legal Detailed Findings

1. `P1` Docs pages are effectively dark-only, so light mode will render low-contrast text and muddy cards/buttons across the docs section.

- [DocsLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsLayout.tsx#L7)
- [DocsOverviewPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsOverviewPage.tsx#L9)
- [DocsQuickstartPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsQuickstartPage.tsx#L8)
- [DocsCookbookPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/docs/DocsCookbookPage.tsx#L12)

2. `P1` Legal pages already switch their hero backgrounds to light, but much of the text, iconography, breadcrumb chrome, and reusable card content still assumes a dark canvas.

- [LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx#L7)
- [LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx#L69)
- [DocumentTopicCard.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/DocumentTopicCard.tsx#L18)
- [LegalHomePage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalHomePage.tsx#L21)
- [LegalInternetServicesPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalInternetServicesPage.tsx#L27)
- [LegalPrivacyPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyPage.tsx#L23)
- [LegalPrivacySelectPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacySelectPage.tsx#L33)
- [LegalPrivacyDocumentPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyDocumentPage.tsx#L42)
- [LegalTermsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalTermsPage.tsx#L22)

3. `P1` `NewsPage` has light-mode surfaces on its dropdowns, but the content inside those panels and most of the page typography/cards are still dark-first.

- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L88)
- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L106)
- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L311)
- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L367)
- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L458)
- [NewsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsPage.tsx#L532)

4. `P1` News detail/article components are not coherently converted.

- [RichParagraph.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/RichParagraph.tsx#L15)
- [ArticleListenBar.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/ArticleListenBar.tsx#L74)
- [BenchmarkTable.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/BenchmarkTable.tsx#L15)
- [ChartFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/ChartFrame.tsx#L13)
- [NewsBenchmarkCharts.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/NewsBenchmarkCharts.tsx#L33)
- [TestimonialPanels.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/news-detail/TestimonialPanels.tsx#L35)
- [NewsDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/NewsDetailPage.tsx#L22)

5. `P2` Story detail is only partially converted and contains a hard-coded dark section inside the page flow.

- [StoryDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StoryDetailPage.tsx#L20)
- [StoryDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StoryDetailPage.tsx#L48)
- [StoryDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StoryDetailPage.tsx#L109)
- [StoryDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StoryDetailPage.tsx#L218)
- [StoryDetailPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/StoryDetailPage.tsx#L275)

6. `P2` Sitemap is unconverted and will remain low-contrast in light mode.

- [SitemapPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/SitemapPage.tsx#L20)
- [SitemapPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/SitemapPage.tsx#L57)

7. `P2` Several legal/detail surfaces still use translucent or blurred dark-style panels in light mode.

- [LegalTermsPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalTermsPage.tsx#L40)
- [LegalPrivacyDocumentPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacyDocumentPage.tsx#L91)
- [LegalPrivacySelectPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/legal/LegalPrivacySelectPage.tsx#L58)
- [DocumentTopicCard.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/DocumentTopicCard.tsx#L18)

## Shared Chrome Detailed Findings

1. `P1` Shared layout still has two theme authorities.

- [bootstrap-dev.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/bootstrap-dev.tsx#L13)
- [MarketingPageFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/MarketingPageFrame.tsx#L15)
- [MarketingPageFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/MarketingPageFrame.tsx#L48)
- [shells.ts](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/shells.ts#L20)

2. `P1` `CookieBanner` is not actually converted across themes.

- [CookieBanner.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CookieBanner.tsx#L109)
- [CookieBanner.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CookieBanner.tsx#L117)

3. `P1` The legal shared chrome is still partly dark-only.

- [LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx#L7)
- [LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx#L69)
- [LegalLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/legal/LegalLayout.tsx#L80)

4. `P1` The mobile top-bar trigger is still styled as dark-only.

- [SiteTopBar.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/SiteTopBar.tsx#L146)
- [app.css](/Users/sonadin/Documents/code/jokuh/landing/src/styles/app.css#L129)

5. `P2` `LanguageSelectModal` still carries muddy light-mode surfaces.

- [LanguageSelectModal.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/LanguageSelectModal.tsx#L58)
- [LanguageSelectModal.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/LanguageSelectModal.tsx#L67)
- [LanguageSelectModal.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/LanguageSelectModal.tsx#L99)

6. `P2` `MegaFooter` is converted functionally, but not with the same light-surface language as the nav.

- [MegaFooter.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/MegaFooter.tsx#L86)
- [MegaFooter.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/MegaFooter.tsx#L263)

## Marketing Surface Detailed Findings

1. `P0` Company pages are structurally dark even when their child typography switches to light-mode colors.

- [CompanyPageLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CompanyPageLayout.tsx#L12)
- [MarketingPageFrame.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/MarketingPageFrame.tsx#L15)
- [typography.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/typography.tsx#L7)

2. `P0` The home editorial sections are only partially converted.

- [Home.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/Home.tsx#L18)
- [RecentNewsSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/RecentNewsSection.tsx#L71)
- [StoriesSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/StoriesSection.tsx#L39)
- [sections.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/system/sections.tsx#L39)

3. `P1` The Download page reads visually light but does not actually switch the shared frame to light.

- [DownloadPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/DownloadPage.tsx#L152)
- [DownloadPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/DownloadPage.tsx#L121)
- [DownloadPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/DownloadPage.tsx#L125)

4. `P1` The landing prompt shell still uses blur and a glossy inset highlight in light mode.

- [promptChrome.ts](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/promptChrome.ts#L3)
- [promptChrome.ts](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/promptChrome.ts#L12)
- [LandingHero.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/LandingHero.tsx#L48)
- [WaitlistSection.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/landing/WaitlistSection.tsx#L29)

5. `P1` About and Careers contain multiple latent light-mode bugs beyond the frame issue.

- [StoryRowLink.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/StoryRowLink.tsx#L13)
- [AboutPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/AboutPage.tsx#L122)
- [CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx#L28)
- [CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx#L71)
- [CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx#L179)
- [CompanyPageLayout.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CompanyPageLayout.tsx#L69)

6. `P1` Careers has several surfaces that still encode dark-only visual assumptions.

- [CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx#L149)
- [CareersPage.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/pages/CareersPage.tsx#L160)

7. `P2` Product detail controls are still frosted glass in both themes.

- [ProductHighlightsCarousel.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/product/ProductHighlightsCarousel.tsx#L102)
- [ProductCloserLookExplorer.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/product/ProductCloserLookExplorer.tsx#L76)

8. `P2` Shared chrome still carries light-mode muddiness in a few places.

- [CookieBanner.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/CookieBanner.tsx#L109)
- [MegaFooter.tsx](/Users/sonadin/Documents/code/jokuh/landing/src/components/MegaFooter.tsx#L87)

## Recommended Fix Order

1. Normalize page-frame theme ownership.
2. Classify routes/components into `dark-locked`, `fully adaptive`, and `needs tokenization`.
3. Introduce semantic surface/text classes for docs, legal, editorial/news, and overlays.
4. Remove blur/translucent light surfaces from prompts, modals, footer controls, language picker, and product controls unless they are intentionally cinematic.

