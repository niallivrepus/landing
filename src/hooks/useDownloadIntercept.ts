import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { DownloadIntentId } from "../data/download-intents";

export type DownloadInterceptExtras = {
  product?: string;
  ref?: string;
  surface?: string;
};

/**
 * **Purpose:** Routes immersive dummy UI clicks to the Download Jokuh sheet (`/?get=1`); the old `/download` page is gone.
 * **Connects to:** `DownloadPage`, product shells, `ClaimIdentityCta`.
 */
export function useDownloadIntercept(defaultSurface?: string) {
  const navigate = useNavigate();

  const buildHref = useCallback(
    (intent: DownloadIntentId, extras?: DownloadInterceptExtras) => {
      void intent;
      void extras;
      // The old /download page is gone: every hand-off opens the Download Jokuh sheet on the homepage.
      return "/?get=1";
    },
    [defaultSurface],
  );

  const intercept = useCallback(
    (intent: DownloadIntentId, extras?: DownloadInterceptExtras) => {
      navigate(buildHref(intent, extras));
    },
    [navigate, buildHref],
  );

  return { intercept, buildHref };
}
