import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
  useMemo,
} from "react";

import { cn } from "../../lib/utils";

export interface GooeyGlassLens {
  width?: number;
  height?: number;
  borderRadius?: number;
  scale?: number;
  depth?: number;
  curvature?: number;
  splay?: number;
  blur?: number;
  chroma?: number;
  glow?: number;
  edgeHighlight?: number;
  specularAngle?: number;
}

export interface GooeyGlassProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  contentClassName?: string;
  filterContent?: boolean;
  lens?: GooeyGlassLens;
}

export interface GooeyGlassMapData {
  href: string;
  maximumDisplacement: number;
}

const DEFAULT_LENS: Required<GooeyGlassLens> = {
  width: 96,
  height: 72,
  borderRadius: 32,
  scale: 30,
  depth: 1.35,
  curvature: 2.55,
  splay: 1.04,
  blur: 0.6,
  chroma: 0.2,
  glow: 0.22,
  edgeHighlight: 0.38,
  specularAngle: 45,
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0));

  return t * t * (3 - 2 * t);
};
const smootherstep = (value: number) => {
  const t = clamp(value);

  return t * t * t * (t * (t * 6 - 15) + 10);
};

function isInsideRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
  const innerX = Math.max(radius, Math.min(width - radius, x));
  const innerY = Math.max(radius, Math.min(height - radius, y));
  const dx = x - innerX;
  const dy = y - innerY;

  return dx * dx + dy * dy <= radius * radius;
}

function roundedRectSdf(px: number, py: number, halfWidth: number, halfHeight: number, radius: number) {
  const qx = Math.abs(px) - (halfWidth - radius);
  const qy = Math.abs(py) - (halfHeight - radius);
  const outsideX = Math.max(qx, 0);
  const outsideY = Math.max(qy, 0);
  const outsideDistance = Math.sqrt(outsideX * outsideX + outsideY * outsideY);
  const insideDistance = Math.min(Math.max(qx, qy), 0);

  return outsideDistance + insideDistance - radius;
}

function roundedRectNormal(px: number, py: number, halfWidth: number, halfHeight: number, radius: number) {
  const epsilon = 0.75;
  const dx =
    roundedRectSdf(px + epsilon, py, halfWidth, halfHeight, radius) -
    roundedRectSdf(px - epsilon, py, halfWidth, halfHeight, radius);
  const dy =
    roundedRectSdf(px, py + epsilon, halfWidth, halfHeight, radius) -
    roundedRectSdf(px, py - epsilon, halfWidth, halfHeight, radius);
  const length = Math.sqrt(dx * dx + dy * dy) || 1;

  return {
    x: dx / length,
    y: dy / length,
  };
}

function createEmptyMap(): GooeyGlassMapData {
  return { href: "", maximumDisplacement: 0 };
}

export function createGooeyGlassMapData(lensInput: GooeyGlassLens = {}): GooeyGlassMapData {
  if (typeof document === "undefined") return createEmptyMap();

  const lens = { ...DEFAULT_LENS, ...lensInput };
  const width = Math.max(8, Math.round(lens.width));
  const height = Math.max(8, Math.round(lens.height));
  const radius = clamp(lens.borderRadius, 0, Math.min(width, height) / 2);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return createEmptyMap();

  const image = context.createImageData(width, height);
  const vectors = new Float32Array(width * height * 2);
  const centerX = (width - 1) / 2;
  const centerY = (height - 1) / 2;
  const halfW = width / 2;
  const halfH = height / 2;
  const minDimension = Math.min(width, height);
  const curvatureForce = Math.pow(clamp(lens.curvature / 3), 0.65);
  const bevelWidth = minDimension * clamp(0.035 + curvatureForce * 0.18, 0.045, 0.22);
  const refractiveIndex = 1.5;
  const glassThickness = Math.pow(clamp(lens.depth / 1.8), 0.72) * 14;
  let maximumDisplacement = 1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const vectorIndex = (y * width + x) * 2;
      const inside = isInsideRoundedRect(x, y, width - 1, height - 1, radius);

      if (!inside) continue;

      const px = x - centerX;
      const py = y - centerY;
      const sdf = roundedRectSdf(px, py, halfW, halfH, radius);
      const edgeDistance = Math.max(0, -sdf);
      const normal = roundedRectNormal(px, py, halfW, halfH, radius);
      const distanceRatio = clamp(edgeDistance / bevelWidth);
      const edge = 1 - smoothstep(0, 1, distanceRatio);
      const normalizedRadius = Math.sqrt(px * px + py * py) / minDimension;
      const centerBlend = smoothstep(0.08, 0.24, normalizedRadius);
      const surfaceSlope = Math.pow(1 - smootherstep(distanceRatio), 1.12) * (0.18 + curvatureForce * 1.95);
      const incidenceAngle = Math.atan(surfaceSlope);
      const refractedAngle = Math.asin(clamp(Math.sin(incidenceAngle) / refractiveIndex, -0.98, 0.98));
      const snellBend = Math.tan(incidenceAngle - refractedAngle) * glassThickness;
      const bevelSpike = Math.pow(edge, 5.4);
      const offsetAmount = (snellBend + bevelSpike * glassThickness * 0.62) * centerBlend;
      const sideStretch = Math.abs(normal.x) > Math.abs(normal.y) ? lens.splay : 1;
      const bendX = normal.x * offsetAmount * sideStretch;
      const bendY = normal.y * offsetAmount;
      const magnitude = Math.sqrt(bendX * bendX + bendY * bendY);

      vectors[vectorIndex] = bendX;
      vectors[vectorIndex + 1] = bendY;
      maximumDisplacement = Math.max(maximumDisplacement, magnitude);
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const vectorIndex = (y * width + x) * 2;
      const normalizedX = vectors[vectorIndex] / maximumDisplacement;
      const normalizedY = vectors[vectorIndex + 1] / maximumDisplacement;

      image.data[index] = clamp(128 + normalizedX * 127, 0, 255);
      image.data[index + 1] = clamp(128 + normalizedY * 127, 0, 255);
      image.data[index + 2] = 128;
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);

  if (lens.blur > 0) {
    const source = document.createElement("canvas");
    source.width = width;
    source.height = height;
    source.getContext("2d")?.drawImage(canvas, 0, 0);

    context.clearRect(0, 0, width, height);
    context.filter = `blur(${lens.blur}px)`;
    context.drawImage(source, 0, 0);
    context.filter = "none";
  }

  return { href: canvas.toDataURL("image/png"), maximumDisplacement };
}

