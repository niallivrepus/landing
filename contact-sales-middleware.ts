import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";

type ContactSalesPayload = {
  interest: string;
  workEmail: string;
  companySize: string;
  companyName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  needs?: string;
  marketingOptIn: boolean;
  website?: string;
};

type SanitizedContactSalesPayload = Omit<ContactSalesPayload, "website"> & {
  submittedAt: string;
  source: "jokuh-contact-sales";
};

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function tidy(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parsePayload(raw: string): ContactSalesPayload | null {
  try {
    const parsed = JSON.parse(raw || "{}") as Record<string, unknown>;
    return {
      interest: tidy(parsed.interest, 120),
      workEmail: tidy(parsed.workEmail, 240),
      companySize: tidy(parsed.companySize, 120),
      companyName: tidy(parsed.companyName, 160),
      firstName: tidy(parsed.firstName, 80),
      lastName: tidy(parsed.lastName, 80),
      phoneNumber: tidy(parsed.phoneNumber, 50),
      needs: tidy(parsed.needs, 3000),
      marketingOptIn: Boolean(parsed.marketingOptIn),
      website: tidy(parsed.website, 240),
    };
  } catch {
    return null;
  }
}

function validatePayload(payload: ContactSalesPayload) {
  const errors: string[] = [];
  if (!payload.interest) errors.push("Please select what you are interested in.");
  if (!payload.workEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.workEmail)) {
    errors.push("Please enter a valid work email.");
  }
  if (!payload.companySize) errors.push("Please select your company size.");
  if (!payload.companyName) errors.push("Please enter your company name.");
  if (!payload.firstName) errors.push("Please enter your first name.");
  if (!payload.lastName) errors.push("Please enter your last name.");
  if (!payload.phoneNumber) errors.push("Please enter your phone number.");
  return errors;
}

async function forwardToWebhook(webhookUrl: string, payload: SanitizedContactSalesPayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

export function createContactSalesMiddleware(webhookUrl?: string): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith("/api/contact-sales") || req.method !== "POST") {
      return next();
    }

    const resNode = res as ServerResponse;

    try {
      const payload = parsePayload(await readBody(req as IncomingMessage));
      if (!payload) {
        json(resNode, 400, { error: "Invalid request body." });
        return;
      }

      // Silent success for obvious bot traffic.
      if (payload.website) {
        json(resNode, 200, { ok: true, mode: "honeypot" });
        return;
      }

      const errors = validatePayload(payload);
      if (errors.length > 0) {
        json(resNode, 400, { error: errors[0], errors });
        return;
      }

      const sanitizedPayload: SanitizedContactSalesPayload = {
        interest: payload.interest,
        workEmail: payload.workEmail,
        companySize: payload.companySize,
        companyName: payload.companyName,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        needs: payload.needs,
        marketingOptIn: payload.marketingOptIn,
        source: "jokuh-contact-sales",
        submittedAt: new Date().toISOString(),
      };

      if (webhookUrl) {
        await forwardToWebhook(webhookUrl, sanitizedPayload);
        json(resNode, 200, { ok: true, mode: "forwarded" });
        return;
      }

      console.log("[contact-sales]", sanitizedPayload);
      json(resNode, 200, { ok: true, mode: "local" });
    } catch (error) {
      json(resNode, 500, {
        error: "Unable to submit contact sales request right now.",
        detail: String(error),
      });
    }
  };
}
