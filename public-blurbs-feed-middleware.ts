import type { ServerResponse } from "node:http";
import type { Connect } from "vite";
import {
  fetchPublicBlurbsFeedServer,
  resolvePublicBlurbsFeedEnv,
  type PublicBlurbsFeedRuntimeEnv,
} from "./public-blurbs-feed-service";

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
  res.end(JSON.stringify(body));
}

/**
 * Local dev / preview: GET `/api/public-blurbs-feed`.
 * Proxies sitemap + RPC server-side because `blurbs-sitemap` Edge lacks browser CORS headers.
 */
export function createPublicBlurbsFeedMiddleware(
  env: PublicBlurbsFeedRuntimeEnv | undefined,
): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith("/api/public-blurbs-feed") || req.method !== "GET") {
      return next();
    }

    const resNode = res as ServerResponse;
    const runtime = env ?? resolvePublicBlurbsFeedEnv({});
    const url = new URL(req.url, "http://localhost");
    const limitRaw = url.searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitRaw) || 24, 1), 48);

    try {
      const result = await fetchPublicBlurbsFeedServer(limit, runtime);
      json(resNode, 200, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "fetch failed";
      json(resNode, 500, { error: message });
    }
  };
}
