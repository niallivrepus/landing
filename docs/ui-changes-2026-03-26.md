# UI Changes Log

Date: 2026-03-26

This document captures the main UI changes made across the Jokuh marketing site on March 26, 2026.

## Navigation and global chrome

- Simplified the top bar hover treatment:
  - removed the heavier gray hover/pill feeling on primary nav items
  - active hovered item stays fully black in light mode
  - sibling items dim to a softer dark gray for cleaner contrast
- Removed the extra light-mode divider line that appeared under the mega menu.
- Reworked the Company dropdown so `Brand guidelines` now appears as a smaller `Resources` link instead of a full-size primary company link.
- Removed the standalone prompt bar detail page:
  - `/prompt` now redirects to the home prompt section (`/#prompt`)
  - sitemap and site-search references were updated to point to the home anchor instead of a separate page
- Reused the top-bar `Try Jokuh` CTA style inside product pages so the call-to-action language and button treatment are consistent.

## Homepage

- Refined the homepage newsroom layout:
  - the featured article remains on top
  - the three supporting articles now sit in a cleaner row underneath instead of collapsing awkwardly in intermediate breakpoints
- Tightened the pre-footer CTA width so the “Get started with Jokuh” block no longer stretches wider than the content rhythm around it.
- Softened the identity wheel center so the inner rings sit back visually and the headline is easier to read.
- Increased the identity wheel scale by roughly 20% so the composition feels more intentional.

## Journal / newsroom / stories listing

- Rebuilt the `/journal` / `/newsroom` listing as a cleaner editorial system:
  - default view is now grid
  - the lead story lives inside the same overall grid logic instead of a separate stitched-together composition
  - header and controls were simplified to better match a modern editorial listing pattern
- Improved the filter/sort/control treatment so the listing feels lighter and less overworked.
- Added a true active-state view toggle:
  - grid view now shows a filled icon when selected
  - list view remains visually distinct when inactive/active
- Standardized editorial image corner radius across:
  - homepage story tiles
  - newsroom/journal cards
  - story detail surfaces
  - shared editorial media wrappers

## Editorial art direction

- Introduced a more consistent editorial imagery system:
  - abstract/glass artwork is now used for news/article entries
  - human-led imagery is now used for stories
- Added a shared editorial art registry so the same visual language can be reused across homepage, journal/newsroom, and story surfaces.
- Added additional office/team story imagery for technical and product-focused story cards.

## Story and article detail structure

- Began turning article detail into a proper reusable template system:
  - extracted a shared editorial article frame
  - aligned hero metadata, title, subtitle, and section rhythm into a repeatable structure
- Cleaned story/news visual consistency so detail pages inherit more from the landing-system language instead of drifting into one-off styling.

## Product pages

- Simplified the product hero/top section:
  - replaced the stacked title-plus-paragraph treatment with one cleaner single-sentence statement
  - removed the older purple `Join Beta` feeling at the top of the page
  - swapped in the shared `Try Jokuh` button style from the top bar

## Contact sales

- Replaced the old `/contact` stub with a real `Contact sales` page.
- Added a clear two-column enterprise-contact layout:
  - left side: sales positioning, feature cards, trust/brand motion section
  - right side: structured sales intake form
- Added hover motion accents for feature cards using the existing Lottie runtime.
- Added a 3-column animated brand/trust wall to make the page feel more alive without adding excess clutter.
- Added a clean help-center handoff beneath the form.

## Support and light-mode specialty pages

- Support and contact were intentionally treated as light-mode pages with cleaner Apple/OpenAI-style visual handling.
- Added help-center origin support so those pages can hand off to a proper sibling/subdomain pattern later.

## Dark-mode and theme infrastructure

- Added an explicit theme contract to the shared marketing frame instead of assuming every template is dark-first.
- Updated the shared simple-page and editorial-article templates to pass theme through properly.
- Added missing `light:` fallbacks to shared typography and section primitives so template-level text can render correctly under light mode.
- Fixed shared chrome components that were not respecting theme properly:
  - fullscreen site search overlay
  - language selector modal
  - top-bar mobile trigger
  - mobile footer accordion row/chevron colors

## Remaining dark-mode follow-up

The current audit still flags deeper dark-mode work in a few places:

- `DownloadPage`
- product showcase modules and art-directed product surfaces
- docs sidebar/nav layout
- legal layout breadcrumb/muted text surfaces
- company closing CTA section

Those areas still need a dedicated pass if full dark-mode parity is the goal.
