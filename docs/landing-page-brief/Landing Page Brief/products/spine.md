# Spine — `/products/spine`

**Purpose:** Spine is the conceptual root of Jokuh. If a visitor only reads one product page, this is the one. It explains memory, encryption, and ownership in language that a non-engineer can hold.

**Audience:** Privacy-aware professionals, founders, researchers, lawyers, journalists. Crypto-curious, not crypto-only.

---

## SEO meta

- **Title:** Spine — Encrypted memory for the AI age | Jokuh
- **Description:** Spine is the encrypted memory layer at the core of Jokuh. Your AI remembers what you choose. Nobody else can read it.
- **OG image:** `/og/spine.png`

---

## Hero

**Eyebrow:** PRODUCT — SPINE

**Headline (H1):**
Memory that belongs to you.

**Subhead:**
Spine is the encrypted core of Jokuh. It stores everything your AI knows about you — and is built so nobody, not even us, can read it.

**Primary CTA:** Get Jokuh →
**Secondary CTA:** How it works → `#architecture`

**Visual slot:** `/_assets/products/spine/hero.mp4` — a column of glyphs slowly assembling into a single object, then sealing.

---

## Section 2 — The problem

**Headline:**
Every prompt is a confession.

**Body (90 words):**
You type. The model remembers. The vendor logs it. Some day a court asks for it, or a competitor's training run absorbs it, or a marketing platform infers it. The pattern is universal — and the moment you hand thought to a third party, the law treats it as theirs to share.

Spine inverts the relationship. Your AI's memory lives in a place built to make extraction physically impossible.

---

## Section 3 — What Spine does

**Headline:**
The vault that learns.

**Body intro (40 words):**
Spine is the persistent memory your Jokuh agents read from and write to. Think of it as the long-term memory of every conversation, decision, document, and signal you choose to keep — encrypted at rest, encrypted in motion, encrypted in compute.

**Three feature cards:**

1. **Capture across surfaces**
   Spine ingests from your Calls, Messages, Blurbs, and connected meeting tools (Zoom, Google Meet, Slack, Discord). What you say, write, or hear is preserved with full speaker attribution when present.

2. **Crystallize, don't dump**
   Raw transcripts compound noise. Spine crystallizes them into a Knowledge Pool — your indexed corpus, queryable by your agents, searchable by you, never readable by us.

3. **Scope, share, forget**
   Every memory is scoped: private, shared with named identities, or public-by-explicit-flag. Forgetting is one click. Forgetting is real — keys are destroyed and the entry is unrecoverable.

---

## Section 4 — Architecture (anchor: `#architecture`)

**Headline:**
Confidentiality, by construction.

**Body (110 words):**
Spine is engineered so the company that ships it is incapable of reading what it stores. We do not have a back door. We could not build one without breaking the seal that vetted the system in the first place.

Three primitives carry this:

- **Trusted Execution Environment (TEE).** Computation runs inside a hardware-isolated enclave. The host machine, the operating system, and the cloud provider cannot see what is being computed.
- **Zero-Knowledge Proofs (ZKP).** Spine can prove that a computation happened correctly without ever revealing the input data. Audit without exposure.
- **Fully Homomorphic Encryption (FHE).** Where ZKPs prove, FHE computes — on encrypted data. Operations happen without decryption.

The keys are yours. We hold none.

---

## Section 5 — What this changes for you

**Three rows, alternating image/text:**

1. **You can finally tell the AI everything.**
   Tax bracket. Health concern. Strategy doc. Family conflict. Spine treats all of it like a private journal that you have hired an intelligence to help you read.

2. **You can connect tools without paying with your data.**
   Email, calendar, drive, code repo, browser history — Spine reads from them through encrypted bridges and never relays the raw signal anywhere.

3. **You can leave any time.**
   Export is a first-class feature. The Spine archive is a portable, encrypted file. Take it with you. Bring it to another instance. We are designed to be left.

---

## Section 6 — Use cases (chips, not paragraphs)

- A lawyer preparing a case without producing admissible evidence against the client.
- A founder brainstorming a product without training a competitor's model.
- A researcher writing a grant without leaking unpublished methodology.
- A family asking medical questions without becoming a marketing segment.
- A child interacting with an AI without building a behavioral profile they didn't consent to.

---

## Section 7 — Verify

**Headline:**
We welcome your skepticism.

**Body (50 words):**
Demand attestations. Read the architecture. Ask for the proofs. Spine was built by people who use it under real confidential agreements. We are not asking you to trust us. We are asking you to verify trust is unnecessary — because the math holds whether you believe in us or not.

**CTA:** Talk to engineering → `/business/contact`

---

## Final CTA strip

**Headline:** The doors are locked from the inside.
**Body:** Only you hold the key.
**Primary CTA:** Get Jokuh →

---

## Asset list

- `/_assets/products/spine/hero.mp4`
- `/_assets/products/spine/architecture-diagram.svg` — TEE / ZKP / FHE triad
- `/_assets/products/spine/scope-diagram.svg` — private / shared / public scopes
- `/_assets/products/spine/usecase-grid.png`

---

## Internal links

- `/products/blurbs` — what your memory generates
- `/products/calls` — what flows in
- `/products/messages` — what flows in
- `/products/profile` — what your memory expresses
- `/business/jokuh-enterprise` — for org-grade Spine
- `/developers/docs` — Spine SDK reference

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
