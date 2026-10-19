import { useEffect, useId, useRef, useState } from "react";
import { JokuhOO } from "../../brand/JokuhOO";
import { GooFilter } from "./GooFilter";
import { babyOOLook, SwarmIconSvg } from "./GooHeroSwarm";
import { GOO_ENV_PARAMS, prefersReducedMotion, roleColor, splexSpec, type GooScheme } from "./goo-kit";
import {
  CITY_BABIES,
  CITY_BUILDINGS,
  CITY_H,
  CITY_QUEEN,
  CITY_W,
  SWARM_ICON_PATHS,
  cityPose,
  cityRestPose,
  cityTag,
  type CityPose,
} from "./oo-swarm-model";
import { useGooLoop } from "./use-goo-loop";

const N = CITY_BABIES.length;
const BABY = 30;
/** How long a "done" label stays up after a baby finishes (s); it rides the baby home. */
const POP_HOLD = 2.2;

/** One goo building: a squat body, a chimney bead and a drip lobe at its foot (all merge through the goo filter). */
function BuildingGoo({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <rect x={x - 30} y={y - 24} width={60} height={50} rx={12} fill={fill} />
      <rect x={x + 8} y={y - 38} width={13} height={20} rx={6} fill={fill} />
      <circle cx={x - 18} cy={y + 30} r={5} fill={fill} />
    </g>
  );
}

function doingText(p: CityPose): string {
  const b = CITY_BUILDINGS[p.task.building]!;
  if (p.leg === "brief") return "Getting a task from Queen OO";
  if (p.leg === "back") return `${b.done[p.task.variant]}. Heading back`;
  return `${b.doing[p.task.variant]} in ${b.label}`;
}

/**
 * **Purpose:** The "OO & agents" section's live OOpolis, phone-sized (360 × 780 stage, scaled to the phone frame):
 * Queen OO (real `JokuhOO` queen look) at the centre hands out tasks; a task drop travels to a baby OO (real baby
 * looks) on its seat; the baby walks a goo street to one of six goo buildings (Spine, Text, Wallet, Calls, Flights,
 * Calendar), works, and pops a label of the real action it finished (`CITY_BUILDINGS`) on the way home. Tap a baby to
 * see its task. Everything is demo motion, no network.
 * **Perf:** buildings, streets and the Queen's blob are one static goo SVG (filtered once, never re-rendered); babies,
 * drops and labels are compositor transforms / opacity written by one rAF loop (`useGooLoop`) that runs only while
 * the section is on screen and the tab is visible. Lazy chunk, mounted when the section nears the viewport
 * (`GooeyHome` `LiveOopolis`). Reduce Motion: a still city (half the babies at work), tap still works.
 * **Parity:** jokuh-live Goo Lab "The full OOpolis" (`frontend/src/components/gooey-labs/goo-lab-agents-city.tsx`) and
 * the app's OOpolis (`frontend/src/agents/oopolis/`); same look rules (real OO art only).
 */
