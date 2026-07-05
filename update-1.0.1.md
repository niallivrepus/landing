# Update log — jokuh-landing 1.0.1

Traceable change log for landing deploys. Newest entries appended at top.

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
