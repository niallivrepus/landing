import { getNewsDetail, type NewsDetailDocument } from "../data/news-detail";

const ENDPOINT = "/api/article-audio";

const urlCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

function cacheKey(text: string) {
  return `${text.length}:${text.slice(0, 96)}`;
}

export function isArticleAudioConfigured() {
  // Server decides if TTS is available; we attempt and fall back gracefully.
  return true;
}

export function hasCachedArticleAudio(text: string) {
  return urlCache.has(cacheKey(text));
}

export function getArticleAudio(text: string): Promise<string> {
  const key = cacheKey(text);
  const cached = urlCache.get(key);
  if (cached) return Promise.resolve(cached);
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`article-audio ${res.status}: ${detail.slice(0, 160)}`);
    }
    const data = (await res.json()) as { url?: string };
    if (!data.url) throw new Error("article-audio: missing url");
    urlCache.set(key, data.url);
    return data.url;
  })().finally(() => {
    inflight.delete(key);
  });

  inflight.set(key, promise);
  return promise;
}

export function preloadArticleAudio(text: string): void {
  if (hasCachedArticleAudio(text)) return;
  void getArticleAudio(text).catch(() => {
    /* preload errors are non-fatal */
  });
}

export function buildSpeechTextFromDoc(doc: NewsDetailDocument): string {
  if (doc.kind === "brief") {
    return [doc.title, doc.subtitle, ...doc.introParagraphs, doc.bodyTitle, ...doc.bodyParagraphs].join(" ");
  }
  return doc.speechText;
}

export function buildSpeechTextForSlug(slug: string): string | null {
  const doc = getNewsDetail(slug);
  if (!doc) return null;
  return buildSpeechTextFromDoc(doc);
}

type IdleScheduler = (cb: () => void) => void;

const scheduleIdle: IdleScheduler =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) =>
        (
          window as unknown as {
            requestIdleCallback: (fn: () => void, opts?: { timeout: number }) => void;
          }
        ).requestIdleCallback(cb, { timeout: 4000 })
    : (cb) => window.setTimeout(cb, 800);

let preloadStarted = false;

export function preloadNewsArticleSlugs(slugs: string[], concurrency = 2): void {
  if (typeof window === "undefined") return;
  if (preloadStarted) return;
  preloadStarted = true;

  const queue = slugs
    .map((slug) => buildSpeechTextForSlug(slug))
    .filter((text): text is string => Boolean(text) && !hasCachedArticleAudio(text!));

  const runNext = () => {
    const text = queue.shift();
    if (!text) return;
    getArticleAudio(text)
      .catch(() => {
        /* swallow */
      })
      .finally(() => {
        scheduleIdle(runNext);
      });
  };

  scheduleIdle(() => {
    for (let i = 0; i < concurrency; i++) {
      runNext();
    }
  });
}
