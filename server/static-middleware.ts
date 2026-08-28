import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
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

function redirect(res: ServerResponse, location: string, status = 302) {
  res.statusCode = status;
  res.setHeader("Location", location);
  res.end();
}

/**
 * Client-side routes that should SPA-fallback with HTTP 200.
 * Unknown paths still serve `index.html` so React can render the 404 page, but with HTTP 404.
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
  "/help",
  "/legal",
  "/brand",
  "/manifesto",
  "/about",
  "/business",
  "/invest",
  "/pitchdeck",
  "/pitch-deck",
  "/charter",
  "/careers",
  "/platform",
  "/pods",
  "/v1llains",
  "/ecosystem",
  "/developers",
  "/chatgpt",
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

/** **Sends** a static file with Content-Length, HSTS on HTML, and an attachment name for `.dmg`. */
function sendFile(res: ServerResponse, filePath: string, contentType: string, status = 200) {
  const size = statSync(filePath).size;
  res.statusCode = status;
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", String(size));
  if (contentType.startsWith("text/html")) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  if (extname(filePath).toLowerCase() === ".dmg") {
    res.setHeader("Content-Disposition", 'attachment; filename="Jokuh.dmg"');
  }
  createReadStream(filePath).pipe(res);
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
        sendFile(resNode, aasaPath, "application/json");
        return;
      }
    }

    if (pathname === "/.well-known/apple-app-site-association") {
      const aasaPath = resolveSafePath(options.staticRoot, pathname);
      if (aasaPath && existsSync(aasaPath)) {
        sendFile(resNode, aasaPath, "application/json");
        return;
      }
    }

    const filePath = resolveSafePath(options.staticRoot, pathname);
    if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath).toLowerCase();
      sendFile(resNode, filePath, MIME_TYPES[ext] ?? "application/octet-stream");
      return;
    }

    /** Official Mac download stays on jokuh.com even if the 117MB dmg was not copied into the image. */
    if (pathname.toLowerCase() === "/downloads/jokuh.dmg") {
      redirect(resNode, macosDmgFallbackUrl, 302);
      return;
    }

    const hasFileExtension = extname(pathname).length > 0;
    if (hasFileExtension) {
      resNode.statusCode = 404;
      resNode.end("Not found");
      return;
    }

    const indexPath = resolveSafePath(options.staticRoot, "/index.html");
    if (indexPath && existsSync(indexPath)) {
      sendFile(resNode, indexPath, "text/html; charset=utf-8", isKnownSpaPath(pathname) ? 200 : 404);
      return;
    }

    next();
  };
}
