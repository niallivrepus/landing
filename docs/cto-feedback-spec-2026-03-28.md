# CTO Feedback Spec

Date: 2026-03-28

## Goal

Turn two CTO notes into shippable landing-site scope:

1. `API Platform` should be named `Agent Portal`.
2. Blog posts should be authorable in markdown and render on-site in the blog.

Phase 1 should include one real post first to validate the format.

## Decisions

### 1. Naming

- Display name: `Agent Portal`
- Current route stays: `/developers/sdk`
- This is a naming change first, not a route migration

Reason:
- lowest-risk change
- current route already exists and is linked widely
- avoids breaking nav/search/docs while copy settles

### 2. Blog model

- Keep `/developers/blog` as the archive page
- Add real post routes at `/developers/blog/:slug`
- Author posts in markdown files
- Render long-form posts with the existing editorial article system

### 3. First post

- Ship one manifesto-style post first
- Best visual model: same family as `/charter`
- Purpose: validate markdown rendering, archive card design, and reading flow before scaling the blog

## Current State

### Blog

- `/developers/blog` exists as an index page
- it is backed by static TS data in `src/data/developer-blog.ts`
- entries currently link to other surfaces, not blog detail pages
- there is no markdown pipeline
- there is no `/developers/blog/:slug` route
- there is no blog detail page component

### Best existing template

Use:
- `src/components/system/templates/EditorialArticleTemplate.tsx`

Why:
- already used by `/charter`
- already fits manifesto / essay content
- cleaner fit than the image-heavy stories template

## Scope

### Phase 1

#### A. Finish `Agent Portal` naming consistency

Update remaining visible mismatches:

- `src/pages/DeveloperSdkPage.tsx`
- `src/data/docs-nav.ts`
- `src/pages/DeveloperLearnPage.tsx`
- `src/App.tsx`
- `src/data/site-search-suggestions.ts`

Expected result:
- user sees `Agent Portal` everywhere
- route can still stay `/developers/sdk`

#### B. Add markdown-authored blog posts

Add:

- `src/pages/DeveloperBlogPostPage.tsx`
- route: `/developers/blog/:slug`
- markdown source directory, recommended:
  - `src/content/developer-blog/`

Add a typed loader/content map with:

- `slug`
- `title`
- `subtitle`
- `excerpt`
- `tag`
- `publishedAt`
- `readMinutes`
- `image`
- `markdown`

#### C. Make the blog index point to real posts

Change blog entry data so each entry can link to:

- `/developers/blog/:slug`

Recommended split:

- `src/data/developer-blog.ts` for archive metadata
- `src/content/developer-blog/*.md` for body content

#### D. Ship one real post

First post recommendation:

- a manifesto-style developer essay
- same reading posture as charter
- likely title direction:
  - `Why Agent Portal exists.`
  - `Build agents without three glue layers.`
  - `The Jokuh developer manifesto.`

## Implementation Shape

### Content format

Recommended markdown frontmatter:

```md
---
slug: agent-portal-manifesto
title: Why Agent Portal exists.
subtitle: One clean surface for agents, tools, and deployment.
excerpt: A short explanation of why Jokuh is collapsing SDK, tools, and agent workflows into one surface.
tag: Platform
publishedAt: 2026-03-28
readMinutes: 4
image: /journal-art/news-blue-lens.png
---

# Intro

Markdown body here.
```

### Rendering rules

- headings, paragraphs, lists, blockquotes, links
- no raw HTML in v1
- code blocks supported
- images optional in v1
- reading layout should use `EditorialArticleTemplate`

### Index behavior

- newest first
- featured first post stays supported
- cards use excerpt + image + tag + date + read time

## File Plan

### New

- `src/pages/DeveloperBlogPostPage.tsx`
- `src/content/developer-blog/agent-portal-manifesto.md`
- `src/lib/developer-blog-content.ts`

### Updated

- `src/App.tsx`
- `src/pages/DeveloperBlogPage.tsx`
- `src/data/developer-blog.ts`
- `src/pages/DeveloperSdkPage.tsx`
- `src/data/docs-nav.ts`
- `src/pages/DeveloperLearnPage.tsx`
- `src/data/site-search-suggestions.ts`

## Non-Goals

- no route migration from `/developers/sdk` in phase 1
- no CMS in phase 1
- no MDX component embedding in phase 1
- no author system in phase 1
- no multi-category filtering in phase 1

## Risks

- `Agent Portal` is only partially renamed right now; visible inconsistency will remain until the sdk/docs/search surfaces are aligned
- markdown support does not exist yet, so blog detail pages require a new content pipeline
- if CTO wants actual route rename later, that is a second project, not part of this naming pass

## Recommendation

Ship in this order:

1. finish `Agent Portal` naming consistency
2. add markdown blog detail architecture
3. publish one manifesto-style post
4. review visually
5. then decide whether to scale blog publishing

## Open Point

CTO note says: `A formatter for crm deployments.`

Current interpretation:
- likely a request for a deployment/content format for CRM-oriented rollout posts or practical deployment notes

Do not build this into phase 1 yet.
Treat it as a follow-up content type once the first markdown post is live.
