import { createHash } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect } from "vite";

type ArticleAudioEnv = {
  apiKey: string;
  voiceId: string;
  modelId: string;
  publicDir: string;
};

const PUBLIC_SUBDIR = "article-audio";
const PUBLIC_URL_PREFIX = `/${PUBLIC_SUBDIR}`;

const inflight = new Map<string, Promise<void>>();

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
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
      const raw = await readBody(req);
      const parsed = raw ? JSON.parse(raw) : {};
      text = typeof parsed?.text === "string" ? parsed.text.trim() : "";
    } catch {
      send(res, 400, { error: "invalid_json" });
      return;
    }
    if (!text) {
      send(res, 400, { error: "missing_text" });
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
      pending = fetchAndStore(env, text, filePath).finally(() => {
        inflight.delete(hash);
      });
      inflight.set(hash, pending);
    }

    try {
      await pending;
      send(res, 200, { url: publicUrl, cached: false });
    } catch (err) {
      send(res, 502, { error: "tts_failed", detail: (err as Error).message });
    }
  };
}
