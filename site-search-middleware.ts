import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";

type SearchRequestArticle = {
  href: string;
  title: string;
  snippet: string;
  meta: string;
  external: boolean;
};

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const SYSTEM = `You are the Jokuh website assistant. Jokuh builds ambient intelligence products. Tagline: "Your thinking is the product." Key surfaces: Pods, Blurbs, Spine, Vortex, prompt bar; Platform (Identity, Gooey, Wallet, Galaxy Nodes); developers docs at /developers/docs; newsroom at /newsroom; stories at /stories; waitlist at /waitlist.

Use the provided ranked site hits as grounding when available. Favor titles and snippets from those hits, and do not invent pages or features that are not present in the context.

Answer in clear prose, max about 120 words. No markdown headings. If the question is unrelated, answer briefly and point to /newsroom, /stories, or /developers/docs.`;

function normalizeArticles(value: unknown): SearchRequestArticle[] {
  if (!Array.isArray(value)) return [];
  const articles = value
    .slice(0, 6)
    .map((item): SearchRequestArticle | null => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Partial<SearchRequestArticle>;
      const href = typeof candidate.href === "string" ? candidate.href.trim() : "";
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
      const snippet = typeof candidate.snippet === "string" ? candidate.snippet.trim() : "";
      const meta = typeof candidate.meta === "string" ? candidate.meta.trim() : "";
      if (!href || !title || !snippet || !meta) return null;
      return {
        href,
        title,
        snippet,
        meta,
        external: Boolean(candidate.external),
      };
    });

  return articles.filter((item): item is SearchRequestArticle => item !== null);
}

function buildContext(articles: SearchRequestArticle[]): string {
  if (articles.length === 0) return "";
  return articles
    .map((hit, index) => `${index + 1}. ${hit.title} | ${hit.meta} | ${hit.href} | ${hit.snippet}`)
    .join("\n");
}

function buildFallbackSummary(query: string, articles: SearchRequestArticle[]): string {
  const top = articles.slice(0, 3);
  if (top.length === 0) {
    return `I could not reach the live site search service, but the closest local matches for "${query}" are the newsroom, product pages, stories, and docs. Try a more specific product or topic name for a tighter result.`;
  }

  const headline = top.map((hit) => `${hit.title} (${hit.meta.toLowerCase()})`).join(", ");
  const snippets = top
    .map((hit) => hit.snippet.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" ");

  return `I could not reach the live site search service, so here are the closest local matches for "${query}": ${headline}. ${snippets}`;
}

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function createSiteSearchMiddleware(apiKey: string | undefined): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const path = (req as IncomingMessage & { originalUrl?: string }).originalUrl ?? req.url ?? "";
    if (!path.startsWith("/api/site-search") || req.method !== "POST") {
      return next();
    }

    const resNode = res as ServerResponse;

    try {
      const raw = await readBody(req as IncomingMessage);
      let query = "";
      let articles: SearchRequestArticle[] = [];
      let context = "";
      try {
        const j = JSON.parse(raw || "{}") as { query?: string; articles?: unknown; context?: string };
        query = String(j.query ?? "").trim().slice(0, 2000);
        articles = normalizeArticles(j.articles);
        context = typeof j.context === "string" ? j.context.trim().slice(0, 4000) : buildContext(articles);
      } catch {
        /* ignore */
      }

      if (!query) {
        json(resNode, 400, { error: "Missing query" });
        return;
      }

      const fallbackSummary = buildFallbackSummary(query, articles);
      let summary = fallbackSummary;

      if (apiKey) {
        try {
          const userMessage = context
            ? `Search query: ${query}\n\nRanked site hits:\n${context}`
            : `Search query: ${query}`;
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [
                { role: "system", content: SYSTEM },
                { role: "user", content: userMessage },
              ],
              temperature: 0.25,
              max_tokens: 256,
            }),
          }).finally(() => clearTimeout(timeoutId));

          if (groqRes.ok) {
            const data = (await groqRes.json()) as {
              choices?: Array<{ message?: { content?: string | null } }>;
            };
            const modelSummary = data.choices?.[0]?.message?.content?.trim();
            if (modelSummary) {
              summary = modelSummary;
            }
          }
        } catch {
          /* fall back to local summary */
        }
      }

      json(resNode, 200, { summary });
    } catch (e) {
      json(resNode, 500, { error: "Server error", detail: String(e) });
    }
  };
}
