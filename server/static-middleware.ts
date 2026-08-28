import { createReadStream, existsSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import type { ServerResponse } from "node:http";
import type { Connect } from "vite";

const MIME_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".dmg": "application/x-apple-diskimage",
};

/** GitHub Release asset used when the image was not baked into `/downloads/Jokuh.dmg`. */
export const DEFAULT_MACOS_DMG_FALLBACK_URL =
  "https://github.com/niallivrepus/landing/releases/download/macos-1.0.1/Jokuh.dmg";

/**
 * Report-only CSP for the Vite marketing SPA: self, Google fonts, app.jokuh.com, and images.
 * Inline scripts in `index.html` (theme, SW cleanup, preloads) stay allowed; enforcement would break them.
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "connect-src 'self' https://app.jokuh.com https://*.supabase.co",
  "frame-src 'self' https://app.jokuh.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

type RedirectRule = {
  match: (path: string) => boolean;
  location: (path: string, search: string) => string;
  status?: number;
};

/**
 * **Returns** app handoff redirects previously configured in `vercel.json` / `Caddyfile`.
 */
function buildRedirectRules(appOrigin: string): RedirectRule[] {
  const app = appOrigin.replace(/\/$/, "");

  return [
    {
      match: (path) => path === "/sandbox" || path.startsWith("/sandbox/"),
      location: (path, search) => `${app}${path}${search}`,
    },
    {
      match: (path) => path === "/dd" || path.startsWith("/dd/"),
      location: (path, search) => `${app}${path}${search}`,
    },
    {
      match: (path) => path === "/dataroom" || path.startsWith("/dataroom/"),
      location: (path, search) => `${app}${path}${search}`,
    },
    {
      match: (path) => path === "/oo" || path.startsWith("/oo/"),
      location: (path, search) => `${app}${path}${search}`,
    },
    {
      match: (path) => path === "/xx/investpipeline" || path.startsWith("/xx/investpipeline/"),
      location: (path, search) => `${app}${path}${search}`,
    },
  ];
}

/** 302/301/308 with security headers so HSTS applies on protocol/host hops too. */
function redirect(res: ServerResponse, location: string, status = 302) {
  res.statusCode = status;
  res.setHeader("Location", location);
  applySecurityHeaders(res);
  res.end();
}

/**
 * Client-side routes that SPA-fallback with HTTP 200 + `index.html`.
 * Unknown paths serve `not-found.html` with HTTP 404 — never the homepage shell.
 */
const KNOWN_SPA_PREFIXES = [
  "/demo",
  "/download",
  "/newsroom",
  "/journal",
  "/news",
  "/rss",
  "/stories",
  "/blurbs",
  "/spine",
  "/calls",
  "/messages",
  "/profile",
  "/contact",
  "/pricing",
  "/privacy",
  "/terms",
  "/support",
  "/security",
  "/help",
  "/legal",
  "/brand",
  "/brand-guidelines",
  "/manifesto",
  "/about",
  "/business",
  "/invest",
  "/pitchdeck",
  "/pitch-deck",
  "/charter",
  "/careers",
  "/prompt",
  "/research",
] as const;

function isKnownSpaPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return KNOWN_SPA_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function forwardedProto(req: { headers: { [key: string]: string | string[] | undefined } }): string {
  const raw = req.headers["x-forwarded-proto"];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value?.split(",")[0]?.trim().toLowerCase() ?? "";
}

/**
 * **Purpose:** Normalize the request verb so HEAD can share GET header logic without a body.
 * **Connects to:** `sendFile`, `sendPlainNotFound` — Node `IncomingMessage.method`.
 * **Inputs:** Raw `req.method` (may be missing).
 * **Outputs:** Uppercase method string; defaults to GET.
 */
function requestMethod(method: string | undefined): string {
  return (method ?? "GET").toUpperCase();
}

/**
 * **Purpose:** Attach browser security headers on every HTML and static file response.
 * **Connects to:** `sendFile` and `sendPlainNotFound` in this middleware.
 * **Inputs:** Node `ServerResponse` about to be committed.
 * **Outputs:** Mutates response headers. CSP is Report-Only so Gooey/inline `index.html` scripts keep working.
 */
function applySecurityHeaders(res: ServerResponse): void {
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Security-Policy-Report-Only", CSP_REPORT_ONLY);
}

/**
 * **Purpose:** Send a static file with Content-Length, security headers, and an attachment name for `.dmg`.
 * **Connects to:** AASA, hashed Vite assets, SPA `index.html`, and `not-found.html`.
 * **Inputs:** Response, absolute file path, MIME type, status (default 200), HTTP method.
 * **Outputs:** Headers + status always. GET pipes the file body; HEAD ends with no body.
 */
function sendFile(
  res: ServerResponse,
  filePath: string,
  contentType: string,
  status = 200,
  method = "GET",
) {
  const size = statSync(filePath).size;
  res.statusCode = status;
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", String(size));
  applySecurityHeaders(res);
  if (extname(filePath).toLowerCase() === ".dmg") {
    res.setHeader("Content-Disposition", 'attachment; filename="Jokuh.dmg"');
  }
  if (requestMethod(method) === "HEAD") {
    res.end();
    return;
  }
  createReadStream(filePath).pipe(res);
}

/**
 * **Purpose:** 404 for missing files-with-extensions and a last-resort missing `not-found.html`.
 * **Connects to:** `applySecurityHeaders`; used when no crawl document is on disk.
 * **Inputs:** Response and HTTP method.
 * **Outputs:** HTTP 404 text/plain. HEAD sends headers only.
 */
