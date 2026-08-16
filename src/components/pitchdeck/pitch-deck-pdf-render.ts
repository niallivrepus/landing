/**
 * @fileoverview Shared PDF.js rasterization for pitch deck UIs (`PitchDeckInlineViewer`,
 * `InteractivePitchDeck`). Produces blob-backed JPEG URLs per page; callers must revoke
 * those URLs on unmount to avoid memory leaks.
 */

let pitchDeckPdfjsLib: typeof import("pdfjs-dist") | null = null;
let pitchDeckPdfjsLoading: Promise<typeof import("pdfjs-dist")> | null = null;

export interface RenderedPitchDeckPage {
  pageNumber: number;
  imageUrl: string;
  width: number;
  height: number;
}

export interface RenderedPitchDeckDocument {
  pageCount: number;
  pages: RenderedPitchDeckPage[];
}

/** Default raster scale for the legacy vertical inline viewer (~960px wide pages). */
export const PITCH_DECK_INLINE_DEFAULT_SCALE = 1.35;

/** Longest canvas edge (px) when rasterizing with DPR; avoids GPU/memory blowups on huge PDF pages. */
const PITCH_DECK_MAX_RASTER_LONG_EDGE_PX = 6144;

/**
 * Reads `window.devicePixelRatio` for sharper slide bitmaps on HiDPI screens; returns 1 when
 * not in a browser (tests / SSR).
 */
function readDevicePixelRatio(): number {
  if (typeof window === "undefined") return 1;
  return Math.min(Math.max(window.devicePixelRatio || 1, 1), 2.5);
}

/**
 * Picks a PDF.js supersampling factor so logical slide size stays the same but bitmap resolution
 * tracks display density, clamped so `logicalW * pr` / `logicalH * pr` stays under the long-edge cap.
 */
function effectiveRasterPixelRatio(
  logicalViewportWidth: number,
  logicalViewportHeight: number,
  requestedDpr: number
): number {
  let pr = Math.min(Math.max(requestedDpr, 1), 2.5);
  const longEdge = Math.max(
    logicalViewportWidth * pr,
    logicalViewportHeight * pr,
    1
  );
  if (longEdge > PITCH_DECK_MAX_RASTER_LONG_EDGE_PX) {
    pr *= PITCH_DECK_MAX_RASTER_LONG_EDGE_PX / longEdge;
  }
  return Math.max(1, pr);
}

/**
 * Lazily load PDF.js and configure the worker once per session.
 */
