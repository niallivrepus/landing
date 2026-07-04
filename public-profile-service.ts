import { parsePublicBlurbSitemap } from "./public-blurbs-feed-shared";
import { signedIdentityPhotoUrl } from "./public-storage-sign-service";
import {
  LANDING_PROFILE_DEMO_FALLBACK,
  PROFILE_DEMO_USERNAME,
  PROFILE_DEMO_USERNAME_POOL,
  type ProfileDemoNetworkPeer,
  type PublicProfileDemoData,
  type PublicProfileDemoResult,
} from "./public-profile-demo-shared";

const DEFAULT_SUPABASE_URL = "https://iyrpplpvggsdsubwmudw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_TV6S_N2Zp2bE6ew3U1LPKg_iiCMMam3";

const NETWORK_PREVIEW_PEER_CAP = 8;

type PeekRow = {
  ok?: boolean;
  error_message?: string | null;
  account_id?: string | null;
  username?: string | null;
  display_name?: string | null;
  biography_text?: string | null;
  identity_photo_path?: string | null;
  identity_photo_masked?: boolean | null;
  profile_shows_extended_public_page?: boolean | null;
  active_profile_live_session_id?: string | null;
};

type ConnectionRequestRow = {
  requester_id?: string;
  addressee_id?: string;
};

type AccountRow = {
  id?: string;
  display_name?: string | null;
  username?: string | null;
  identity_photo_path?: string | null;
};

type PublicBlurbShareRpcRow = {
  body_text?: string;
};

export type PublicProfileDemoRuntimeEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string | null;
};

/** **Returns** Supabase URL, anon key, and optional service role for server-side profile demo fetch. */
export function resolvePublicProfileDemoEnv(
  env: Record<string, string | undefined>,
): PublicProfileDemoRuntimeEnv {
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

function rpcUrl(supabaseUrl: string, fn: string): string {
  return `${supabaseUrl}/rest/v1/rpc/${fn}`;
}

function restUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl}/rest/v1/${path}`;
}

/** **Calls** anon-safe `peek_public_profile` RPC for one vanity username. */
async function fetchPeekPublicProfileServer(
  username: string,
  runtime: PublicProfileDemoRuntimeEnv,
): Promise<PeekRow | null> {
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
  const row = (Array.isArray(data) ? data[0] : data) as PeekRow | undefined;
  return row ?? null;
}

/** **Loads** the latest public blurb body for [username] via sitemap + `get_public_blurb_share`. */
async function fetchLatestPublicBlurbForUsername(
  username: string,
  runtime: PublicProfileDemoRuntimeEnv,
): Promise<string | null> {
  const target = username.trim().toLowerCase();
  if (!target) return null;
  try {
    const sitemapResponse = await fetch(`${runtime.supabaseUrl}/functions/v1/blurbs-sitemap`, {
      headers: { Accept: "application/xml,text/xml" },
    });
    if (!sitemapResponse.ok) return null;
    const xml = await sitemapResponse.text();
    const entry = parsePublicBlurbSitemap(xml).find((row) => row.username.toLowerCase() === target);
    if (!entry) return null;
    const response = await fetch(rpcUrl(runtime.supabaseUrl, "get_public_blurb_share"), {
      method: "POST",
      headers: {
        apikey: runtime.supabaseAnonKey,
        Authorization: `Bearer ${runtime.supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_slug: entry.slug,
        p_username: entry.username,
      }),
    });
    if (!response.ok) return null;
    const row = (await response.json()) as PublicBlurbShareRpcRow | null;
    const body = (row?.body_text ?? "").trim();
    return body || null;
  } catch {
    return null;
  }
}

