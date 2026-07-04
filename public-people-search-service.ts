import {
  normalizePeopleSearchQuery,
  type PublicPeopleSearchItem,
  type PublicPeopleSearchResult,
} from "./public-people-search-shared";
import {
  signedIdentityPhotoUrl,
  type PublicStorageSignRuntime,
} from "./public-storage-sign-service";

const DEFAULT_SUPABASE_URL = "https://iyrpplpvggsdsubwmudw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_TV6S_N2Zp2bE6ew3U1LPKg_iiCMMam3";

type SearchAccountsRpcRow = {
  id?: string;
  username?: string;
  display_name?: string | null;
  biography_text?: string | null;
  identity_photo_path?: string | null;
};

export type PublicPeopleSearchRuntimeEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
};

function toStorageRuntime(runtime: PublicPeopleSearchRuntimeEnv): PublicStorageSignRuntime {
  return {
    supabaseUrl: runtime.supabaseUrl,
    supabaseAnonKey: runtime.supabaseAnonKey,
    supabaseServiceKey: runtime.supabaseServiceKey,
  };
}

/**
 * **Returns** Supabase URL + service role key for server-side `search_accounts` RPC.
 * **Side effects:** none — callers must never expose the service key to the browser.
 */
export function resolvePublicPeopleSearchEnv(
  env: Record<string, string | undefined>,
): PublicPeopleSearchRuntimeEnv | null {
  const supabaseUrl =
    env.VITE_SUPABASE_URL?.trim() ||
    env.SUPABASE_URL?.trim() ||
    DEFAULT_SUPABASE_URL;
  const supabaseServiceKey =
    env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    env.SUPABASE_SERVICE_KEY?.trim() ||
    "";
  if (!supabaseServiceKey) return null;
  const supabaseAnonKey =
    env.VITE_SUPABASE_ANON_KEY?.trim() ||
    env.SUPABASE_ANON_KEY?.trim() ||
    DEFAULT_SUPABASE_ANON_KEY;
  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    supabaseAnonKey,
    supabaseServiceKey,
  };
}

function getSearchRpcUrl(supabaseUrl: string): string {
  return `${supabaseUrl}/rest/v1/rpc/search_accounts`;
}

function mapRpcRow(row: SearchAccountsRpcRow): Omit<PublicPeopleSearchItem, "avatarUrl"> | null {
  const id = row.id?.trim().toLowerCase();
  const username = row.username?.trim().toLowerCase();
  if (!id || !username) return null;
  const displayName = (row.display_name ?? username).trim() || username;
  return {
    id,
    username,
    displayName,
    biographyText: (row.biography_text ?? "").trim(),
  };
}

async function attachSignedAvatars(
  rows: Omit<PublicPeopleSearchItem, "avatarUrl">[],
  rpcRows: SearchAccountsRpcRow[],
  runtime: PublicPeopleSearchRuntimeEnv,
): Promise<PublicPeopleSearchItem[]> {
  const storage = toStorageRuntime(runtime);
  return Promise.all(
    rows.map(async (item, index) => {
      const photoPath = rpcRows[index]?.identity_photo_path?.trim() || null;
      const avatarUrl = await signedIdentityPhotoUrl(photoPath, storage);
      return { ...item, avatarUrl };
    }),
  );
}

/**
 * **Queries** `public.search_accounts` with the service role (anon/authenticated cannot execute).
 * **Inputs:** normalized query (min 2 chars). **Outputs:** up to 24 public profile rows.
 */
export async function fetchPublicPeopleSearchServer(
  rawQuery: string,
  runtime: PublicPeopleSearchRuntimeEnv,
): Promise<PublicPeopleSearchResult> {
  const query = normalizePeopleSearchQuery(rawQuery);
  if (query.length < 2) {
    return { items: [], source: "live" };
  }

  try {
    const response = await fetch(getSearchRpcUrl(runtime.supabaseUrl), {
      method: "POST",
      headers: {
        apikey: runtime.supabaseServiceKey,
        Authorization: `Bearer ${runtime.supabaseServiceKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ p_query: query }),
    });

    if (!response.ok) {
      throw new Error(`search_accounts ${response.status}`);
    }

    const rows = (await response.json()) as SearchAccountsRpcRow[] | null;
    const mapped: Omit<PublicPeopleSearchItem, "avatarUrl">[] = [];
    const rpcRows: SearchAccountsRpcRow[] = [];
    for (const row of rows ?? []) {
      const item = mapRpcRow(row);
      if (item) {
        mapped.push(item);
        rpcRows.push(row);
      }
    }
    const items = await attachSignedAvatars(mapped, rpcRows, runtime);
    return { items, source: "live" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "search failed";
    return { items: [], source: "unavailable", error: message };
  }
}

/** **Handles** GET `/api/public-people-search?q=` for Railway server and tests. */
export async function handlePublicPeopleSearchRequest(
  request: Request,
  runtime: PublicPeopleSearchRuntimeEnv | null,
): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (!runtime) {
    return Response.json(
      {
        items: [],
        source: "unavailable",
        error: "People search is not configured on this host.",
      } satisfies PublicPeopleSearchResult,
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const result = await fetchPublicPeopleSearchServer(query, runtime);
  return Response.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
