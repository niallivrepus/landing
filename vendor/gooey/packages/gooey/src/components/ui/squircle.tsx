import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
} from "react";
import { getSvgPath } from "figma-squircle";

import { cn } from "../../lib/utils";

export interface SquircleProps extends HTMLAttributes<HTMLDivElement> {
  allowOverflow?: boolean;
  borderWidth?: number;
  cornerRadius?: number;
  cornerSmoothing?: number;
  defaultHeight?: number;
  defaultWidth?: number;
  height?: number;
  strokeClassName?: string;
  strokeColor?: string;
  width?: number;
}

export interface SquircleFilterProps {
  alpha?: number;
  blur?: number;
  className?: string;
  colorMatrix?: number;
  id?: string;
}

type Size = {
  height: number;
  width: number;
};

const DEFAULT_SQUIRCLE_SIZE = 320;
const DEFAULT_CORNER_RADIUS = 40;
const DEFAULT_CORNER_SMOOTHING = 0.86;

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
        return;
      }

      ref.current = node;
    });
  };
}

function squirclePath(size: Size, cornerRadius: number, cornerSmoothing: number) {
  if (size.width <= 0 || size.height <= 0) return "";

  return getSvgPath({
    width: size.width,
    height: size.height,
    cornerRadius: Math.min(cornerRadius, Math.min(size.width, size.height) / 2),
    cornerSmoothing,
  });
}

export const Squircle = forwardRef<HTMLDivElement, SquircleProps>(function Squircle(
  {
    children,
    allowOverflow = false,
    borderWidth = 0,
    className,
    cornerRadius = DEFAULT_CORNER_RADIUS,
    cornerSmoothing = DEFAULT_CORNER_SMOOTHING,
    defaultHeight = DEFAULT_SQUIRCLE_SIZE,
    defaultWidth = DEFAULT_SQUIRCLE_SIZE,
    height,
    style,
    strokeClassName,
    strokeColor = "currentColor",
    width,
    ...props
  },
  forwardedRef,
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [measuredSize, setMeasuredSize] = useState<Size>({
    height: height ?? defaultHeight,
    width: width ?? defaultWidth,
  });

  useEffect(() => {
    const node = localRef.current;
    if (!node || (height && width) || typeof ResizeObserver === "undefined") return undefined;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const nextWidth = width ?? entry.contentRect.width;
      const nextHeight = height ?? entry.contentRect.height;

      setMeasuredSize((current) =>
        Math.round(current.width) === Math.round(nextWidth) && Math.round(current.height) === Math.round(nextHeight)
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [height, width]);

  const size = {
    height: height ?? measuredSize.height,
    width: width ?? measuredSize.width,
  };
  const path = useMemo(
    () => squirclePath(size, cornerRadius, cornerSmoothing),
    [cornerRadius, cornerSmoothing, size.height, size.width],
  );
  const squircleStyle = {
    borderRadius: cornerRadius,
    clipPath: path ? `path("${path}")` : undefined,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={mergeRefs(localRef, forwardedRef)}
      data-gooey-squircle
      className={cn("relative", allowOverflow ? "overflow-visible" : "overflow-hidden", className)}
      style={squircleStyle}
      {...props}
    >
      {children}
      {borderWidth > 0 && path ? (
        <svg
          aria-hidden="true"
          className={cn("pointer-events-none absolute inset-0 size-full", strokeClassName)}
          focusable="false"
          viewBox={`0 0 ${size.width} ${size.height}`}
        >
          <path d={path} fill="none" stroke={strokeColor} strokeWidth={borderWidth} vectorEffect="non-scaling-stroke" />
        </svg>
      ) : null}
    </div>
  );
});

export function createSquirclePath({
  cornerRadius = DEFAULT_CORNER_RADIUS,
  cornerSmoothing = DEFAULT_CORNER_SMOOTHING,
  height,
  width,
}: {
  cornerRadius?: number;
  cornerSmoothing?: number;
  height: number;
  width: number;
}) {
  return squirclePath({ height, width }, cornerRadius, cornerSmoothing);
}

export function SquircleFilter({
  alpha = -7,
  blur = 10,
  className,
  colorMatrix = 20,
  id,
}: SquircleFilterProps) {
  const reactId = useId();
  const filterId = id ?? `gooey-squircle-filter-${reactId.replace(/:/g, "")}`;

  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute size-0", className)} focusable="false">
      <defs>
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={blur} />
          <feColorMatrix
            in="blur"
            mode="matrix"
            result="goo"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${colorMatrix} ${alpha}`}
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}
