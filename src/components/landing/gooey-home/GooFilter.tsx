import { Fragment } from "react";
import { gooMatrix, type GooParams, type MaterialSpec } from "./goo-kit";

/**
 * **Purpose:** The Splex goo SVG filter (shape threshold → blurred colour clipped to the shape → material: drop,
 * contact, refraction tint, outer hairline, gradient, highlights, shade, inner rim, specular). React port of the
 * app's `frontend/src/components/gooey/goo-env/goo-filter.tsx` (`GooEnvFilter`), same layer order and numbers.
 * **Connects to:** `goo-kit.ts`, `GooGlyphMark`, `GooCornerFrame`, `GooScrollMerge`.
 */

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255].map((v) => Math.round(v * 1000) / 1000) as [
    number,
    number,
    number,
  ];
}

type Band = { dy: number; blur: number; color: string; a: number };

function BandLayer({ name, l }: { name: string; l: Band }) {
  const rgb = hexRgb(l.color);
  return (
    <>
      <feOffset in="goo" dy={l.dy} result={`${name}o`} />
      <feGaussianBlur in={`${name}o`} stdDeviation={l.blur} result={`${name}b`} />
      <feComposite in={`${name}b`} in2="goo" operator="arithmetic" k2={-1} k3={1} result={`${name}m`} />
      <feColorMatrix in={`${name}m`} values={`0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} 0 0 0 ${l.a} 0`} result={name} />
    </>
  );
}

export function GooFilter({
  id,
  x,
  y,
  width,
  height,
  spec: m,
  params: p,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  spec: MaterialSpec;
  params: GooParams;
}) {
  return (
    <filter id={id} x={x} y={y} width={width} height={height} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation={p.blur} result="sb" />
      <feColorMatrix in="sb" values={gooMatrix(p)} result="goo" />
      <feGaussianBlur in="SourceGraphic" stdDeviation={p.blur} result="cb" />
      <feColorMatrix in="cb" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  ${m.alphaRow}`} result="cc" />
      <feComposite in="cc" in2="goo" operator="in" result="body" />
      <feOffset in="goo" dy={m.drop.dy} result="do" />
      <feGaussianBlur in="do" stdDeviation={m.drop.blur} result="db" />
      <feFlood floodColor={m.drop.color} floodOpacity={m.drop.a} />
      <feComposite in2="db" operator="in" result="dc" />
      <feComposite in="dc" in2="goo" operator="out" result="drop" />
      {m.contact ? (
        <>
          <feOffset in="goo" dy={m.contact.dy} result="co" />
          <feGaussianBlur in="co" stdDeviation={m.contact.blur} result="cbl" />
          <feFlood floodColor={m.contact.color} floodOpacity={m.contact.a} />
          <feComposite in2="cbl" operator="in" result="cfill" />
          <feComposite in="cfill" in2="goo" operator="out" result="contact" />
        </>
      ) : null}
      {m.caustic ? (
        <>
          <feColorMatrix in="cb" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  ${m.caustic.alphaRow}`} result="ka0" />
          <feComposite in="ka0" in2="goo" operator="in" result="ka" />
          <feOffset in="ka" dy={m.caustic.dy} result="ko" />
          <feGaussianBlur in="ko" stdDeviation={m.caustic.blur} result="kb" />
          <feComposite in="kb" in2="goo" operator="out" result="caustic" />
        </>
      ) : null}
      {m.rimOut ? (
        <>
          <feMorphology in="goo" operator="dilate" radius={m.rimOut.w} result="outer" />
          <feComposite in="outer" in2="goo" operator="out" result="rimom" />
          <feFlood floodColor={m.rimOut.color} floodOpacity={m.rimOut.a} />
          <feComposite in2="rimom" operator="in" result="rimOut" />
        </>
      ) : null}
      {m.gradient ? <BandLayer name="grad" l={m.gradient} /> : null}
      <BandLayer name="hi" l={m.hi} />
      {m.hi2 ? <BandLayer name="hi2" l={m.hi2} /> : null}
      {m.shade ? <BandLayer name="shade" l={m.shade} /> : null}
      <feMorphology in="goo" operator="erode" radius={m.rim.w} result="inner" />
      <feComposite in="goo" in2="inner" operator="out" result="rimm" />
      <feFlood floodColor={m.rim.color} floodOpacity={m.rim.a} />
      <feComposite in2="rimm" operator="in" result="rim" />
      {m.spec ? (
        <>
          <feGaussianBlur in="goo" stdDeviation={Math.max(1.5, p.blur * 0.45)} result="bump" />
          <feSpecularLighting
            in="bump"
            surfaceScale={m.spec.surface}
            specularConstant={0.9}
            specularExponent={m.spec.exponent}
            lightingColor="#ffffff"
            result="sl"
          >
            <feDistantLight azimuth={235} elevation={m.spec.elevation} />
          </feSpecularLighting>
          <feComposite in="sl" in2="goo" operator="in" result="slc" />
          <feColorMatrix in="slc" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${m.spec.a} 0`} result="spec" />
        </>
      ) : null}
      <feMerge>
        {["drop", m.contact && "contact", m.caustic && "caustic", m.rimOut && "rimOut", "body", m.gradient && "grad", m.shade && "shade", "hi", m.hi2 && "hi2", "rim", m.spec && "spec"]
          .filter(Boolean)
          .map((n) => (
            <Fragment key={n as string}>
              <feMergeNode in={n as string} />
            </Fragment>
          ))}
      </feMerge>
    </filter>
  );
}
