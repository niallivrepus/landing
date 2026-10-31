import { ArrowUp, Plus } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { JokuhOO } from "../../brand/JokuhOO";
import { GooFilter } from "../gooey-home/GooFilter";
import { GOO_ENV_PARAMS, GOO_ENV_SPRING, prefersReducedMotion, roleColor, springSettled, springStep, splexSpec, type GooScheme, type Spring } from "../gooey-home/goo-kit";
import { gulpGooPose, type GulpBox } from "./gulp-goo-core";

const PAD = 40;
const AMBIENT_S = 6;
const BAR_H = 56;
/** Milliseconds without a keystroke before the caret fuses into the Enter bead (`goo-ghost-typing.ts`). */
const TYPING_PAUSE_MS = 450;

/**
 * **Purpose:** The Gulp+ goo body (React port): the glass bar + the + drop through the house Splex filter, and the blue
 * (Splex glass accent: the pill at rest with two orbiting droplets, the caret / Enter bead when open) through its own
 * goo filter, plus the soft accent glow under the rest pill. Opening melts the pill into the bar (it thins mid-melt);
 * the blue drains into the send bead. Never takes pointer events.
 * **Ported from (jokuh-live):** `frontend/src/components/gooey/goo-home/GulpGooBody.tsx` (same pose, spring, ambient
 * 6 s breath + orbit, glow opacity 0.3 dark / 0.2 light), `gulp-goo-core.ts` (verbatim).
 */
