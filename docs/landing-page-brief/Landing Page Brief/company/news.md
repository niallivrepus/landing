# News — `/company/news`

**Purpose:** A reverse-chronological surface for milestone announcements: funding, partnerships, product releases, public security audits, hires of public significance. News pieces are short, factual, and quotable. Stories pieces are long and reflective. Don't confuse the two.

**Audience:** Press, investors, partners, prospective hires.

---

## SEO meta

- **Title:** News — Jokuh
- **Description:** Funding, releases, audits, and milestones from the team building Jokuh.
- **OG image:** `/og/news.png`

---

## Hero

**Eyebrow:** NEWS

**Headline (H1):**
What's new at Jokuh.

**Subhead:**
Announcements, releases, and milestones — short, factual, easy to quote.

**Visual slot:** `/_assets/company/news/hero-mark.svg` — small geometric mark, dark, restrained.

---

## Section 2 — Latest (template)

**Card layout, three across, reverse-chronological:**

- Tag (e.g., FUNDING · RELEASE · AUDIT · PARTNERSHIP)
- Date (ISO format displayed as `Apr 29, 2026`)
- Title (headline, max 90 chars)
- Excerpt (40–60 words)
- CTA: Read announcement →

(The agent should connect this to a CMS source: `/_content/news/*.md` with frontmatter `date`, `tag`, `title`, `excerpt`, `body`, `og_image`, `is_press_release` boolean.)

---

## Section 3 — Press contact

**Body (40 words):**
Press inquiries: `press@jokuh.com` (placeholder — confirm before publishing). For interviews and embargoed releases, contact us directly. We aim to respond within two business days.

**CTA:** Download press kit → `/press`

---

## Section 4 — Subscribe to releases

**Body (30 words):**
We send a brief release digest — funding, releases, audits, partnerships. No editorial. No fluff. PGP-encrypted email available on request.

**Form:** Email field, subscribe button.

---

## Section 5 — Tag taxonomy (locked)

The agent should support this fixed set of tags. Do not invent new ones without a content lead approving it:

- **FUNDING** — round announcements, grants, accelerator news.
- **RELEASE** — software releases on Spine, Blurbs, Calls, Messages, Profile, ARC Terminal, SDK.
- **AUDIT** — security audits, attestations, third-party verification.
- **PARTNERSHIP** — public integrations, ecosystem collaborations.
- **HIRE** — public significance hires (executives, security leads).
- **MILESTONE** — user-base, ecosystem, infrastructure milestones.

---

## Section 6 — Editorial rules for News pieces

(For internal use, surfaced to the agent so it formats consistently)

- Lead with the fact in the first sentence.
- Quote a person on the record by their public title.
- Include verifiable links: signed audit, SAFE filing, repo, partner site.
- 200–500 words. Anything longer becomes a Story.
- No marketing adjectives. The fact has to do the work.

---

## Final CTA strip

**Primary CTA:** Subscribe to releases →
**Secondary CTA:** Read longer pieces → `/company/stories`

---

## Asset list

- `/_assets/company/news/hero-mark.svg`
- `/_assets/company/news/og-template.png`
- Tag icons (one per tag, monochrome) at `/_assets/company/news/tags/*.svg`

---

## Internal links

- `/company/stories`
- `/company/about`
- `/company/company`

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