function sendPlainNotFound(res: ServerResponse, method: string): void {
  const body = "Not found";
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Length", String(Buffer.byteLength(body)));
  applySecurityHeaders(res);
  if (requestMethod(method) === "HEAD") {
    res.end();
    return;
  }
  res.end(body);
}

/**
 * **Purpose:** Locate the crawl-honest 404 document without falling back to the homepage shell.
 * **Connects to:** Vite copies `public/not-found.html` into `dist/` (`STATIC_ROOT`); sibling `public/` covers local runs that point `STATIC_ROOT` at `dist` before a rebuild.
 * **Inputs:** `staticRoot` from Railway / Vite (`dist`).
 * **Outputs:** Absolute path to `not-found.html`, or null if neither the root nor its sibling tree has the file.
 */
function resolveNotFoundHtml(staticRoot: string): string | null {
  const candidates = [
    join(staticRoot, "not-found.html"),
    join(dirname(staticRoot), "not-found.html"),
    join(dirname(staticRoot), "public", "not-found.html"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

/**
 * **Purpose:** Serve a dedicated 404 document for junk SPA URLs instead of the homepage `index.html`.
 * **Connects to:** `public/not-found.html` (copied into `dist` by Vite), `KNOWN_SPA_PREFIXES`.
 * **Inputs:** Response, static root, HTTP method.
 * **Outputs:** HTTP 404 with `not-found.html` body (or short text if the file is missing). HEAD sends headers only.
 */
function sendUnknownPathNotFound(res: ServerResponse, staticRoot: string, method: string): void {
  const notFoundPath = resolveNotFoundHtml(staticRoot);
  if (notFoundPath) {
    sendFile(res, notFoundPath, "text/html; charset=utf-8", 404, method);
    return;
  }
  sendPlainNotFound(res, method);
}

function resolveSafePath(root: string, requestPath: string): string | null {
  const normalizedRoot = normalize(root);
  const candidate = normalize(join(root, requestPath));

  if (!candidate.startsWith(normalizedRoot)) {
    return null;
  }

  return candidate;
}

/**
 * Static assets, SPA fallback, AASA headers, and app handoff redirects for Railway production.
 */
export function createStaticMiddleware(options: {
  staticRoot: string;
  appOrigin: string;
  /** `apex` (default): 308 www → apex. `www`: serve www (GoDaddy forwards apex → www). */
  canonicalHost?: "apex" | "www";
  /**
   * Same-origin `/downloads/Jokuh.dmg` 302 target when the disk image is missing from the image.
   * **Connects to:** Docker bake in `Dockerfile`, `resolveMacDownloadUrl`.
   */
  macosDmgFallbackUrl?: string;
}): Connect.NextHandleFunction {
  const redirectRules = buildRedirectRules(options.appOrigin);
  const canonicalHost = options.canonicalHost ?? "apex";
  const macosDmgFallbackUrl = options.macosDmgFallbackUrl?.trim() || DEFAULT_MACOS_DMG_FALLBACK_URL;

  return (req, res, next) => {
    const resNode = res as ServerResponse;
    const method = requestMethod(req.method);
    const host = req.headers.host ?? "";
    const rawUrl = req.url ?? "/";
    const url = new URL(rawUrl, `http://${host}`);
    const pathname = url.pathname;
    const proto = forwardedProto(req);

    if (proto === "http" && host && !host.startsWith("localhost") && !host.startsWith("127.")) {
      redirect(resNode, `https://${host}${url.pathname}${url.search}`, 301);
      return;
    }

    if (canonicalHost === "www" && host && !host.startsWith("www.") && !host.startsWith("localhost")) {
      redirect(resNode, `https://www.${host}${url.pathname}${url.search}`, 308);
      return;
    }

    if (canonicalHost === "apex" && host.startsWith("www.")) {
      redirect(resNode, `https://${host.slice(4)}${url.pathname}${url.search}`, 308);
      return;
    }

    for (const rule of redirectRules) {
      if (rule.match(pathname)) {
        redirect(resNode, rule.location(pathname, url.search), rule.status ?? 302);
        return;
      }
    }

    if (pathname === "/apple-app-site-association") {
      const aasaPath = resolveSafePath(options.staticRoot, "/.well-known/apple-app-site-association");
      if (aasaPath && existsSync(aasaPath)) {
        sendFile(resNode, aasaPath, "application/json", 200, method);
        return;
      }
    }

    if (pathname === "/.well-known/apple-app-site-association") {
      const aasaPath = resolveSafePath(options.staticRoot, pathname);
      if (aasaPath && existsSync(aasaPath)) {
        sendFile(resNode, aasaPath, "application/json", 200, method);
        return;
      }
    }

    const filePath = resolveSafePath(options.staticRoot, pathname);
    if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath).toLowerCase();
      sendFile(resNode, filePath, MIME_TYPES[ext] ?? "application/octet-stream", 200, method);
      return;
    }

    /** Official Mac download stays on jokuh.com even if the 117MB dmg was not copied into the image. */
    if (pathname.toLowerCase() === "/downloads/jokuh.dmg") {
      redirect(resNode, macosDmgFallbackUrl, 302);
      return;
    }

    const hasFileExtension = extname(pathname).length > 0;
    if (hasFileExtension) {
      sendPlainNotFound(resNode, method);
      return;
    }

    if (!isKnownSpaPath(pathname)) {
      sendUnknownPathNotFound(resNode, options.staticRoot, method);
      return;
    }

    const indexPath = resolveSafePath(options.staticRoot, "/index.html");
    if (indexPath && existsSync(indexPath)) {
      sendFile(resNode, indexPath, "text/html; charset=utf-8", 200, method);
      return;
    }

    next();
  };
}
