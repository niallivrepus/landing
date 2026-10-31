import { useEffect, useId, useRef } from "react";
import { GooFilter } from "../gooey-home/GooFilter";
import { GOO_ENV_PARAMS, roleColor, splexSpec, type GooScheme } from "../gooey-home/goo-kit";
import type { CityLayout, Tower } from "./batcoin-city-layout";

/** One goo tower: body, its roof (dome / spire / step / flat) and a drip lobe at its foot, merged by the goo filter. */
function TowerGoo({ t, groundY, fill }: { t: Tower; groundY: number; fill: string }) {
  const cx = t.x + t.w / 2;
  const r = Math.min(12, t.w / 2.4);
  return (
    <g>
      <rect x={t.x} y={t.top} width={t.w} height={groundY - t.top + 20} rx={r} fill={fill} />
      {t.kind === "dome" ? <circle cx={cx} cy={t.top + 2} r={t.w * 0.36} fill={fill} /> : null}
      {t.kind === "spire" ? (
        <>
          <rect x={cx - Math.max(3, t.w * 0.09)} y={t.top - 34} width={Math.max(6, t.w * 0.18)} height={40} rx={4} fill={fill} />
          <circle cx={cx} cy={t.top - 36} r={5} fill={fill} />
        </>
      ) : null}
      {t.kind === "step" ? <rect x={t.x + t.w * 0.2} y={t.top - 18} width={t.w * 0.6} height={26} rx={8} fill={fill} /> : null}
    </g>
  );
}

/**
 * **Purpose:** The city under the bats: a faint hex hive in the sky (the OOpolis enclave cell, `docs/oopolis-plan.md`
 * §8.2, drawn once per size on a 2D canvas), then the skyline of five districts as one static goo SVG through the
 * house Splex filter (towers neck into each other and into the street), lit windows on top, and the district names
 * on the street. Nothing here animates per frame except a few CSS-twinkled windows; the bats live on their own layer.
 * **Connects to:** `BatcoinCity.tsx` (stage), `batcoin-city-layout.ts` (geometry), `GooFilter` / `goo-kit` (material).
 */
export function CitySkyline({ city, scheme, active }: { city: CityLayout; scheme: GooScheme; active: number }) {
  const uid = useId().replace(/[:]/g, "");
  const hive = useRef<HTMLCanvasElement>(null);
  const fill = roleColor(scheme, "base");
  const { w, h, groundY } = city;

  useEffect(() => {
    const cv = hive.current;
    if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    // Enclave cells: hexagon outline (r 16) + six vertex dots (r 6) in du, at 0.55 pt per du, on the d = 56 lattice.
    const s = 0.55;
    const d = 56 * s;
    const dark = scheme === "dark";
    const line = dark ? "rgba(255,255,255,0.05)" : "rgba(60,45,20,0.07)";
    const dot = dark ? "rgba(255,255,255,0.07)" : "rgba(60,45,20,0.08)";
    ctx.lineWidth = 6 * s * 0.5;
    for (let j = 0; d * 0.866 * j < groundY + d; j++) {
      for (let i = -1; d * i < w + d; i++) {
        const x = d * (i + (j % 2 ? 0.5 : 0));
        const y = d * 0.8660254 * j;
        // Fade the hive out toward the top of the sky so the title reads clean.
        const fade = Math.min(1, Math.max(0, (y - h * 0.08) / (h * 0.5)));
        if (fade <= 0.02) continue;
        ctx.globalAlpha = fade;
        const pts = [
          [0, -16],
          [13.86, -8],
          [13.86, 8],
          [0, 16],
          [-13.86, 8],
          [-13.86, -8],
        ] as const;
        ctx.strokeStyle = line;
        ctx.beginPath();
        pts.forEach(([px, py], k) => (k ? ctx.lineTo(x + px * s, y + py * s) : ctx.moveTo(x + px * s, y + py * s)));
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = dot;
        for (const [px, py] of pts) {
          ctx.beginPath();
          ctx.arc(x + px * s, y + py * s, 6 * s * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }, [w, h, groundY, scheme]);

  return (
    <div className="bc-city" aria-hidden>
      <canvas ref={hive} className="bc-city__hive" style={{ width: w, height: h }} />
      {scheme === "dark" ? <div className="bc-city__moon" /> : null}
      <svg className="bc-city__goo" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <GooFilter id={`bc-city-${uid}`} x={-20} y={0} width={w + 40} height={h} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#bc-city-${uid})`}>
          <rect x={-30} y={groundY} width={w + 60} height={h - groundY + 40} rx={26} fill={fill} />
          {city.districts.map((d) => d.towers.map((t, i) => <TowerGoo key={`${d.id}-${i}`} t={t} groundY={groundY} fill={fill} />))}
        </g>
      </svg>
      <svg className="bc-city__windows" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {city.windows.map((win, i) =>
          win.lit ? (
            <rect
              key={i}
              x={win.x - 2.5}
              y={win.y - 3}
              width={5}
              height={6}
              rx={1.6}
              className={i % 9 === 0 ? "bc-win bc-win--twinkle" : "bc-win"}
              style={i % 9 === 0 ? { animationDelay: `${(i * 0.37) % 5}s` } : undefined}
            />
          ) : null,
        )}
      </svg>
      <div className="bc-city__names" style={{ top: groundY + 12 }}>
        {city.districts.map((d, i) => (
          <span key={d.id} className={`bc-name gh-slab gh-slab--pill${active === i ? " is-on" : ""}`} style={{ left: d.cx }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
