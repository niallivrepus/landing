import { useEffect, useState } from "react";
import {
  fetchPublicPeopleSearch,
  normalizePeopleSearchQuery,
  type PublicPeopleSearchItem,
  type PublicPeopleSearchResult,
} from "../lib/public-people-search";

/** Debounce aligned with Add Friend / Call sheet (`add-friend-sheet.swift`, `AddFriendSheet.tsx`). */
const SEARCH_DEBOUNCE_MS = 320;

/**
 * **Purpose:** Debounced people search for the Profile immersive shell.
 * **Connects to:** `ProfilePeopleSearchPanel`, `fetchPublicPeopleSearch`.
 */
export function usePublicPeopleSearch(query: string) {
  const [items, setItems] = useState<PublicPeopleSearchItem[]>([]);
  const [source, setSource] = useState<PublicPeopleSearchResult["source"]>("live");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const normalized = normalizePeopleSearchQuery(query);
    if (normalized.length < 2) {
      setItems([]);
      setLoading(false);
      setError(undefined);
      setSource("live");
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = window.setTimeout(() => {
      void (async () => {
        const result = await fetchPublicPeopleSearch(normalized);
        if (cancelled) return;
        setItems(result.items);
        setSource(result.source);
        setError(result.error);
        setLoading(false);
      })();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  return { items, source, loading, error };
}
