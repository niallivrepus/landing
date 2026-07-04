# Quickstart — `/developers/quickstart`

**Purpose:** Get a real engineer from "zero" to "running their first Jokuh call" in under fifteen minutes. The page must read like a tested guide, not a marketing piece.

**Audience:** Engineers, mid- to senior-level, who have used npm and curl and want to evaluate the SDK fast.

**Note for the agent:** This page is the marketing-site mirror of the canonical Quickstart that lives in the developer docs site. Where they conflict, the canonical docs win. This file is the *staging* of the structure on the marketing site, with placeholder links to the live doc.

---

## SEO meta

- **Title:** Quickstart — Jokuh SDK
- **Description:** Install the Jokuh SDK, get an API key, run your first encrypted call. Under fifteen minutes.
- **OG image:** `/og/quickstart.png`

---

## Hero

**Eyebrow:** QUICKSTART

**Headline (H1):**
From zero to running, in fifteen minutes.

**Subhead:**
Install the SDK. Get an API key. Make your first encrypted call to Spine. Verify the attestation. Done.

**Primary CTA:** Open the canonical docs ↗ → `https://docs.jokuh.com/quickstart` (placeholder — confirm)
**Secondary CTA:** Read the SDK overview → `/developers`

---

## Section 2 — Prerequisites

- Node 20+ (for the TypeScript SDK)
- A working terminal
- Five minutes to read the README before you complain that the example didn't work

---

## Section 3 — Step 1 — Install

```bash
npm install @jokuh/sdk
```

(Or `pnpm add @jokuh/sdk` if that's how you live.)

---

## Section 4 — Step 2 — Get an API key

**Body (40 words):**
Until self-serve key issuance is live, request a developer API key by emailing `developers@jokuh.com` (placeholder — confirm). We respond within one business day. The key is scoped to a sandbox Spine you control.

---

## Section 5 — Step 3 — Initialize

```ts
import { Jokuh } from "@jokuh/sdk";

const jokuh = new Jokuh({
  apiKey: process.env.JOKUH_API_KEY,
  // Optional: pin a region for compliance
  region: "us-east-1",
});
```

---

## Section 6 — Step 4 — Make your first call

```ts
// 1. Connect to a sandbox Sigil (your developer key gives you one)
const sigil = await jokuh.identity.devSigil();

// 2. Open Spine for that Sigil
const spine = await jokuh.spine.connect({ sigil });

// 3. Write a memory
await spine.write({
  scope: "private",
  payload: { title: "first run", body: "hello sovereignty" },
});

// 4. Read it back
const memories = await spine.query({ scope: "private", limit: 5 });
console.log(memories);
```

If you see your memory in the output: congratulations. You have just written to a TEE-backed encrypted memory store.

---

## Section 7 — Step 5 — Verify the attestation

```ts
// Every Spine operation produces an attestation.
const attestation = await spine.lastAttestation();

// Verify it locally
const ok = await jokuh.attestations.verify(attestation);
console.log("attestation valid:", ok);
```

**Body (30 words):**
The attestation is what makes Jokuh more than just another encrypted store. It is the cryptographic receipt that the operation happened, in the configuration we said, on the data you sent.

---

## Section 8 — What to build next

**Three suggestions:**

1. **Personal AI memory app** — wrap Spine in a simple notes UI. Reference: `/_examples/notes` (placeholder).
2. **ZK age-gating flow** — issue and verify an over-18 attestation without revealing DOB. Reference: `/_examples/zk-age-gate` (placeholder).
3. **Sidekick agent** — spawn an agentic runtime that reads Spine and answers a user question. Reference: `/_examples/sidekick-101` (placeholder).

---

## Section 9 — Where to go for more

- Full reference docs → `/developers/docs`
- Discord (developers) — invite surfaced with your API key
- Engineering office hours — monthly, on the record
- Security disclosures — `security@jokuh.com` (placeholder — confirm)

---

## Final CTA strip

**Primary CTA:** Read the full docs → `/developers/docs`
**Secondary CTA:** Talk to engineering → `/business/contact?topic=sdk`

---

## Asset list

- `/_assets/developers/quickstart/og.png`
- `/_assets/developers/quickstart/code-blocks/*.png` — for OG previews when shared

---

## Internal links

- `/developers`
- `/developers/docs`
- `/business/sdk-api`

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
