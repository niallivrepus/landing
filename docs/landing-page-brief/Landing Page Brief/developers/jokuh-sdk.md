# Jokuh SDK — `/developers`

**Purpose:** The developer landing. Different audience than `/business/sdk-api`. The marketing page sells the *idea*. The developer page sells the *experience of building*. Show code, not glow.

**Audience:** Engineers — staff to junior. Their first impression of the product is this page. Make it credible immediately.

---

## SEO meta

- **Title:** Jokuh SDK — Build sovereign apps
- **Description:** Encrypted memory, agentic primitives, and ZK attestations. The Jokuh SDK gives developers the building blocks for sovereign AI apps.
- **OG image:** `/og/developers.png`

---

## Hero

**Eyebrow:** DEVELOPERS

**Headline (H1):**
Build apps the user actually owns.

**Subhead:**
The Jokuh SDK gives you encrypted memory, agentic primitives, ZK attestations, and identity — as composable, audited building blocks.

**Primary CTA:** Quickstart → `/developers/quickstart`
**Secondary CTA:** Read the docs → `/developers/docs`

**Visual slot:** Static code block (one of the `Quick taste` snippets below). Dark theme. Mono font. No animation.

---

## Section 2 — Quick taste (code, two snippets)

**Snippet 1 — Read from Spine**

```ts
import { Jokuh } from "@jokuh/sdk";

const jokuh = new Jokuh({ apiKey: process.env.JOKUH_API_KEY });

// Memory belongs to the user, identified by their Sigil
const spine = await jokuh.spine.connect({ sigil: user.sigil });

// Pull the last 7 days of crystallized notes
const notes = await spine.query({
  scope: "private",
  since: "7d",
  limit: 50,
});

console.log(notes.length, "memories.");
```

**Snippet 2 — Issue a ZK attestation**

```ts
// Prove the user is over 18 without revealing their birthdate
const attestation = await jokuh.attestations.issue({
  subject: user.sigil,
  claim: "age.over18",
  proof: { kind: "zk", input: encryptedDob },
});

// The attestation is portable. The verifier never sees the input.
return attestation;
```

(Agent: render these in dark code blocks with line numbers, but no glow / gradient effects. Type-forward.)

---

## Section 3 — What's in the SDK

**Four-pillar grid:**

1. **Spine SDK** — encrypted memory read/write, scoped by Sigil and Pod, TEE-backed compute hooks.
2. **Sidekick SDK** — agentic runtime, memory-aware planning, deterministic checkpoints.
3. **Identity SDK** — Sigil resolution, DID, ZK attestation issuance and verification.
4. **Wallet SDK** — multi-chain primitives, scoped to the user, never custodial.

---

## Section 4 — Languages and surfaces

| Language / surface | Status |
|---|---|
| TypeScript / JavaScript (Node, edge, browser) | Stable |
| iOS (Swift) | Beta |
| Python | In progress |
| Rust | Planned |
| Direct REST API | Stable |

---

## Section 5 — Engineering posture

**Body (90 words):**
The SDK is small on purpose. Every additional surface is something we have to defend. We expose the primitives that make sovereign apps possible and resist the temptation to ship sugar that hides the security model.

We document the failure cases first, the happy paths second. We sign every release. We publish breaking-change notices six months in advance. We respond to security disclosures within one business day.

We are building tools we ourselves have to trust under real confidential agreements. That constraint is a feature.

---

## Section 6 — Get started

**Three steps:**

1. **Read the Quickstart** → `/developers/quickstart`
2. **Get an API key** → email `developers@jokuh.com` (placeholder — confirm)
3. **Build something small** — the Quickstart includes three reference apps to fork.

---

## Section 7 — Community and support

- **GitHub** — public repos at `github.com/jokuh-org` (placeholder — confirm)
- **Discord (developers)** — invite link surfaced after API key is issued
- **Office hours** — monthly engineering Q&A, on the record
- **Security disclosures** — `security@jokuh.com` (placeholder — confirm), PGP key linked

---

## Final CTA strip

**Primary CTA:** Quickstart → `/developers/quickstart`
**Secondary CTA:** Read the docs → `/developers/docs`

---

## Asset list

- `/_assets/developers/code-quickstart.png` — render of the snippet for OG
- `/_assets/developers/pillar-icons/*.svg`
- `/_assets/developers/og-template.png`

---

## Internal links

- `/developers/quickstart`
- `/developers/docs`
- `/business/sdk-api`
- `/products/spine`
- `/products/profile`

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
