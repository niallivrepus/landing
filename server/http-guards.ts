import type { IncomingMessage } from "node:http";

/**
 * **Purpose:** Shared request guards for the landing `/api/*` middleware — bounded body reads and a
 * small in-memory per-IP token-bucket limiter.
 * **Connects to:** `site-search-middleware.ts`, `story-submissions-middleware.ts`,
 * `article-audio-middleware.ts`, `contact-sales-middleware.ts` (Railway `server/railway.ts` + Vite dev/preview).
 * **Client IP:** socket address by default. Set `LANDING_TRUST_X_FORWARDED_FOR=1` to key on the first
 * `x-forwarded-for` hop instead (only behind a proxy that overwrites that header).
 */

export const DEFAULT_MAX_BODY_BYTES = 32 * 1024;

/** Thrown by [readBody] when the payload exceeds the cap; middleware maps it to HTTP 413. */
export class BodyTooLargeError extends Error {
  readonly status = 413;
  constructor() {
    super("Request body is too large.");
    this.name = "BodyTooLargeError";
  }
}

/** **Reads** the request body as UTF-8, rejecting with [BodyTooLargeError] past `maxBytes`. */
export function readBody(req: IncomingMessage, maxBytes = DEFAULT_MAX_BODY_BYTES): Promise<string> {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers["content-length"]);
    if (Number.isFinite(declared) && declared > maxBytes) {
      reject(new BodyTooLargeError());
      req.resume();
      return;
    }
    const chunks: Buffer[] = [];
    let total = 0;
    let done = false;
    req.on("data", (chunk: Buffer) => {
      if (done) return;
      total += chunk.length;
      if (total > maxBytes) {
        done = true;
        chunks.length = 0;
        reject(new BodyTooLargeError());
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (done) return;
      done = true;
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", (err) => {
      if (done) return;
      done = true;
      reject(err);
    });
  });
}

const trustForwardedFor = (() => {
  const raw = (typeof process !== "undefined" ? process.env.LANDING_TRUST_X_FORWARDED_FOR : "") ?? "";
  return raw === "1" || raw.toLowerCase() === "true";
})();

/** **Returns** the rate-limit key for a request (socket address unless proxy trust is enabled). */
export function clientIp(req: IncomingMessage): string {
  if (trustForwardedFor) {
    const raw = req.headers["x-forwarded-for"];
    const first = (Array.isArray(raw) ? raw[0] : raw)?.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.socket?.remoteAddress ?? "unknown";
}

export type RateLimiter = {
  /** `true` when the key had a token (request allowed). */
  take(key: string): boolean;
};

const MAX_TRACKED_KEYS = 10_000;

/** **Creates** a token bucket per key: `capacity` tokens refilled evenly over `windowMs`. */
export function createRateLimiter(capacity: number, windowMs: number): RateLimiter {
  const buckets = new Map<string, { tokens: number; updatedAt: number }>();
  const refillPerMs = capacity / windowMs;

  return {
    take(key) {
      const now = Date.now();
      if (buckets.size > MAX_TRACKED_KEYS) {
        for (const [k, b] of buckets) {
          if (now - b.updatedAt > windowMs) buckets.delete(k);
        }
        if (buckets.size > MAX_TRACKED_KEYS) buckets.clear();
      }
      const bucket = buckets.get(key) ?? { tokens: capacity, updatedAt: now };
      bucket.tokens = Math.min(capacity, bucket.tokens + (now - bucket.updatedAt) * refillPerMs);
      bucket.updatedAt = now;
      const allowed = bucket.tokens >= 1;
      if (allowed) bucket.tokens -= 1;
      buckets.set(key, bucket);
      return allowed;
    },
  };
}
