import { useEffect, useRef } from "react";

/* ── Seeded PRNG (Mulberry32) ── */
function m32(s: number) {
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RING_C = [
  "#f00", "#0f0", "#08f", "#f0f", "#fc0",
  "#f60", "#0fc", "#f36", "#c0f", "#0ff",
];

const VILLAIN_COUNT = 300;

/* ── Pill-shaped path helper (rounded-[999px] at 40×54) ── */
function pillPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
) {
  const r = w / 2;
  const half = h / 2;
  ctx.beginPath();
  ctx.moveTo(cx - r, cy - half + r);
  ctx.arcTo(cx - r, cy - half, cx, cy - half, r);
  ctx.arcTo(cx + r, cy - half, cx + r, cy - half + r, r);
  ctx.lineTo(cx + r, cy + half - r);
  ctx.arcTo(cx + r, cy + half, cx, cy + half, r);
  ctx.arcTo(cx - r, cy + half, cx - r, cy + half - r, r);
  ctx.closePath();
}

/* ── Load all 300 villain PNGs into a sprite atlas ── */
function loadAtlas(): Promise<{
  canvas: HTMLCanvasElement;
  cols: number;
  meta: { ring: string | null }[];
}> {
  const AVT_W = 40;
  const AVT_H = 54;
  const cols = Math.ceil(Math.sqrt(VILLAIN_COUNT));
  const rows = Math.ceil(VILLAIN_COUNT / cols);

  const meta: { ring: string | null }[] = [];
  for (let i = 0; i < VILLAIN_COUNT; i++) {
    const rng = m32(i * 7919 + 9999);
    meta.push({
      ring: rng() > 0.72 ? RING_C[Math.floor(rng() * RING_C.length)] : null,
    });
  }

  return new Promise((resolve) => {
    const atlas = document.createElement("canvas");
    atlas.width = cols * AVT_W;
    atlas.height = rows * AVT_H;
    const actx = atlas.getContext("2d")!;
    let loaded = 0;

    for (let i = 0; i < VILLAIN_COUNT; i++) {
      const img = new Image();
      img.src = `/villains/villain-${String(i + 1).padStart(4, "0")}.png`;
      img.onload = () => {
        const ax = (i % cols) * AVT_W;
        const ay = Math.floor(i / cols) * AVT_H;
        actx.drawImage(img, ax, ay, AVT_W, AVT_H);
        loaded++;
        if (loaded === VILLAIN_COUNT) resolve({ canvas: atlas, cols, meta });
      };
      img.onerror = () => {
        loaded++;
        if (loaded === VILLAIN_COUNT) resolve({ canvas: atlas, cols, meta });
      };
    }
  });
}

/* ── Grid constants (40×54 pill cells) ── */
const CELL_W = 32;
const CELL_H = 44;
const GAP = 12;
const SP_X = CELL_W + GAP;
const SP_Y = (CELL_H + GAP) * 0.866;
const HEX_COLS = 27;
const HEX_ROWS = 19;
const GW = HEX_COLS * SP_X;
const GH = HEX_ROWS * SP_Y;
const MAX_R = 420;

