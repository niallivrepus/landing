/**
 * **Purpose:** Framework-free maths + copy for the OO swarm: the hero's background baby OOs (`GooHeroSwarm`) and the
 * live OOpolis in the "OO & agents" section (`GooOopolisLive`). Pure functions of time, so the views only write
 * `transform` / `opacity` per frame (no layout reads in the loop).
 * **Copy rule:** every action label is something Jokuh really does (Spine save + morning brief, Text drafts, Wallet
 * Pay, call recaps (`meeting-summarize`), Spine reminders, OO flight search (`search_flights`), Meet links). Never add
 * an action the product can't do ("booked" a flight is not real: OO finds flights, it doesn't buy them).
 * **Baby looks:** Gooey `avatar.tsx` `OO_ORIGIN_COLORS` (same hex as jokuh-live
 * `frontend/src/utils/gooey-oo-origin-palettes.ts`) on the OOpolis Figma disc pairing (`oopolis-city.ts`
 * `OOPOLIS_ORIGIN_BG`, Swift `OopolisOOLook.origin`). `life` (lime) is left out on purpose: it read as a fake OO.
 * **Parity:** jokuh-live `frontend/src/guest-home/oo-swarm-model.ts` (byte-for-byte copy; keep in sync).
 */

export type SwarmIcon = "calendar" | "message" | "coin" | "phone" | "doc" | "note" | "plane";

/** Baby OO looks: origin palettes, plus `oo` (the real OO, insight on blue). */
export type BabyLook = "oo" | "fruta" | "flame" | "solar" | "aether" | "spirit";

export type BabyColors = { bg: string; bodyStart: string; bodyEnd: string; stroke: string; eye: string };

export const BABY_COLORS: Record<BabyLook, BabyColors> = {
  oo: { bg: "#0066FF", bodyStart: "#7700FF", bodyEnd: "#B300FF", stroke: "#E2C5FF", eye: "#FFFFFF" },
  fruta: { bg: "#21DC11", bodyStart: "#CB0B03", bodyEnd: "#FF0970", stroke: "#FFB4B1", eye: "#FFFFFF" },
  flame: { bg: "#9327FF", bodyStart: "#FF4D00", bodyEnd: "#FFB800", stroke: "#FFEBDF", eye: "#FFFFFF" },
  solar: { bg: "#0066FF", bodyStart: "#FF9D00", bodyEnd: "#F2FF3D", stroke: "#FFE7AB", eye: "#000000" },
  aether: { bg: "#FF4D00", bodyStart: "#002FFF", bodyEnd: "#3D7EFF", stroke: "#DDEDFF", eye: "#FFFFFF" },
  spirit: { bg: "#21DC11", bodyStart: "#FF00D9", bodyEnd: "#FF58B4", stroke: "#FFAAF9", eye: "#FFFFFF" },
};

/** Real Jokuh actions, by the task icon a baby carries. */
export const SWARM_ACTIONS: Record<SwarmIcon, readonly string[]> = {
  calendar: ["Reminded you", "Added it to your calendar"],
  message: ["Drafted a reply"],
  coin: ["Paid Khush"],
  phone: ["Summarized the call", "Made a meeting link"],
  doc: ["Wrote your morning brief"],
  note: ["Saved to Spine"],
  plane: ["Found you flights"],
};

/** Every label the swarm can show (for the report / tests). */
export const ALL_SWARM_LABELS: readonly string[] = Object.values(SWARM_ACTIONS).flat();

/** 24 × 24 stroke icons (round caps, 2 px), drawn for the swarm. */
export const SWARM_ICON_PATHS: Record<SwarmIcon, string> = {
  calendar: "M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  message: "M20 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.3-4.4A7.5 7.5 0 1 1 20 11.5z",
  coin: "M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16zM12 7.5v9M14.6 9.6c-.4-.9-1.4-1.4-2.6-1.4-1.5 0-2.6.8-2.6 1.9 0 2.6 5.3 1.4 5.3 4 0 1.1-1.1 1.9-2.7 1.9-1.3 0-2.3-.5-2.7-1.5",
  phone: "M7 4h2.5l1.3 4-2 1.3a11 11 0 0 0 5.9 5.9l1.3-2 4 1.3V17a2 2 0 0 1-2.2 2A15 15 0 0 1 5 6.2 2 2 0 0 1 7 4z",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4",
  note: "M5 5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9l-6 6H6a1 1 0 0 1-1-1zM13 20v-5a1 1 0 0 1 1-1h5",
  plane: "M10.5 13.5 4 12l-1-2 7.5.5L14 4h2l-1.5 7 5 .5a1.5 1.5 0 0 1 0 3l-5 .5L16 22h-2l-3.5-6.5L3 16l1-2z",
};

