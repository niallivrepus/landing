import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";
import { createClient } from "@supabase/supabase-js";

type StorySubmissionPayload = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  aboutWho: "self" | "other" | "";
  bio: string;
  jokuhUsage: string;
  impact: string;
  uniqueness: string;
  productSlugs: string[];
  links: string;
  consent: boolean;
  website?: string;
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

const MAX_TEXT = 1000;

function parsePayload(raw: string): StorySubmissionPayload | null {
  try {
    const p = JSON.parse(raw || "{}") as Record<string, unknown>;
    const aboutRaw = String(p.aboutWho || "");
    const aboutWho: "self" | "other" | "" = aboutRaw === "self" || aboutRaw === "other" ? aboutRaw : "";
    const productSlugs = Array.isArray(p.productSlugs)
      ? (p.productSlugs as unknown[]).map((x) => String(x).trim().slice(0, 64)).filter(Boolean)
      : [];
    return {
      firstName: tidy(p.firstName, 120),
      lastName: tidy(p.lastName, 120),
      email: tidy(p.email, 240),
      city: tidy(p.city, 120),
      state: tidy(p.state, 120),
      aboutWho,
      bio: tidy(p.bio, MAX_TEXT),
      jokuhUsage: tidy(p.jokuhUsage, MAX_TEXT),
      impact: tidy(p.impact, MAX_TEXT),
      uniqueness: tidy(p.uniqueness, MAX_TEXT),
      productSlugs,
      links: tidy(p.links, 2000),
      consent: Boolean(p.consent),
      website: tidy(p.website, 240),
    };
  } catch {
    return null;
  }
}

function validatePayload(payload: StorySubmissionPayload): string[] {
  const errors: string[] = [];
  if (payload.website) return errors;
  if (!payload.firstName) errors.push("First name is required.");
  if (!payload.lastName) errors.push("Last name is required.");
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.push("A valid email is required.");
  if (!payload.city) errors.push("City is required.");
  if (!payload.state) errors.push("State or region is required.");
  if (payload.aboutWho !== "self" && payload.aboutWho !== "other") errors.push("Select who this story is about.");
  if (!payload.bio) errors.push("Biography is required.");
  if (!payload.jokuhUsage) errors.push("Describe how you use Jokuh.");
  if (!payload.impact) errors.push("Describe how Jokuh has helped.");
  if (!payload.uniqueness) errors.push("What makes the story special is required.");
  if (payload.productSlugs.length < 1) errors.push("Select at least one product.");
  if (!payload.consent) errors.push("Please accept the privacy terms.");
  return errors;
}

type StoryMiddlewareEnv = {
  supabaseUrl: string;
  supabaseServiceKey: string;
};

/**
 * Local dev / preview: POST /api/story-submissions. Persists to Supabase when
 * `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (or `SUPABASE_SERVICE_KEY`) are set; otherwise
 * returns 202 with { ok, deferred: true } for UI testing. Production static builds need a
 * serverless/edge route with the same contract.
 */
export function createStorySubmissionsMiddleware(env: StoryMiddlewareEnv | undefined): Connect.NextHandleFunction {
  return async (req, res, next) => {
    if (!req.url?.startsWith("/api/story-submissions") || req.method !== "POST") {
      return next();
    }

    const resNode = res as ServerResponse;
    const serviceKey = env?.supabaseServiceKey?.trim() || "";
    const supabaseUrl = env?.supabaseUrl?.trim() || "";
    const hasSupabase = Boolean(supabaseUrl && serviceKey);

    try {
      const payload = parsePayload(await readBody(req as IncomingMessage));
      if (!payload) {
        json(resNode, 400, { error: "Invalid request body." });
        return;
      }

      if (payload.website) {
        json(resNode, 200, { ok: true, mode: "honeypot" });
        return;
      }

      const errors = validatePayload(payload);
      if (errors.length > 0) {
        json(resNode, 400, { error: errors[0], errors });
        return;
      }

      const row = {
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        city: payload.city,
        state: payload.state,
        about: payload.aboutWho,
        bio: payload.bio,
        jokuh_usage: payload.jokuhUsage,
        impact: payload.impact,
        uniqueness: payload.uniqueness,
        product_slugs: payload.productSlugs,
        links: payload.links || null,
        consent: payload.consent,
        source: "web-stories" as const,
      };

      if (hasSupabase) {
        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { error } = await supabase.from("story_submissions").insert(row);
        if (error) {
          console.error("[story-submissions]", error);
          json(resNode, 500, { error: "Could not save submission. Try again later." });
          return;
        }
        json(resNode, 200, { ok: true, mode: "saved" });
        return;
      }

      console.log("[story-submissions] deferred (no Supabase):", { ...row, product_slugs: row.product_slugs.length });
      json(resNode, 202, { ok: true, deferred: true, mode: "deferred" });
    } catch (e) {
      console.error("[story-submissions]", e);
      json(resNode, 500, { error: "Unable to submit your story right now." });
    }
  };
}
