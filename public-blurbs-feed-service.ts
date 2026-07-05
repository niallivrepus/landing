import {
  LANDING_PUBLIC_BLURBS_FALLBACK,
  normalizePublicBlurbMediaKind,
  parsePublicBlurbSitemap,
  type PublicBlurbFeedItem,
  type PublicBlurbsFeedResult,
} from "./public-blurbs-feed-shared";
import {
  signedBlurbsMediaUrl,
  signedIdentityPhotoUrl,
  type PublicStorageSignRuntime,
} from "./public-storage-sign-service";

type PublicBlurbShareRpcRow = {
  id?: string;
  body_text?: string;
  created_at?: string;
  username?: string;
  display_name?: string;
  public_slug?: string;
  has_media?: boolean;
  media_kind?: string | null;
  image_object_path?: string | null;
  poster_object_path?: string | null;
  identity_photo_path?: string | null;
  identity_photo_masked?: boolean | null;
};

type PeekPublicProfileRow = {
  ok?: boolean;
  identity_photo_path?: string | null;
};

const DEFAULT_SUPABASE_URL = "https://iyrpplpvggsdsubwmudw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_TV6S_N2Zp2bE6ew3U1LPKg_iiCMMam3";

export type PublicBlurbsFeedRuntimeEnv = PublicStorageSignRuntime;

/** **Returns** publishable Supabase URL + keys for server-side public blurbs feed (parity `JokuhSupabase.xcconfig`). */
export function resolvePublicBlurbsFeedEnv(
  env: Record<string, string | undefined>,
): PublicBlurbsFeedRuntimeEnv {
  const supabaseUrl = (
    env.VITE_SUPABASE_URL?.trim() ||
    env.SUPABASE_URL?.trim() ||
    DEFAULT_SUPABASE_URL
  ).replace(/\/$/, "");
  const supabaseAnonKey =
    env.VITE_SUPABASE_ANON_KEY?.trim() ||
    env.SUPABASE_ANON_KEY?.trim() ||
    DEFAULT_SUPABASE_ANON_KEY;
  const supabaseServiceKey =
    env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    env.SUPABASE_SERVICE_KEY?.trim() ||
    null;
  return { supabaseUrl, supabaseAnonKey, supabaseServiceKey };
}

function getSitemapUrl(supabaseUrl: string): string {
  return `${supabaseUrl}/functions/v1/blurbs-sitemap`;
}

function rpcUrl(supabaseUrl: string, fn: string): string {
  return `${supabaseUrl}/rest/v1/rpc/${fn}`;
}

type PublicBlurbShareDraft = PublicBlurbFeedItem & {
  imageObjectPath: string | null;
  posterObjectPath: string | null;
  identityPhotoPath: string | null;
};

/** **Calls** anon-safe `peek_public_profile` to resolve `identity_photo_path` for avatar signing. */
async function fetchIdentityPhotoPathForUsername(
  username: string,
  runtime: PublicBlurbsFeedRuntimeEnv,
): Promise<string | null> {
  const u = username.trim().toLowerCase();
  if (!u) return null;
  const response = await fetch(rpcUrl(runtime.supabaseUrl, "peek_public_profile"), {
    method: "POST",
    headers: {
      apikey: runtime.supabaseAnonKey,
      Authorization: `Bearer ${runtime.supabaseAnonKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ p_username: u }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  const row = (Array.isArray(data) ? data[0] : data) as PeekPublicProfileRow | undefined;
  if (row?.ok === false) return null;
  return row?.identity_photo_path?.trim() || null;
}

/** **Loads** one public blurb via anon RPC (parity `jokuh-blurbs-api.ts` `fetchPublicBlurbShare`). */
async function fetchPublicBlurbShareServer(
  slug: string,
  username: string,
  runtime: PublicBlurbsFeedRuntimeEnv,
): Promise<PublicBlurbShareDraft | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!/^[a-f0-9]{12}$/.test(normalizedSlug)) return null;
  const trimmedUsername = username.trim();
  const response = await fetch(rpcUrl(runtime.supabaseUrl, "get_public_blurb_share"), {
    method: "POST",
    headers: {
      apikey: runtime.supabaseAnonKey,
      Authorization: `Bearer ${runtime.supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_slug: normalizedSlug,
      p_username: trimmedUsername || null,
    }),
  });
  if (!response.ok) return null;
  const row = (await response.json()) as PublicBlurbShareRpcRow | null;
  if (!row?.id || !row.public_slug || !row.username) return null;
  const bodyText = (row.body_text ?? "").trim();
  const imageObjectPath = row.image_object_path?.trim() || null;
  const posterObjectPath = row.poster_object_path?.trim() || null;
  const hasMedia = Boolean(row.has_media) || Boolean(imageObjectPath);
  if (!bodyText && !hasMedia) return null;
  return {
    id: row.id,
    bodyText: bodyText || (hasMedia ? "Shared a moment" : ""),
    createdAt: row.created_at ?? new Date().toISOString(),
    username: row.username,
    displayName: (row.display_name ?? row.username).trim() || row.username,
    publicSlug: row.public_slug,
    hasMedia,
    mediaKind: normalizePublicBlurbMediaKind(row.media_kind),
    avatarUrl: null,
    mediaUrl: null,
    posterUrl: null,
    imageObjectPath,
    posterObjectPath,
    identityPhotoPath: row.identity_photo_path?.trim() || null,
  };
}

