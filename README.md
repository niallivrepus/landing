# Jokuh · Landing

Marketing and product surface for **[Jokuh](https://github.com/niallivrepus)** — a humane layer for communities, identity, and expression. This repo is the public-facing **Vite + React** site: home, product pages, news (Medium), downloads, and legal hubs.

---

## Highlights

- **Design system** — Built on [`@jokuh/gooey`](https://github.com/niallivrepus) (Radix-style primitives, Tailwind v4, dark-first theming).
- **Production build** — `pnpm build` keeps the current default production entry, which is selected in `src/main.tsx`. Use `pnpm build:landing` to force the full landing site build, or `pnpm build:mask` to make the current mask-target explicit.
- **News** — Medium posts are baked from RSS into `src/data/medium-feed.json` via a small Node script; GitHub Actions can refresh that file on a schedule.
- **Fast iteration** — TypeScript, React 19, React Router 7, Motion, Lottie where it matters.

---

## Tech stack

| Area        | Choice                                      |
| ----------- | ------------------------------------------- |
| Build       | [Vite](https://vitejs.dev/) 6               |
| UI          | React 19, Tailwind CSS 4 (`@tailwindcss/vite`) |
| Routing     | React Router 7                              |
| Components  | `@jokuh/gooey` (local package; see below)   |
| Tooling     | TypeScript 5, pnpm                          |

---

## Requirements

- **Node.js** 20+ (22+ matches CI)
- **pnpm** (recommended; npm/yarn work if you adjust commands)

### `@jokuh/gooey` dependency

`package.json` references the design system as a **local path**:

```json
"@jokuh/gooey": "file:../gooey/packages/gooey"
```

Clone this repo **next to** the `gooey` monorepo so that path resolves, **or** change the dependency to a published tarball/Git tag once `gooey` is published.

For local development, `landing` resolves Gooey directly from the sibling source tree instead of treating the copied `node_modules/@jokuh/gooey` folder as the effective source of truth. The package dependency remains in place for dependency installation, but the runtime/editor boundary points at `../gooey/packages/gooey/src`.

See [docs/gooey-ingestion.md](/Users/sonadin/Documents/code/jokuh/landing/docs/gooey-ingestion.md) for the repo contract.

Suggested layout:

```text
code/
├── gooey/
│   └── packages/gooey/
└── landing/          ← this repo
```

---

## Getting started

```bash
pnpm install
pnpm dev
```

Dev server defaults to **port `5174`** with `host: true` (LAN-friendly). Open the URL Vite prints in the terminal.

To verify a production bundle locally:

```bash
pnpm build
pnpm preview
```

Preview uses the same port settings as dev.

---

## Scripts

| Command            | Description |
| ------------------ | ----------- |
| `pnpm dev`         | Start Vite dev server with the **full** site (all routes, Gooey theme). |
| `pnpm build`       | Production build using the default entry in `src/main.tsx`; output in `dist/`. |
| `pnpm build:mask`  | Explicit alias for the default production build entry. |
| `pnpm build:landing` | Full landing-site production build with `VITE_SITE_ENTRY=landing`. |
| `pnpm preview`     | Serve `dist/` for smoke tests. |
| `pnpm typecheck`   | Run the repo TypeScript check with `tsc --noEmit`. |
| `pnpm sync:medium` | Fetch Medium RSS and write `src/data/medium-feed.json`. |

---

## Environment

Copy `.env.example` to `.env` for local development:

| Variable           | Purpose |
| ------------------ | ------- |
| `GROQ_API_KEY` | Used by the dev/preview site-search middleware at `POST /api/site-search`. |
| `CONTACT_SALES_WEBHOOK_URL` | Optional server-side webhook target for `POST /api/contact-sales` during dev/preview. |
| `VITE_CONTACT_SALES_ENDPOINT` | Optional client-side override for the contact sales form endpoint. Defaults to `/api/contact-sales`. |
| `VITE_ORIGIN_DEVELOPERS` | Optional absolute origin for the developer portal, e.g. `https://developers.jokuh.com`. |
| `VITE_ORIGIN_HELP` | Optional absolute origin for the help center, e.g. `https://help.jokuh.com`. |
| `VITE_ORIGIN_STATUS` | Optional absolute origin for the status portal, e.g. `https://status.jokuh.com`. |

If you also need Medium sync in your local setup, use the script-specific environment expected by `scripts/sync-medium.mjs`.

## Domain Topology

This repo currently assumes:

- main marketing host on `jokuh.com` or `www.jokuh.com`
- developer portal on `developers.jokuh.com`
- status portal on `status.jokuh.com`
- a planned standalone V1llains property on `v1llains.com`
- a future dedicated V1llains purchase host under `v1llains.com`

See [docs/domain-topology.md](/Users/sonadin/Documents/code/jokuh/landing/docs/domain-topology.md) for the canonical host map and rollout notes.

Then, for local verification:

```bash
pnpm dev
```

---

## GitHub Actions

[`.github/workflows/medium-feed-sync.yml`](.github/workflows/medium-feed-sync.yml) runs **daily** (06:00 UTC) and on **workflow dispatch**. It expects a repo secret:

- **`MEDIUM_RSS_URL`** — same as local `.env`

If the feed changes, the workflow commits updates to `src/data/medium-feed.json`.

---

## Project layout

```text
├── public/              # Static assets (favicon, fonts, mask image for prod build, …)
├── scripts/
│   └── sync-medium.mjs  # RSS → medium-feed.json
├── src/
│   ├── components/      # Shared UI (nav, footer, legal chrome, …)
│   ├── data/            # Content modules + generated Medium JSON
│   ├── pages/           # Route-level screens
│   ├── styles/          # Tailwind entry + app overrides
│   ├── bootstrap-dev.tsx   # Full app (dev)
│   ├── bootstrap-prod.tsx  # Mask-only shell (production)
│   ├── ProdMaskPage.tsx
│   ├── prod-mask.css
│   └── main.tsx         # PROD vs DEV dynamic import
├── index.html
├── vite.config.ts
└── package.json
```

---

## Contributing

Issues and PRs are welcome. Before opening a change that touches entry points or styles, run `pnpm build`, `pnpm build:landing`, and `pnpm typecheck` so both production entry paths and the TypeScript boundary are exercised.

---

## License

No license file is bundled in this repository yet. Add one when you are ready to clarify terms for contributors and users.
