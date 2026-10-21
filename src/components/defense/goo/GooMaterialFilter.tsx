import { gooMatrix, hexRgb, type GooParams, type MaterialSpec } from "./goo-material";

/**
 * **Purpose:** The goo + Splex material SVG filter (React port of the app's `GooEnvFilter`): shape blur → alpha
 * threshold, the blurred colour clipped to the shape through the material's alpha row (Splex glass: saturated beads
 * read as tinted glass), then drop, contact, refraction tint, hairlines, highlights, shade, inner rim and specular.
 * `units="user"` sizes the region in the stage's user space (SVG stages); `units="box"` uses a padded bounding box
 * with px primitives, for HTML elements filtered with `filter: url(#id)`.
 * **Connects to:** `goo-material.ts`, `GooStage.tsx`, `GooDefs.tsx`.
 * **Parity:** jokuh-live `frontend/src/components/gooey/goo-env/goo-filter.tsx` (same primitive order and numbers).
 */
type Band = { dy: number; blur: number; color: string; a: number };

export function GooMaterialFilter({
  id,
  spec: m,
  params: p,
  region,
}: {
  id: string;
  spec: MaterialSpec;
  params: GooParams;
  /** User-space region; omitted = a padded bounding box (HTML targets). */
  region?: { x: number; y: number; width: number; height: number };
}) {
  const band = (key: string, l: Band) => {
    const rgb = hexRgb(l.color);
    return [
      <feOffset key={`${key}1`} in="goo" dy={l.dy} result={`${key}o`} />,
      <feGaussianBlur key={`${key}2`} in={`${key}o`} stdDeviation={l.blur} result={`${key}b`} />,
      <feComposite key={`${key}3`} in={`${key}b`} in2="goo" operator="arithmetic" k2={-1} k3={1} result={`${key}m`} />,
      <feColorMatrix
        key={`${key}4`}
        in={`${key}m`}
        values={`0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} 0 0 0 ${l.a} 0`}
        result={key}
      />,
    ];
  };
  const regionAttrs = region
    ? { ...region, filterUnits: "userSpaceOnUse" as const }
    : { x: "-30%", y: "-60%", width: "160%", height: "220%" };
  return (
    <filter id={id} {...regionAttrs} colorInterpolationFilters="sRGB">
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
      {m.gradient ? band("grad", m.gradient) : null}
      {band("hi", m.hi)}
      {m.hi2 ? band("hi2", m.hi2) : null}
      {m.shade ? band("shade", m.shade) : null}
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
        <feMergeNode in="drop" />
        {m.contact ? <feMergeNode in="contact" /> : null}
        {m.caustic ? <feMergeNode in="caustic" /> : null}
        {m.rimOut ? <feMergeNode in="rimOut" /> : null}
        <feMergeNode in="body" />
        {m.gradient ? <feMergeNode in="grad" /> : null}
        {m.shade ? <feMergeNode in="shade" /> : null}
        <feMergeNode in="hi" />
        {m.hi2 ? <feMergeNode in="hi2" /> : null}
        <feMergeNode in="rim" />
        {m.spec ? <feMergeNode in="spec" /> : null}
      </feMerge>
    </filter>
  );
}
