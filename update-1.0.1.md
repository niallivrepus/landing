# Update log — jokuh-landing 1.0.1

Traceable change log for landing deploys. Newest entries appended at top.

---

## 2026-08-28T11:52 (UTC-4) — Follow-up from spec review

**Commit:** this landing `main` push.
**Rationale:** Post-ship review: `/prompt` Playwright still expected `/#prompt`; identity close still said “Claim a handle”; old `/legal/*.html` URLs 404d before React could redirect.

### Modified files

| File | Nature | Reasoning |
|------|--------|-----------|
| `tests/product-scroll.spec.ts` | `/prompt` expects `/demo` | Matches `App.tsx` Navigate; `#prompt` no longer exists. |
| `IdentityBlock.tsx` | Copy + purpose comments | “Create an account…” instead of Claim jargon. |
| `server/static-middleware.ts` | HTML legal aliases; comments on SPA helpers | Old App Store legal URLs SPA-fallback to live pages. |

---

## 2026-08-28T11:48 (UTC-4) — SEO, crawl 404, production landing chunk

**Commit:** this landing `main` push (Railway `www` auto-deploy).
**Rationale:** After the conversion-path ship, crawlers still saw an empty `#root`, no share card, `/robots.txt` 404, and a production bundle named `bootstrap-dev`. Close those P1 items plus leftover homepage/product holes so www matches the spec except GoDaddy apex.

### Modified files

| File | Nature | Reasoning |
|------|--------|-----------|
| `index.html`, `landing-hero-copy.ts`, `site-directory.ts`, `useDocumentTitle.ts` | One sentence, title, OG/Twitter, JSON-LD, `#root` H1 | Crawlers and share cards use the same product line as the footer. |
| `public/og-default.png`, `public/og-default.svg`, `public/apple-touch-icon.png` | 1200×630 OG + 180 apple-touch | Stops 404 share image and iOS home-screen icon. |
| `public/robots.txt`, `public/sitemap.xml` | Allow `/` + public URLs including `/security` | Googlebot no longer 404s robots/sitemap. |
| `public/not-found.html`, `server/static-middleware.ts` | Dedicated 404 HTML; HEAD; HSTS/nosniff/Referrer/frame/CSP-RO | Unknown paths are crawl-honest; `/chatgpt/*` and unpublished stubs are not 200. |
| `src/bootstrap-dev.tsx` → `src/bootstrap-landing.tsx`, `src/main.tsx`, `README.md` | Landing entry rename | `pnpm build:landing` emits `bootstrap-landing-*.js`, not `-dev-`. |
| `src/pages/SecurityPage.tsx`, `App.tsx`, `rigid-sitemap.ts`, `ProductDemoSection.tsx` | `/security` explainer | Backs the E2EE homepage claim with a real page. |
| `LandingImmersiveShell.tsx`, `landing-home-suggestions.ts` | Hide library rail; drop Invest chip | Homepage first screen is product, not token. |
| `landing-mission-intro.ts`, `mission-intro-storage.ts` | Private-workspace splash; skip after first session | P2 splash length + return visits land on the hero. |
| `StoriesPage.tsx`, `SupportPage.tsx`, `FaqSection.tsx` | Honest stories intro; Bond/Cortex → passkeys/OO; 375 wrap | Wording polish and FAQ overflow. |
| `vite.config.ts`, `tests/*` | Preview uses static 404s; unpublished paths expect 404 | E2E matches Railway. |

### Deploy / ops follow-up

1. Push `main` — Railway `www` rebuilds. Confirm `curl -s https://www.jokuh.com/` contains the H1, `/robots.txt` and `/sitemap.xml` 200, `/zzz` 404 body, no `bootstrap-dev` in HTML, `/security` 200.
2. Apex `jokuh.com` is still GoDaddy parking (405). Forward `jokuh.com` → `https://www.jokuh.com` (301, no mask). Code cannot finish P0-1.

---

## 2026-08-27T21:20 (UTC-4) — First-visit conversion + production download/HTTPS

**Commit:** this landing `main` push (Railway `www` auto-deploy).
**Rationale:** A first-time visitor audit found a premium page that would not convert: dead hero chips, jargon CTA, white-on-white OO proof, icon rail over the footer, `/pricing` bouncing home, 200-on-unknown-paths, pre-checked marketing consent, and a Mac download that 404d or leaked to GitHub. Ship those product fixes and bake the notarized `.dmg` into the Railway image so `/downloads/Jokuh.dmg` is same-origin.

### Modified files