export type SwarmBaby = { look: BabyLook; icon: SwarmIcon; size: number; phase: number; speed: number; lane: number };

/** The hero's babies (6–10 per the brief; 8 here). Speeds are rad/s round the ring: slow. */
export const HERO_BABIES: readonly SwarmBaby[] = [
  { look: "fruta", icon: "note", size: 34, phase: 0.2, speed: 0.022, lane: 0.55 },
  { look: "aether", icon: "message", size: 30, phase: 1.0, speed: -0.018, lane: 0.3 },
  { look: "flame", icon: "coin", size: 32, phase: 1.75, speed: 0.016, lane: 0.75 },
  { look: "spirit", icon: "phone", size: 28, phase: 2.5, speed: -0.024, lane: 0.45 },
  { look: "oo", icon: "calendar", size: 36, phase: 3.3, speed: 0.019, lane: 0.65 },
  { look: "solar", icon: "doc", size: 30, phase: 4.05, speed: -0.017, lane: 0.25 },
  { look: "aether", icon: "plane", size: 28, phase: 4.8, speed: 0.021, lane: 0.8 },
  { look: "flame", icon: "calendar", size: 30, phase: 5.55, speed: -0.02, lane: 0.4 },
];

export type SwarmFrame = {
  /** Stage size (the hero's squircle column). */
  w: number;
  h: number;
  /** Half sizes of the clear zone round the centre (logo + bar + pills + CTA). */
  exHx: number;
  exHy: number;
  /** Clear zone centre offset below the stage centre (the CTA hangs under the bar). */
  exDy: number;
};

/** The clear zone for a hero of `w × h`: wide enough for the logo, bar, suggestion pills and Get Jokuh. */
export function swarmFrame(w: number, h: number): SwarmFrame {
  // Phones: the suggestion pills wrap to two rows and the footnote sits lower, so the zone is taller there.
  const narrow = w < 640;
  return { w, h, exHx: Math.min(w / 2, 330), exHy: Math.min(h / 2, narrow ? 225 : 190), exDy: narrow ? 50 : 30 };
}

/**
 * Where baby `b` is at time `t` (s): on a squircle ring (superellipse n = 4, the app's column shape) between the clear
 * zone and the stage edge, drifting round with a slow breath in and out. `fade` is 0 when the point would fall inside
 * the clear zone (narrow screens), 1 otherwise, so a baby swims "behind" the bar instead of over it.
 */
export function swarmPos(b: SwarmBaby, t: number, f: SwarmFrame): { x: number; y: number; fade: number; tilt: number } {
  const margin = 44;
  const outHx = Math.max(40, f.w / 2 - margin);
  const outHy = Math.max(40, f.h / 2 - margin - 8);
  const inHx = Math.min(outHx, f.exHx + 36);
  const inHy = Math.min(outHy, f.exHy + 36);
  const u = Math.min(1, Math.max(0, b.lane + 0.18 * Math.sin(t * 0.21 + b.phase * 1.7)));
  const hx = inHx + (outHx - inHx) * u;
  const hy = inHy + (outHy - inHy) * u;
  const a = b.phase + t * b.speed * 6 + 0.12 * Math.sin(t * 0.37 + b.phase);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = hx * Math.sign(c) * Math.sqrt(Math.abs(c)) + 7 * Math.sin(t * 0.9 + b.phase * 3);
  const y = hy * Math.sign(s) * Math.sqrt(Math.abs(s)) + 6 * Math.cos(t * 0.7 + b.phase * 2);
  // Clear-zone test (rounded box round the centre, shifted down by exDy).
  const dx = Math.abs(x) / (f.exHx + 18);
  const dy = Math.abs(y - f.exDy) / (f.exHy + 18);
  const inside = Math.max(dx, dy);
  const fade = Math.min(1, Math.max(0, (inside - 1) / 0.12));
  return { x: f.w / 2 + x, y: f.h / 2 + y, fade, tilt: 6 * Math.sin(t * 0.8 + b.phase * 5) };
}

