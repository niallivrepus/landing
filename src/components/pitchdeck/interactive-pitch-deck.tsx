/**
 * @fileoverview Horizontal scroll-snap deck for `/pitchdeck`: opens with the bundled
 * intro MP4 (`jokuh-agentic-operating-system.mp4`), then **Pitch Deck Jokuh 2026** PDF pages
 * rasterized via PDF.js (first page unlocks the UI, remaining pages stream in); maps vertical
 * wheel to horizontal scroll, minimap + arrows,
 * optional fullscreen, responsive layout for portrait and landscape mobile, and OS pinch /
 * Ctrl+wheel zoom (viewport meta relaxed for this route only; see `useDeckViewportZoomMeta`).
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

import {
  SLIDE_VIEWPORT_GUTTER_PX,
  useArtboardMaxCssWidthPx,
  useLayoutViewportWidthPx,
} from "./interactive-deck-viewport";
import {
  type RenderedPitchDeckDocument,
  renderPitchDeckDocumentAtMaxCssWidth,
} from "./pitch-deck-pdf-render";
import { useDeckViewportZoomMeta } from "./use-deck-viewport-zoom-meta";

/** Public asset path (served from `public/assets/`) for the 2026 investor deck PDF. */
const PITCH_DECK_2026_PDF_URL = "/assets/pitchdeck/jokuh-pitch-deck-2026.pdf";

/** Public asset path for the opening deck video (same dimensions as PDF slide 1 for layout parity). */
const PITCH_DECK_INTRO_VIDEO_URL = "/assets/pitchdeck/jokuh-agentic-operating-system.mp4";

/**
 * Full-viewport deck: injects page-level cursor/scrollbar styles while mounted (removed on unmount),
 * maps vertical wheel to horizontal scroll, and syncs minimap dots via `IntersectionObserver`.
 */
