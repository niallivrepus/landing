import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react";
import { GooFilter } from "../GooFilter";
import { GOO_ENV_PARAMS, roleColor, splexSpec, type GooScheme } from "../goo-kit";
import {
  GOO_ORB_BEAD_ASPECT,
  GOO_ORB_CHAIR_SCALE,
  GOO_ORB_SEAT_ASPECT,
  gooOrbBeadPoint,
  gooOrbFrontNeck,
  gooOrbRimBeads,
  gooOrbSeats,
  makeGooOrbGeometry,
  type GooOrbEllipse,
} from "./goo-orb-geometry";

/**
 * **Purpose:** The day story's evening beat: the real Profile Live Orb in goo, scripted. Same stage geometry as the app
 * (`goo-orb-geometry.ts`, a verbatim port): the big breathing orb with your live picture masked inside, the goo rim
 * that ripples with your voice (and throws voice rings), curved tiers of face seats filling centre-out with the
 * nearest front seats necked off the rim, people-dots filling out to the edges, 12 VIP chairs on curved goo tables
 * round the orb's upper shoulders (some taken, Diamond-ringed), and reactions (heart, flame, ice) flying in on goo
 * drops and landing with a tint + splash.
 * **API:** `paint(u)` draws second `u` of the beat (a pure function of `u`, so scrubbing works both ways). The stage
 * calls it from its own `seek`; there is no loop here. Goo = one filtered SVG (written only while things move);
 * faces / dots / glyphs = one canvas.
 * **Parity (jokuh-live):** `frontend/src/components/profile-live/orb/ProfileLiveGooOrb.tsx` (palette, rim, necks,
 * tables, chairs, canvas order), `styles/profile-live-goo-orb.css` (backdrop glow), Swift
 * `Sources/profile-live-orb/` (`ProfileLiveGooOrbView`).
 */

export type DayStoryOrbHandle = { paint: (u: number) => void };

/**
 * The scene is laid out on a taller virtual canvas (the app's own sizing for a big phone) and scaled into the
 * 390 × 720 stage, so faces and tiers keep the app's proportions instead of the front rows ballooning to fill.
 */
const K = 0.83;
const W = Math.round(390 / K);
const H = Math.round(720 / K);
const G = makeGooOrbGeometry(W, H, 120, 230, 120, 560);
/** The orb's resting ellipse in stage units: the stage's goo body morphs onto it before the scene takes over. */
export const DAY_ORB_ELLIPSE = { cx: G.orb.cx * K, cy: G.orb.cy * K, rx: G.orb.rx * K, ry: G.orb.ry * K };
const RIM = 44;
const RING_BEADS = 24;
const VOICE_RINGS = [0.9, 1.9, 2.9, 3.7];
const SPRITE_W = 64;
const SPRITE_H = Math.round(64 * GOO_ORB_SEAT_ASPECT);
const FACES = ["maya", "leo", "june", "kenji", "lyra", "malik", "sloane", "rowan", "lekishon"];
/** You sit in slot 0 (front centre); the rest of the room fills centre-out over the beat. */
const SEAT_FILL = [0.35, 2.7];
const BEAD_FILL = [1.0, 3.6];
const TAKEN_CHAIRS = [0, 1, 2, 3, 5, 8];
const KINDS = ["heart", "flame", "ice"] as const;
type Kind = (typeof KINDS)[number];
const GLYPH: Record<Kind, string> = { heart: "❤️", flame: "🔥", ice: "🧊" };
const KIND_COLOR: Record<Kind, string> = { heart: "#ff3b6b", flame: "#ff7a1a", ice: "#7fd3ff" };

/** Deterministic hash in [0, 1). */
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Reactions: from a seat to a point on the rim, on a lifted arc. */
const FLYERS = Array.from({ length: 12 }, (_, i) => {
  const seat = 2 + Math.floor(hash(i + 1) * 60);
  const a = -Math.PI * (0.15 + 0.7 * hash(i + 21));
  return { seat, start: 1.3 + i * 0.24, dur: 0.85, kind: KINDS[i % 3]!, rimA: a, lift: 40 + hash(i + 7) * 50 };
});

function palette(scheme: GooScheme) {
  const dark = scheme === "dark";
  return { seat: dark ? "#8a70f2" : "#5b3fd1", seatFar: dark ? "#b8a7ff" : "#8a70f2", diamond: dark ? "#a08ff4" : "#8c7cf0", gold: "#ffc21a" };
}