export function createGooeyGlassMap(lensInput: GooeyGlassLens = {}) {
  return createGooeyGlassMapData(lensInput).href;
}

export const GooeyGlass = forwardRef<HTMLDivElement, GooeyGlassProps>(function GooeyGlass({
  children,
  className,
  contentClassName,
  filterContent = true,
  lens: lensInput,
  style,
  ...props
}, ref) {
  const reactId = useId();
  const lens = { ...DEFAULT_LENS, ...lensInput };
  const filterKey = [
    lens.width,
    lens.height,
    lens.borderRadius,
    lens.scale,
    lens.depth,
    lens.curvature,
    lens.splay,
    lens.blur,
    lens.chroma,
    lens.glow,
    lens.edgeHighlight,
    lens.specularAngle,
  ].join("-");
  const filterId = `gooey-glass-${reactId.replace(/:/g, "")}-${filterKey.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const map = useMemo(() => createGooeyGlassMapData(lens), [
    lens.blur,
    lens.borderRadius,
    lens.curvature,
    lens.depth,
    lens.height,
    lens.scale,
    lens.splay,
    lens.width,
  ]);
  const scale = map.maximumDisplacement * Math.max(0.35, lens.scale / 12);

  const shellStyle = {
    "--gooey-glass-glow-strong": `${clamp(lens.glow * 46, 0, 100)}%`,
    "--gooey-glass-glow-soft": `${clamp(lens.glow * 24, 0, 100)}%`,
    "--gooey-glass-edge-strong": `${clamp(lens.edgeHighlight * 42, 0, 100)}%`,
    "--gooey-glass-edge-soft": `${clamp(lens.edgeHighlight * 34, 0, 100)}%`,
    "--gooey-glass-angle": `${lens.specularAngle}deg`,
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      data-gooey-glass
      className={cn("relative isolate overflow-hidden", className)}
      style={shellStyle}
      {...props}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute size-0" focusable="false">
        <filter id={filterId} colorInterpolationFilters="sRGB">
          {map.href && <feImage href={map.href} xlinkHref={map.href} result="lens-map" preserveAspectRatio="none" />}
          <feDisplacementMap
            in="SourceGraphic"
            in2="lens-map"
            result="base-shift"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lens-map"
            result="red-shift"
            scale={scale * (1 + lens.chroma * 0.3)}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="red-shift"
            result="red-channel"
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feColorMatrix
            in="base-shift"
            result="green-channel"
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lens-map"
            result="cyan-shift"
            scale={scale * (1 - lens.chroma * 0.22)}
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="cyan-shift"
            result="blue-channel"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
          <feBlend in="red-channel" in2="green-channel" mode="screen" result="red-green" />
          <feBlend in="red-green" in2="blue-channel" mode="screen" />
        </filter>
      </svg>

      <div
        className={cn("relative z-0", contentClassName)}
        style={filterContent ? { filter: `url(#${filterId})` } : undefined}
      >
        {children}
      </div>

      <span aria-hidden="true" data-gooey-glass-rim />
    </div>
  );
});
