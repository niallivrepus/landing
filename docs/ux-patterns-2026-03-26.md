# UX Patterns Requested On 2026-03-26

This document captures the UX patterns requested during the March 26, 2026 working session so they remain part of the product/design brief rather than living only in chat history.

## Content Model

### Stories vs Newsroom

- `Stories` are human-centered narratives for the broader audience.
- `Newsroom` is for corporate, product, engineering, company, and feature updates.
- Story cards and story listings must always resolve to the story detail template.
- Newsroom cards and newsroom listings must always resolve to the article/news detail template.
- Story clicks must never route into product detail pages.
- Article clicks must never route into product detail pages.

## Homepage

### Newsroom Section

- The previous Journal structure is the correct structural model for the homepage Newsroom section.
- Show exactly `1` featured card plus `3` supporting cards.
- Desktop behavior:
  - Featured card on the left.
  - Three supporting cards stacked vertically on the right.
  - The featured block should scroll along with the viewport and remain sticky under the top bar until the section ends.
- Tablet behavior:
  - Featured card sits on top.
  - Three supporting cards appear in a horizontal row beneath it.
- Phone behavior:
  - Featured card on top.
  - Supporting cards return to a vertical list underneath.
- Sticky behavior should feel visually pinned to the top of the viewport, not float noticeably below it.
- The sticky behavior is a layout rule, not a dark-mode/light-mode variant.

### Stories Section

- Stories remain a separate surface from Newsroom.
- Homepage Stories should continue to point into the Stories system rather than Newsroom.

## Story Detail Pages

### Editorial Direction

- The story detail page should feel editorial and documentary rather than like a product-marketing template.
- Emphasis should come from:
  - calmer pacing
  - wider spacing between narrative beats
  - large photographic moments
  - stronger reading hierarchy
  - subtler interaction states
- Avoid overusing marketing furniture at the end of the page.
- The reading experience should prioritize narrative flow over conversion surfaces.

### Story Layout

- Use a restrained story header.
- Include a quiet story navigator/selective story rail rather than loud archive treatment.
- Narrative body copy should have stronger editorial contrast than utility labels.
- Hover behavior in story pages should remain subdued.
- Quotes and supporting callouts should feel like part of the reportage, not promo banners.

### Three-Up Image/Text Component

- Add a reusable block with:
  - `3` images side by side on larger screens
  - text directly underneath each image
  - support for emphasized keywords rendered in bold
- This component must be ready for both dark mode and light mode.
- Light/dark readiness includes:
  - appropriate surface/background colors
  - border contrast
  - readable text contrast in both themes

## Top Bar Navigation

### Products Dropdown

- The Products hover state must clearly showcase Jokuh products.
- It must include:
  - Pods
  - Blurbs
  - Spine
  - Vortex
  - other product-adjacent items already present if useful, as long as products remain clearly visible

### Developers Dropdown

- Left side should be the primary large-text section.
- Primary left-side items:
  - Jokuh SDK
  - Agents
  - Open models
  - Pods
- These developer-primary items should use the diagonal arrow / launch treatment.
- Right side should be a smaller `Resources` section.
- Resource items:
  - Docs
  - Cookbooks
  - Community
- Resource items should also use the diagonal arrow / launch treatment.

### Company Dropdown

- Company hover state should contain:
  - About us
  - Careers
  - News
  - Brand guidelines

## Documentation Template

### Docs Shell

- Developer documentation should use a dedicated template, separate from the marketing page frame.
- The docs experience should read like its own product surface or app shell, even if it still lives in the same codebase.
- The shell should use a full-width layout rather than the narrower marketing content frame.
- Desktop docs should support:
  - a dedicated top bar
  - a persistent left navigation rail
  - a wide main content canvas
- Mobile docs should avoid a bulky accordion-first experience and instead use lighter horizontal navigation where possible.
- The docs shell should be treated as the starting template for future documentation work.

## Search Overlay

### Primary Interaction Model

- Search should open as a top-first composer, not as a bottom-bar search pattern.
- The large search input should appear near the top by default when the overlay opens.
- The first-search state should feel clean, spacious, and simple.

### Prompt Suggestions

- The empty search state should cycle through animated prompt suggestions.
- Suggested prompt language should include examples like:
  - ask me about our team
  - ask me about our mission
  - ask me about research at Jokuh
  - ask what our team is thinking
- The suggestion animation should move top-to-bottom in a calm carousel-like way.

### Follow-Up Behavior

- After the first result is returned, the follow-up prompt should no longer behave like a fixed bottom bar.
- Follow-up input should appear underneath the returned result set as part of a chronological thread.
- The interaction should read like:
  - first question
  - results / summary
  - follow-up prompt
  - next answer
- This is a thread model, not a docked composer model.

### Search Trigger / Iconography

- The top-bar search icon should transition into a simple square close state when search is open.
- The open/close icon treatment should feel clean and minimal.
- The send affordance should use the same directional arrow language as the prompt bar.
- The search composer should be expressed as an underlined input line with the send arrow attached to that line, rather than a bulky boxed field.

## Visual Principles For Today’s Requests

- Keep the interface calm and premium.
- Preserve hierarchy instead of flattening all cards into equal importance.
- Differentiate surfaces clearly:
  - Newsroom for updates
  - Stories for narratives
  - Search for guided discovery
- Responsive behavior should preserve the content hierarchy instead of merely reflowing cards mechanically.
- When adding new components, always account for both dark and light themes.