function mix(a: string, b: string, t: number, steps = 4): string {
  const p = (h: string) => {
    const n = parseInt(h.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const u = Math.round(Math.min(1, Math.max(0, t)) * steps) / steps;
  const A = p(a);
  const B = p(b);
  return `#${A.map((v, i) => Math.round(v + (B[i]! - v) * u).toString(16).padStart(2, "0")).join("")}`;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const backOut = (k: number) => {
  if (k <= 0) return 0;
  if (k >= 1) return 1;
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (k - 1) ** 3 + c1 * (k - 1) ** 2;
};
const f1 = (n: number) => n.toFixed(1);

function capsule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(w, h) / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

const DayStoryOrb = forwardRef<DayStoryOrbHandle, { scheme: GooScheme }>(function DayStoryOrb({ scheme }, ref) {
  const uid = useId().replace(/[:]/g, "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lobeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGEllipseElement>(null);
  const rim = useRef<(SVGCircleElement | null)[]>([]);
  const voice = useRef<(SVGCircleElement | null)[]>([]);
  const seatEls = useRef<(SVGRectElement | null)[]>([]);
  const neckEls = useRef<(SVGCircleElement | null)[]>([]);
  const tableEls = useRef<(SVGCircleElement | null)[]>([]);
  const chairEls = useRef<(SVGRectElement | null)[]>([]);
  const flyEls = useRef<(SVGCircleElement | null)[]>([]);
  const sparkEls = useRef<(SVGCircleElement | null)[]>([]);
  const sprites = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const seatK = useRef<number[]>([]);
  const lastU = useRef(0);
  const pal = palette(scheme);
  const palRef = useRef(pal);
  palRef.current = pal;

  // Face sprites (capsule-clipped, like the app's seat sprites).
  useEffect(() => {
    let dead = false;
    for (const name of [...FACES, "you"]) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (dead) return;
        const cv = document.createElement("canvas");
        cv.width = SPRITE_W;
        cv.height = SPRITE_H;
        const g = cv.getContext("2d");
        if (!g) return;
        capsule(g, 0, 0, SPRITE_W, SPRITE_H);
        g.clip();
        const k = Math.max(SPRITE_W / img.naturalWidth, SPRITE_H / img.naturalHeight);
        g.drawImage(img, (SPRITE_W - img.naturalWidth * k) / 2, (SPRITE_H - img.naturalHeight * k) / 2, img.naturalWidth * k, img.naturalHeight * k);
        sprites.current.set(name, cv);
        paint(lastU.current);
      };
      img.src = `/day-story/${name}.webp`;
    }
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seats = gooOrbSeats(G, G.slots.length, 0);
  const visibleSeats = seats.filter((s) => !s.behind);

  const paint = (u: number) => {
    lastU.current = u;
    const p = palRef.current;
    const lv = backOut(clamp01(u / 0.75));
    const breath = 1 + 0.018 * Math.sin(u * 2.3);
    const o = G.orb;
    const orb: GooOrbEllipse = { cx: o.cx, cy: o.cy, rx: o.rx * (0.2 + 0.8 * lv) * breath, ry: o.ry * (0.2 + 0.8 * lv) * breath };
    // Host speaking: bursts of voice level.
    const level = Math.max(0, Math.sin(u * 5.5)) * clamp01((u - 0.6) / 0.4) * (0.55 + 0.45 * Math.sin(u * 13) ** 2);
    // Reaction tint on the rim (the latest landing, fading over 0.6 s).
    let tint: { color: string; k: number } | null = null;
    for (const f of FLYERS) {
      const since = u - (f.start + f.dur);
      if (since >= 0 && since < 0.6) tint = { color: KIND_COLOR[f.kind], k: 1 - since / 0.6 };
    }
    const base = roleColor(scheme, "base");
    const rimBase = scheme === "light" ? p.seatFar : base;
    const ringColor = tint ? mix(rimBase, tint.color, 0.5 * tint.k, 6) : rimBase;

    // Live picture in the breathing lobe.
    const lobe = lobeRef.current;
    if (lobe) {
      const rx = Math.max(0, orb.rx - 4);
      const ry = Math.max(0, orb.ry - 4);
      lobe.style.transform = `translate3d(${f1(orb.cx - o.rx)}px, ${f1(orb.cy - o.ry)}px, 0) scale(${(rx / Math.max(1, o.rx - 4)).toFixed(4)}, ${(ry / Math.max(1, o.ry - 4)).toFixed(4)})`;
      lobe.style.opacity = clamp01((lv - 0.4) / 0.5).toFixed(2);
    }

    // Rim ring + beads that ripple with the voice.
    const ring = ringRef.current;
    if (ring) {
      ring.setAttribute("cx", f1(orb.cx));
      ring.setAttribute("cy", f1(orb.cy));
      ring.setAttribute("rx", f1(orb.rx));
      ring.setAttribute("ry", f1(orb.ry));
      ring.setAttribute("stroke-width", f1(10 + level * 5));
      ring.setAttribute("stroke", ringColor);
    }
    const rimR = Math.max(5, Math.min(o.rx, o.ry) * 0.05);
    gooOrbRimBeads(RIM, orb, rimR, level, u * 9).forEach((b, i) => {
      const el = rim.current[i];
      if (!el) return;
      el.setAttribute("cx", f1(b.x));
      el.setAttribute("cy", f1(b.y));
      el.setAttribute("r", f1(b.r));
      el.setAttribute("fill", ringColor);
    });
    VOICE_RINGS.forEach((at, k) => {
      const age = u - at;
      const on = age >= 0 && age < 1.1;
      const q = on ? age / 1.1 : 0;
      for (let i = 0; i < RING_BEADS; i++) {
        const el = voice.current[k * RING_BEADS + i];
        if (!el) continue;
        if (!on) {
          if (el.getAttribute("r") !== "0") el.setAttribute("r", "0");
          continue;
        }
        const a = (i / RING_BEADS) * Math.PI * 2 + k;
        el.setAttribute("cx", f1(orb.cx + Math.cos(a) * (orb.rx + 12 + q * 40)));
        el.setAttribute("cy", f1(orb.cy + Math.sin(a) * (orb.ry + 10 + q * 26)));
        el.setAttribute("r", f1(6 * (1 - q * 0.8)));
        el.setAttribute("fill", ringColor);
      }
    });

    // Seats: goo bead under each face, popping in centre-out; necks off the rim for the nearest front seats.
    const seatLive = clamp01((lv - 0.7) / 0.3);
    const n = visibleSeats.length;
    let necks = 0;
    visibleSeats.forEach((s, i) => {
      const at = SEAT_FILL[0]! + (i / Math.max(1, n - 1)) * (SEAT_FILL[1]! - SEAT_FILL[0]!);
      const k = backOut(clamp01((u - at) / 0.45)) * seatLive;
      const el = seatEls.current[i];
      if (el && seatK.current[i] !== k) {
        seatK.current[i] = k;
        const w = s.w * 0.86 * k;
        const h = w * GOO_ORB_SEAT_ASPECT * 0.96;
        el.setAttribute("x", f1(s.x - w / 2));
        el.setAttribute("y", f1(s.y - h / 2));
        el.setAttribute("width", f1(Math.max(0, w)));
        el.setAttribute("height", f1(Math.max(0, h)));
        el.setAttribute("rx", f1(Math.max(0, w / 2)));
      }
      if (s.front && s.ring === 0 && s.depth > 0.68 && necks < 8 && k > 0.5) {
        const beads = gooOrbFrontNeck(s, orb, 46);
        beads.forEach((b, j) => {
          const ne = neckEls.current[necks * 2 + j];
          if (!ne) return;
          ne.setAttribute("cx", f1(b.x));
          ne.setAttribute("cy", f1(b.y + Math.sin(u * 2.2 + i) * 1.2));
          ne.setAttribute("r", f1(b.r));
        });
        if (beads.length) necks += 1;
      }
    });
    for (let j = necks * 2; j < neckEls.current.length; j++) {
      const ne = neckEls.current[j];
      if (ne && ne.getAttribute("r") !== "0") ne.setAttribute("r", "0");
    }

    // VIP tables + chairs.
    const tableK = backOut(clamp01((u - 0.7) / 0.5)) * seatLive;
    const tr = f1(7 * tableK);
    for (const el of tableEls.current) if (el && el.getAttribute("r") !== tr) el.setAttribute("r", tr);
    const CS = GOO_ORB_CHAIR_SCALE;
    G.chairs.forEach((ch, k) => {
      const el = chairEls.current[k];
      if (!el) return;
      const takeAt = TAKEN_CHAIRS.indexOf(k);
      const taken = takeAt >= 0 && u > 1.5 + takeAt * 0.3;
      const ck = backOut(clamp01((u - 0.8 - (k % 6) * 0.05) / 0.45)) * seatLive;
      const w = (taken ? 26 : 18) * CS * ck;
      const h = (taken ? 33 : 22) * CS * ck;
      el.setAttribute("x", f1(ch.x - w / 2));
      el.setAttribute("y", f1(ch.y - h / 2));
      el.setAttribute("width", f1(Math.max(0, w)));
      el.setAttribute("height", f1(Math.max(0, h)));
      el.setAttribute("rx", f1(Math.min(9 * CS, w / 2)));
      el.setAttribute("fill", taken ? p.gold : p.diamond);
    });

    // Reactions on goo drops; a splash of sparks where they land.
    FLYERS.forEach((f, i) => {
      const el = flyEls.current[i];
      const s = visibleSeats[f.seat % visibleSeats.length]!;
      const q = (u - f.start) / f.dur;
      const bx = orb.cx + Math.cos(f.rimA) * orb.rx;
      const by = orb.cy + Math.sin(f.rimA) * orb.ry;
      if (el) {
        if (q < 0 || q >= 1) {
          if (el.getAttribute("r") !== "0") el.setAttribute("r", "0");
        } else {
          el.setAttribute("cx", f1(s.x + (bx - s.x) * q));
          el.setAttribute("cy", f1(s.y + (by - s.y) * q - Math.sin(Math.PI * q) * f.lift));
          el.setAttribute("r", "6");
          el.setAttribute("fill", KIND_COLOR[f.kind]);
        }
      }
      const since = u - (f.start + f.dur);
      for (let k = 0; k < 4; k++) {
        const sp = sparkEls.current[i * 4 + k];
        if (!sp) continue;
        if (since < 0 || since > 0.6) {
          if (sp.getAttribute("r") !== "0") sp.setAttribute("r", "0");
          continue;
        }
        const vx = (hash(i * 9 + k) - 0.5) * 240;
        const vy = -60 - hash(i * 5 + k) * 140;
        sp.setAttribute("cx", f1(bx + vx * since));
        sp.setAttribute("cy", f1(by + vy * since + 0.5 * 420 * since * since));
        sp.setAttribute("r", f1(4 * (1 - since / 0.6)));
        sp.setAttribute("fill", KIND_COLOR[f.kind]);
      }
    });

    paintCanvas(u, seatLive);
  };

  const paintCanvas = (u: number, seatLive: number) => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    // The stage is CSS-scaled by its host (`day-story-fit.ts` writes the scale to `data-k`): draw at that resolution.
    const fitK = Number((cv.closest("[data-k]") as HTMLElement | null)?.dataset.k || 1) * K;
    const dpr = Math.min(3, (window.devicePixelRatio || 1) * fitK);
    const pw = Math.round(W * dpr);
    const ph = Math.round(H * dpr);
    if (cv.width !== pw || cv.height !== ph) {
      cv.width = pw;
      cv.height = ph;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, pw, ph);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const p = palRef.current;
    // People-dots fill out to the edges.
    const beadN = Math.floor(G.beads.length * clamp01((u - BEAD_FILL[0]!) / (BEAD_FILL[1]! - BEAD_FILL[0]!)));
    if (seatLive > 0.5) {
      for (let j = 0; j < beadN; j++) {
        const pt = gooOrbBeadPoint(G, j, 0);
        const b = G.beads[j];
        if (!pt || !b) continue;
        // Far people read as a dim crowd, never brighter than the faces (app numbers, a touch softer here).
        ctx.globalAlpha = b.front ? 0.38 : 0.2 + 0.24 * Math.min(1, b.w / 13);
        ctx.fillStyle = b.front ? p.seat : p.seatFar;
        capsule(ctx, pt.x - b.w / 2, pt.y - (b.w * GOO_ORB_BEAD_ASPECT) / 2, b.w, b.w * GOO_ORB_BEAD_ASPECT);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // Faces, back to front.
    const order = visibleSeats.map((_, i) => i).sort((a, b) => visibleSeats[a]!.depth - visibleSeats[b]!.depth);
    for (const i of order) {
      const k = seatK.current[i] ?? 0;
      if (k <= 0.02) continue;
      const s = visibleSeats[i]!;
      const w = s.w * k;
      const h = w * GOO_ORB_SEAT_ASPECT;
      const sp = sprites.current.get(FACES[(i * 7) % FACES.length]!);
      ctx.globalAlpha = 0.45 + 0.55 * s.depth;
      if (sp) ctx.drawImage(sp, s.x - w / 2, s.y - h / 2, w, h);
    }
    ctx.globalAlpha = 1;
    // VIP faces with a Diamond ring.
    const CS = GOO_ORB_CHAIR_SCALE;
    TAKEN_CHAIRS.forEach((k, n) => {
      if (u <= 1.5 + n * 0.3) return;
      const ch = G.chairs[k];
      const sp = sprites.current.get(FACES[(n * 3 + 2) % FACES.length]!);
      if (!ch || !sp) return;
      const pk = backOut(clamp01((u - 1.5 - n * 0.3) / 0.4));
      const w = 20 * CS * pk;
      const h = 27 * CS * pk;
      ctx.drawImage(sp, ch.x - w / 2, ch.y - h / 2, w, h);
      ctx.strokeStyle = p.diamond;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.lineDashOffset = -((u * 14 + k * 5) % 100);
      ctx.beginPath();
      ctx.ellipse(ch.x, ch.y, w * 0.82, h * 0.72, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    // Glyphs ride their drops.
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = '15px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    const o = G.orb;
    for (const f of FLYERS) {
      const q = (u - f.start) / f.dur;
      if (q < 0 || q >= 1) continue;
      const s = visibleSeats[f.seat % visibleSeats.length]!;
      const bx = o.cx + Math.cos(f.rimA) * o.rx;
      const by = o.cy + Math.sin(f.rimA) * o.ry;
      ctx.fillText(GLYPH[f.kind], s.x + (bx - s.x) * q, s.y + (by - s.y) * q - Math.sin(Math.PI * q) * f.lift - 12);
    }
  };

  useImperativeHandle(ref, () => ({ paint }), []);

  const o = G.orb;
  const top = G.chairs.find((c) => !c.left && c.index === 3) ?? G.chairs[1]!;
  return (
    <div className="gds-orbscene" style={{ width: W, height: H, transform: `scale(${K})` }}>
      <span className="gds-orbscene__glow" style={{ left: o.cx - o.rx * 1.5, top: o.cy - o.ry * 1.6, width: o.rx * 3, height: o.ry * 3.2 }} />
      <div ref={lobeRef} className="gds-orbscene__lobe" style={{ width: (o.rx - 4) * 2, height: (o.ry - 4) * 2, left: 4, top: 4 }}>
        <img src="/day-story/you-live.webp" alt="" draggable={false} />
      </div>
      <svg className="gds-orbscene__goo" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <GooFilter id={`gds-orb-${uid}`} x={-40} y={-40} width={W + 80} height={H + 80} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#gds-orb-${uid})`}>
          <ellipse ref={ringRef} fill="none" rx={0} ry={0} />
          {Array.from({ length: RIM }, (_, i) => (
            <circle key={`r${i}`} ref={(el) => void (rim.current[i] = el)} r={0} />
          ))}
          {Array.from({ length: VOICE_RINGS.length * RING_BEADS }, (_, i) => (
            <circle key={`v${i}`} ref={(el) => void (voice.current[i] = el)} r={0} />
          ))}
          {visibleSeats.map((s, i) => (
            <rect key={`s${i}`} ref={(el) => void (seatEls.current[i] = el)} width={0} height={0} fill={mix(pal.seatFar, pal.seat, s.depth, 4)} />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={`n${i}`} ref={(el) => void (neckEls.current[i] = el)} r={0} fill={pal.seat} />
          ))}
          {[...G.tables[0], ...G.tables[1]].map((tb, i) => (
            <circle key={`t${i}`} ref={(el) => void (tableEls.current[i] = el)} cx={tb.x} cy={tb.y} r={0} fill={pal.diamond} />
          ))}
          {G.chairs.map((_, i) => (
            <rect key={`c${i}`} ref={(el) => void (chairEls.current[i] = el)} width={0} height={0} />
          ))}
          {FLYERS.map((_, i) => (
            <circle key={`f${i}`} ref={(el) => void (flyEls.current[i] = el)} r={0} />
          ))}
          {Array.from({ length: FLYERS.length * 4 }, (_, i) => (
            <circle key={`p${i}`} ref={(el) => void (sparkEls.current[i] = el)} r={0} />
          ))}
        </g>
      </svg>
      <canvas ref={canvasRef} className="gds-orbscene__canvas" width={W} height={H} />
      <span className="gds-orbscene__vip" style={{ left: top.x, top: G.vipTag.y }}>
        VIP · 6
      </span>
      <span className="gds-orbscene__vip" style={{ left: 2 * o.cx - top.x, top: G.vipTag.y }}>
        VIP
      </span>
    </div>
  );
});

export default DayStoryOrb;
