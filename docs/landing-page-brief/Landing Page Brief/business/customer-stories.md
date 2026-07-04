# Customer Stories — `/business/customer-stories`

**Purpose:** A trust surface that demonstrates Jokuh in real operational contexts. Customer Stories are case-study-shaped: a problem, an approach, an outcome, with verification. Different from `/company/stories` (which is editorial).

**Audience:** Buyers in evaluation, partners, journalists looking for proof.

**Important note for the agent:** Do not publish a customer story without explicit written permission from the customer, on the record. Anonymous stories are allowed but must say so prominently. We do not invent customers.

---

## SEO meta

- **Title:** Customer Stories — Jokuh in the wild
- **Description:** How real teams use Jokuh to keep AI, communication, and identity confidential by mathematics.
- **OG image:** `/og/customer-stories.png`

---

## Hero

**Eyebrow:** CUSTOMER STORIES

**Headline (H1):**
What sovereignty looks like in practice.

**Subhead:**
Real teams putting Jokuh to work — across law, research, design, and security. Names attributed when permission was given. Anonymous when it had to be.

**Visual slot:** `/_assets/business/customer-stories/hero.svg` — three quiet glyphs in a row.

---

## Section 2 — Featured story (template)

**Layout:** Hero card.

- Industry chip (e.g., LAW · RESEARCH · DESIGN · SECURITY · FINANCE)
- Title (max 90 chars)
- One-line summary (60 chars)
- Status: ATTRIBUTED · ANONYMOUS
- Excerpt (60 words)
- CTA: Read the story →

(Connect to `/_content/customer-stories/*.md` with frontmatter `industry`, `title`, `summary`, `attribution`, `customer_name`, `excerpt`, `body`, `og_image`, `quote`, `quote_attribution`.)

---

## Section 3 — Index

**Layout:** Two columns of cards. Filterable by industry chip.

Empty state: "We are choosy about case studies. Real ones are coming. In the meantime, talk to us." → `/business/contact`

---

## Section 4 — How a customer story is made

**Body (80 words):**
We do not publish a story without written permission. We do not pay customers to be featured. We share drafts before publication. We let customers veto any line they don't like.

For sensitive industries, we publish anonymously and document the verification process. Independent press is welcome to confirm the underlying facts directly with the customer when authorized.

This is how trust is earned outside our own product as well — receipts.

---

## Section 5 — Story format (what each customer story contains)

1. **The problem** — what could not be said out loud, what could not be left unsaid.
2. **The constraint** — what compliance, regulation, or threat model demanded.
3. **The approach** — which Jokuh surfaces are deployed, in which configuration.
4. **The verification** — what attestations, audits, or third-party reviews confirm the claims.
5. **The outcome** — what changed in operation, in speed, in posture.
6. **The quote** — on the record, attributed when allowed.

---

## Final CTA strip

**Headline:** Be the next case study (or stay anonymous — both are honored).
**Primary CTA:** Talk to us → `/business/contact`

---

## Asset list

- `/_assets/business/customer-stories/hero.svg`
- `/_assets/business/customer-stories/industry-chips/*.svg`
- `/_assets/business/customer-stories/og-template.png`

---

## Internal links

- `/business/contact`
- `/company/stories`
- `/business/jokuh-business`
- `/business/jokuh-enterprise`

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