export default function InteractivePitchDeck() {
  useDeckViewportZoomMeta();
  const pdfUrl = PITCH_DECK_2026_PDF_URL;
  const introVideoUrl = PITCH_DECK_INTRO_VIDEO_URL;
  const artboardMaxCss = useArtboardMaxCssWidthPx();
  /**
   * Quantized width for PDF raster passes so `visualViewport` / resize jitter does not restart
   * a full multi-page `pdf.js` pass for 1–2px deltas (`interactive-deck-viewport.ts`).
   */
  const rasterLayoutMaxCssPx = useMemo(
    () => Math.round(artboardMaxCss / 32) * 32,
    [artboardMaxCss]
  );
  const layoutViewportW = useLayoutViewportWidthPx();
  const [doc, setDoc] = useState<RenderedPitchDeckDocument | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [smoothCursor, setSmoothCursor] = useState({ x: 0, y: 0 });
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  /**
   * Row height for a slide column from raster dimensions and current viewport (keeps labels aligned).
   */
  const computeDisplaySlideHeightPx = useCallback(
    (pageWidth: number, pageHeight: number) => {
      const w = Math.min(
        pageWidth,
        Math.max(280, layoutViewportW - SLIDE_VIEWPORT_GUTTER_PX)
      );
      return Math.max(1, Math.round((pageHeight * w) / pageWidth));
    },
    [layoutViewportW]
  );

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-pitchdeck-interactive", "true");
    styleEl.textContent = `
      * { cursor: none !important; }
      .pitchdeck-interactive__clickable { cursor: pointer !important; }
      body { overflow: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      ::selection { background: #FFFF02; color: #000; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const createdUrls: string[] = [];

    setLoading(true);
    setLoadError(null);
    setDoc(null);
    setActiveIndex(0);

    let trackedUrlCount = 0;

    void renderPitchDeckDocumentAtMaxCssWidth(pdfUrl, rasterLayoutMaxCssPx, {
      onPartialDocument: (partial) => {
        if (cancelled) return;
        for (; trackedUrlCount < partial.pages.length; trackedUrlCount += 1) {
          createdUrls.push(partial.pages[trackedUrlCount]!.imageUrl);
        }
        setDoc(partial);
        if (partial.pages.length >= 1) {
          setLoading(false);
        }
      },
    })
      .then((rendered) => {
        if (cancelled) {
          rendered.pages.forEach((p) => URL.revokeObjectURL(p.imageUrl));
          return;
        }
        setDoc(rendered);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) {
          createdUrls.forEach((u) => URL.revokeObjectURL(u));
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Could not load the pitch deck PDF.";
        setLoadError(message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      createdUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [pdfUrl, reloadToken, rasterLayoutMaxCssPx]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /**
   * Smooth cursor follow loop: pauses when the tab is hidden so we do not burn CPU/GPU
   * with continuous `setState` while the deck is not visible (see `document.visibilityState`).
   */
  useEffect(() => {
    let rafId: number | null = null;
    const tick = () => {
      if (document.visibilityState !== "visible") {
        rafId = null;
        return;
      }
      const speed = 0.25;
      smoothRef.current.x +=
        (cursorRef.current.x - smoothRef.current.x) * speed;
      smoothRef.current.y +=
        (cursorRef.current.y - smoothRef.current.y) * speed;
      setSmoothCursor({ x: smoothRef.current.x, y: smoothRef.current.y });
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return undefined;

    const handleWheel = (e: WheelEvent) => {
      /** Browser zoom (trackpad pinch / Ctrl+scroll): do not hijack the wheel event. */
      if (e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        slider.scrollBy({ left: e.deltaY * 3, behavior: "auto" });
      }
    };
    slider.addEventListener("wheel", handleWheel, { passive: false });
    return () => slider.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !doc) return undefined;

    const totalSlides = doc.pageCount + 1;
    const observers = Array.from({ length: totalSlides }, (_, index) => {
      const slideEl = slideRefs.current[index];
      if (!slideEl) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        { root: slider, rootMargin: "0px", threshold: 0.55 }
      );
      observer.observe(slideEl);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, [doc, layoutViewportW]);

  /**
   * Centers the selected slide in the horizontal scroller; targets the inner `article`
   * so `scroll-snap` alignment matches user clicks on the minimap.
   */
  const scrollToSlide = useCallback((index: number) => {
    const slideEl = slideRefs.current[index];
    if (!slideEl) return;
    const articleEl = slideEl.querySelector("article");
    articleEl?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, []);

  /**
   * Moves one slide forward or back using the latest active index from the intersection observer.
   */
  const goAdjacent = useCallback(
    (delta: number) => {
      if (!doc) return;
      const totalSlides = doc.pageCount + 1;
      const next = Math.max(
        0,
        Math.min(totalSlides - 1, activeIndexRef.current + delta)
      );
      scrollToSlide(next);
    },
    [doc, scrollToSlide]
  );

  useEffect(() => {
    if (!doc) return undefined;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goAdjacent(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goAdjacent(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doc, goAdjacent]);

  /**
   * Requests element fullscreen on the deck root (helps phones use the full display in landscape).
   */
  const enterDeckFullscreen = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const anyEl = el as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    const req =
      el.requestFullscreen?.bind(el) ?? anyEl.webkitRequestFullscreen?.bind(el);
    if (req) {
      void req().catch(() => {
        /* user denied or unsupported */
      });
    }
  }, []);

  const firstRaster = doc?.pages[0];
  const displaySlideW = firstRaster
    ? Math.min(
        firstRaster.width,
        Math.max(280, layoutViewportW - SLIDE_VIEWPORT_GUTTER_PX)
      )
    : layoutViewportW;
  const halfPad = `max(12px, calc(50vw - ${displaySlideW / 2}px))`;

  if (loading) {
    return (
      <div
        className="flex min-h-dvh w-full max-w-[100vw] flex-col items-center justify-center gap-4 text-[#111]"
        style={{
          backgroundColor: "rgb(237, 237, 237)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#111] border-t-transparent" />
        <p className="text-sm font-medium tracking-wide text-[#555]">
          Loading Pitch Deck Jokuh 2026…
        </p>
      </div>
    );
  }

  if (loadError || !doc) {
    return (
      <div
        className="flex min-h-dvh w-full max-w-[100vw] flex-col items-center justify-center gap-4 px-8 text-center text-[#111]"
        style={{
          backgroundColor: "rgb(237, 237, 237)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <p className="max-w-md text-lg font-medium">Could not load the deck</p>
        <p className="max-w-lg text-sm text-[#555]">{loadError}</p>
        <button
          type="button"
          className="pitchdeck-interactive__clickable rounded-full border border-[#111] bg-white px-6 py-2 text-sm font-medium text-[#111] transition-colors hover:bg-[#111] hover:text-white"
          onClick={() => setReloadToken((n) => n + 1)}
        >
          Retry
        </button>
      </div>
    );
  }

  const totalSlides = doc.pageCount + 1;
  const firstPage = doc.pages[0];
  const introSlideH = computeDisplaySlideHeightPx(
    firstPage.width,
    firstPage.height
  );
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < totalSlides - 1;

  return (
    <div
      ref={rootRef}
      className="pitchdeck-interactive-root relative flex min-h-dvh h-dvh w-full max-w-[100vw] flex-col overflow-hidden text-[#111]"
      style={{
        backgroundColor: "rgb(237, 237, 237)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <main
        ref={sliderRef}
        className="hide-scrollbar relative flex h-full min-h-0 w-full max-w-[100vw] flex-1 items-center overflow-x-auto overflow-y-hidden scroll-smooth [-webkit-overflow-scrolling:touch]"
        style={{
          scrollSnapType: "x mandatory",
          gap: "clamp(20px, 5vw, 96px)",
          overscrollBehavior: "contain",
          touchAction: "pan-x pinch-zoom",
        }}
      >
        <div style={{ flexShrink: 0, width: halfPad, height: "100%" }} />

        <div
          key="pitchdeck-intro-video"
          ref={(el) => {
            slideRefs.current[0] = el;
          }}
          data-index={0}
          className="flex max-w-[100vw] shrink-0 flex-col items-center justify-center px-2"
          style={{ height: `${introSlideH + 40}px` }}
        >
          <div
            className="pointer-events-none w-full max-w-[min(100%,calc(100vw-2rem))] select-none pl-2 text-[12px] tracking-wide text-[#888]"
            style={{
              height: "24px",
              marginBottom: "16px",
              userSelect: "none",
            }}
          >
            Intro — slide 1 of {totalSlides}
          </div>
          <article
            style={{
              width: `${firstPage.width}px`,
              maxWidth: "calc(100vw - 48px)",
              aspectRatio: `${firstPage.width} / ${firstPage.height}`,
              height: "auto",
              maxHeight: "min(86dvh, calc(100dvh - 140px))",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
            className="pitchdeck-interactive__clickable box-border shrink-0 snap-center overflow-hidden bg-black"
          >
            <video
              className="block h-full w-full object-contain"
              src={introVideoUrl}
              controls
              playsInline
              preload="metadata"
              aria-label="Jokuh: The Agentic Operating System — intro video"
            />
          </article>
        </div>

        {Array.from({ length: doc.pageCount }, (_, pdfIndex) => {
          const page = doc.pages[pdfIndex];
          const slideIndex = pdfIndex + 1;
          const dims = page ?? firstPage;
          const slideH =
            computeDisplaySlideHeightPx(dims.width, dims.height) + 40;
          return (
            <div
              key={
                page ? `pdf-${page.pageNumber}` : `pdf-pending-${slideIndex}`
              }
              ref={(el) => {
                slideRefs.current[slideIndex] = el;
              }}
              data-index={slideIndex}
              className="flex max-w-[100vw] shrink-0 flex-col items-center justify-center px-2"
              style={{ height: `${slideH}px` }}
            >
              <div
                className="pointer-events-none w-full max-w-[min(100%,calc(100vw-2rem))] select-none pl-2 text-[12px] tracking-wide text-[#888]"
                style={{
                  height: "24px",
                  marginBottom: "16px",
                  userSelect: "none",
                }}
              >
                Page {pdfIndex + 1} of {doc.pageCount} — slide {slideIndex + 1}{" "}
                of {totalSlides}
              </div>
              <article
                style={{
                  width: `${dims.width}px`,
                  maxWidth: "calc(100vw - 48px)",
                  aspectRatio: `${dims.width} / ${dims.height}`,
                  height: "auto",
                  maxHeight: "min(86dvh, calc(100dvh - 140px))",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
                className={
                  page
                    ? "pointer-events-none box-border shrink-0 snap-center overflow-hidden bg-white"
                    : "pointer-events-none box-border flex shrink-0 snap-center items-center justify-center overflow-hidden bg-[#e8e8e8]"
                }
              >
                {page ? (
                  <img
                    src={page.imageUrl}
                    alt={`Pitch Deck Jokuh 2026 — page ${page.pageNumber}`}
                    width={page.width}
                    height={page.height}
                    className="block h-full w-full object-contain"
                    loading={pdfIndex < 1 ? "eager" : "lazy"}
                    draggable={false}
                  />
                ) : (
                  <p className="px-4 text-center text-[11px] font-medium tracking-wide text-[#888]">
                    Preparing slide {pdfIndex + 1}…
                  </p>
                )}
              </article>
            </div>
          );
        })}

        <div style={{ flexShrink: 0, width: halfPad, height: "100%" }} />
      </main>

      <header className="pointer-events-none fixed left-0 top-[max(3rem,env(safe-area-inset-top))] z-[100] flex w-full justify-center px-2">
        <div className="pointer-events-auto flex max-w-[min(96vw,920px)] flex-wrap justify-center gap-1">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index === 0 ? "intro-video" : `slide-${index}`}
              type="button"
              aria-label={
                index === 0
                  ? `Intro video, slide 1 of ${totalSlides}`
                  : `Deck page ${doc.pages[index - 1]?.pageNumber ?? index}, slide ${index + 1} of ${totalSlides}`
              }
              aria-current={activeIndex === index ? "true" : undefined}
              onClick={() => scrollToSlide(index)}
              className="pitchdeck-interactive__clickable flex min-h-9 min-w-6 items-center justify-center border-0 bg-transparent p-0"
            >
              {activeIndex === index ? (
                <span
                  className="border-[1.5px] border-[#888] transition-all duration-300"
                  style={{ width: "20px", height: "8px" }}
                />
              ) : (
                <span
                  className="bg-[#C4C4C4] transition-all duration-300"
                  style={{ width: "1px", height: "8px" }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="pointer-events-none fixed inset-y-0 left-0 z-[120] flex w-14 items-center justify-center sm:w-16">
        <button
          type="button"
          aria-label="Previous slide"
          disabled={!canPrev}
          onClick={() => goAdjacent(-1)}
          className="pitchdeck-interactive__clickable pointer-events-auto flex h-24 w-12 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#111] shadow-md backdrop-blur-sm transition-opacity disabled:pointer-events-none disabled:opacity-25 sm:h-28 sm:w-14"
        >
          <ChevronLeft
            className="h-8 w-8 sm:h-10 sm:w-10"
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      </div>

      <div className="pointer-events-none fixed inset-y-0 right-0 z-[120] flex w-14 items-center justify-center sm:w-16">
        <button
          type="button"
          aria-label="Next slide"
          disabled={!canNext}
          onClick={() => goAdjacent(1)}
          className="pitchdeck-interactive__clickable pointer-events-auto flex h-24 w-12 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#111] shadow-md backdrop-blur-sm transition-opacity disabled:pointer-events-none disabled:opacity-25 sm:h-28 sm:w-14"
        >
          <ChevronRight
            className="h-8 w-8 sm:h-10 sm:w-10"
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
      </div>

      <div className="pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-[125]">
        <button
          type="button"
          aria-label="Enter fullscreen"
          onClick={enterDeckFullscreen}
          className="pitchdeck-interactive__clickable pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/95 text-[#111] shadow-md backdrop-blur-sm md:hidden"
        >
          <Maximize2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <div
        className="pointer-events-none fixed left-0 top-0 z-[110] flex h-8 w-8 items-center justify-center mix-blend-difference"
        style={{
          transform: `translate3d(${smoothCursor.x}px, ${smoothCursor.y}px, 0) translate(-50%, -50%)`,
        }}
        aria-hidden
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
        >
          <path d="M12 2V22M2 12H22" />
        </svg>
      </div>
    </div>
  );
}
