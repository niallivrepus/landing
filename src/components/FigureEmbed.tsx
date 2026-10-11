/**
 * **Purpose:** Embed one interactive isometric figure (`public/figures/<id>/`) in a page.
 * - Sandboxed iframe (`allow-scripts` only, no same-origin), mounted only when near the viewport
 *   (IntersectionObserver + `loading="lazy"`).
 * - Light or dark build follows the site theme (`useTheme().resolvedTheme`, same source as `TertiaryPageChrome`).
 * - Space is reserved from measured heights (`data/figures.ts`) so nothing shifts; the PNG poster shows until
 *   the figure reports its real height via `postMessage` (`public/figures/embed.js`).
 * - Reduced motion: the figures check `prefers-reduced-motion` themselves; the poster fade is motion-safe only.
 * **Connects to:** `data/figures.ts`, `pages/AgentsPage.tsx`, `pages/SecurityPage.tsx`,
 * `/figures/` framing headers in `server/static-middleware.ts`.
 */
import { cn, useTheme } from "@jokuh/gooey";
import { useEffect, useRef, useState } from "react";
import {
  FIGURES,
  figurePageHref,
  figurePosterSrc,
  figureReservedHeight,
  type FigureId,
  type FigureTheme,
} from "../data/figures";

const HEIGHT_MESSAGE = "jokuh-figure:height";
/** Start loading a little before the frame scrolls into view. */
const MOUNT_MARGIN = "600px 0px";

export function FigureEmbed({
  id,
  caption,
  className,
  frameClassName,
}: {
  id: FigureId;
  /** Overrides the registry caption. Keep it to what the figure itself states. */
  caption?: string;
  /** Classes on the outer `<figure>` (width / max-width / margins). */
  className?: string;
  frameClassName?: string;
}) {
  const def = FIGURES[id];
  const { resolvedTheme } = useTheme();
  const theme: FigureTheme = resolvedTheme === "light" ? "light" : "dark";
  const src = figurePageHref(id, theme);

  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [near, setNear] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [reportedHeight, setReportedHeight] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  // Mount the iframe only when the frame is near the viewport.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: MOUNT_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  // Track the frame width so the reserved height matches the figure's layout at that width.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Height reports from this frame only (opaque origin, so match on the window, not the origin).
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== frameRef.current?.contentWindow) return;
      const data = event.data as { type?: unknown; height?: unknown } | null;
      if (!data || data.type !== HEIGHT_MESSAGE || typeof data.height !== "number") return;
      const height = Math.round(data.height);
      if (height < 160 || height > 4000) return;
      setReportedHeight(height);
      setReady(true);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // A theme switch loads the other build: show its poster again until it reports in.
  useEffect(() => {
    setReady(false);
  }, [src]);

  const reservedHeight = width ? figureReservedHeight(def, width) : null;
  const height = reportedHeight ?? reservedHeight;
  const [sampleWidth, sampleHeight] = def.heights[def.heights.length - 3];

  return (
    <figure className={cn("mx-auto w-full", className)}>
      <div
        ref={boxRef}
        className={cn(
          "relative w-full overflow-hidden rounded-[24px] border border-light-space/[0.08] bg-[#131313] light:border-black/[0.08] light:bg-[#fbfbfa]",
          frameClassName,
        )}
        style={height ? { height } : { aspectRatio: `${sampleWidth} / ${sampleHeight}` }}
      >
        {near ? (
          <iframe
            ref={frameRef}
            key={src}
            src={src}
            title={`Interactive figure: ${def.title}`}
            sandbox="allow-scripts"
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => {
              // embed.js reports height right away; fall back to showing the frame if it never does.
              window.setTimeout(() => setReady(true), 1200);
            }}
            className="absolute inset-0 block size-full border-0"
          />
        ) : null}
        <img
          src={figurePosterSrc(id, theme)}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className={cn(
            "pointer-events-none absolute inset-0 size-full object-cover object-top motion-safe:transition-opacity motion-safe:duration-300",
            ready ? "opacity-0" : "opacity-100",
          )}
        />
      </div>
      <figcaption className="mt-3 flex flex-col gap-1.5 font-sans text-[13px] leading-[1.5] text-light-space/50 light:text-zinc-500 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <span className="text-pretty">{caption ?? def.caption}</span>
        <a
          href={src}
          target="_blank"
          rel="noopener"
          className="shrink-0 rounded-sm font-medium text-light-space/75 underline-offset-4 hover:underline light:text-zinc-700"
        >
          Open full screen
          <span className="sr-only"> (opens “{def.title}” in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}
