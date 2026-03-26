# Jokuh · Landing

Marketing and product surface for **[Jokuh](https://github.com/niallivrepus)** — a humane layer for communities, identity, and expression. This repo is the public-facing **Vite + React** site: home, product pages, news (Medium), downloads, and legal hubs.

---

## Highlights

- **Design system** — Built on [`@jokuh/gooey`](https://github.com/niallivrepus) (Radix-style primitives, Tailwind v4, dark-first theming).
- **Production build** — `pnpm build` ships a **minimal mask splash** (static hero asset + tiny bundle). Full navigation and pages load in **development only** (`pnpm dev`).
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
| `pnpm build`       | Production build: **mask-only** entry + lean CSS; output in `dist/`. |
| `pnpm preview`     | Serve `dist/` for smoke tests. |
| `pnpm sync:medium` | Fetch Medium RSS and write `src/data/medium-feed.json`. |

---

## Environment

Copy `.env.example` to `.env` for local Medium sync:

| Variable           | Purpose |
| ------------------ | ------- |
| `MEDIUM_RSS_URL`   | Public RSS URL, e.g. `https://medium.com/feed/@yourhandle` (no API key). |

Then:

```bash
pnpm sync:medium
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

Issues and PRs are welcome. Please run `pnpm build` before opening a change that touches entry points or styles, so the production mask view stays intact.

---

## License

No license file is bundled in this repository yet. Add one when you are ready to clarify terms for contributors and users.