export default function GooOopolisLive({ scheme, alt }: { scheme: GooScheme; alt: string }) {
  const uid = useId().replace(/[:]/g, "");
  const frameEl = useRef<HTMLDivElement>(null);
  const stageEl = useRef<HTMLDivElement>(null);
  const babies = useRef<(HTMLButtonElement | null)[]>([]);
  const carries = useRef<(HTMLSpanElement | null)[]>([]);
  const pops = useRef<(HTMLSpanElement | null)[]>([]);
  const drops = useRef<(SVGCircleElement | null)[]>([]);
  const tethers = useRef<(SVGLineElement | null)[]>([]);
  const bubble = useRef<HTMLSpanElement>(null);
  const poses = useRef<CityPose[]>(CITY_BABIES.map((_, i) => cityRestPose(i, N)));
  const popUntil = useRef<number[]>(CITY_BABIES.map(() => -1));
  const lastLeg = useRef<string[]>(CITY_BABIES.map(() => ""));
  const clock = useRef(0);
  const [reduced] = useState(prefersReducedMotion);
  const [selected, setSelected] = useState<number | null>(null);
  const selectedRef = useRef<number | null>(null);
  selectedRef.current = selected;

  const paint = (t: number, still: boolean) => {
    clock.current = t;
    for (let i = 0; i < N; i++) {
      const p = still ? cityRestPose(i, N) : cityPose(i, N, t, CITY_BABIES[i]!.offset);
      poses.current[i] = p;
      const el = babies.current[i];
      if (el) el.style.transform = `translate3d(${(p.x - 22).toFixed(1)}px, ${(p.y - 22 + p.bob).toFixed(1)}px, 0)`;
      const art = el?.firstElementChild as HTMLElement | null;
      if (art) art.style.transform = `rotate(${p.lean.toFixed(1)}deg)`;
      // Carry the task icon while out and at work.
      const carrying = p.leg === "out" || p.leg === "work";
      const c = carries.current[i];
      if (c && c.dataset.on !== String(carrying)) {
        c.dataset.on = String(carrying);
        c.classList.toggle("is-on", carrying);
      }
      const icon = CITY_BUILDINGS[p.task.building]!.icon;
      if (c && c.dataset.icon !== icon) {
        c.dataset.icon = icon;
        c.querySelector("path")?.setAttribute("d", SWARM_ICON_PATHS[icon]);
      }
      // Finished: work → back pops the done label for POP_HOLD seconds.
      if (!still && lastLeg.current[i] === "work" && p.leg === "back") {
        popUntil.current[i] = t + POP_HOLD;
        const pop = pops.current[i];
        if (pop) pop.textContent = CITY_BUILDINGS[p.task.building]!.done[p.task.variant]!;
      }
      lastLeg.current[i] = p.leg;
      const showPop = t < popUntil.current[i]! && selectedRef.current !== i;
      const pop = pops.current[i];
      if (pop && pop.classList.contains("is-on") !== showPop) pop.classList.toggle("is-on", showPop);
      // Task drop: Queen → baby along a hairline.
      const d = drops.current[i];
      const tl = tethers.current[i];
      if (d && tl) {
        if (p.drop >= 0) {
          const e = 1 - (1 - p.drop) ** 2;
          d.setAttribute("cx", (CITY_QUEEN.x + (p.x - CITY_QUEEN.x) * e).toFixed(1));
          d.setAttribute("cy", (CITY_QUEEN.y + (p.y - CITY_QUEEN.y) * e - Math.sin(e * Math.PI) * 10).toFixed(1));
          d.setAttribute("r", (3.5 + Math.sin(e * Math.PI) * 1.5).toFixed(2));
          d.style.opacity = "1";
          tl.setAttribute("x2", p.x.toFixed(1));
          tl.setAttribute("y2", p.y.toFixed(1));
          tl.style.opacity = (0.5 * (1 - e * 0.6)).toFixed(2);
        } else if (d.style.opacity !== "0") {
          d.style.opacity = "0";
          tl.style.opacity = "0";
        }
      }
    }
    const s = selectedRef.current;
    if (s != null && bubble.current) {
      const p = poses.current[s]!;
      bubble.current.style.transform = `translate3d(${p.x.toFixed(1)}px, ${(p.y - 30 + p.bob).toFixed(1)}px, 0) translate(-50%, -100%)`;
      const text = `${CITY_BABIES[s]!.name} · ${doingText(p)}`;
      if (bubble.current.textContent !== text) bubble.current.textContent = text;
    }
  };

  const { wake } = useGooLoop(frameEl, (_dt, t) => {
    paint(t, false);
    return true;
  });

  // Fit the 360 × 780 stage to the phone frame (ResizeObserver; never read in the loop).
  useEffect(() => {
    const el = frameEl.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      const w = entries[entries.length - 1]?.contentRect.width ?? CITY_W;
      stageEl.current?.style.setProperty("--k", (w / CITY_W).toFixed(4));
    });
    ro.observe(el);
    if (reduced) paint(0, true);
    else wake();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // Reduce Motion: repaint once when the selection changes (no loop runs).
  useEffect(() => {
    if (reduced) paint(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, reduced]);

  // A picked baby's card closes by itself after a while.
  useEffect(() => {
    if (selected == null) return undefined;
    const t = window.setTimeout(() => setSelected(null), 4200);
    return () => window.clearTimeout(t);
  }, [selected]);

  const fill = roleColor(scheme, "base");
  const ink = scheme === "dark" ? "#ffffff" : "#111111";
  return (
    <figure className="gh-phone gh-city" ref={frameEl} aria-label={alt} onClick={() => setSelected(null)}>
      <div className="gh-city__stage" ref={stageEl} style={{ width: CITY_W, height: CITY_H }}>
        <div className="gh-city__head">
          <span className="gh-city__title">OOpolis</span>
          <span className="gh-city__sub">{N} agents at work · they ask before they act</span>
        </div>

        <svg className="gh-city__goo" width={CITY_W} height={CITY_H} viewBox={`0 0 ${CITY_W} ${CITY_H}`} aria-hidden>
          <defs>
            <GooFilter id={`gh-city-${uid}`} x={0} y={0} width={CITY_W} height={CITY_H} spec={splexSpec(scheme)} params={GOO_ENV_PARAMS} />
          </defs>
          <g filter={`url(#gh-city-${uid})`}>
            {CITY_BUILDINGS.map((b) => (
              <line key={`s-${b.key}`} x1={CITY_QUEEN.x} y1={CITY_QUEEN.y} x2={b.x} y2={b.y} stroke={fill} strokeWidth={9} strokeLinecap="round" />
            ))}
            <circle cx={CITY_QUEEN.x} cy={CITY_QUEEN.y} r={CITY_QUEEN.r + 10} fill={fill} />
            {CITY_BUILDINGS.map((b) => (
              <BuildingGoo key={b.key} x={b.x} y={b.y} fill={fill} />
            ))}
          </g>
          <g>
            {CITY_BABIES.map((_, i) => (
              <line
                key={`t-${i}`}
                ref={(el) => {
                  tethers.current[i] = el;
                }}
                x1={CITY_QUEEN.x}
                y1={CITY_QUEEN.y}
                x2={CITY_QUEEN.x}
                y2={CITY_QUEEN.y}
                stroke="#2c81ff"
                strokeWidth={1.2}
                strokeDasharray="2 4"
                strokeLinecap="round"
                style={{ opacity: 0 }}
              />
            ))}
            {CITY_BABIES.map((_, i) => (
              <circle
                key={`d-${i}`}
                ref={(el) => {
                  drops.current[i] = el;
                }}
                className="gh-city__drop"
                cx={CITY_QUEEN.x}
                cy={CITY_QUEEN.y}
                r={4}
                fill="#2c81ff"
                style={{ opacity: 0 }}
              />
            ))}
          </g>
        </svg>

        {CITY_BUILDINGS.map((b) => {
          const tag = cityTag(b);
          return (
            <div key={b.key}>
              <span className="gh-city__bldg-icon" style={{ left: b.x, top: b.y, color: ink }}>
                <SwarmIconSvg icon={b.icon} size={18} />
              </span>
              <span className="gh-city__bldg-name" style={{ left: tag.x, top: tag.y }}>
                {b.label}
              </span>
            </div>
          );
        })}

        <div className="gh-city__queen" style={{ left: CITY_QUEEN.x, top: CITY_QUEEN.y }}>
          <JokuhOO size={68} look="queen" label="Queen OO" />
          <span className="gh-city__queen-name">Queen OO</span>
        </div>

        {CITY_BABIES.map((b, i) => (
          <button
            key={i}
            type="button"
            ref={(el) => {
              babies.current[i] = el;
            }}
            className={`gh-city__baby${selected === i ? " is-picked" : ""}`}
            aria-label={`${b.name}, a baby OO. Show its task`}
            aria-pressed={selected === i}
            onClick={(e) => {
              e.stopPropagation();
              setSelected((s) => (s === i ? null : i));
            }}
          >
            <span className="gh-city__baby-art">
              <JokuhOO size={BABY} look={babyOOLook(b.look)} />
              <span
                className="gh-city__carry"
                ref={(el) => {
                  carries.current[i] = el;
                }}
              >
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="" />
                </svg>
              </span>
            </span>
            <span
              className="gh-city__pop"
              aria-hidden
              ref={(el) => {
                pops.current[i] = el;
              }}
            />
          </button>
        ))}

        <span ref={bubble} className={`gh-city__bubble${selected != null ? " is-on" : ""}`} role="status" aria-live="polite" />

        <div className="gh-city__foot">Tap a baby OO to see its task</div>
      </div>
    </figure>
  );
}
