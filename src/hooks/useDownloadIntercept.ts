import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { DownloadIntentId } from "../data/download-intents";

export type DownloadInterceptExtras = {
  product?: string;
  ref?: string;
  surface?: string;
};

/**
 * **Purpose:** Routes immersive dummy UI clicks to `/download` with contextual copy via search params.
 * **Connects to:** `DownloadPage`, product shells, `ClaimIdentityCta`.
 */
export function useDownloadIntercept(defaultSurface?: string) {
  const navigate = useNavigate();

  const buildHref = useCallback(
    (intent: DownloadIntentId, extras?: DownloadInterceptExtras) => {
      const params = new URLSearchParams({ intent });
      const surface = extras?.surface ?? defaultSurface;
      if (surface) params.set("surface", surface);
      if (extras?.product) params.set("product", extras.product);
      if (extras?.ref) params.set("ref", extras.ref);
      return `/download?${params.toString()}`;
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
