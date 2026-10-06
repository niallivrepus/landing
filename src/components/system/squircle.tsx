import { Squircle, cn, createSquirclePath } from "@jokuh/gooey";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { SQUIRCLE_MEDIA_CORNER_RADIUS, SQUIRCLE_MEDIA_MATTE_CLASS } from "./editorialMedia";

type SquircleShellProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  cornerRadius?: number;
  cornerSmoothing?: number;
  borderWidth?: number;
  strokeClassName?: string;
  /** Explicit SVG path stroke — avoids `currentColor` inheriting light page text. */
  strokeColor?: string;
  fillClassName?: string;
};

/**
 * **Purpose:** Renders a squircle fill and optional border as a background layer so text and
 * controls are never cropped by Gooey's `clipPath` measurement quirks.
 * **Connects to:** `ProductDemoSection` bubbles, hero CTAs, demo composer chrome.
 */
export function SquircleShell({
  children,
  className,
  contentClassName,
  cornerRadius = 18,
  cornerSmoothing = 1,
  borderWidth = 0,
  strokeClassName,
  strokeColor,
  fillClassName = "",
}: SquircleShellProps) {
  return (
    <div className={cn("relative isolate", className)}>
      <Squircle
        cornerRadius={cornerRadius}
        cornerSmoothing={cornerSmoothing}
        borderWidth={borderWidth}
        strokeClassName={strokeClassName}
        strokeColor={strokeColor}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 -z-10", fillClassName)}
      />
      <div className={cn("relative z-[1]", contentClassName)}>{children}</div>
    </div>
  );
}

type SquircleMediaProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  cornerRadius?: number;
  cornerSmoothing?: number;
};

/**
 * **Purpose:** Clips photos, gradients, and lava-lamp art with an SVG squircle `clipPath`
 * instead of painting border colors over square corners.
 * **Connects to:** `NewsCardArt`, product showcase tiles, editorial link cards.
 */
export function SquircleMedia({
  children,
  className,
  cornerRadius = SQUIRCLE_MEDIA_CORNER_RADIUS,
  cornerSmoothing = 1,
  ...props
}: SquircleMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const clipId = `squircle-media-${reactId.replace(/:/g, "")}`;
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;

    const measure = () => {
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const path = useMemo(() => {
    if (size.width <= 0 || size.height <= 0) return "";
    return createSquirclePath({
      width: size.width,
      height: size.height,
      cornerRadius,
      cornerSmoothing,
    });
  }, [cornerRadius, cornerSmoothing, size.height, size.width]);

  return (
    <div ref={ref} className={cn("relative", SQUIRCLE_MEDIA_MATTE_CLASS, className)} {...props}>
      {path ? (
        <svg
          aria-hidden
          className="absolute inset-0 block size-full"
          focusable="false"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={path} />
            </clipPath>
          </defs>
          <foreignObject width={size.width} height={size.height} clipPath={`url(#${clipId})`}>
            <div className="size-full">
              {children}
            </div>
          </foreignObject>
        </svg>
      ) : (
        <div className="size-full opacity-0">{children}</div>
      )}
    </div>
  );
}

export type SquircleBoxRadius = number | ((width: number, height: number) => number);

export type SquircleBoxProps = {
  /** Corner radius in px, or a function of the measured box (e.g. `(w, h) => Math.min(w, h) * 0.3`). */
  radius: SquircleBoxRadius;
  children?: ReactNode;
  className?: string;
  /** Class on the clipped fill layer (background, padding, overflow content). */
  fillClassName?: string;
  /** Adds an SVG rim stroked on the same superellipse (style `path` stroke via this class). */
  rimClassName?: string;
  /**
   * An outer ring traced `offset` px outside the squircle — a focus ring that hugs the shape (style via
   * `ring.className`; toggle with opacity). Drawn on its own SVG with visible overflow.
   */
  ring?: { offset: number; className?: string };
  /** Soft shadow layer behind the shape (clip-path would cut a box-shadow; a filter would break backdrop blur). */
  shadowClassName?: string;
  /** Base class for the BEM parts (`__fill`, `__rim`, `__ring`, `__shadow`). Default `jk-squircle`. */
  baseClassName?: string;
  style?: CSSProperties;
  fillStyle?: CSSProperties;
};

/**
 * **Purpose:** The site's true-superellipse box (Figma 100% corner smoothing, the app's `SquircleSurface` look):
 * measures itself, clips its fill with `createSquirclePath`, and can stroke a matching rim, an offset focus ring and
 * a soft shadow. Re-measures on every resize, so springing tiles and streaming chat bubbles keep exact corners.
 * Before the first measure it falls back to `border-radius` so nothing renders square.
 * **Connects to:** `ProfilePodsDemoPods` (`Squircle`), console home tiles + surface window, `LandingTempChatPanel`,
 * OO demo proof cards; base styles `.jk-squircle*` in `landing-controls.css`.
 */
export function SquircleBox({
  radius,
  children,
  className,
  fillClassName,
  rimClassName,
  ring,
  shadowClassName,
  baseClassName = "jk-squircle",
  style,
  fillStyle,
}: SquircleBoxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = () => {
      const w = Math.round(node.offsetWidth);
      const h = Math.round(node.offsetHeight);
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const r = size.w > 0 && size.h > 0
    ? Math.min(typeof radius === "function" ? radius(size.w, size.h) : radius, size.w / 2, size.h / 2)
    : typeof radius === "number" ? radius : 0;

  const path = useMemo(
    () =>
      size.w > 0 && size.h > 0
        ? createSquirclePath({ width: size.w, height: size.h, cornerRadius: r, cornerSmoothing: 1 })
        : "",
    [r, size.h, size.w],
  );

  const ringPath = useMemo(() => {
    if (!ring || size.w <= 0 || size.h <= 0) return "";
    const o = ring.offset;
    return createSquirclePath({ width: size.w + o * 2, height: size.h + o * 2, cornerRadius: r + o, cornerSmoothing: 1 });
  }, [r, ring, size.h, size.w]);

  return (
    <div ref={ref} className={cn(baseClassName, className)} style={style}>
      {shadowClassName ? (
        <span aria-hidden className={cn(`${baseClassName}__shadow`, shadowClassName)} style={{ borderRadius: r * 0.92 }} />
      ) : null}
      <div
        className={cn(`${baseClassName}__fill`, fillClassName)}
        style={{ ...fillStyle, ...(path ? { clipPath: `path('${path}')` } : { borderRadius: r }) }}
      >
        {children}
      </div>
      {path && rimClassName ? (
        <svg
          className={cn(`${baseClassName}__rim`, rimClassName)}
          viewBox={`0 0 ${size.w} ${size.h}`}
          aria-hidden
          focusable="false"
        >
          <path d={path} />
        </svg>
      ) : null}
      {ring && ringPath ? (
        <svg
          className={cn(`${baseClassName}__ring`, ring.className)}
          style={{ inset: -ring.offset, width: size.w + ring.offset * 2, height: size.h + ring.offset * 2 }}
          viewBox={`0 0 ${size.w + ring.offset * 2} ${size.h + ring.offset * 2}`}
          aria-hidden
          focusable="false"
        >
          <path d={ringPath} />
        </svg>
      ) : null}
    </div>
  );
}
