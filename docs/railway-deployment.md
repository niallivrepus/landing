# Railway deployment (`jokuh.com`)

Production target for this repo is **Railway + Supabase**, not Vercel.

| Host | Railway service | Repo | Runtime |
|------|-----------------|------|---------|
| `jokuh.com`, `www.jokuh.com` | **`www`** | `niallivrepus/landing` | `Dockerfile` → `server/railway.ts` |
| `app.jokuh.com` | **`live`** | `niallivrepus/jokuh-live` | jokuh-live frontend |

## How it works

1. **Build** — `pnpm build:landing` emits static assets to `dist/`.
2. **Bundle** — `pnpm build:server` bundles `server/railway.ts` to `server-dist/railway.mjs` (esbuild).
3. **Run** — Node serves:
   - `GET/POST /api/*` via the same middleware as Vite dev/preview
   - Static files from `STATIC_ROOT` (default `/srv/static` in Docker)
   - SPA fallback to `index.html`
   - App handoff redirects (`/dataroom`, `/xx/investpipeline`, `/sandbox`, `/oo`, `/dd`) → `https://app.jokuh.com`
   - `/pitchdeck` (and `/pitch-deck`) stay on this site as the investor theatre
   - `www` → apex redirect (308)

Deprecated paths:

- `vercel.json` — kept for reference only (`_deprecated` field)
- `api/*.ts` — Vercel serverless adapters; Railway uses root `*-middleware.ts` instead
- `Caddyfile` — optional local dev mirror; production uses Node

## Deploy

Connect this GitHub repo to Railway project **`live`**, service **`www`**. Railway reads `railway.toml` and builds `Dockerfile`.

**Do not** use `railway up` from a laptop — `public/` is too large for CLI uploads. Push to GitHub and let Railway clone.

### DNS / HTTPS (GoDaddy)

`www.jokuh.com` is a CNAME to Railway and must stay that way.

`jokuh.com` (apex) currently sits on GoDaddy forwarding IPs (`3.33.251.168`, `15.197.225.128`). That forwarding must send visitors to **`https://www.jokuh.com`** (301, forward-only, not mask). HTTP→HTTP is a conversion leak; a 405 means forwarding is broken.

In GoDaddy → Domain → DNS / Forwarding:

1. Turn **off** masking.
2. Forward `jokuh.com` → `https://www.jokuh.com` with **301** and HTTPS.
3. Keep `www` CNAME on `koes01k3.up.railway.app` (or the current Railway service domain).
4. Railway service `www` must have `LANDING_CANONICAL_HOST=www` so the app does not 308 `www` back to apex.

Optional later: add `jokuh.com` as a Railway custom domain and replace the forwarding A records with Railway’s apex A records. Until that cutover, GoDaddy must forward over HTTPS.

`help.jokuh.com` is not live — the site links `/support` until a knowledge-base origin exists.

After DNS cutover, remove apex domains from any legacy Vercel project.

## Railway dashboard — variables

Set on service **`www`** (runtime unless noted as build):

### Required for profile / blurbs features

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Signed avatars + blurbs media; `search_accounts` RPC for people search |
| `VITE_SUPABASE_URL` | Supabase project URL (build + runtime; defaults baked in if unset) |
| `VITE_SUPABASE_ANON_KEY` | Publishable anon key for public RPCs (build + runtime) |

### Recommended

| Variable | Purpose |
|----------|---------|
| `VITE_ORIGIN_APP` | App handoff target (build arg, default `https://app.jokuh.com`) |
| `VITE_COOKIE_DOMAIN` | Cookie consent across subdomains (build arg, e.g. `.jokuh.com`) |
| `VITE_ORIGIN_HELP` | Unused until a live help host exists (site uses `/support`) |
| `VITE_ORIGIN_STATUS` | Status portal origin (build) |

### Optional feature APIs

| Variable | Route |
|----------|-------|
| `GROQ_API_KEY` | `POST /api/site-search` |
| `RESEND_API_KEY`, `CONTACT_SALES_*` | `POST /api/contact-sales` |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | `POST /api/story-submissions` |
| `ELEVENLABS_API_KEY`, `VITE_ELEVENLABS_*` | `POST /api/article-audio` |

Railway injects `PORT` automatically — do not hardcode.

## Local verification

```bash
pnpm install
pnpm typecheck
pnpm build:landing
pnpm build:server

# Load .env, then run production server against dist/
export STATIC_ROOT=dist
pnpm start:railway
```

Dev workflow unchanged:

```bash
pnpm dev
```

Vite middleware handles `/api/*` during `pnpm dev` and `pnpm preview`.

## API routes on Railway

| Route | Handler |
|-------|---------|
| `GET /api/public-blurbs-feed` | `public-blurbs-feed-middleware.ts` |
| `GET /api/public-people-search` | `public-people-search-middleware.ts` |
| `GET /api/public-profile-demo` | `public-profile-demo-middleware.ts` |
| `POST /api/contact-sales` | `contact-sales-middleware.ts` |
| `POST /api/story-submissions` | `story-submissions-middleware.ts` |
| `POST /api/site-search` | `site-search-middleware.ts` |
| `POST /api/article-audio` | `article-audio-middleware.ts` |
