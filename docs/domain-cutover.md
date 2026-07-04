# Domain cutover: `jokuh.com` → Railway

Production target for the marketing site is **Railway service `www`** in project **`live`**, repo **`niallivrepus/landing`**. The signed-in app stays on **Railway service `live`** at **`app.jokuh.com`**.

See also: [`railway-deployment.md`](railway-deployment.md), [`../services/www/README.md`](../../jokuh-live/services/www/README.md) (monorepo mirror).

---

## Architecture (what moves vs stays)

| Host | Railway service | Repo | Notes |
|------|-----------------|------|-------|
| **`jokuh.com`**, **`www.jokuh.com`** | **`www`** | `niallivrepus/landing` | Marketing landing + `/api/*` |
| **`app.jokuh.com`** | **`live`** | `niallivrepus/jokuh-live` (`frontend/`) | **Do not change DNS** |
| **`spine.jokuh.com`** | **`gadgets`** | `jokuh-live` | Gadgets gateway — **unchanged** |
| **`help.jokuh.com`**, **`status.jokuh.com`**, **`developers.jokuh.com`** | External / other hosts | — | Linked from landing via `VITE_ORIGIN_*`; **do not repoint** unless intentionally migrating those surfaces |

Canonical marketing origin is **apex** (`https://jokuh.com`). The Node server issues **308** `www` → apex (`server/static-middleware.ts`).

---

## Phase 0 — Pre-cutover (Railway)

1. **Connect source** — Railway project **`live`**, service **`www`**:
   - **Settings → Source:** GitHub **`niallivrepus/landing`**, branch **`main`**, Root Directory **`.`**
   - Builder reads [`railway.toml`](../railway.toml) → [`Dockerfile`](../Dockerfile) → [`server/railway.ts`](../server/railway.ts)

2. **Deploy green** — Wait for **SUCCESS** (~8–12 min first build). Confirm the default `*.up.railway.app` URL serves the homepage.

3. **Set variables** on service **`www`** before go-live (see [`railway-deployment.md`](railway-deployment.md)):

   | Variable | Required? | Purpose |
   |----------|-----------|---------|
   | `SUPABASE_SERVICE_ROLE_KEY` | **Yes** (blurbs/profile) | Signed avatars, media, `search_accounts` RPC |
   | `VITE_SUPABASE_URL` | Build | Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Build | Public RPCs |
   | `VITE_ORIGIN_APP` | Build | App handoff target (`https://app.jokuh.com`) |
   | `VITE_COOKIE_DOMAIN` | Build | Cookie consent (`.jokuh.com`) |
   | `VITE_ORIGIN_HELP`, `VITE_ORIGIN_STATUS` | Build | Footer/help links |
   | `GROQ_API_KEY`, `RESEND_API_KEY`, … | Optional | Site search, contact sales, etc. |

   **Do not** set `PORT` — Railway injects it.

4. **Add custom domains** — **Settings → Networking → Custom domain:**
   - Add **`jokuh.com`**
   - Add **`www.jokuh.com`**

   Railway shows **two records per hostname** (both required):
   - **Routing:** `CNAME` → `xxxxxxxx.up.railway.app` (value is service-specific — copy from dashboard)
   - **Verification:** `TXT` at `_railway-verify` (and `_railway-verify.www` for www)

   > **No static project ID in repo** — the CNAME target is per-service; always copy from the Railway UI for service **`www`**.

---

## Phase 1 — Lower TTL (24–48 h before cutover)

At your DNS provider, lower TTL on existing **`jokuh.com`** / **`www`** records to **300 s** (5 min) so rollback propagates quickly.

---

## Phase 2 — DNS records

Registrar is **not documented in-repo** (may be Cloudflare, Route 53, Namecheap, etc.). Use the **exact** CNAME + TXT values Railway shows for service **`www`**.

### Apex `jokuh.com`

Railway does **not** publish static A records. Use a provider that supports one of:

| Provider pattern | Record type | Name | Target |
|------------------|-------------|------|--------|
| **Cloudflare** | CNAME (flattened) | `@` | `xxxxxxxx.up.railway.app` |
| **DNSimple** | ALIAS | `@` | same |
| **Namecheap** | CNAME (root) | `@` | same |
| **Route 53** | ALIAS to another record | `@` | same CNAME target |
| **bunny.net** | ANAME | `@` | same |

Also add the **TXT** verification record Railway provides (`_railway-verify`).

