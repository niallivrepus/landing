import { useEffect, useRef, useState } from "react";
import { GetJokuhButton, GetJokuhSheet } from "../gooey-home/GetJokuh";
import { prefersReducedMotion, type GooScheme } from "../gooey-home/goo-kit";
import { useGooLoop } from "../gooey-home/use-goo-loop";
import { SiteFooter } from "../../SiteFooter";
import { SiteLink } from "../../SiteLink";
import { newBatBuf, traceBat } from "./bat-silhouette";
import { BatGooRenderer, buildFxAtlas, CIRCLE_FRAME, FX_COIN, FX_GLINT, FX_RING } from "./bat-goo-renderer";
import { batcoinReply, coinsToDraw, parseBatcoinCommand } from "./batcoin-command";
import { DISTRICTS, districtAt, layoutCity, type CityLayout, type DistrictId } from "./batcoin-city-layout";
import { BatcoinCitySim, batPose, Mode } from "./batcoin-city-sim";
import { CitySkyline } from "./CitySkyline";
import { GulpPlusBar } from "./GulpPlusBar";
import "../../../styles/gooey-home.css";
import "../../../styles/batcoin.css";

/** The page's facts, one per district. Each is true in the app today (see the report / commit for sources). */
export const BATCOIN_CARDS: { id: DistrictId; title: string; body: string }[] = [
  { id: "welcome", title: "9 to start", body: "New accounts get 9 Batcoin when they join." },
  { id: "invites", title: "Invite a friend", body: "When a friend you invite joins, you both get 9." },
  { id: "streaks", title: "Daily streak", body: "Post a blurb every day: 1 a day, plus bonus coins on days 3, 6 and 9." },
  { id: "tips", title: "Tips", body: "Tip friends with Batcoin in Jokuh." },
  { id: "swap", title: "Swap", body: "Get more Batcoin in the app's Swap." },
];

export const BATCOIN_LINE = "The coin inside Jokuh. You get some when you join, and more for inviting friends and posting.";

type Perf = { frames: number; work: number[]; dts: number[]; bats: number };

declare global {
  interface Window {
    __batcoinCity?: Perf & { sample: () => number[]; state: () => { coins: number; coinAt: number[][]; jobs: number; flying: number; roosting: number; gl: boolean } };
  }
}

function useStageSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      const r = entries[entries.length - 1]?.contentRect;
      if (!r) return;
      setSize((s) => (s && Math.abs(s.w - r.width) < 1 && Math.abs(s.h - r.height) < 1 ? s : { w: Math.round(r.width), h: Math.round(r.height) }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/** Fills one frame's instance lists from the sim. */
function fill(r: BatGooRenderer, sim: BatcoinCitySim, phone: boolean) {
  r.begin();
  for (const b of sim.bats) {
    const p = batPose(b);
    if (!p.visible || p.span < 2) continue;
    r.pushMask(b.x, b.y, p.span, p.bank, BatGooRenderer.flapFrame(p.flap));
  }
  for (const d of sim.drops) if (d.live) r.pushMask(d.x, d.y, d.r * 2, 0, CIRCLE_FRAME);
  for (const j of sim.jobs) if (j.live && j.blobR > 0.5) r.pushMask(j.x, j.y, j.blobR * 2, 0, CIRCLE_FRAME);
  const coin = phone ? 36 : 42;
  for (const c of sim.coins) {
    if (!c.live) continue;
    if (c.state === 2) {
      const k = Math.min(1, c.t / 0.5);
      r.pushFx(c.x, c.y, coin * (1 + 0.8 * k), 0, FX_COIN, 1 - k);
      r.pushFx(c.x, c.y, 40 + 150 * k, 0, FX_RING, (1 - k) * 0.9);
    } else {
      r.pushFx(c.x, c.y, coin, Math.sin(sim.time * 3 + c.carrier) * 0.25, FX_COIN, 1);
    }
  }
  // The app's glint where a blob popped: r = 15 · sin(π g), at (+10, −10), turning 1.2 rad.
  for (const j of sim.jobs) {
    if (!j.live || j.glint <= 0) continue;
    const rr = 15 * Math.sin(Math.PI * j.glint);
    if (rr > 0.5) r.pushFx(j.x + 10, j.y - 10, (rr * 128) / 52, j.glint * 1.2, FX_GLINT, 1);
  }
}

/** Canvas 2D fallback (no WebGL2): the same outlines, flat ink with a hairline rim, no goo merge. */
function draw2d(ctx: CanvasRenderingContext2D, sim: BatcoinCitySim, dark: boolean, buf: Float64Array) {
  const { w, h } = sim.city;
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  for (const b of sim.bats) {
    const p = batPose(b);
    if (!p.visible || p.span < 2) continue;
    traceBat(ctx, b.x, b.y, p.span, p.flap, p.bank, buf);
  }
  for (const j of sim.jobs) {
    if (j.live && j.blobR > 0.5) {
      ctx.moveTo(j.x + j.blobR, j.y);
      ctx.arc(j.x, j.y, j.blobR, 0, Math.PI * 2);
    }
  }
  ctx.fillStyle = dark ? "#000" : "#141414";
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = dark ? "rgba(181,111,255,0.8)" : "rgba(255,255,255,0.5)";
  ctx.stroke();
  ctx.fillStyle = "#FFC633";
  for (const c of sim.coins) {
    if (!c.live || c.state === 2) continue;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

type Pop = { id: number; x: number; y: number; text: string };

/**
 * **Purpose:** `/batcoin`: a full-screen living Batcoin city. Jokuh's goo bats (the iOS app's bat swarm, ported
 * 1:1) roost on five goo districts, take off in flocks, circle the towers, carry glowing Batcoin between districts,
 * merge into one goo blob when they land and pop out again. The cursor attracts bats (a click scatters them); a tap
 * on a district sends a flock out with coins; the Gulp+ bar takes "tip 5 to Maya", "send a flock" or "wake the
 * city". Overlay: title, one line, the five Batcoin facts (one per district) and Download Jokuh (the shared sheet).
 * **Motion:** one rAF loop (`useGooLoop`) only while the stage is on screen and the tab is visible; fixed 1/60 s sim.
 * Reduce Motion: one calm still frame that fades in slowly; no loop.
 * **Connects to:** `pages/BatcoinPage.tsx`, `batcoin-city-sim.ts`, `bat-goo-renderer.ts`, `CitySkyline.tsx`,
 * `GulpPlusBar.tsx`, `GetJokuh.tsx` (sheet), `styles/batcoin.css`.
 */
export function BatcoinCity({ scheme }: { scheme: GooScheme }) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const size = useStageSize(stage);
  const [city, setCity] = useState<CityLayout | null>(null);
  const [active, setActive] = useState(-1);
  const [reply, setReply] = useState("");
  const [pops, setPops] = useState<Pop[]>([]);
  const [reduced] = useState(prefersReducedMotion);
  const [calmIn, setCalmIn] = useState(false);
  const sim = useRef<BatcoinCitySim | null>(null);
  const gl = useRef<BatGooRenderer | null>(null);
  const ctx2d = useRef<CanvasRenderingContext2D | null>(null);
  const clock = useRef(0);
  const buf = useRef(newBatBuf());
  const perf = useRef<Perf>({ frames: 0, work: [], dts: [], bats: 0 });
  const thermal = useRef(false);
  const popId = useRef(0);
  const cardCool = useRef<number[]>([]);
  const activeTimer = useRef(0);

  useEffect(() => {
    thermal.current = new URLSearchParams(window.location.search).get("rim") === "thermal";
  }, []);

  // Layout follows the stage size.
  useEffect(() => {
    if (!size) return;
    const next = layoutCity(size.w, size.h);
    setCity(next);
    if (sim.current) sim.current.resize(next);
    else {
      sim.current = new BatcoinCitySim(next);
      // Start mid-life: flocks formed, a delivery under way (also the Reduce Motion still frame).
      sim.current.advance(reduced ? 2.9 : 1.2, 400);
      clock.current = sim.current.time;
    }
  }, [size, reduced]);

  const render = () => {
    const s = sim.current;
    if (!s) return;
    if (gl.current) {
      gl.current.look = { dark: scheme === "dark", thermal: thermal.current };
      fill(gl.current, s, s.city.phone);
      gl.current.render();
    } else if (ctx2d.current) {
      draw2d(ctx2d.current, s, scheme === "dark", buf.current);
    }
    perf.current.frames += 1;
  };

  // Renderer (WebGL2, else Canvas 2D), sized to the stage.
  useEffect(() => {
    const cv = canvas.current;
    if (!cv || !size) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!gl.current && !ctx2d.current) {
      gl.current = BatGooRenderer.create(cv);
      if (!gl.current) ctx2d.current = cv.getContext("2d");
    }
    if (gl.current) gl.current.resize(size.w, size.h, dpr);
    else if (ctx2d.current) {
      cv.width = Math.round(size.w * dpr);
      cv.height = Math.round(size.h * dpr);
      ctx2d.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    render();
    if (reduced) requestAnimationFrame(() => setCalmIn(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  // Coin art: the real Batcoin mark on a gold disc, once the SVG has loaded.
  useEffect(() => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!gl.current) return;
      gl.current.setFx(buildFxAtlas(img, scheme === "dark"));
      if (reduced) render();
    };
    img.src = "/batcoin-token.svg";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheme]);

  useEffect(() => {
    if (reduced) render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheme]);

  useEffect(
    () => () => {
      gl.current?.dispose();
      gl.current = null;
      window.clearTimeout(activeTimer.current);
    },
    [],
  );

  const flash = (district: number) => {
    setActive(district);
    window.clearTimeout(activeTimer.current);
    activeTimer.current = window.setTimeout(() => setActive(-1), 1400);
  };

  const { wake } = useGooLoop(stage, (dt) => {
    const s = sim.current;
    if (!s || reduced) return false;
    const t0 = performance.now();
    clock.current += dt;
    s.advance(clock.current);
    if (s.events.length) {
      for (const e of s.events) {
        if (e.tag) {
          const id = ++popId.current;
          setPops((p) => [...p.slice(-3), { id, x: e.x, y: e.y, text: e.tag! }]);
          window.setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 1900);
          flash(e.district);
        }
      }
      s.events.length = 0;
    }
    perf.current.dts.push(dt * 1000);
    if (perf.current.dts.length > 900) perf.current.dts.shift();
    perf.current.bats = s.bats.length;
    render();
    // CPU time for this frame: sim steps + instance fill + GL submission.
    perf.current.work.push(performance.now() - t0);
    if (perf.current.work.length > 900) perf.current.work.shift();
    return true;
  });

  useEffect(() => {
    window.__batcoinCity = Object.assign(perf.current, {
      sample: () => {
        const s = sim.current;
        return s ? s.bats.slice(0, 12).flatMap((b) => [Math.round(b.x), Math.round(b.y)]) : [];
      },
      state: () => {
        const s = sim.current;
        return {
          coins: s ? s.coins.filter((c) => c.live).length : 0,
          coinAt: s ? s.coins.filter((c) => c.live).map((c) => [Math.round(c.x), Math.round(c.y), c.state]) : [],
          jobs: s ? s.jobs.filter((j) => j.live).length : 0,
          flying: s ? s.bats.filter((b) => b.mode !== Mode.Hidden && b.mode !== Mode.Roost).length : 0,
          roosting: s ? s.bats.filter((b) => b.mode === Mode.Roost).length : 0,
          gl: Boolean(gl.current),
        };
      },
    });
    if (!reduced) wake();
    return () => {
      delete window.__batcoinCity;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  /* ── Pointer: attract on hover (mouse), scatter on a tap in the sky, a flock on a tap on a district ── */

  const local = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const isStage = (e: React.PointerEvent) => {
    const t = e.target as HTMLElement;
    return !t.closest("a, button, input, form, .bc-card, .bc-head > *");
  };

  const sendFrom = (from: number, coins: number, tag: string | null) => {
    const s = sim.current;
    if (!s || reduced) return false;
    const nd = DISTRICTS.length;
    let to = Math.floor(Math.random() * (nd - 1));
    if (to >= from) to++;
    const ok = s.deliver(from, to, Math.min(16, 7 + coins), coinsToDraw(coins), tag);
    if (ok) flash(from);
    return ok;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = sim.current;
    if (!s || reduced || e.pointerType !== "mouse") return;
    if (!isStage(e)) {
      s.pointer.on = false;
      return;
    }
    const p = local(e);
    s.pointer = { x: p.x, y: p.y, on: true };
  };
  const onPointerLeave = () => {
    if (sim.current) sim.current.pointer.on = false;
  };
  const onPointerDown = (e: React.PointerEvent) => {
    const s = sim.current;
    if (!s || reduced || !isStage(e) || !city) return;
    const p = local(e);
    const d = districtAt(city, p.x, p.y);
    if (d >= 0) sendFrom(d, 1 + Math.floor(Math.random() * 3), null);
    else s.scatter(p.x, p.y);
  };

  const onCard = (i: number) => {
    const now = performance.now();
    if ((cardCool.current[i] ?? 0) > now) return;
    cardCool.current[i] = now + 2600;
    sendFrom(i, 2, null);
  };

  const onGulp = (text: string) => {
    const cmd = parseBatcoinCommand(text);
    const s = sim.current;
    const line = batcoinReply(cmd);
    setReply(line ? `${line} Just for show: nothing is sent.` : "");
    if (!s || reduced) return;
    if (cmd.kind === "sweep") {
      s.sweep();
      return;
    }
    if (cmd.kind === "deliver") {
      const from = cmd.from === "tips" ? DISTRICTS.findIndex((d) => d.id === "tips") : Math.floor(Math.random() * DISTRICTS.length);
      const tag = cmd.name ? `+${cmd.coins} for ${cmd.name}` : `+${cmd.coins}`;
      if (!sendFrom(from, cmd.coins, tag)) sendFrom((from + 2) % DISTRICTS.length, cmd.coins, tag);
    }
  };

  return (
    <div className="gh bc" data-scheme={scheme}>
      <section
        ref={stage}
        className="bc-stage"
        aria-labelledby="bc-title"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        {city ? <CitySkyline city={city} scheme={scheme} active={active} /> : null}
        <canvas
          ref={canvas}
          className={`bc-bats${reduced ? " bc-bats--calm" : ""}${calmIn ? " is-in" : ""}`}
          style={size ? { width: size.w, height: size.h } : undefined}
          aria-hidden
          data-testid="batcoin-canvas"
        />
        {pops.map((p) => (
          <span key={p.id} className="bc-pop" style={{ left: p.x, top: p.y }} aria-hidden>
            {p.text}
          </span>
        ))}

        <div className="bc-over">
        <header className="bc-head">
          <SiteLink href="/" className="bc-home gh-slab gh-slab--pill">
            Jokuh
          </SiteLink>
          <h1 id="bc-title" className="bc-title">
            <span className="bc-coin" aria-hidden />
            Batcoin
          </h1>
          <p className="bc-line">{BATCOIN_LINE}</p>
          <div className="bc-cta">
            <GetJokuhButton size="sm" />
          </div>
          <p className="bc-hint">{reduced ? "A still frame of the Batcoin city." : "Tap a district to send a flock with coins."}</p>
        </header>

        <ul className="bc-cards" aria-label="How you get Batcoin">
          {BATCOIN_CARDS.map((c, i) => (
            <li key={c.id} className={`bc-card gh-slab${active === i ? " is-on" : ""}`} onPointerEnter={(e) => e.pointerType === "mouse" && onCard(i)}>
              <h2 className="bc-card__title">
                <span className="bc-card__dot" aria-hidden />
                {c.title}
              </h2>
              <p className="bc-card__body">{c.body}</p>
            </li>
          ))}
        </ul>
        </div>

        <div className="bc-dock">
          <GulpPlusBar scheme={scheme} onSend={onGulp} reply={reply} />
        </div>
      </section>
      <SiteFooter scheme={scheme} />
      <GetJokuhSheet />
    </div>
  );
}
