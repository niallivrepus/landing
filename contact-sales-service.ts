import {
  CONTACT_SALES_COMPANY_SIZE_OPTIONS,
  CONTACT_SALES_INTEREST_OPTIONS,
} from "./src/data/contact-sales";

export type ContactSalesPayload = {
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

export type SanitizedContactSalesPayload = Omit<ContactSalesPayload, "website"> & {
  source: "jokuh-contact-sales";
  submittedAt: string;
};

export type ContactSalesRuntimeEnv = {
  resendApiKey?: string;
  toEmail?: string;
  fromEmail?: string;
  webhookUrl?: string;
  devMode?: string;
};

export type ContactSalesHandlerResult = {
  status: number;
  body: {
    ok?: boolean;
    error?: string;
    errors?: string[];
    id?: string;
    mode?: "email" | "dev-log" | "honeypot";
    message?: string;
  };
};

const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const DEFAULT_CONTACT_TO_EMAIL = "hello@jokuh.com";
const DEFAULT_CONTACT_FROM_EMAIL = "Jokuh <hello@jokuh.com>";
const SUCCESS_MESSAGE = "Thanks. Your inquiry was sent to Jokuh and our team will follow up by email.";

function nonEmpty(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function resolveContactSalesEnv(env: Record<string, string | undefined>): ContactSalesRuntimeEnv {
  return {
    resendApiKey: nonEmpty(env.RESEND_API_KEY),
    toEmail: nonEmpty(env.CONTACT_SALES_TO_EMAIL) ?? nonEmpty(env.CONTACT_INBOX_EMAIL) ?? DEFAULT_CONTACT_TO_EMAIL,
    fromEmail: nonEmpty(env.CONTACT_SALES_FROM_EMAIL) ?? DEFAULT_CONTACT_FROM_EMAIL,
    webhookUrl: nonEmpty(env.CONTACT_SALES_WEBHOOK_URL),
    devMode: nonEmpty(env.CONTACT_SALES_DEV_MODE),
  };
}

function tidy(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parsePayload(input: unknown): ContactSalesPayload | null {
  try {
    const parsed =
      typeof input === "string"
        ? (JSON.parse(input || "{}") as Record<string, unknown>)
        : (input as Record<string, unknown>);

    if (!parsed || typeof parsed !== "object") return null;

    return {
      interest: tidy(parsed.interest, 120),
      workEmail: tidy(parsed.workEmail, 240).toLowerCase(),
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

  if (!CONTACT_SALES_INTEREST_OPTIONS.includes(payload.interest as (typeof CONTACT_SALES_INTEREST_OPTIONS)[number])) {
    errors.push("Please select what you are interested in.");
  }

  if (!payload.workEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.workEmail)) {
    errors.push("Please enter a valid work email.");
  }

  if (!CONTACT_SALES_COMPANY_SIZE_OPTIONS.includes(payload.companySize as (typeof CONTACT_SALES_COMPANY_SIZE_OPTIONS)[number])) {
    errors.push("Please select your company size.");
  }

  if (!payload.companyName) errors.push("Please enter your company name.");
  if (!payload.firstName) errors.push("Please enter your first name.");
  if (!payload.lastName) errors.push("Please enter your last name.");
  if (!payload.phoneNumber) errors.push("Please enter your phone number.");

  return errors;
}

function splitEmailList(value: string) {
  const recipients = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return recipients.length > 1 ? recipients : recipients[0] ?? value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlMultiline(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function createSubmissionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildSubject(payload: SanitizedContactSalesPayload) {
  return `[Jokuh sales] ${payload.companyName} - ${payload.interest}`.slice(0, 180);
}

function buildTextEmail(payload: SanitizedContactSalesPayload) {
  return [
    "New Jokuh contact sales inquiry",
    "",
    `Submitted: ${payload.submittedAt}`,
    `Name: ${payload.firstName} ${payload.lastName}`,
    `Work email: ${payload.workEmail}`,
    `Phone: ${payload.phoneNumber}`,
    `Company: ${payload.companyName}`,
    `Company size: ${payload.companySize}`,
    `Interest: ${payload.interest}`,
    `Marketing opt-in: ${payload.marketingOptIn ? "Yes" : "No"}`,
    "",
    "Business needs:",
    payload.needs || "Not provided.",
  ].join("\n");
}

function buildHtmlEmail(payload: SanitizedContactSalesPayload) {
  const rows: [string, string][] = [
    ["Submitted", payload.submittedAt],
    ["Name", `${payload.firstName} ${payload.lastName}`],
    ["Work email", payload.workEmail],
    ["Phone", payload.phoneNumber],
    ["Company", payload.companyName],
    ["Company size", payload.companySize],
    ["Interest", payload.interest],
    ["Marketing opt-in", payload.marketingOptIn ? "Yes" : "No"],
  ];

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f6f4;font-family:Arial,sans-serif;color:#111111;">
    <main style="max-width:640px;margin:0 auto;padding:32px 20px;">
      <section style="background:#ffffff;border:1px solid #e6e2dc;border-radius:18px;padding:28px;">
        <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6f6a63;">Jokuh contact sales</p>
        <h1 style="margin:0 0 24px 0;font-size:24px;line-height:1.2;">New enterprise inquiry</h1>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${rows
              .map(
                ([label, value]) => `<tr>
                  <th style="width:150px;padding:10px 0;border-top:1px solid #efebe5;text-align:left;vertical-align:top;font-size:12px;color:#6f6a63;">${escapeHtml(label)}</th>
                  <td style="padding:10px 0;border-top:1px solid #efebe5;font-size:14px;line-height:1.55;">${escapeHtml(value)}</td>
                </tr>`,
              )
              .join("")}
          </tbody>
        </table>
        <h2 style="margin:24px 0 8px 0;font-size:15px;">Business needs</h2>
        <p style="margin:0;font-size:14px;line-height:1.65;color:#37322d;">${htmlMultiline(payload.needs || "Not provided.")}</p>
      </section>
    </main>
  </body>
</html>`;
}

async function sendViaResend(payload: SanitizedContactSalesPayload, env: Required<Pick<ContactSalesRuntimeEnv, "resendApiKey" | "toEmail" | "fromEmail">>) {
  const idempotencyKey = `contact-sales-${createSubmissionId()}`;
  const response = await fetch(RESEND_EMAILS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: env.fromEmail,
      to: splitEmailList(env.toEmail),
      reply_to: payload.workEmail,
      subject: buildSubject(payload),
      html: buildHtmlEmail(payload),
      text: buildTextEmail(payload),
      tags: [
        { name: "source", value: "jokuh_contact_sales" },
        { name: "form", value: "contact_sales" },
      ],
    }),
  });
  const result = (await response.json().catch(() => null)) as { id?: string; message?: string; name?: string } | null;

  if (!response.ok) {
    console.error("[contact-sales] resend failed", {
      status: response.status,
      name: result?.name,
      message: result?.message,
    });
    throw new Error("Email provider rejected the request.");
  }

  return result?.id;
}

async function forwardToWebhook(webhookUrl: string, payload: SanitizedContactSalesPayload & { emailDeliveryId?: string }) {
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

export async function handleContactSalesSubmission(
  body: unknown,
  env: ContactSalesRuntimeEnv,
): Promise<ContactSalesHandlerResult> {
  const payload = parsePayload(body);
  if (!payload) {
    return { status: 400, body: { error: "Invalid request body." } };
  }

  // Silent success for obvious bot traffic.
  if (payload.website) {
    return { status: 200, body: { ok: true, mode: "honeypot", message: SUCCESS_MESSAGE } };
  }

  const errors = validatePayload(payload);
  if (errors.length > 0) {
    return { status: 400, body: { error: errors[0], errors } };
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

  if (!env.resendApiKey) {
    if (env.devMode === "log") {
      console.log("[contact-sales] dev-log", sanitizedPayload);
      return { status: 200, body: { ok: true, mode: "dev-log", message: SUCCESS_MESSAGE } };
    }

    return {
      status: 503,
      body: {
        error: "Email delivery is not configured yet. Add RESEND_API_KEY before accepting contact inquiries.",
      },
    };
  }

  if (!env.toEmail || !env.fromEmail) {
    return {
      status: 503,
      body: {
        error: "Email delivery is missing a sender or recipient address.",
      },
    };
  }

  try {
    const emailDeliveryId = await sendViaResend(sanitizedPayload, {
      resendApiKey: env.resendApiKey,
      toEmail: env.toEmail,
      fromEmail: env.fromEmail,
    });

    if (env.webhookUrl) {
      forwardToWebhook(env.webhookUrl, { ...sanitizedPayload, emailDeliveryId }).catch((error: unknown) => {
        console.error("[contact-sales] webhook failed after email delivery", error);
      });
    }

    return {
      status: 200,
      body: {
        ok: true,
        mode: "email",
        id: emailDeliveryId,
        message: SUCCESS_MESSAGE,
      },
    };
  } catch {
    return {
      status: 502,
      body: {
        error: "We could not send your inquiry right now. Please email hello@jokuh.com directly.",
      },
    };
  }
}

export async function handleContactSalesFetchRequest(request: Request, env: ContactSalesRuntimeEnv) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 20_000) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  const result = await handleContactSalesSubmission(await request.text(), env);
  return Response.json(result.body, { status: result.status });
}

