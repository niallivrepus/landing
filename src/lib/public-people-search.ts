/**
 * **Purpose:** Browser client for marketing-site people discovery search.
 * **Data path:** GET `/api/public-people-search` (server proxies `search_accounts`; RPC is auth-only).
 * **Connects to:** `ProfilePeopleSearchPanel`, `usePublicPeopleSearch`.
 */

export {
  normalizePeopleSearchQuery,
  type PublicPeopleSearchItem,
  type PublicPeopleSearchResult,
} from "../../public-people-search-shared";

import {
  normalizePeopleSearchQuery,
  type PublicPeopleSearchResult,
} from "../../public-people-search-shared";

const PUBLIC_PEOPLE_SEARCH_ENDPOINT =
  (import.meta.env.VITE_PUBLIC_PEOPLE_SEARCH_ENDPOINT as string | undefined)?.trim() ||
  "/api/public-people-search";

/** **Fetches** people search results via same-origin API route. */
export async function fetchPublicPeopleSearch(query: string): Promise<PublicPeopleSearchResult> {
  const normalized = normalizePeopleSearchQuery(query);
  if (normalized.length < 2) {
    return { items: [], source: "live" };
  }

  try {
    const url = `${PUBLIC_PEOPLE_SEARCH_ENDPOINT}?q=${encodeURIComponent(normalized)}`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const result = (await response.json()) as PublicPeopleSearchResult;
    if (result.source === "unavailable" && import.meta.env.DEV && result.error) {
      console.warn("[public-people-search]", result.error);
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    if (import.meta.env.DEV) {
      console.warn("[public-people-search]", message);
    }
    return { items: [], source: "unavailable", error: message };
  }
}
