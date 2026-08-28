import { useEffect } from "react";
import { SITE_DOCUMENT_TITLE } from "../data/landing-hero-copy";

/**
 * Default `document.title` when a route does not pass a page-specific title.
 * Matches `index.html` `<title>` / `og:title` and `SITE_DOCUMENT_TITLE`.
 */
export const DEFAULT_SITE_TITLE = SITE_DOCUMENT_TITLE;

/**
 * Sets the browser tab title for the current marketing route.
 * Omitting `title` keeps the canonical homepage / site title so new pages
 * do not fall back to a stale Vite or host default.
 */
export function useDocumentTitle(title: string = DEFAULT_SITE_TITLE) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
