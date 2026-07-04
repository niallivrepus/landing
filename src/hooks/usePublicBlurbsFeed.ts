import { useEffect, useState } from "react";
import {
  fetchPublicBlurbsFeed,
  type PublicBlurbFeedItem,
  type PublicBlurbsFeedResult,
} from "../lib/public-blurbs-feed";

/**
 * **Purpose:** Loads the marketing-site public Blurbs feed once on mount.
 * **Connects to:** `PublicBlurbsFeed`, `fetchPublicBlurbsFeed`.
 */
export function usePublicBlurbsFeed(limit = 24) {
  const [items, setItems] = useState<PublicBlurbFeedItem[]>([]);
  const [source, setSource] = useState<PublicBlurbsFeedResult["source"]>("fallback");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const result = await fetchPublicBlurbsFeed(limit);
      if (cancelled) return;
      setItems(result.items);
      setSource(result.source);
      setError(result.error);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { items, source, loading, error };
}
