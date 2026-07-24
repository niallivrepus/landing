import { Squircle, cn, createSquirclePath } from "@jokuh/gooey";
import { useEffect, useId, useMemo, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

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