export async function getPitchDeckPdfjs() {
  if (pitchDeckPdfjsLib) return pitchDeckPdfjsLib;
  if (pitchDeckPdfjsLoading) return pitchDeckPdfjsLoading;

  pitchDeckPdfjsLoading = import("pdfjs-dist").then((mod) => {
    pitchDeckPdfjsLib = mod;

    try {
      const workerUrl = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      );
      mod.GlobalWorkerOptions.workerSrc = workerUrl.href;
    } catch {
      mod.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${mod.version}/build/pdf.worker.min.mjs`;
    }

    return mod;
  });

  return pitchDeckPdfjsLoading;
}

/** Optional supersampling + JPEG tuning for `renderPitchDeckPage` (used by interactive decks). */
export type RenderPitchDeckPageRasterOptions = {
  /**
   * Multiplies PDF.js viewport scale so the canvas has more physical pixels than CSS layout
   * width; returned `width`/`height` stay logical CSS px so `<img width height>` stays unchanged.
   */
  pixelRatio?: number;
  /** JPEG quality 0–1; higher = less blockiness on text (larger blobs). */
  jpegQuality?: number;
};

/**
 * Renders one PDF page to a JPEG blob URL at the given logical viewport scale, optionally
 * supersampling by `pixelRatio` for Retina-class displays. Depends on DOM `canvas` + `document`.
 */
export async function renderPitchDeckPage(
  pdf: import("pdfjs-dist").PDFDocumentProxy,
  pageNumber: number,
  renderScale: number,
  rasterOpts?: RenderPitchDeckPageRasterOptions
): Promise<RenderedPitchDeckPage> {
  const page = await pdf.getPage(pageNumber);
  const pr = rasterOpts?.pixelRatio ?? 1;
  const viewport = page.getViewport({ scale: renderScale * pr });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", {
    alpha: false,
    willReadFrequently: false,
  });

  if (!context) {
    throw new Error("Could not create canvas context for pitch deck page");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context,
    viewport,
    canvas,
    intent: "display",
  }).promise;

  const jpegQ = rasterOpts?.jpegQuality ?? (pr > 1 ? 0.94 : 0.92);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", jpegQ);
  });

  canvas.width = 0;
  canvas.height = 0;

  if (!blob) {
    throw new Error("Pitch deck page render did not produce an image blob");
  }

  return {
    pageNumber,
    imageUrl: URL.createObjectURL(blob),
    width: viewport.width / pr,
    height: viewport.height / pr,
  };
}

export type RenderPitchDeckDocumentOptions = {
  /** Viewport scale passed to `page.getViewport({ scale })` for every page. */
  renderScale?: number;
};

/** Options for width-clamped deck rasterization (e.g. data-room horizontal rails). */
export type RenderPitchDeckDocumentAtMaxCssWidthOptions = {
  /** Stop after this many pages to bound memory/CPU on long PDFs; full `pageCount` is still returned. */
  maxPages?: number;
  /**
   * Invoked after each page finishes rasterizing with `{ pageCount, pages }` where `pages.length`
   * grows 1…n — lets `/pitchdeck` and `/deck` show the intro + first slide while heavier decks
   * finish in the background (`interactive-pitch-deck.tsx`, `interactive-deck.tsx`).
   */
  onPartialDocument?: (doc: RenderedPitchDeckDocument) => void;
};

/** Detects Git LFS pointer files accidentally deployed as static assets (common on hosts without LFS checkout). */
const GIT_LFS_POINTER_PREFIX = "version https://git-lfs.github.com/spec/v1";

/**
 * Fetches the PDF from `pdfUrl` (same-origin `/assets/...` or absolute CDN) and validates bytes before PDF.js.
 * Static hosts that ship the **LFS pointer text** instead of the binary make PDF.js throw "Invalid PDF structure";
 * this surfaces an actionable error instead.
 */
async function fetchPitchDeckPdfBytes(pdfUrl: string): Promise<Uint8Array> {
  const res = await fetch(pdfUrl, { credentials: "same-origin" });
  if (!res.ok) {
    throw new Error(`Could not fetch pitch deck PDF (HTTP ${res.status}).`);
  }
  const buf = await res.arrayBuffer();
  if (buf.byteLength < 8) {
    throw new Error("Pitch deck file is empty or truncated.");
  }
  const prefix = new TextDecoder("utf-8", { fatal: false })
    .decode(buf.slice(0, 80))
    .trimStart();
  if (prefix.startsWith(GIT_LFS_POINTER_PREFIX)) {
    throw new Error(
      "Pitch deck file on the server is a Git LFS pointer, not the real PDF. Check in the binary under `public/` or enable Git LFS on your deploy."
    );
  }
  const magic = new Uint8Array(buf.slice(0, 5));
  const sig = String.fromCharCode(
    magic[0]!,
    magic[1]!,
    magic[2]!,
    magic[3]!,
    magic[4]!
  );
  if (sig !== "%PDF-") {
    throw new Error(
      "Pitch deck download is not a PDF (often an HTML shell or login page). Verify `/assets/pitchdeck/…` in the network tab."
    );
  }
  return new Uint8Array(buf);
}

/**
 * PDF.js `getDocument` options shared by pitch deck loaders; uses in-memory `data` so we can pre-validate bytes.
 */
function pitchDeckGetDocumentParams(
  pdfjs: typeof import("pdfjs-dist"),
  pdfBytes: Uint8Array
) {
  return {
    data: pdfBytes,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
  } as const;
}

/**
 * Loads a pitch deck PDF and rasterizes every page to in-memory JPEG URLs.
 */
export async function renderPitchDeckDocument(
  pdfUrl: string,
  options?: RenderPitchDeckDocumentOptions
): Promise<RenderedPitchDeckDocument> {
  const renderScale = options?.renderScale ?? PITCH_DECK_INLINE_DEFAULT_SCALE;
  const pdfjs = await getPitchDeckPdfjs();
  const pdfBytes = await fetchPitchDeckPdfBytes(pdfUrl);
  const pdf = await pdfjs.getDocument(
    pitchDeckGetDocumentParams(pdfjs, pdfBytes)
  ).promise;
  const pages: RenderedPitchDeckPage[] = [];
  const firstPage = await pdf.getPage(1);
  const logicalVp = firstPage.getViewport({ scale: renderScale });
  const pr = effectiveRasterPixelRatio(
    logicalVp.width,
    logicalVp.height,
    readDevicePixelRatio()
  );
  const rasterOpts: RenderPitchDeckPageRasterOptions = {
    pixelRatio: pr,
    jpegQuality: pr > 1 ? 0.94 : 0.92,
  };

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    pages.push(
      await renderPitchDeckPage(pdf, pageNumber, renderScale, rasterOpts)
    );
  }

  return {
    pageCount: pdf.numPages,
    pages,
  };
}

/**
 * Rasterizes every page so the first page’s CSS width does not exceed `maxCssWidthPx`
 * (uses page 1’s unscaled width to pick one `renderScale` for the whole deck).
 */
export async function renderPitchDeckDocumentAtMaxCssWidth(
  pdfUrl: string,
  maxCssWidthPx: number,
  options?: RenderPitchDeckDocumentAtMaxCssWidthOptions
): Promise<RenderedPitchDeckDocument> {
  const pdfjs = await getPitchDeckPdfjs();
  const pdfBytes = await fetchPitchDeckPdfBytes(pdfUrl);
  const pdf = await pdfjs.getDocument(
    pitchDeckGetDocumentParams(pdfjs, pdfBytes)
  ).promise;
  const first = await pdf.getPage(1);
  const baseW = first.getViewport({ scale: 1 }).width;
  const renderScale = Math.min(maxCssWidthPx / baseW, 2);
  const logicalVp = first.getViewport({ scale: renderScale });
  const pr = effectiveRasterPixelRatio(
    logicalVp.width,
    logicalVp.height,
    readDevicePixelRatio()
  );
  const rasterOpts: RenderPitchDeckPageRasterOptions = {
    pixelRatio: pr,
    jpegQuality: pr > 1 ? 0.94 : 0.92,
  };
  const pages: RenderedPitchDeckPage[] = [];
  const limit =
    typeof options?.maxPages === "number" && options.maxPages > 0
      ? Math.min(pdf.numPages, Math.floor(options.maxPages))
      : pdf.numPages;

  for (let pageNumber = 1; pageNumber <= limit; pageNumber++) {
    pages.push(
      await renderPitchDeckPage(pdf, pageNumber, renderScale, rasterOpts)
    );
    options?.onPartialDocument?.({
      pageCount: pdf.numPages,
      pages: [...pages],
    });
  }

  return {
    pageCount: pdf.numPages,
    pages,
  };
}
