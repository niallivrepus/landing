import type { ServerResponse } from "node:http";
import type { Connect } from "vite";
import {
  fetchPublicProfileDemoServer,
  resolvePublicProfileDemoEnv,
  type PublicProfileDemoRuntimeEnv,
} from "./public-profile-service";

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "private, no-store");
  res.end(JSON.stringify(body));
}

/**
 * Local dev / preview: GET `/api/public-profile-demo`.
 * Loads `peek_public_profile` + optional network peers for the marketing profile pod.
 */
export function createPublicProfileDemoMiddleware(
  env: PublicProfileDemoRuntimeEnv | undefined,
): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith("/api/public-profile-demo") || req.method !== "GET") {
      return next();
    }

    const resNode = res as ServerResponse;
    const runtime = env ?? resolvePublicProfileDemoEnv({});
    const url = new URL(req.url, "http://localhost");
    const username = url.searchParams.get("username") ?? undefined;

    try {
      const result = await fetchPublicProfileDemoServer(username, runtime);
      json(resNode, 200, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "profile demo failed";
      json(resNode, 500, { profile: null, source: "fallback", error: message });
    }
  };
}