export function V1llainsHoneycombHero() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const st = {
      ox: 0,
      oy: 0,
      vx: 0,
      vy: 0,
      drag: false,
      lx: 0,
      ly: 0,
      mx: 0.5,
      my: 0.5,
      hover: false,
      w: 0,
      h: 0,
      t0: performance.now(),
    };

    const sizeCanvas = () => {
      const r = cvs.parentElement!.getBoundingClientRect();
      cvs.width = r.width * dpr;
      cvs.height = r.height * dpr;
      cvs.style.width = `${r.width}px`;
      cvs.style.height = `${r.height}px`;
      st.w = r.width;
      st.h = r.height;
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    const cells: { gx: number; gy: number; vi: number }[] = [];
    for (let r = 0; r < HEX_ROWS; r++)
      for (let c = 0; c < HEX_COLS; c++)
        cells.push({
          gx: (c - HEX_COLS / 2) * SP_X + (r & 1 ? SP_X / 2 : 0),
          gy: (r - HEX_ROWS / 2) * SP_Y,
          vi: (r * HEX_COLS + c) % VILLAIN_COUNT,
        });

    let alive = true;

    loadAtlas().then(({ canvas: atlas, cols: aC, meta }) => {
      if (!alive) return;
      const AVT_W = 40;
      const AVT_H = 54;

      const frame = () => {
        if (!alive) return;
        requestAnimationFrame(frame);

        const now = performance.now();
        const t = (now - st.t0) / 1000;

        if (!st.drag) {
          if (Math.abs(st.vx) > 0.1 || Math.abs(st.vy) > 0.1) {
            st.ox += st.vx;
            st.oy += st.vy;
            st.vx *= 0.955;
            st.vy *= 0.955;
            if (Math.abs(st.vx) < 0.05) st.vx = 0;
            if (Math.abs(st.vy) < 0.05) st.vy = 0;
          } else {
            st.ox += 0.35;
            st.oy -= 0.5;
          }
        }

        const fox = st.ox;
        const foy = st.oy;

        const { w, h } = st;
        const cx = w / 2;
        const cy = h / 2;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        const breathe = Math.sin(t * 0.9) * 0.025;

        type Item = { sx: number; sy: number; dist: number; vi: number };
        const items: Item[] = [];

        for (const cell of cells) {
          const wx =
            (((cell.gx + fox) % GW) + GW * 1.5) % GW - GW / 2;
          const wy =
            (((cell.gy + foy) % GH) + GH * 1.5) % GH - GH / 2;
          const dist = Math.hypot(wx, wy);
          if (dist > MAX_R * 1.45) continue;
          items.push({ sx: cx + wx, sy: cy + wy, dist, vi: cell.vi });
        }

        items.sort((a, b) => b.dist - a.dist);

        ctx.imageSmoothingEnabled = false;

        for (const it of items) {
          const norm = Math.max(0, 1 - it.dist / MAX_R);
          const scale = 0.3 + (0.82 + breathe) * norm * norm;
          const alpha = Math.max(0.05, norm * norm * 0.92 + 0.08 * norm);
          const sw = CELL_W * scale;
          const sh = CELL_H * scale;

          ctx.globalAlpha = alpha;

          ctx.fillStyle = "#0d0d0d";
          pillPath(ctx, it.sx, it.sy, sw, sh);
          ctx.fill();

          ctx.save();
          pillPath(ctx, it.sx, it.sy, sw - 2, sh - 2);
          ctx.clip();
          const srcX = (it.vi % aC) * AVT_W;
          const srcY = Math.floor(it.vi / aC) * AVT_H;
          ctx.drawImage(
            atlas,
            srcX,
            srcY,
            AVT_W,
            AVT_H,
            it.sx - sw / 2,
            it.sy - sh / 2,
            sw,
            sh,
          );
          ctx.restore();

          if (norm > 0.15) {
            ctx.save();
            pillPath(ctx, it.sx, it.sy, sw - 2, sh - 2);
            ctx.clip();
            ctx.strokeStyle = `rgba(255,255,255,${0.15 * norm})`;
            ctx.lineWidth = 1;
            pillPath(ctx, it.sx, it.sy - 0.5, sw - 2, sh - 2);
            ctx.stroke();
            ctx.restore();
          }

          const m = meta[it.vi];
          if (m.ring && norm > 0.22) {
            ctx.strokeStyle = m.ring;
            ctx.lineWidth = 3 * scale;
            ctx.shadowColor = m.ring;
            ctx.shadowBlur = 6 * norm;
            pillPath(ctx, it.sx, it.sy, sw, sh);
            ctx.stroke();
            ctx.shadowBlur = 0;
          } else if (norm > 0.12) {
            ctx.strokeStyle = "rgba(255,255,255,0.06)";
            ctx.lineWidth = 1;
            pillPath(ctx, it.sx, it.sy, sw, sh);
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 1;
        const vr = Math.max(w, h) * 0.56;
        const grad = ctx.createRadialGradient(
          cx,
          cy,
          vr * 0.32,
          cx,
          cy,
          vr,
        );
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.5, "rgba(0,0,0,0.4)");
        grad.addColorStop(1, "rgba(0,0,0,0.97)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      };

      requestAnimationFrame(frame);
    });

    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      st.drag = true;
      st.lx = e.clientX;
      st.ly = e.clientY;
      st.vx = 0;
      st.vy = 0;
      cvs.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.lx;
      const dy = e.clientY - st.ly;
      st.vx = dx * 0.55;
      st.vy = dy * 0.55;
      st.ox += dx;
      st.oy += dy;
      st.lx = e.clientX;
      st.ly = e.clientY;
    };
    const up = () => {
      st.drag = false;
    };
    const mouseMove = (e: MouseEvent) => {
      const r = cvs.getBoundingClientRect();
      st.mx = (e.clientX - r.left) / r.width;
      st.my = (e.clientY - r.top) / r.height;
      st.hover = true;
    };
    const mouseLeave = () => {
      st.hover = false;
    };

    cvs.addEventListener("pointerdown", down);
    cvs.addEventListener("pointermove", move);
    cvs.addEventListener("pointerup", up);
    cvs.addEventListener("pointerleave", up);
    cvs.addEventListener("mousemove", mouseMove);
    cvs.addEventListener("mouseleave", mouseLeave);

    return () => {
      alive = false;
      window.removeEventListener("resize", sizeCanvas);
      cvs.removeEventListener("pointerdown", down);
      cvs.removeEventListener("pointermove", move);
      cvs.removeEventListener("pointerup", up);
      cvs.removeEventListener("pointerleave", up);
      cvs.removeEventListener("mousemove", mouseMove);
      cvs.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    />
  );
}
