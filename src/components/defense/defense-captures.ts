import { useEffect, useState } from "react";
import type { DefenseCaptureSurface } from "../../data/defense";

/**
 * **Purpose:** Loads `/defense/captures/manifest.json` — the real-app recordings the `/defense` doc embeds — once,
 * and picks the theme-matched files per surface. The recordings are the app's `/demo?scenario=team` (the civilian
 * "Field Team North" demo team, real components); re-record with
 * `scripts/capture-app-demo.mjs --scenario team --out public/defense/captures --surfaces signin,drawer,texts,calls,spine,docs,oo,id`
 * (signin and drawer dark only) and the page follows.
 * **Connects to:** `DefenseCapture`, `DefenseCapabilities`, `scripts/capture-app-demo.mjs`.
 */

export type DefenseCaptureFiles = {
  webm?: string;
  mp4?: string;
  poster?: string;
  size?: { width: number; height: number };
  scenario?: string;
};

type Manifest = {
  surfaces: Partial<Record<DefenseCaptureSurface, { dark?: DefenseCaptureFiles; light?: DefenseCaptureFiles }>>;
};

const MANIFEST_URL = "/defense/captures/manifest.json";
let manifestPromise: Promise<Manifest | null> | null = null;
let manifestCache: Manifest | null | undefined;

function loadManifest(): Promise<Manifest | null> {
  manifestPromise ??= fetch(MANIFEST_URL, { headers: { Accept: "application/json" } })
    .then((response) => (response.ok ? (response.json() as Promise<Manifest>) : null))
    .catch(() => null)
    .then((manifest) => {
      manifestCache = manifest;
      return manifest;
    });
  return manifestPromise;
}

/** Kick the manifest off as soon as the page chunk loads, so posters can paint with the first frame. */
if (typeof window !== "undefined") void loadManifest();

function pick(manifest: Manifest | null | undefined, surface: DefenseCaptureSurface, light: boolean) {
  const entry = manifest?.surfaces[surface];
  return (light ? entry?.light ?? entry?.dark : entry?.dark ?? entry?.light) ?? null;
}

/** `undefined` while loading, `null` when the surface has no recording. */
export function useDefenseCapture(surface: DefenseCaptureSurface, light: boolean): DefenseCaptureFiles | null | undefined {
  const [files, setFiles] = useState<DefenseCaptureFiles | null | undefined>(() =>
    manifestCache === undefined ? undefined : pick(manifestCache, surface, light),
  );
  useEffect(() => {
    let cancelled = false;
    void loadManifest().then((manifest) => {
      if (!cancelled) setFiles(pick(manifest, surface, light));
    });
    return () => {
      cancelled = true;
    };
  }, [light, surface]);
  return files;
}
