import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";
import {
  handleContactSalesSubmission,
  type ContactSalesRuntimeEnv,
} from "./contact-sales-service";

const MAX_BODY_BYTES = 20_000;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    req.on("data", (chunk: Buffer) => {
      totalBytes += chunk.length;
      if (totalBytes > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

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

    try {
      const result = await handleContactSalesSubmission(await readBody(req as IncomingMessage), env);
      json(resNode, result.status, result.body);
    } catch (error) {
      json(resNode, error instanceof Error && error.message.includes("too large") ? 413 : 500, {
        error: error instanceof Error ? error.message : "Unable to submit contact sales request right now.",
      });
    }
  };
}