/** **Signs** author avatars + primary media attachments for public blurb cards. */
async function enrichPublicBlurbItems(
  drafts: PublicBlurbShareDraft[],
  runtime: PublicBlurbsFeedRuntimeEnv,
): Promise<PublicBlurbFeedItem[]> {
  const identityPathByUsername = new Map<string, string | null>();

  for (const draft of drafts) {
    const usernameKey = draft.username.trim().toLowerCase();
    if (!usernameKey || identityPathByUsername.has(usernameKey)) continue;
    identityPathByUsername.set(usernameKey, draft.identityPhotoPath);
  }

  const usernamesNeedingPeek = Array.from(identityPathByUsername.entries())
    .filter(([, path]) => !path)
    .map(([username]) => username);

  await Promise.all(
    usernamesNeedingPeek.map(async (username) => {
      const path = await fetchIdentityPhotoPathForUsername(username, runtime);
      identityPathByUsername.set(username, path);
    }),
  );

  const avatarUrlByUsername = new Map<string, string | null>();
  await Promise.all(
    Array.from(identityPathByUsername.keys()).map(async (username) => {
      const path = identityPathByUsername.get(username) ?? null;
      const url = await signedIdentityPhotoUrl(path, runtime);
      avatarUrlByUsername.set(username, url);
    }),
  );

  return Promise.all(
    drafts.map(async (draft) => {
      const usernameKey = draft.username.trim().toLowerCase();
      const avatarUrl = avatarUrlByUsername.get(usernameKey) ?? null;
      let mediaUrl: string | null = null;
      let posterUrl: string | null = null;

      if (draft.imageObjectPath) {
        mediaUrl = await signedBlurbsMediaUrl(draft.imageObjectPath, runtime);
      }
      if (draft.posterObjectPath) {
        posterUrl = await signedBlurbsMediaUrl(draft.posterObjectPath, runtime);
      }

      const { imageObjectPath: _image, posterObjectPath: _poster, identityPhotoPath: _photo, ...item } = draft;
      return {
        ...item,
        avatarUrl,
        mediaUrl,
        posterUrl: posterUrl ?? (draft.mediaKind === "image" ? mediaUrl : posterUrl),
      };
    }),
  );
}

/**
 * **Fetches** recent public blurbs server-side (avoids browser CORS on `blurbs-sitemap`).
 * **Data path:** `blurbs-sitemap` Edge → `get_public_blurb_share` RPC per slug → signed avatars/media.
 */
export async function fetchPublicBlurbsFeedServer(
  limit: number,
  runtime: PublicBlurbsFeedRuntimeEnv,
): Promise<PublicBlurbsFeedResult> {
  try {
    const sitemapResponse = await fetch(getSitemapUrl(runtime.supabaseUrl), {
      headers: { Accept: "application/xml,text/xml" },
    });
    if (!sitemapResponse.ok) {
      throw new Error(`sitemap ${sitemapResponse.status}`);
    }
    const xml = await sitemapResponse.text();
    const targets = parsePublicBlurbSitemap(xml).slice(0, Math.max(limit * 2, 40));
    const drafts: PublicBlurbShareDraft[] = [];

    const batchSize = 6;
    for (let index = 0; index < targets.length && drafts.length < limit; index += batchSize) {
      const batch = targets.slice(index, index + batchSize);
      const resolved = await Promise.all(
        batch.map((entry) => fetchPublicBlurbShareServer(entry.slug, entry.username, runtime)),
      );
      for (const item of resolved) {
        if (item) drafts.push(item);
        if (drafts.length >= limit) break;
      }
    }

    if (drafts.length > 0) {
      const items = await enrichPublicBlurbItems(drafts, runtime);
      return { items, source: "live" };
    }
    return {
      items: LANDING_PUBLIC_BLURBS_FALLBACK,
      source: "fallback",
      error: "No public blurbs resolved",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    return {
      items: LANDING_PUBLIC_BLURBS_FALLBACK,
      source: "fallback",
      error: message,
    };
  }
}

/** **Handles** GET `/api/public-blurbs-feed` for Railway server and tests. */
export async function handlePublicBlurbsFeedRequest(
  request: Request,
  runtime: PublicBlurbsFeedRuntimeEnv,
): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  const url = new URL(request.url);
  const limitRaw = url.searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitRaw) || 24, 1), 48);
  const result = await fetchPublicBlurbsFeedServer(limit, runtime);
  return Response.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=120, stale-while-revalidate=300",
    },
  });
}
