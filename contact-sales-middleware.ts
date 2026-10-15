import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";
import { BodyTooLargeError, clientIp, createRateLimiter, readBody } from "./server/http-guards";
import {
  handleContactSalesSubmission,
  type ContactSalesRuntimeEnv,
} from "./contact-sales-service";

const MAX_BODY_BYTES = 20_000;

/** Contact-sales submissions per client per minute. */
const contactSalesLimiter = createRateLimiter(3, 60_000);

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

export function createContactSalesMiddleware(env: ContactSalesRuntimeEnv): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith("/api/contact-sales")) {
      return next();
    }

    const resNode = res as ServerResponse;

    if (req.method !== "POST") {
      json(resNode, 405, { error: "Method not allowed." });
      return;
    }

    if (!contactSalesLimiter.take(clientIp(req as IncomingMessage))) {
      resNode.setHeader("Retry-After", "60");
      json(resNode, 429, { error: "Too many requests. Try again in a minute." });
      return;
    }

    try {
      const result = await handleContactSalesSubmission(
        await readBody(req as IncomingMessage, MAX_BODY_BYTES),
        env,
      );
      json(resNode, result.status, result.body);
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        json(resNode, 413, { error: error.message });
        return;
      }
      console.error("[contact-sales]", error);
      json(resNode, 500, { error: "Unable to submit contact sales request right now." });
    }
  };
}

