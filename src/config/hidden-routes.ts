/**
 * **Hidden marketing routes (Sean, 2026-10-27: "everything else can hide").**
 *
 * jokuh.com is trimmed to the homepage plus the pages the App Store needs (privacy, terms, security, support;
 * Download is a sheet on the homepage, `/?get=1`) and the app hand-offs (`/@handle`, `/m/*`, `/live/*`, ...). Every route below is sent to `/`:
 * - in the browser by `<Navigate to="/" replace />` (`App.tsx`), and
 * - on the server by a 302 to `/` (`server/static-middleware.ts`), so crawlers and direct hits land home too.
 * Nav, footer, sitemap and site search drop any link to them (`isHiddenRoute`, `isUnlistedRoute`).
 *
 * Each entry hides the path itself and everything under it (`/stories` also hides `/stories/<slug>`). Files that
 * merely start with the same letters are untouched: `/shipped-feed.json` and `/rss.xml` are still served.
 *
 * The page code is kept. **To bring a page back:** delete its entry here, put its link back in
 * `data/rigid-sitemap.ts` (and `public/sitemap.xml` if it should be crawled), then rebuild. The route in
 * `App.tsx` still points at the original page component, so nothing else needs to change.
 */
export const HIDDEN_ROUTES = [
  // Company and editorial
  "/manifesto",
  "/charter",
  "/about",
  "/research",
  "/careers",
  "/brand",
  "/brand-guidelines",
  "/newsroom",
  "/news",
  "/journal",
  "/stories",
  "/shipped",
  // Business and sales
  "/business",
  "/invest",
  "/contact",
  "/pricing",
  // Developers
  "/developers",
  "/sdk",
  // Old product pages and demo
  "/blurbs",
  "/spine",
  "/calls",
  "/messages",
  "/profile",
  "/agents",
  "/demo",
  "/prompt",
  // Unpublished marketing URLs that already went home
  "/platform",
  "/pods",
  "/v1llains",
  "/ecosystem",
] as const;

/**
 * Reachable but never linked from the nav, footer or sitemap (partners and investors get the URL directly).
 * `/defense` stays in `public/sitemap.xml` so it can still be found by search engines.
 */
export const UNLISTED_ROUTES = ["/defense", "/pitchdeck", "/pitch-deck", "/dataroom", "/concepts"] as const;

function pathOf(href: string): string {
  const path = href.split("#")[0]?.split("?")[0] ?? href;
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function matchesAny(list: readonly string[], href: string): boolean {
  if (!href.startsWith("/")) return false;
  const path = pathOf(href);
  return list.some((route) => path === route || path.startsWith(`${route}/`));
}

/** True when `href` (a same-site path, query and hash allowed) is a hidden route that redirects home. */
export function isHiddenRoute(href: string): boolean {
  return matchesAny(HIDDEN_ROUTES, href);
}

/** True for routes that stay reachable but are never linked. */
export function isUnlistedRoute(href: string): boolean {
  return matchesAny(UNLISTED_ROUTES, href);
}

/**
 * Old URLs that redirect to a live page rather than home. `/download` was a page; Download Jokuh is now the sheet that
 * opens on the homepage at `/?get=1` (`GetJokuh.tsx`). Client: `<Navigate>` in `App.tsx`; server: 302 in
 * `server/static-middleware.ts`. The query string is dropped (`/download?intent=identity` -> `/?get=1`).
 * `/downloads/Jokuh.dmg` (the Mac build) is a different path and never matches.
 */
export const REDIRECT_ROUTES: Record<string, string> = {
  "/download": "/?get=1",
};

/** Where `href` redirects to, or `null` when it is not an old URL. */
export function redirectTargetFor(href: string): string | null {
  return REDIRECT_ROUTES[pathOf(href)] ?? null;
}