/** Resting seats for Reduce Motion (t = 0, no wobble beyond the formula). */
export function swarmRestPos(b: SwarmBaby, f: SwarmFrame) {
  return swarmPos(b, 0, f);
}

/** Small deterministic PRNG (mulberry32) so the label order is stable between renders. */
export function swarmRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── OOpolis (the live city in the "OO & agents" section) ── */

export const CITY_W = 360;
export const CITY_H = 780;
export const CITY_QUEEN = { x: 180, y: 404, r: 46 } as const;

export type CityBuilding = {
  key: string;
  label: string;
  icon: SwarmIcon;
  x: number;
  y: number;
  /** Present tense while a baby works here; past tense label when it's done. */
  doing: readonly string[];
  done: readonly string[];
};

/** Six goo buildings on a ring round the Queen (top, then clockwise). Real Jokuh apps and real actions only. */
export const CITY_BUILDINGS: readonly CityBuilding[] = [
  { key: "spine", label: "Spine", icon: "note", x: 180, y: 192, doing: ["Saving it to Spine", "Writing your morning brief"], done: ["Saved to Spine", "Wrote your morning brief"] },
  { key: "text", label: "Text", icon: "message", x: 290, y: 296, doing: ["Drafting a reply"], done: ["Drafted a reply"] },
  { key: "wallet", label: "Wallet", icon: "coin", x: 290, y: 512, doing: ["Paying Khush"], done: ["Paid Khush"] },
  { key: "calls", label: "Calls", icon: "phone", x: 180, y: 616, doing: ["Summarizing the call", "Making a meeting link"], done: ["Summarized the call", "Made a meeting link"] },
  { key: "flights", label: "Flights", icon: "plane", x: 70, y: 512, doing: ["Finding you flights"], done: ["Found you flights"] },
  { key: "calendar", label: "Calendar", icon: "calendar", x: 70, y: 296, doing: ["Setting a reminder", "Adding it to your calendar"], done: ["Reminded you", "Added it to your calendar"] },
];

export type CityBabySpec = { look: BabyLook; name: string; offset: number };

export const CITY_BABIES: readonly CityBabySpec[] = [
  { look: "fruta", name: "Pip", offset: 0 },
  { look: "aether", name: "Dot", offset: 2.1 },
  { look: "flame", name: "Mo", offset: 4.3 },
  { look: "spirit", name: "Bea", offset: 6.4 },
  { look: "solar", name: "Kit", offset: 8.6 },
  { look: "aether", name: "Rue", offset: 10.7 },
];

export type CityLeg = "brief" | "out" | "work" | "back";

/** Cycle timings (s). Walk speed in stage px/s. */
export const CITY_BRIEF = 1.4;
export const CITY_WORK = 1.8;
export const CITY_WALK_SPEED = 62;
/** The task drop's flight from the Queen to the baby, at the start of a brief. */
export const CITY_DROP_TIME = 0.9;

/** Seat on the ring round the Queen for baby `i` of `n`. */
export function citySeat(i: number, n: number): { x: number; y: number } {
  const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + Math.PI / n;
  return { x: CITY_QUEEN.x + Math.cos(a) * 86, y: CITY_QUEEN.y + Math.sin(a) * 86 };
}

/** Door of a building (babies stop just in front of it, on the Queen side). */
export function cityDoor(b: CityBuilding): { x: number; y: number } {
  const dx = CITY_QUEEN.x - b.x;
  const dy = CITY_QUEEN.y - b.y;
  const d = Math.hypot(dx, dy) || 1;
  return { x: b.x + (dx / d) * 46, y: b.y + (dy / d) * 46 };
}