/** **Queries** accepted connections + peer accounts for marketing network strip (service role only). */
async function fetchNetworkPreviewServer(
  accountId: string,
  runtime: PublicProfileDemoRuntimeEnv,
): Promise<{ connectionCount: number; peers: ProfileDemoNetworkPeer[] }> {
  if (!runtime.supabaseServiceKey) {
    return { connectionCount: 0, peers: [] };
  }
  const id = accountId.trim().toLowerCase();
  const headers = {
    apikey: runtime.supabaseServiceKey,
    Authorization: `Bearer ${runtime.supabaseServiceKey}`,
    Accept: "application/json",
  };

  const connectionsResponse = await fetch(
    restUrl(
      runtime.supabaseUrl,
      `connection_requests?status=eq.accepted&or=(requester_id.eq.${id},addressee_id.eq.${id})&select=requester_id,addressee_id,updated_at&order=updated_at.desc&limit=72`,
    ),
    { headers },
  );
  if (!connectionsResponse.ok) {
    return { connectionCount: 0, peers: [] };
  }
  const connections = (await connectionsResponse.json()) as ConnectionRequestRow[];
  const peerIds: string[] = [];
  for (const row of connections ?? []) {
    const requester = row.requester_id?.trim().toLowerCase();
    const addressee = row.addressee_id?.trim().toLowerCase();
    const peer = requester === id ? addressee : requester;
    if (peer && peer !== id && !peerIds.includes(peer)) {
      peerIds.push(peer);
    }
  }
  const connectionCount = peerIds.length;
  const previewIds = peerIds.slice(0, NETWORK_PREVIEW_PEER_CAP);
  if (previewIds.length === 0) {
    return { connectionCount, peers: [] };
  }

  const accountsResponse = await fetch(
    restUrl(
      runtime.supabaseUrl,
      `accounts?id=in.(${previewIds.join(",")})&select=id,display_name,username,identity_photo_path`,
    ),
    { headers },
  );
  if (!accountsResponse.ok) {
    return { connectionCount, peers: [] };
  }
  const accounts = (await accountsResponse.json()) as AccountRow[];
  const accountById = new Map<string, AccountRow>();
  for (const account of accounts ?? []) {
    const key = account.id?.trim().toLowerCase();
    if (key) accountById.set(key, account);
  }

  const peers: ProfileDemoNetworkPeer[] = [];
  for (const peerId of previewIds) {
    const account = accountById.get(peerId);
    const displayName =
      (account?.display_name ?? account?.username ?? peerId.slice(0, 8)).trim() ||
      peerId.slice(0, 8);
    const avatarUrl = await signedIdentityPhotoUrl(account?.identity_photo_path, runtime);
    peers.push({ userId: peerId, displayName, avatarUrl });
  }
  return { connectionCount, peers };
}

function mapPeekToProfile(
  row: PeekRow,
  extras: {
    avatarUrl: string | null;
    latestBlurbText: string | null;
    connectionCount: number;
    networkPeers: ProfileDemoNetworkPeer[];
  },
): PublicProfileDemoData | null {
  if (!row.ok || !row.account_id) return null;
  const username = (row.username ?? "").trim().toLowerCase();
  const displayName = (row.display_name ?? username).trim() || username;
  return {
    accountId: row.account_id.trim().toLowerCase(),
    username,
    displayName,
    biographyText: (row.biography_text ?? "").trim(),
    avatarUrl: extras.avatarUrl,
    identityPhotoMasked: row.identity_photo_masked === true,
    activeProfileLiveSessionId: row.active_profile_live_session_id?.trim().toLowerCase() || null,
    latestBlurbText: extras.latestBlurbText,
    connectionCount: extras.connectionCount,
    networkPeers: extras.networkPeers,
  };
}

/** **Fetches** one real profile + network preview for the landing demo pod. */
export async function fetchPublicProfileDemoServer(
  rawUsername: string | undefined,
  runtime: PublicProfileDemoRuntimeEnv,
): Promise<PublicProfileDemoResult> {
  const candidates = rawUsername?.trim()
    ? [rawUsername.trim().toLowerCase()]
    : [PROFILE_DEMO_USERNAME, ...PROFILE_DEMO_USERNAME_POOL.filter((u) => u !== PROFILE_DEMO_USERNAME)];

  for (const username of candidates) {
    try {
      const peek = await fetchPeekPublicProfileServer(username, runtime);
      if (!peek?.ok || !peek.account_id) continue;

      const accountId = peek.account_id.trim().toLowerCase();
      const [avatarUrl, latestBlurbText, network] = await Promise.all([
        signedIdentityPhotoUrl(peek.identity_photo_path, runtime),
        fetchLatestPublicBlurbForUsername(username, runtime),
        fetchNetworkPreviewServer(accountId, runtime),
      ]);

      const profile = mapPeekToProfile(peek, {
        avatarUrl,
        latestBlurbText,
        connectionCount: network.connectionCount,
        networkPeers: network.peers,
      });
      if (profile) {
        return { profile, source: "live" };
      }
    } catch {
      /* try next candidate */
    }
  }

  return {
    profile: { ...LANDING_PROFILE_DEMO_FALLBACK },
    source: "fallback",
    error: "Could not load a live profile demo.",
  };
}

/** **Handles** GET `/api/public-profile-demo?username=` for Railway server and tests. */
export async function handlePublicProfileDemoRequest(
  request: Request,
  runtime: PublicProfileDemoRuntimeEnv,
): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  const url = new URL(request.url);
  const username = url.searchParams.get("username") ?? undefined;
  const result = await fetchPublicProfileDemoServer(username, runtime);
  return Response.json(result, {
    status: 200,
    headers: { "Cache-Control": "private, no-store" },
  });
}
