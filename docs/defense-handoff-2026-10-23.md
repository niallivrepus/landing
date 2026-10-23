# /defense — handoff for the local Gooey session (2026-10-23)

Paste-ready prompt for the local session is at the bottom. Everything below is what the cloud session learned and decided.

## 1. State of the work

| Where | What | Status |
|---|---|---|
| `niallivrepus/landing` `main` | v1 redesign of `/defense` (goo hero, Missions, System map, Day in the life, trust, status) + capability statement PDF + share images + loops | **Live** (Railway builds from `main`; deploy not confirmed from the cloud) |
| `landing` `main` | Fix: Texts + sign-in recordings played squeezed (non-square pixels); re-recorded light sign-in + Bubbles | **Live** (083674f) |
| `landing` `claude/defense-goo-v2` | v2: GPU Splex goo engine, library energy tokens, phone layouts, drag test, **page inside the Gooey home shell** (corner frame + Nexus, `.gh` slabs, scroll-merge drops, Gooey footer) | **Pushed, not on main.** Needs "ship it" |
| `jokuh-live` `claude/charming-edison-4c7npq` | `/demo?surface=signin` now mounts the real Welcome card ("Ready to build your universe?", Sign Up / Sign In); Bubbles demo drawer shows the real goo pond | Pushed |

Run v2 locally: `cd ~/Desktop/landing && git fetch && git checkout claude/defense-goo-v2 && ln -sfn "$PWD/vendor/gooey" ../gooey && pnpm install && npx vite --port 4174` → `/defense`.
Tests: `npx playwright test tests/defense.spec.ts --workers=1` (run serially; parallel workers fight over software WebGL). Re-render assets: `npm run render:defense-assets`. Re-record app screens: `scripts/capture-app-demo.mjs` against a local `jokuh-live/frontend` dev server (`pnpm dev`, `/demo?scenario=team`).

## 2. What v2 is (files)

- `src/components/defense/goo/` — `goo-material.ts` (Splex numbers ported verbatim from jokuh-live `goo-kit.ts`), `goo-gl.ts` (one WebGL2 SDF pass: beads, necks, glow, trust membranes; SVG-filter fallback), `GooStage.tsx` (springs, reach, drag, snap, converge, zones), `DefenseHero/Explorer/Day/Trust/Status.tsx`, `GooTabs`, `GooCapture` (splat transition), `defense-energy.ts` (library tokens).
- `src/pages/DefensePage.tsx` — wraps everything in the homepage's `.gh` root; reuses `GooCornerFrame`, `GooNexus`, `HeroBackgroundText` (exported from `GooHero`), `GooScrollMerge`, `GooFooter` (exported from `GooeyHome`).
- `src/styles/defense-goo.css` — house-skin block at the end maps onto `--gh-*` tokens.
- `src/data/defense.ts` — all copy + the accuracy rules (top-of-file comment). `DEFENSE_MAP`, `DEFENSE_SCENARIOS`, `DEFENSE_DAY`, `DEFENSE_HERO_*`.
- Known: software WebGL in the cloud sandbox is slow (~133 ms/frame while dragging); never seen on a real GPU. Check on a Mac + phone.

## 3. Hard rules (public claim surface for government buyers)

No contracts, awards, registrations, certifications, agency names, customers or endorsements — none exist. Only messages (direct + group) are end-to-end encrypted; Spine/Docs/Mail are private to the account but not E2EE; calls go through a real-time media provider (no E2EE claim). **OO runs on third-party cloud models today**: never claim on-device, air-gapped, self-hosted, on-prem, sovereign-AI or US-only processing as available (both are roadmap, phrased as intent). Not approved for classified/CUI. Every app screen is a recording of the real app on demo data, labelled illustrative. `tests/defense.spec.ts` pins the load-bearing sentences and bans FedRAMP/FISMA/air-gapped/sovereign/"trusted by" etc. in the page text — **if the stamp uses "sovereign", scope it carefully and update that test deliberately.**

## 4. Design direction from the user

- It must look like **us**: inside the app shell (corner action buttons, Nexus, squircle, goo slabs), like jokuh.com — not a separate website. Done in v2; user hasn't reviewed it live yet.
- Wants it "mind-blowing and interactive": poke/drag goo, trust membranes, merge, closing bead — done in v2.
- Colours must come from the Gooey library tokens (`--color-<energy>-<n>`), material = Splex (dark) / designed Gooey Light. Done.
- Recordings must show the **current** app (Goo Lab is the source of truth; old Bond card + old drawer rows are wrong). Done for signin + drawer.

## 5. Positioning research (this is the new context to build with)

