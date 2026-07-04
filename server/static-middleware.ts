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
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

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
      match: (path) => path === "/pitchdeck",
      location: () => `${app}/pitch-deck`,
    },
    {
      match: (path) => path.startsWith("/pitchdeck/"),
      location: (path) => `${app}/pitch-deck${path.slice("/pitchdeck".length)}`,
    },
    {
      match: (path) => path === "/pitch-deck" || path.startsWith("/pitch-deck/"),
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

function sendFile(res: ServerResponse, filePath: string, contentType: string) {
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
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
}): Connect.NextHandleFunction {
  const redirectRules = buildRedirectRules(options.appOrigin);

  return (req, res, next) => {
    const resNode = res as ServerResponse;
    const host = req.headers.host ?? "";
    const rawUrl = req.url ?? "/";
    const url = new URL(rawUrl, `http://${host}`);
    const pathname = url.pathname;

    if (host.startsWith("www.")) {
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

    const hasFileExtension = extname(pathname).length > 0;
    if (hasFileExtension) {
      resNode.statusCode = 404;
      resNode.end("Not found");
      return;
    }

    const indexPath = resolveSafePath(options.staticRoot, "/index.html");
    if (indexPath && existsSync(indexPath)) {
      sendFile(resNode, indexPath, "text/html; charset=utf-8");
      return;
    }

    next();
  };
}
