import { createHash } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ServerResponse } from "node:http";
import type { Connect } from "vite";
import { BodyTooLargeError, clientIp, createRateLimiter, readBody } from "./server/http-guards";
import { NEWS_FEED_ITEMS } from "./src/data/news";
import { getNewsDetail, NEWS_DETAIL_BY_SLUG } from "./src/data/news-detail";
import { buildSpeechTextFromDoc } from "./src/lib/article-audio";

type ArticleAudioEnv = {
  apiKey: string;
  voiceId: string;
  modelId: string;
  publicDir: string;
};

const PUBLIC_SUBDIR = "article-audio";
const PUBLIC_URL_PREFIX = `/${PUBLIC_SUBDIR}`;

const inflight = new Map<string, Promise<void>>();

/** Longest current article speech text is ~5 KB; anything past this is not one of ours. */
const MAX_TEXT_CHARS = 12_000;
const MAX_BODY_BYTES = 48 * 1024;
/** ElevenLabs generations (cache misses) per client per minute. */
const generationLimiter = createRateLimiter(5, 60_000);
/** Global ElevenLabs generations per UTC day (override with `ARTICLE_AUDIO_DAILY_CAP`). */
const DAILY_GENERATION_CAP = (() => {
  const raw = process.env.ARTICLE_AUDIO_DAILY_CAP?.trim();
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 100;
})();
let dailyCount = { day: "", count: 0 };

function takeDailyGeneration(): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (dailyCount.day !== day) dailyCount = { day, count: 0 };
  if (dailyCount.count >= DAILY_GENERATION_CAP) return false;
  dailyCount.count += 1;
  return true;
}

function textDigest(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * Digests of every on-site article's speech text (same builder the client uses), so the route
 * only ever voices the site's own newsroom copy — never arbitrary POSTed text.
 */
function knownArticleTextDigests(): Set<string> {
  const slugs = new Set<string>(Object.keys(NEWS_DETAIL_BY_SLUG));
  for (const item of NEWS_FEED_ITEMS) {
    if (item.slug) slugs.add(item.slug);
  }
  const digests = new Set<string>();
  for (const slug of slugs) {
    const doc = getNewsDetail(slug);
    if (!doc) continue;
    const text = buildSpeechTextFromDoc(doc).trim();
    if (text) digests.add(textDigest(text));
  }
  return digests;
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function hashFor(voice: string, model: string, text: string) {
  return createHash("sha256").update(`${voice}:${model}:${text}`).digest("hex").slice(0, 24);
}

async function fetchAndStore(env: ArticleAudioEnv, text: string, filePath: string) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${env.voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": env.apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: env.modelId,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.8,
        style: 0.15,
        use_speaker_boost: true,
      },
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(filePath, buf);
}

export function createArticleAudioMiddleware(env: ArticleAudioEnv): Connect.NextHandleFunction {
  const dir = join(env.publicDir, PUBLIC_SUBDIR);
  mkdirSync(dir, { recursive: true });
  const knownDigests = knownArticleTextDigests();

  return async (req, res, next) => {
    if (!req.url) return next();
    const url = req.url.split("?")[0];
    if (url !== "/api/article-audio") return next();
    if (req.method !== "POST") {
      send(res, 405, { error: "method_not_allowed" });
      return;
    }

    if (!env.apiKey) {
      send(res, 503, { error: "elevenlabs_not_configured" });
      return;
    }

    let text = "";
    try {
      const raw = await readBody(req, MAX_BODY_BYTES);
      const parsed = raw ? JSON.parse(raw) : {};
      text = typeof parsed?.text === "string" ? parsed.text.trim() : "";
    } catch (err) {
      if (err instanceof BodyTooLargeError) {
        send(res, 413, { error: "payload_too_large" });
        return;
      }
      send(res, 400, { error: "invalid_json" });
      return;
    }
    if (!text) {
      send(res, 400, { error: "missing_text" });
      return;
    }
    if (text.length > MAX_TEXT_CHARS || !knownDigests.has(textDigest(text))) {
      send(res, 404, { error: "unknown_article" });
      return;
    }

    const hash = hashFor(env.voiceId, env.modelId, text);
    const fileName = `${hash}.mp3`;
    const filePath = join(dir, fileName);
    const publicUrl = `${PUBLIC_URL_PREFIX}/${fileName}`;

    if (existsSync(filePath)) {
      send(res, 200, { url: publicUrl, cached: true });
      return;
    }

    let pending = inflight.get(hash);
    if (!pending) {
      if (!generationLimiter.take(clientIp(req))) {
        res.setHeader("Retry-After", "60");
        send(res, 429, { error: "rate_limited" });
        return;
      }
      if (!takeDailyGeneration()) {
        send(res, 503, { error: "daily_cap_reached" });
        return;
      }
      pending = fetchAndStore(env, text, filePath).finally(() => {
        inflight.delete(hash);
      });
      inflight.set(hash, pending);
    }

    try {
      await pending;
      send(res, 200, { url: publicUrl, cached: false });
    } catch (err) {
      console.error("[article-audio]", (err as Error).message);
      send(res, 502, { error: "tts_failed" });
    }
  };
}