**Cloudflare tips:**
- Proxy (orange cloud): OK for normal hostnames; SSL mode **Full** (not Full Strict during issuance).
- If cert stays on “Validating,” temporarily set proxy **DNS only** (grey), wait for Railway green checkmark, then re-enable proxy.

### `www.jokuh.com`

| Type | Name | Target |
|------|------|--------|
| **CNAME** | `www` | `xxxxxxxx.up.railway.app` (same as apex) |
| **TXT** | `_railway-verify.www` | value from Railway |

### Remove / replace legacy records

- Delete old **A/CNAME** records pointing **`jokuh.com`** / **`www`** at **Vercel** (or any prior host).
- Avoid **duplicate** A + CNAME on the same name.

### Do **not** change

| Host | Keep pointing at |
|------|------------------|
| **`app.jokuh.com`** | Railway **`live`** |
| **`spine.jokuh.com`** | Railway **`gadgets`** |
| **`help`**, **`status`**, **`developers`**, MX, etc. | Current targets |

---

## Phase 3 — SSL/TLS

Railway provisions and renews Let’s Encrypt certs automatically after:

1. Both **CNAME** and **TXT** show **VALID** in Railway
2. DNS has propagated (often 5–30 min; up to ~1 h)

Dashboard should show **Issued** for each custom domain.

---

## Phase 4 — Server-side redirects (already in image)

No extra DNS work — handled by [`server/static-middleware.ts`](../server/static-middleware.ts):

| Request | Response |
|---------|----------|
| `www.jokuh.com/*` | **308** → `https://jokuh.com{path}` |
| `/dataroom`, `/pitchdeck`, `/pitch-deck`, `/xx/investpipeline`, `/sandbox`, `/oo`, `/dd` | **302** → `https://app.jokuh.com{path}` |
| `/.well-known/apple-app-site-association` | **200** JSON (no redirect — required for Apple) |

---

## Phase 5 — Verification checklist

Run after DNS + Railway show verified/issued:

```bash
# Homepage
curl -sI https://jokuh.com/ | head -5

# www → apex (expect 308, Location: https://jokuh.com/...)
curl -sI https://www.jokuh.com/ | grep -iE '^(HTTP|location)'

# App handoff
curl -sI https://jokuh.com/dataroom | grep -iE '^(HTTP|location)'

# Public API (blurbs feed)
curl -sS 'https://jokuh.com/api/public-blurbs-feed' | head -c 200

# Apple AASA (must be 200, application/json — not HTML, not redirect)
curl -sI https://jokuh.com/.well-known/apple-app-site-association | head -5

# SPA route
curl -sI https://jokuh.com/blurbs | head -3
```

Browser checks: homepage, `/blurbs` feed cards (avatars if `SUPABASE_SERVICE_ROLE_KEY` set), `/profile` people search, cookie banner on apex + sibling links.

Confirm **`app.jokuh.com`** still loads the product app (unchanged).

---

## Phase 6 — Retire legacy Vercel apex

After Railway is live and verified:

1. Vercel project **`landing`** (`prj_pp21kXXkHLhQOX41760M22uLot7f`) — **remove** custom domains **`jokuh.com`** and **`www.jokuh.com`**
2. Do **not** delete the Vercel project until you are sure nothing else depends on it

---

## Rollback

1. Restore previous DNS (A/CNAME) to Vercel or last-known-good targets
2. Wait for TTL (why Phase 1 matters)
3. Re-add domains on Vercel if removed

Railway custom domains can stay attached; they simply stop receiving traffic when DNS points elsewhere.

---

## Cutover risks

| Risk | Mitigation |
|------|------------|
| Missing **TXT** record | Domain stays pending / 404 on Railway |
| Apex on provider without CNAME flattening | Move DNS to Cloudflare (or ALIAS-capable provider) |
| Stale Vercel DNS | Remove old records; use `dig jokuh.com` / dnschecker.org |
| Long TTL | Lower before cutover |
| AASA redirect | Landing server serves AASA without redirect; do not put apex behind a redirect-only CDN rule |
| `SUPABASE_SERVICE_ROLE_KEY` unset | Site works; blurbs/profile show placeholders only |
| Parallel run | Optional: test via Railway `*.up.railway.app` URL before flipping DNS |

---

## Quick reference

- **Railway:** project **`live`**, service **`www`**
- **GitHub:** `niallivrepus/landing` (push to deploy — no `railway up` from laptop)
- **Canonical origin:** `https://jokuh.com`
- **App handoff:** `https://app.jokuh.com`
- **Deploy docs:** [`railway-deployment.md`](railway-deployment.md)