/** Name tag spot: on the far side of the building from the Queen, so babies at the door never cover it. */
export function cityTag(b: CityBuilding): { x: number; y: number } {
  const dx = b.x - CITY_QUEEN.x;
  const dy = b.y - CITY_QUEEN.y;
  const d = Math.hypot(dx, dy) || 1;
  return { x: b.x + (dx / d) * 44, y: b.y + (dy / d) * 40 };
}

export type CityTask = { building: number; variant: number };

/** The k-th task of baby `i`: walks every building in a per-baby order, alternating the action variants. */
export function cityTask(i: number, k: number): CityTask {
  const n = CITY_BUILDINGS.length;
  const building = (i * 5 + k * (i % 2 ? 1 : 5)) % n;
  const variant = Math.floor((k + i) / 2) % CITY_BUILDINGS[building].done.length;
  return { building, variant };
}

export type CityPose = {
  x: number;
  y: number;
  leg: CityLeg;
  /** 0..1 progress inside the leg. */
  p: number;
  task: CityTask;
  /** Task index k (changes once per cycle). */
  k: number;
  /** Walk bob (px) and lean (deg). */
  bob: number;
  lean: number;
  /** Task drop 0..1 along Queen → baby, or -1 when not flying. */
  drop: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

/** Duration of one full cycle for a task. */
function cycleLen(i: number, n: number, task: CityTask) {
  const seat = citySeat(i, n);
  const door = cityDoor(CITY_BUILDINGS[task.building]);
  const walk = Math.hypot(door.x - seat.x, door.y - seat.y) / CITY_WALK_SPEED;
  return { walk, total: CITY_BRIEF + walk + CITY_WORK + walk };
}

/** Where baby `i` (of `n`) is at time `t`: pure function of time (walks cycles from t = -offset). */
export function cityPose(i: number, n: number, t: number, offset: number): CityPose {
  let local = Math.max(0, t + offset);
  let k = 0;
  // Cycles are short (≈ 8 s); walk forward. Bounded so a long-lived tab never loops forever.
  for (let guard = 0; guard < 100000; guard++) {
    const len = cycleLen(i, n, cityTask(i, k)).total;
    if (local < len) break;
    local -= len;
    k++;
  }
  const task = cityTask(i, k);
  const { walk } = cycleLen(i, n, task);
  const seat = citySeat(i, n);
  const door = cityDoor(CITY_BUILDINGS[task.building]);
  const step = (s: number) => Math.sin(s * Math.PI * 2 * 2.2);
  if (local < CITY_BRIEF) {
    const p = local / CITY_BRIEF;
    const drop = local < CITY_DROP_TIME ? local / CITY_DROP_TIME : -1;
    return { x: seat.x, y: seat.y, leg: "brief", p, task, k, bob: Math.sin(local * 5) * 1.2, lean: 0, drop };
  }
  local -= CITY_BRIEF;
  if (local < walk) {
    const p = local / walk;
    const e = ease(p);
    return { x: lerp(seat.x, door.x, e), y: lerp(seat.y, door.y, e), leg: "out", p, task, k, bob: -Math.abs(step(local)) * 4, lean: step(local) * 7, drop: -1 };
  }
  local -= walk;
  if (local < CITY_WORK) {
    const p = local / CITY_WORK;
    return { x: door.x, y: door.y, leg: "work", p, task, k, bob: -Math.abs(Math.sin(local * 9)) * 2.4, lean: Math.sin(local * 9) * 4, drop: -1 };
  }
  local -= CITY_WORK;
  const p = Math.min(1, local / walk);
  const e = ease(p);
  return { x: lerp(door.x, seat.x, e), y: lerp(door.y, seat.y, e), leg: "back", p, task, k, bob: -Math.abs(step(local)) * 4, lean: step(local) * 7, drop: -1 };
}

/** Reduce Motion: a still city — half the babies at work in front of a building, half on their Queen seats. */
export function cityRestPose(i: number, n: number): CityPose {
  const task = cityTask(i, 0);
  const at = i % 2 === 0 ? cityDoor(CITY_BUILDINGS[task.building]) : citySeat(i, n);
  return { x: at.x, y: at.y, leg: i % 2 === 0 ? "work" : "brief", p: 0, task, k: 0, bob: 0, lean: 0, drop: -1 };
}
