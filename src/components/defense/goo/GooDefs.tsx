/**
 * **Purpose:** The Goo material for `/defense`: one hidden SVG holding the metaball filters (blur + alpha threshold, so
 * shapes that touch merge into one liquid body). Content (text, recordings) is never filtered: goo is the vessel.
 * **Connects to:** `DefenseGooPage` (mounts it once), every `goo/*` section that sets `filter: url(#dg-goo-*)`.
 * **Parity:** Splex goo glass in `frontend/src/components/gooey/goo-env/*` (Solid app) and `Sources/gooey/` (Swift).
 */
export function GooDefs() {
  return (
    <svg aria-hidden focusable="false" width="0" height="0" className="defense-goo-defs">
      <defs>
        <GooFilter id="dg-goo-hero" blur={9} threshold="22 -10" />
        <GooFilter id="dg-goo-chain" blur={6} threshold="20 -9" />
        <GooFilter id="dg-goo-map" blur={1.7} threshold="20 -9" />
        <GooFilter id="dg-goo-rail" blur={5} threshold="20 -9" />
      </defs>
    </svg>
  );
}

function GooFilter({ id, blur, threshold }: { id: string; blur: number; threshold: string }) {
  return (
    <filter id={id} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
      <feColorMatrix in="blur" mode="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${threshold}`} />
    </filter>
  );
}
