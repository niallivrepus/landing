# Docs — `/developers/docs`

**Purpose:** A developer documentation index — the marketing-site shadow of the canonical docs site. The marketing version exists for SEO and for buyers who want to verify documentation depth before they bring engineering in. The canonical version lives at `docs.jokuh.com`.

**Audience:** Engineers evaluating depth, integration architects, security reviewers reading the API surface for risk.

**Note for the agent:** This page is mostly a routed redirect/index. Do not duplicate the canonical docs here. The marketing-site version surfaces the *table of contents* and links out.

---

## SEO meta

- **Title:** Docs — Jokuh SDK
- **Description:** Reference documentation for the Jokuh SDK — Spine, Sidekick, Identity, Attestations, Wallet.
- **OG image:** `/og/docs.png`

---

## Hero

**Eyebrow:** DOCS

**Headline (H1):**
Reference documentation.

**Subhead:**
The full developer documentation lives on the canonical docs site. Below is the table of contents.

**Primary CTA:** Open the docs ↗ → `https://docs.jokuh.com` (placeholder — confirm)
**Secondary CTA:** Run the Quickstart → `/developers/quickstart`

---

## Section 2 — Table of contents

**Six top-level sections:**

### 1 — Concepts
- The Jokuh model (Spine, Sigil, Pod, Sidekick, Wallet)
- Confidentiality stack (TEE, ZKP, FHE)
- Attestation lifecycle
- Scope semantics (private, scoped, public)
- Forgetting

### 2 — Spine SDK
- `connect`, `write`, `query`, `forget`
- Pod scopes
- Crystallization hooks
- Export and import
- Error model

### 3 — Sidekick SDK
- Spawning an agent
- Memory-aware planning
- Deterministic checkpoints
- Tool registration
- Inference budgets

### 4 — Identity SDK
- Sigil resolution
- DID linkage
- ZK attestation issuance
- ZK attestation verification
- Revocation

### 5 — Wallet SDK
- Multi-chain primitives
- Transaction signing
- Gas estimation across networks
- Settlement against Pods

### 6 — Operational
- Region pinning
- Rate limits
- Versioning and breaking-change policy
- Security disclosures

---

## Section 3 — How the docs are versioned

**Body (60 words):**
Docs are versioned alongside the SDK. We tag each major version, keep the previous major fully indexed for one year, and surface deprecation notices six months ahead of breaking changes.

The canonical docs site supports per-version permalinks. Cite versioned URLs in your internal docs to avoid drift.

---

## Section 4 — Status surface

| Surface | Status |
|---|---|
| Spine SDK | Stable |
| Sidekick SDK | Beta |
| Identity SDK | Stable |
| Wallet SDK | Beta |
| iOS SDK | Beta |
| TypeScript / JS SDK | Stable |
| Python SDK | In progress |
| Rust SDK | Planned |

(Agent: keep this in sync with the SDK landing — do not let them drift.)

---

## Section 5 — Disclosures

**Body (40 words):**
Found a security issue? Email `security@jokuh.com` (placeholder — confirm). PGP key linked from the docs. We respond within one business day, fix critical issues with priority, and credit the reporter on disclosure.

---

## Final CTA strip

**Primary CTA:** Open the canonical docs ↗ → `https://docs.jokuh.com`
**Secondary CTA:** Run the Quickstart → `/developers/quickstart`

---

## Asset list

- `/_assets/developers/docs/og.png`
- `/_assets/developers/docs/section-icons/*.svg`

---

## Internal links

- `/developers`
- `/developers/quickstart`
- `/business/sdk-api`
- `/business/resources`

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