function GulpGooBody({ open, typing, scheme, width }: { open: boolean; typing: boolean; scheme: GooScheme; width: number }) {
  const uid = useId().replace(/[:]/g, "");
  const host = useRef<HTMLDivElement>(null);
  const barEl = useRef<SVGRectElement>(null);
  const plusEl = useRef<SVGCircleElement>(null);
  const accentEl = useRef<SVGRectElement>(null);
  const glowEl = useRef<HTMLDivElement>(null);
  const dropEls = useRef<(SVGCircleElement | null)[]>([]);
  const st = useRef({ o: { x: open ? 1 : 0, v: 0 } as Spring, orbit: 0.8, ambient: 0, ambientLeft: AMBIENT_S, raf: 0, last: 0, visible: true });
  const props = useRef({ open, typing, width, scheme });
  props.current = { open, typing, width, scheme };

  const write = () => {
    const s = st.current;
    const p0 = props.current;
    const w = p0.width;
    const bar: GulpBox = { cx: w / 2, cy: 30, w, h: BAR_H };
    const amb = Math.min(1, s.ambientLeft) * s.ambient;
    const breath = Math.sin((s.orbit / 2.2) * 2.1) * 0.022 * amb * (1 - Math.min(1, s.o.x));
    const p = gulpGooPose({ o: s.o.x, bar, send: { cx: w - 26, cy: 30 }, plus: { cx: 26, cy: 30 }, typing: p0.typing, breath, orbit: s.orbit });
    const rect = (el: SVGRectElement | null, b: GulpBox) => {
      if (!el) return;
      const bw = Math.max(0, b.w);
      const bh = Math.max(0, b.h);
      el.setAttribute("x", (PAD + b.cx - bw / 2).toFixed(2));
      el.setAttribute("y", (PAD + b.cy - bh / 2).toFixed(2));
      el.setAttribute("width", bw.toFixed(2));
      el.setAttribute("height", bh.toFixed(2));
      el.setAttribute("rx", (Math.min(bw, bh) / 2).toFixed(2));
    };
    rect(barEl.current, p.bar);
    rect(accentEl.current, p.accent);
    if (plusEl.current) {
      plusEl.current.setAttribute("cx", (PAD + p.plus.cx).toFixed(2));
      plusEl.current.setAttribute("cy", (PAD + p.plus.cy).toFixed(2));
      plusEl.current.setAttribute("r", p.plusR.toFixed(2));
    }
    p.drops.forEach((d, i) => {
      const el = dropEls.current[i];
      if (!el) return;
      el.setAttribute("cx", (PAD + d.x).toFixed(2));
      el.setAttribute("cy", (PAD + d.y).toFixed(2));
      el.setAttribute("r", d.r.toFixed(2));
    });
    if (glowEl.current) glowEl.current.style.opacity = String((1 - Math.min(1, Math.max(0, s.o.x))) * (p0.scheme === "dark" ? 0.3 : 0.2));
  };

  const tick = (now: number) => {
    const s = st.current;
    const dt = s.last ? Math.min(0.064, (now - s.last) / 1000) : 1 / 60;
    s.last = now;
    if (!s.visible || document.visibilityState !== "visible") {
      s.raf = 0;
      s.last = 0;
      return;
    }
    const target = props.current.open ? 1 : 0;
    s.o = springStep(s.o, target, GOO_ENV_SPRING, dt);
    const settled = springSettled(s.o, target, 0.002);
    if (settled) s.o = { x: target, v: 0 };
    if (!props.current.open && s.ambientLeft > 0) {
      s.ambientLeft = Math.max(0, s.ambientLeft - dt);
      s.ambient = Math.min(1, s.ambient + dt * 2);
      s.orbit += dt * 2.2 * Math.min(1, s.ambientLeft);
    }
    write();
    const more = !settled || (!props.current.open && s.ambientLeft > 0);
    s.raf = more ? requestAnimationFrame(tick) : 0;
    if (!more) s.last = 0;
  };

  const wake = () => {
    const s = st.current;
    if (prefersReducedMotion()) {
      s.o = { x: props.current.open ? 1 : 0, v: 0 };
      s.ambientLeft = 0;
      write();
      return;
    }
    if (!s.raf && s.visible) s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!open) st.current.ambientLeft = AMBIENT_S;
    wake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, typing, scheme, width]);

  useEffect(() => {
    const el = host.current?.parentElement;
    if (!el) return undefined;
    write();
    const io = new IntersectionObserver((entries) => {
      st.current.visible = entries.some((e) => e.isIntersecting);
      if (st.current.visible) wake();
    });
    io.observe(el);
    const poke = () => {
      if (!props.current.open) {
        st.current.ambientLeft = AMBIENT_S;
        wake();
      }
    };
    el.addEventListener("pointerenter", poke);
    const onVis = () => document.visibilityState === "visible" && wake();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerenter", poke);
      document.removeEventListener("visibilitychange", onVis);
      if (st.current.raf) cancelAnimationFrame(st.current.raf);
      st.current.raf = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sw = width + PAD * 2;
  const sh = 60 + PAD * 2;
  const spec = splexSpec(scheme);
  return (
    <div ref={host} className="bc-gulp-goo" aria-hidden>
      <div ref={glowEl} className="bc-gulp-goo__glow" />
      <svg className="bc-gulp-goo__svg" width={sw} height={sh} viewBox={`0 0 ${sw} ${sh}`}>
        <defs>
          <GooFilter id={`bc-gulp-bar-${uid}`} x={0} y={0} width={sw} height={sh} spec={spec} params={GOO_ENV_PARAMS} />
          <GooFilter id={`bc-gulp-blue-${uid}`} x={0} y={0} width={sw} height={sh} spec={spec} params={GOO_ENV_PARAMS} />
        </defs>
        <g filter={`url(#bc-gulp-bar-${uid})`}>
          <rect ref={barEl} fill={roleColor(scheme, "base")} />
          <circle ref={plusEl} r="0" fill={roleColor(scheme, "knob")} />
        </g>
        <g filter={`url(#bc-gulp-blue-${uid})`}>
          <rect ref={accentEl} fill={roleColor(scheme, "accent")} />
          <circle ref={(el) => void (dropEls.current[0] = el)} r="0" fill={roleColor(scheme, "accent")} />
          <circle ref={(el) => void (dropEls.current[1] = el)} r="0" fill={roleColor(scheme, "accent")} />
        </g>
      </svg>
    </div>
  );
}

export const GULP_PLACEHOLDER = "Tip a friend, or send a flock";
const CHIPS = ["Tip 5 to Maya", "Send a flock", "Wake the city"] as const;

/**
 * **Purpose:** The Gulp+ bar as the Batcoin city's main control. At rest: the blue "Ask OO" pill with the real OO,
 * breathing, two droplets orbiting it. Tap it and it melts open into the glass bar (+ drop on the left, the blue
 * drained into the send bead: a caret while you type, a round Enter bead after a pause), with suggestion chips budding
 * above while the field is empty. Enter sends the line to the city (`onSend`) and the bar gulps back into the pill.
 * The reply line above the bar says what the bats are doing, and that nothing is really sent.
 * **Ported from (jokuh-live):** `frontend/src/components/gooey/goo-home/GulpPlus.tsx` (`GulpRestPill`, `GulpChips`),
 * `GulpGooBody.tsx`, `gulp-plus.css`, `goo-ghost-typing.ts`. Left out on purpose: the XP / level / combo game and the
 * OOpolis result bulge (they belong to the signed-in app).
 */
export function GulpPlusBar({ scheme, onSend, reply }: { scheme: GooScheme; onSend: (text: string) => void; reply: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [width, setWidth] = useState(360);
  const shell = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const typingTimer = useRef(0);

  useEffect(() => {
    const el = shell.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      const w = entries[entries.length - 1]?.contentRect.width;
      if (w) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(typingTimer.current);
    };
  }, []);

  const openBar = () => {
    setOpen(true);
    requestAnimationFrame(() => input.current?.focus());
  };

  const noteKey = () => {
    if (prefersReducedMotion()) return;
    setTyping(true);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => setTyping(false), TYPING_PAUSE_MS);
  };

  const send = (line: string) => {
    const v = line.trim();
    if (!v) return;
    onSend(v);
    setText("");
    setTyping(false);
    setOpen(false);
    input.current?.blur();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(text);
  };

  return (
    <form className="bc-gulp" onSubmit={submit} role="search" aria-label="Send bats across the city">
      <div className="bc-gulp__above">
        <p className="bc-gulp__reply" role="status" aria-live="polite">
          {reply}
        </p>
        <div
          className={`bc-gulp__chips${open && !text ? " is-shown" : ""}`}
          role="group"
          aria-label="Suggestions"
          aria-hidden={open && !text ? undefined : true}
          onPointerDown={(e) => e.preventDefault()}
        >
          {CHIPS.map((c, i) => (
            <button key={c} type="button" className="bc-gulp__chip" tabIndex={open && !text ? 0 : -1} style={{ transitionDelay: `${i * 40}ms` }} onClick={() => send(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div ref={shell} className={`bc-gulp__shell${open ? " is-open" : ""}`} data-typing={typing || undefined}>
        <GulpGooBody open={open} typing={typing} scheme={scheme} width={width} />
        <button
          type="button"
          className={`bc-gulp__rest${open ? "" : " is-shown"}`}
          aria-label="Ask OO"
          tabIndex={open ? -1 : 0}
          aria-hidden={open ? true : undefined}
          onClick={openBar}
        >
          <span className="bc-gulp__oo" aria-hidden>
            <JokuhOO size={30} />
          </span>
          <span>Ask OO</span>
        </button>
        <div className="bc-gulp__field" aria-hidden={open ? undefined : true}>
          <button
            type="button"
            className="bc-gulp__plus"
            aria-label="Show suggestions"
            tabIndex={open ? 0 : -1}
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              setText("");
              input.current?.focus();
            }}
          >
            <Plus size={18} strokeWidth={2.2} aria-hidden />
          </button>
          <input
            ref={input}
            className="bc-gulp__input"
            value={text}
            placeholder={GULP_PLACEHOLDER}
            aria-label="Tell the bats what to carry"
            enterKeyHint="send"
            autoComplete="off"
            maxLength={80}
            tabIndex={open ? 0 : -1}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              if (!text.trim()) window.setTimeout(() => setOpen(document.activeElement === input.current), 120);
            }}
            onChange={(e) => {
              setText(e.target.value);
              noteKey();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setText("");
                input.current?.blur();
                setOpen(false);
              }
            }}
          />
          <button type="submit" className="bc-gulp__send" aria-label="Send" tabIndex={open ? 0 : -1} disabled={!text.trim()}>
            <ArrowUp size={18} strokeWidth={2.4} aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );
}