| File | Nature | Reasoning |
|------|--------|-----------|
| `src/lib/landing-demo-seed.ts`, `LandingImmersiveShell`, `LandingPromptBar`, `ProductDemoSection`, `landing-home-suggestions.ts` | Hero prompt + chips seed `#demo` | First clicks run the live OO proof instead of doing nothing. |
| `ClaimIdentityCta`, overlay, onboarding card, `download-intents.ts` | CTA copy **Get started** / Create your account | Signup is the primary action, not “Claim identity”. |
| `src/styles/landing-oo-speak.css` | Light-theme incoming bubble text `#111` | Privacy line “Only you and Sam…” is readable on smoke fill. |
| `ImmersiveAppChrome`, `InvestImmersiveShell`, `DownloadImmersiveShell` | Contained chrome; hide library rail on long pages | Icon rail no longer eats footer / five-ways tiles. |
| `PricingPage.tsx`, `pricing.ts`, `App.tsx`, `NotFoundPage.tsx` | Real `/pricing`; splat is 404 | Stops home bounce and 200-on-unknown-URL. |
| `server/static-middleware.ts`, `Dockerfile` | HTTP→HTTPS; SPA 404 status; bake/302 Mac dmg | Production download + crawler honesty + no GitHub href. |
| `ContactSalesPage`, `email-validation.ts`, `contact-sales-service.ts` | GDPR opt-in off; stronger email | Marketing consent is explicit; waitlist shares the same API. |
| `invest-overview.ts`, `landing-spine-capsules.ts`, `FaqSection`, `site-subdomains.ts` | Past-tense token window; hour order; FAQ wrap; `/support` | Stale/broken integrity items from the audit. |

### Deploy / ops follow-up

1. Push `main` — Railway project `live` service `www` clones and rebuilds.
2. GoDaddy: forward apex `jokuh.com` → **`https://www.jokuh.com`** (301, no mask). Apex A records today are GoDaddy parking and return 405.
3. Confirm Railway `LANDING_CANONICAL_HOST=www`.
4. Confirm `https://www.jokuh.com/downloads/Jokuh.dmg` is 200 (baked) or 302 (fallback).

---

## 2026-07-04T20:42 (UTC-4) — Canonical host + public avatar signing

**Commit:** see `git log` (this entry committed alongside the change).
**Rationale:** `www.jokuh.com` was stuck in a redirect loop (`ERR_TOO_MANY_REDIRECTS`) because
GoDaddy forwards apex → `www` while the Railway server unconditionally 308-redirected `www` → apex.
GoDaddy cannot host a root `CNAME`, so `www` must be servable as the canonical host. Separately,
public blurb author avatars rendered as initials because anon Storage signing 404s without a
service-role key on Railway.

### Modified files

| File | Nature | Reasoning |
|------|--------|-----------|
| `server/resolve-runtime-env.ts` | Added `canonicalHost` (from `LANDING_CANONICAL_HOST`, default `apex`) | Lets Railway serve `www` directly when GoDaddy forwards apex → `www`. |
| `server/static-middleware.ts` | Guard `www` → apex 308 behind `canonicalHost === "apex"` | Removes the redirect loop when `LANDING_CANONICAL_HOST=www`. |
| `server/railway.ts` | Pass `canonicalHost` into `createStaticMiddleware` | Wire runtime flag through to the static handler. |
| `.env.example` | Documented `LANDING_CANONICAL_HOST` + relaxed `SUPABASE_SERVICE_ROLE_KEY` note | Ops guidance for GoDaddy vs Cloudflare apex + edge-signed avatars. |
| `public-storage-sign-service.ts` | `signedIdentityPhotoUrl` falls back to `public-identity-avatar` edge redirect | Avatars work without a service-role key on Railway. |
| `public-blurbs-feed-service.ts` | Consume `identity_photo_path` from `get_public_blurb_share`; skip N+1 peeks; honor `ok` flag | Fewer round-trips; correct anon peek handling. |
| `public-blurbs-feed-shared.ts` | Doc comment for `avatarUrl` source | Reflect edge-redirect signing path. |
| `src/components/landing/LandingHomeSuggestionPills.tsx` | Scroll-aware edge mask fades | Suggestion strip no longer clips abruptly at the sides. |
| `src/styles/landing-home-prompt.css` | Split strip into wrapper + `__scroller`; mask styles | Support the fade without breaking horizontal scroll. |

### Related backend (jokuh-live repo)

- New edge function `backend/supabase/functions/public-identity-avatar/index.ts` (deployed) —
  anon-callable 302 redirect to a signed `identity-photos` URL.
- Migration `20260704140000_get_public_blurb_share_author_photo.sql` (applied) — adds
  `identity_photo_path` / `identity_photo_masked` to the `get_public_blurb_share` RPC.

### Deploy / ops follow-up

1. Railway service `www`: set `LANDING_CANONICAL_HOST=www`.
2. GoDaddy: forward `jokuh.com` → `https://www.jokuh.com` (301, forward-only) after this deploys.
3. Optional: `SUPABASE_SERVICE_ROLE_KEY` on Railway for direct signing + blurb media thumbnails.

---

## 2026-07-04T22:24 (UTC-4) — Mac direct download on /download

