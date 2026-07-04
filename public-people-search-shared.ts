/**
 * **Purpose:** Shared types for marketing-site people discovery search.
 * **Connects to:** `public-people-search-service.ts`, `src/lib/public-people-search.ts`.
 * **Backend parity:** `public.search_accounts` RPC (`20260426020000_accounts_search_indexes_and_rpc.sql`).
 */

/** One row from global people search — public profile fields only. */
export type PublicPeopleSearchItem = {
  id: string;
  username: string;
  displayName: string;
  biographyText: string;
  avatarUrl: string | null;
};

export type PublicPeopleSearchResult = {
  items: PublicPeopleSearchItem[];
  source: "live" | "unavailable";
  error?: string;
};

/** **Normalizes** a raw query string the same way the app RPC sanitizes input. */
export function normalizePeopleSearchQuery(raw: string): string {
  return raw.trim().toLowerCase().replace(/[%_\\]/g, "");
}
