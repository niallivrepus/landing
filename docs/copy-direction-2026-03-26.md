# Copy Direction

Date: 2026-03-26

Updated: 2026-03-27

This document captures the copy direction established today for Jokuh marketing copy, with emphasis on product detail pages.

## Core Direction

The copy should move toward Apple-style simplicity:

- fewer words
- cleaner rhythm
- one idea at a time
- less explanation under the headline
- more confidence in the main line itself

The goal is not sparse copy for its own sake. The goal is clarity that lands immediately.

## Product Detail Page Rule

For every Jokuh product detail page:

- each feature or section should be explained by one clean punchline
- do not rely on subtitles to make the idea understandable
- the main line should stand on its own
- supporting copy should be removed when the punchline can carry the meaning by itself

In practice, this means:

- hero sections should lead with a simple primary statement
- feature cards should use a single strong line
- bento sections should use one punchline per panel
- spotlight sections should use one statement only
- privacy sections should rely on the headline, not a paragraph stack
- closing value cards should use one short line each

## Writing Logic

When writing or revising product copy:

- say one thing clearly instead of two things cleverly
- prefer short declarative sentences
- avoid stacked clauses joined by dashes when a simpler sentence will do
- avoid headline-plus-explainer patterns unless the explainer is truly necessary
- avoid sounding inflated, conceptual, or over-written
- keep the tone calm, direct, and premium
- make each line feel complete without follow-up text

## Main Page Title Rule

For main page titles and hero headlines:

- prefer a deliberate line break
- even when the title is short, let it stack across lines if that makes it feel more leading
- treat the line break as part of the rhythm, not just a layout fallback
- keep each line visually clean and easy to scan

This does not mean every title needs two long lines. It means the main title should feel led, not dumped in one flat row.

## What To Avoid

- subtitles that repeat or decode the headline
- feature descriptions that explain what the title should already communicate
- multiple ideas inside one sentence
- layered marketing language that weakens the main point
- copy that needs a second sentence to become clear

## Approved Copy Change For Today

The waitlist line was simplified from:

`Get a note when the next batch opens-including blurbs and drops tied to what we ship.`

to:

`Get a note when the next batch opens.`

This is the model for the direction:

- remove the extra clause
- keep the useful meaning
- leave one clean sentence

## Applied Product Page Implementation

Today this direction was applied to the shared product detail system.

Implementation notes:

- product hero H1 copy is sourced from `src/data/products.ts`
- product detail section titles are centralized in `src/data/product-detail-blueprints.ts`
- the shared product renderer is `src/pages/ProductPage.tsx`
- the active title pass favors shorter headline strings in the shared data layer first

Because the product pages share one template, this rule should remain consistent across Pods, Blurbs, Spine, and Vortex unless a future exception is explicitly approved.

## Editing Standard Going Forward

For any copy pass on Jokuh product marketing:

1. Start by asking whether the headline can carry the full meaning alone.
2. If yes, remove the subtitle.
3. If not, rewrite the headline before adding support copy.
4. Keep feature cards to one punchline whenever possible.
5. Prefer subtraction before rewriting around the existing sentence.

## Quick Test

Before approving a line, check:

- Can someone understand it in one read?
- Does it feel clean without supporting text?
- Is it saying only one thing?
- Would removing the second line make it stronger?

If the answer is yes, the copy is moving in the right direction.
