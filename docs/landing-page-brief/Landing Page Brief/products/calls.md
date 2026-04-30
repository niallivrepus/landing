# Calls — `/products/calls`

**Purpose:** Position Calls as encrypted voice that earns its keep — every call you take strengthens your Knowledge Pool. The page must thread between "secure call app" (a crowded category) and "everything you say compounds your intelligence" (the Jokuh angle).

**Audience:** Founders, advisors, lawyers, doctors, anyone who already pays for privacy on their voice.

---

## SEO meta

- **Title:** Calls — Encrypted voice that remembers for you | Jokuh
- **Description:** End-to-end encrypted voice calls inside Jokuh. Every call deepens your Knowledge Pool. Nobody else can listen.
- **OG image:** `/og/calls.png`

---

## Hero

**Eyebrow:** PRODUCT — CALLS

**Headline (H1):**
Talk in private. Remember in full.

**Subhead:**
Encrypted, peer-to-peer voice calls that flow directly into your Spine. Your agents listen with you. No one else can.

**Primary CTA:** Get Jokuh →
**Secondary CTA:** How it works → `#how`

**Visual slot:** `/_assets/products/calls/hero.mp4` — two pulses, one each side of the screen, joining and pulsing in lockstep.

---

## Section 2 — The trade most apps make

**Headline:**
You should not have to choose between privacy and memory.

**Body (90 words):**
Most secure call apps make a deal with you: we keep the call encrypted, but we keep nothing else. You leave with no transcript, no summary, no searchable record. So you start writing notes during calls, missing what is being said. Your other apps offer memory, but at the cost of routing the audio through their cloud.

Jokuh refuses the trade. Calls are end-to-end encrypted on the wire, processed in a Trusted Execution Environment, and the resulting transcript belongs to you alone.

---

## Section 3 — What it does

**Headline:** A call that knows you afterwards.

**Three feature cards:**

1. **End-to-end encrypted by default**
   Voice frames are encrypted on your device and decrypted only on the device of the people you called. The Jokuh server forwards but cannot listen.

2. **Native transcription, native crystallization**
   The call is transcribed inside the TEE on your own device. The result is written to your Spine with full speaker attribution.

3. **Sidekick joins quietly**
   Your AI agent can listen alongside you, draft follow-ups, surface decisions, and remind you of past commitments without ever leaving your encrypted memory.

---

## Section 4 — How it works (anchor: `#how`)

**Body (110 words):**
Calls run over an end-to-end encrypted transport. The audio stream never decrypts on a Jokuh server, on a relay, on a cloud GPU, or on any third party.

When you opt in to transcription, the local device passes encrypted audio frames into a Trusted Execution Environment running on your machine or a hardware-attested cloud enclave. The transcription model runs in that enclave. The plaintext transcript exists only inside the enclave for the duration of the run, then is encrypted again into your Spine before exit.

You can verify these properties through attestation. Verify ↔ Trust.

**Inline link:** See the architecture → `/products/spine#architecture`

---

## Section 5 — Who is on the call?

**Body (60 words):**
Speaker attribution is real. Each participant's audio is identified to them by their Sigil. When a call ends, your Knowledge Pool knows who said what, when, and to whom. *Indulged* audio (information you absorbed but didn't speak) is stored in a separate partition with different weight in your Sigil's signal.

---

## Section 6 — What you can do with the result

- Search every call you have ever taken, by topic, person, or moment.
- Generate Blurbs from a call's high-signal moments.
- Hand a call's full transcript to your Sidekick to follow up.
- Scope a transcript privately, share it with the participants only, or publish a redacted summary.
- Forget a call. Real forgetting — keys destroyed, entry unrecoverable.

---

## Section 7 — Compatibility

- Native Jokuh ↔ Jokuh calls (full feature set).
- Inbound calls from non-Jokuh users — voice only, no metadata sharing.
- Capture from external meeting tools (Zoom, Google Meet, Slack, Discord) is handled by the Jokuh Chrome plugin and lands in Spine the same way native calls do.

---

## Section 8 — What Calls is not

- Not a video conferencing platform.
- Not a Zoom replacement.
- Not a marketing transcription tool.
- Not a CRM.

Calls is the voice surface of an operating system that respects your speech.

---

## Final CTA strip

**Headline:** Speak freely.
**Body:** End-to-end encrypted. Locally remembered. Yours.
**Primary CTA:** Get Jokuh →

---

## Asset list

- `/_assets/products/calls/hero.mp4`
- `/_assets/products/calls/e2e-flow.svg`
- `/_assets/products/calls/tee-transcription.svg`
- `/_assets/products/calls/sigil-attribution.png`

---

## Internal links

- `/products/spine`
- `/products/blurbs`
- `/products/messages`
- `/products/profile`
- `/business/jokuh-enterprise` — for org-grade voice

---

## Footer signature

> Jokuh — The Sovereign Agentic Operating System. Verify ↔ Trust.