Reference sites (user pasted their text; the cloud sandbox can't fetch external sites):
- **FetLife**: names category + audience in one line, so newcomers know in 2 s.
- **Praxis**: coins a category in three words ("The superintelligence state"), explains it with a lineage ("Bitcoin gave our generation its own currency. We are using superintelligence to create our own society."), sections are nouns you can picture (City, Residences, Membership, Governments), proof fast (press, live count), sells belonging ("Join Praxis"), speaks to each audience (members / investors / governments). Manifesto arc: shift → mechanism ($50T wages → AI owners) → three channels → slogan ("Not our weights, not our nation") → villain → historical frame → urgency → new category ("Digital Nation") → one act. **Do not adopt the tribal/political content** (exclusionary; Jokuh's line is "Joining Our Knowledge, Unifying Humanity"; procurement runs from culture-war language).
- **Palantir**: category stamp on every surface ("Sovereign AI Systems for Every Decision"; "The Operating System for ___"), named product architecture (Gotham/Foundry/AIP/Ontology/Apollo), range phrases ("from space to mud", "from the factory floor to the front lines"), numeric proof + named customers, trust as infrastructure (Privacy & Civil Liberties, Trust Center, Human Rights Policy), immersive entrance ("You are now entering Gotham"). **Do not borrow** "weapons system"/"kill chain" language — Jokuh is communications + identity.
- Praxis app also lists "End-to-end encrypted messaging between members" — adjacent territory (partner or proof the positioning sells).

### Homepage/defense stamp options discussed (user liked the Bitcoin lineage; wants "more than talk — to exist / sovereign identity"; floated "The private OS")

Bitcoin lineage lines, by how true they are today:
1. "Bitcoin gave our generation its own money. Jokuh gives it its own identity." — fully true (passkeys + device keys)
2. "Bitcoin gave us money no bank controls. Jokuh gives you an identity no one can phish."
3. **"Not your keys, not your coins. Not your keys, not your self."** — my favourite; true (keys on device)
4. "Bitcoin made money sovereign. Jokuh makes you sovereign." — strongest, abstract; needs the proof line right after
5. "Bitcoin let money exist without a bank. Jokuh lets you exist without being owned." — fits "to exist"
6. "…a life online nobody else can read" — **not true yet** (only messages are E2EE); wait for roadmap.

Category stamps: **The private OS** (clear, ownable; "OS" is metaphor) · The sovereign OS (strongest; hold until self-hosted/US-only ships) · Sovereign identity (careful: "SSI/DIDs" is a specific standard Jokuh doesn't implement) · Build your universe (already in the app's onboarding — warm, less power) · The OS for your people.

Recommended combo: Homepage **"The private OS."** + the "Not your keys, not your self" line + sub "Your identity, messages, memories, money and your own AI, in one app. Your keys stay on your device." Defense: **"Sovereign communications."** / headline **"The group chat nobody else can read."**; use "Defense technology for free people" as the signature, not the headline ("defense technology" reads as weapons). Upgrade to "The sovereign OS" when self-hosted/US-only processing ships.

Structure to steal: Palantir-style named product list with one true line each — Bond (identity, keys on device), Text/Call (voice, messages sealed E2E), Spine (memory), OO (intelligence, only what you share), Bubbles (communities), Wallet (value). Range phrase: "From the family chat to the field team." Honest proof instead of fake proof: public weekly build log (the Nexus already reads `/shipped-feed.json`), platforms list, "sealed end to end since the first message". Add a `/trust` page (what's sealed / not / where data goes / roadmap / no certifications claimed). One definition sentence everywhere (title, meta, share image, footer). Nexus on `/defense` could say "Jokuh for Defense · Messages sealed end to end". "Get Jokuh" → "Join Jokuh" (belonging).

A Jokuh manifesto (inclusive, true) on the Praxis arc: shift (AI will know each of us better than anyone) → mechanism (platforms read and rent your context) → villain (surveillance as the price of connection — a business model, not a group) → slogan → answer (what's true today) → honest frontier (infrastructure you control, on the roadmap) → belonging. The site already has a `/manifesto` route.

## 6. Open items

1. Decide stamp + line, then build behind `?stamp=v2` (hero, product-architecture strip, `/defense` "entrance", first `/trust`), update `data/defense.ts` + the claims test, regenerate OG/PDF assets with the new line.
2. **Ship v2** to `main` when approved (merge `claude/defense-goo-v2`; Railway deploys `main`).
3. Review v2 on a real GPU + phone; the cloud only saw software WebGL.
4. Optional: delete the v1 "OO chat feed (rollback)" flow from the Onboarding Lab (cloud offered; not done). `SymbioticBondAuth` is still used by the real app — don't delete.
5. Capability statement PDF has no UEI/CAGE/legal-entity/email (unknown) — add once they exist. Lists NAICS 513210/541511/541512 from `docs/govcon-readiness-plan.md` — confirm.
6. Unrelated, still local-only: the OO check-in backend (`46e7dfd3`, `oo-checkin` edge function, migration not applied) lives on the user's Mac and was never pushed; "Gooey Tabs" work was not found in any session. Push from the Mac to continue it.
7. `tests/home.spec.ts` has 3 failing cases (chat error, download, footer→shipped) — likely pre-existing on `main`, not confirmed.

## 7. Prompt for the local session

> Read `docs/defense-handoff-2026-10-23.md` in the landing repo (branch `claude/defense-goo-v2`). Using the positioning research in §5 and the claims rules in §3, build the next version of `/defense` inside the Gooey home shell: pick the stamp + Bitcoin-lineage line with me (options in §5), add the Palantir-style product-architecture strip with only-true lines, an honest-proof strip fed by the public build log, the "entering the room" entrance, and a first `/trust` page. Check it against the Goo Lab's current components, keep every colour a Gooey token, update `tests/defense.spec.ts`, and show me screenshots before anything goes to `main`.