**Release:** [landing macos-1.0.0](https://github.com/niallivrepus/landing/releases/tag/macos-1.0.0) — `Jokuh.dmg` (Developer ID signed, 112MB).

**jokuh-live:** `scripts/release-macos-direct.sh`, `jokuh-macos` Xcode scheme, `docs/macos-direct-distribution.md`.

**Landing:** `/download` → **Download for Mac** → GitHub release asset URL (public repo).

**Notarization:** Pending `xcrun notarytool store-credentials "Jokuh-Notary"` — signed build ships; Gatekeeper may prompt until notarized.

---

## 2026-07-24T17:20 (UTC-4) — Homepage proof funnel + mission intro + Bubbles/demo rebuild

**Commit:** see `git log` (this entry committed alongside the change).
**Rationale:** Restructure the homepage so one claim ("your private machine, not another chat") is
proven in visible beats and hands off to Claim identity, per the landing proof plan
(`.cursor/plans/landing_proof_message_0c27f153.plan.md`). Funnel: Hero (Claim primary) → product
strip → "See it work" proof stage → IdentityBlock → thin investors strip. Also ships the mission
scramble intro (plays every homepage visit; `?intro=0` skips), the rebuilt Bubbles beat, and the
OO power-demo chat with Reply + Artifact + Claim-bridge pattern.

### Modified files

| File | Nature | Reasoning |
|------|--------|-----------|
| `src/pages/Home.tsx` | Reordered sections; dropped `LandingBubblesSection` + `LandingEditorialSection` from critical path | One conversion path: proof → claim; editorial/investors demoted. |
| `src/components/landing/LandingImmersiveShell.tsx` | Claim-primary CTAs (Download as quiet text link); prompt scrolls to `#demo`; mission intro wiring; removed hero slogan | Hero converts to Claim; demo path stays on `/`. |
| `src/data/landing-hero-copy.ts` | Removed slogan + short-lived proof line | Headline stands alone per design direction. |
| `src/components/landing/MissionIntroOverlay.tsx` (new) | Full-viewport scramble intro with OO avatar beat | Brand moment before the hero typewriter; plays every visit. |
| `src/hooks/useScrambleReveal.ts`, `src/data/landing-mission-intro.ts`, `src/lib/mission-intro-storage.ts`, `src/styles/landing-mission-intro.css` (new) | Intro engine, copy, force/skip helpers, styles | Support files for the mission intro. |
| `src/components/landing/ProductDemoSection.tsx` | Rebuilt as proof stage: real Texts inbox, OO power chips, artifact cards, Claim bridge; soft-stop after 2 powers | Demo is an on-ramp to Claim, not a chat toy. |
| `src/data/landing-demo-powers.ts` (new) | Five powers (memory/privacy/spine/calendar/bubble) with prompt, reply, artifact, bridge label | Single source for the Reply + Artifact + Bridge pattern. |
| `src/data/messages-oo-demo-chat.ts` | Replies keyed to powers; `MESSAGES_OO_INTERCEPT_AFTER = 2` | Canned proof exchanges; claim becomes next step. |
| `src/hooks/useClaimIdentityFlow.ts`, `src/context/ClaimIdentityFlowContext.tsx` | Added `power` context to open/close cycle | Proof power travels from demo chip → overlay → app URL. |
| `src/lib/claim-identity-handoff.ts` | Added `power` handoff query param | App can continue the demo beat post-claim. |
| `src/components/landing/ClaimIdentityLandingOverlay.tsx`, `ClaimIdentityOnboardingCard.tsx` (new card) | Overlay accepts `power`; card subtitle mirrors bridge copy | Belief continuity into the handle step. |
| `src/components/landing/IdentityBlock.tsx` | Added supporting line ("keep memory, privacy, and Bubbles") | Claim close repeats the proof language. |
| `src/components/landing/InvestorBranchSection.tsx` | Slimmed to a thin strip | Off the conversion path. |
| `src/components/landing/ProductShowcaseSection.tsx` | Header action → `#demo` ("See it work") | Keeps visitors on the funnel instead of `/calls`. |
| `src/data/rigid-sitemap.ts` | `Invest` surfaced in footer | Investor path reachable without a homepage section. |
| `src/components/landing/LandingBubblesSection.tsx` (new) | Bubbles beat with flat circular stack marks (fixes glass-filter line artifacts) | Kept as reusable section; currently off Home. |
| `src/components/landing/OoSpeakBubble.tsx`, `src/hooks/useOoSpeak.ts`, `src/styles/landing-oo-speak.css` (new) | OO speak bubble used across demo surfaces | Shared agent-voice UI. |
| `src/components/landing/MessagesHighlightVisual.tsx`, `MessagesImmersiveShell.tsx`, `messages-demo-inbox.ts` | Inbox/threads powering the proof stage | Real Texts UI instead of illustrative mock. |
| Misc (`MegaFooter`, profile/product shells, styles, `SiteThemeToggle`, onboarding assets) | Prior-session polish carried in this deploy | Bundled UI refinements from the same work stream. |
