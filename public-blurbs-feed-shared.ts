/** One public blurb row normalized for landing cards. */
export type PublicBlurbFeedItem = {
  id: string;
  bodyText: string;
  createdAt: string;
  username: string;
  displayName: string;
  publicSlug: string;
  hasMedia: boolean;
  mediaKind: "image" | "video" | "audio" | null;
  /** Signed `identity-photos` URL when service role or anon signing succeeds. */
  avatarUrl: string | null;
  /** Signed `blurbs-media` playback/thumbnail URL for the primary attachment. */
  mediaUrl: string | null;
  /** Signed poster/thumbnail for video blurbs. */
  posterUrl: string | null;
};

export type PublicBlurbsFeedResult = {
  items: PublicBlurbFeedItem[];
  /** `live` when sitemap + RPC succeeded; `fallback` when using bundled samples. */
  source: "live" | "fallback";
  error?: string;
};

/** **Parses** `/u/{username}/b/{slug}` entries from the public blurbs sitemap XML. */
export function parsePublicBlurbSitemap(xml: string): Array<{ username: string; slug: string }> {
  const entries: Array<{ username: string; slug: string }> = [];
  const pattern = /<loc>https?:\/\/[^/]+\/u\/([^/]+)\/b\/([a-f0-9]+)<\/loc>/gi;
  let match: RegExpExecArray | null = pattern.exec(xml);
  while (match) {
    entries.push({
      username: decodeURIComponent(match[1] ?? ""),
      slug: match[2] ?? "",
    });
    match = pattern.exec(xml);
  }
  return entries;
}

/** **Formats** ISO timestamps as compact relative labels (`2h`, `3d`, `Apr 4`). */
export function formatBlurbRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** **Normalizes** RPC `media_kind` strings into card render hints. */
export function normalizePublicBlurbMediaKind(
  raw: string | null | undefined,
): PublicBlurbFeedItem["mediaKind"] {
  const kind = (raw ?? "").trim().toLowerCase();
  if (kind === "video" || kind === "audio" || kind === "image") return kind;
  return null;
}

/** Bundled samples when live fetch is unavailable (signed-out feed RLS note in `jokuh-blurbs-api.ts`). */
export const LANDING_PUBLIC_BLURBS_FALLBACK: PublicBlurbFeedItem[] = [
  {
    id: "fallback-1",
    bodyText: "Your thinking is the product — capture it before it slips.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    username: "jokuh",
    displayName: "Jokuh",
    publicSlug: "000000000001",
    hasMedia: false,
    mediaKind: null,
    avatarUrl: null,
    mediaUrl: null,
    posterUrl: null,
  },
  {
    id: "fallback-2",
    bodyText: "Spine remembered the call. Blurbs remembered the spark.",
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    username: "jokuh",
    displayName: "Jokuh",
    publicSlug: "000000000002",
    hasMedia: false,
    mediaKind: null,
    avatarUrl: null,
    mediaUrl: null,
    posterUrl: null,
  },
  {
    id: "fallback-3",
    bodyText: "Posted from the corner pill. Found again in search.",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    username: "jokuh",
    displayName: "Jokuh",
    publicSlug: "000000000003",
    hasMedia: false,
    mediaKind: null,
    avatarUrl: null,
    mediaUrl: null,
    posterUrl: null,
  },
];
