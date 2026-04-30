# Stories — `/company/stories`

**Purpose:** A long-form narrative surface owned by Jokuh. Stories are not blog posts and not press releases. They are essays, field notes, and reflections from the people building and using Jokuh. Use this page as the index/landing for that body of work.

**Audience:** Curious readers, researchers, journalists, prospective hires.

---

## SEO meta

- **Title:** Stories — Field notes from Jokuh
- **Description:** Long-form essays, reflections, and field notes from the people building Jokuh and the people using it.
- **OG image:** `/og/stories.png`

---

## Hero

**Eyebrow:** STORIES

**Headline (H1):**
Field notes from a freedom layer.

**Subhead:**
Essays, reflections, and dispatches from the team building Jokuh and the people putting it to use.

**Visual slot:** `/_assets/company/stories/hero-bookplate.svg` — a bookplate-style vignette, small and centered, like the title page of a literary publisher.

---

## Section 2 — Editorial pillars

**Three pillars, each a heading + one-line:**

1. **Cryptographic conviction** — why mathematics is the only honest answer to surveillance.
2. **Sovereign software** — what it takes to build software that does not extract.
3. **Lived sovereignty** — stories from people using Jokuh in the wild.

---

## Section 3 — Featured story (template)

**Card layout:**

- Eyebrow: editorial pillar (e.g., *Cryptographic conviction*)
- Title: e.g., "What a Trusted Execution Environment actually trusts."
- Author: byline + link to author page (or Sigil link)
- Reading time: e.g., 8 min
- Excerpt: 30–40 words
- CTA: Read story →

(Component to be reused at scale once the editorial calendar produces work.)

---

## Section 4 — Index of stories

**Layout:** Two columns. Each row = a story. Sortable by pillar.

Columns:
- Title
- Pillar
- Author
- Date
- Reading time

(Initially populate with placeholder rows. The agent should connect this to the CMS — e.g. a `/_content/stories/*.md` source. Each post is its own MD with frontmatter: `title`, `pillar`, `author`, `date`, `reading_time`, `excerpt`, `og_image`.)

---

## Section 5 — Submission

**Headline:**
Have a story for us?

**Body (40 words):**
Stories is open to outside writers when their work fits the editorial pillars. We pay. We edit collaboratively. We do not turn essays into ad copy.

**CTA:** Pitch a story → links to `/company/share-your-story`

---

## Section 6 — Subscribe

**Body line:**
We send a Stories digest, occasionally. Encrypted email is welcome — link to PGP key in the footer.

**Form:** Email field, single-line. No checkboxes. No upsell.

---

## Final CTA strip

**Primary CTA:** Read the latest →
**Secondary CTA:** Pitch a story → `/company/share-your-story`

---

## Asset list

- `/_assets/company/stories/hero-bookplate.svg`
- `/_assets/company/stories/og-template.png`
- `/_assets/company/stories/pillar-icons/*.svg`

---

## Internal links

- `/company/share-your-story`
- `/company/news`
- `/company/about`

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
