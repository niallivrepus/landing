import type { ServerResponse } from "node:http";
import type { Connect } from "vite";
import {
  fetchPublicPeopleSearchServer,
  resolvePublicPeopleSearchEnv,
  type PublicPeopleSearchRuntimeEnv,
} from "./public-people-search-service";

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "private, no-store");
  res.end(JSON.stringify(body));
}

/**
 * Local dev / preview: GET `/api/public-people-search`.
 * Proxies `search_accounts` server-side because the RPC is authenticated-only.
 */
export function createPublicPeopleSearchMiddleware(
  env: PublicPeopleSearchRuntimeEnv | null | undefined,
): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith("/api/public-people-search") || req.method !== "GET") {
      return next();
    }

    const resNode = res as ServerResponse;
    const runtime = env ?? resolvePublicPeopleSearchEnv({});
    const url = new URL(req.url, "http://localhost");
    const query = url.searchParams.get("q") ?? "";

    if (!runtime) {
      json(resNode, 503, {
        items: [],
        source: "unavailable",
        error: "People search is not configured on this host.",
      });
      return;
    }

    try {
      const result = await fetchPublicPeopleSearchServer(query, runtime);
      json(resNode, 200, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "search failed";
      json(resNode, 500, { items: [], source: "unavailable", error: message });
    }
  };
}
