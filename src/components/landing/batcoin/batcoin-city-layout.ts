/**
 * **Purpose:** The Batcoin city's geometry as a pure function of the stage size: five districts of goo towers on one
 * street (Welcome, Invites, Streaks, Tips, Swap, one per Batcoin fact on the page), the roost slots on every roof
 * where bats sit, each district's landing point (where a coin flock merges and pops), and the lit windows.
 * Deterministic per stage size (seeded), so the city never jumps between frames or reloads.
 * **Connects to:** `CitySkyline.tsx` (draws it), `batcoin-city-sim.ts` (roosts, landings, hit tests).
 */

export type DistrictId = "welcome" | "invites" | "streaks" | "tips" | "swap";

export const DISTRICTS: { id: DistrictId; label: string }[] = [
  { id: "welcome", label: "Welcome" },
  { id: "invites", label: "Invites" },
  { id: "streaks", label: "Streaks" },
  { id: "tips", label: "Tips" },
  { id: "swap", label: "Swap" },
];

export type TowerTop = "dome" | "spire" | "step" | "flat";

export type Tower = { x: number; w: number; top: number; kind: TowerTop };
export type Roost = { x: number; y: number; district: number; taken: number };
export type Window = { x: number; y: number; lit: boolean };

export type District = {
  id: DistrictId;
  label: string;
  cx: number;
  x0: number;
  x1: number;
  towers: Tower[];
  /** Highest roof (smallest y). */
  roof: number;
  landing: { x: number; y: number };
  roosts: number[];
};

export type CityLayout = {
  w: number;
  h: number;
  groundY: number;
  /** Lowest a roof may reach (the sky above stays clear for the title on a phone). */
  skyTop: number;
  districts: District[];
  roosts: Roost[];
  windows: Window[];
  phone: boolean;
};

/** mulberry32: tiny seeded PRNG (the hive's PRNG in jokuh-live `docs/oopolis-plan.md` §8.3). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Street height under the towers (the Gulp+ bar and the district names sit on it). */
export function streetHeight(w: number): number {
  return w < 640 ? 112 : 128;
}

export function layoutCity(w: number, h: number): CityLayout {
  const phone = w < 640;
  const groundY = h - streetHeight(w);
  // Roofs stay below the title block on a phone and below the upper third on a computer.
  const skyTop = phone ? Math.max(h * 0.5, groundY - 300) : Math.max(h * 0.4, groundY - 440);
  const rnd = mulberry32(0xba7c17 ^ (phone ? 0x55 : 0xaa));
  const dw = w / DISTRICTS.length;
  const districts: District[] = [];
  const roosts: Roost[] = [];
  const windows: Window[] = [];
  const span = Math.max(60, groundY - skyTop);

  DISTRICTS.forEach((d, di) => {
    const x0 = di * dw;
    const x1 = x0 + dw;
    const n = phone ? 2 + (rnd() < 0.5 ? 1 : 0) : 3 + (rnd() < 0.5 ? 1 : 0);
    const inner = dw * 0.82;
    const widths: number[] = [];
    for (let i = 0; i < n; i++) widths.push(0.7 + rnd() * 0.6);
    const sum = widths.reduce((a, b) => a + b, 0);
    let cursor = x0 + (dw - inner) / 2;
    const towers: Tower[] = [];
    // The middle tower of each district is the tallest, so every district reads as a little skyline.
    const mid = Math.floor(n / 2);
    for (let i = 0; i < n; i++) {
      const tw = Math.max(18, (widths[i]! / sum) * inner * 0.86);
      const gap = ((widths[i]! / sum) * inner - tw) / 2;
      const tx = cursor + gap;
      cursor += (widths[i]! / sum) * inner;
      const tall = i === mid ? 0.78 + rnd() * 0.22 : 0.32 + rnd() * 0.4;
      const top = groundY - span * tall;
      const kinds: TowerTop[] = ["dome", "spire", "step", "flat"];
      const kind = kinds[Math.floor(rnd() * kinds.length)]!;
      towers.push({ x: tx, w: tw, top, kind });
    }
    const roof = Math.min(...towers.map((t) => t.top));
    const ids: number[] = [];
    for (const t of towers) {
      // Roost slots along the roof (a dome's roof is its crown; a spire keeps its shoulders).
      const slots = Math.max(1, Math.floor(t.w / 15));
      const roofY = t.kind === "dome" ? t.top - t.w * 0.34 : t.kind === "step" ? t.top - 18 : t.top;
      const usable = t.kind === "dome" ? t.w * 0.55 : t.w * 0.8;
      for (let s = 0; s < slots; s++) {
        const u = slots === 1 ? 0.5 : s / (slots - 1);
        const x = t.x + t.w / 2 + (u - 0.5) * usable * (t.kind === "step" ? 0.6 : 1);
        if (t.kind === "spire" && Math.abs(x - (t.x + t.w / 2)) < 7) continue;
        ids.push(roosts.length);
        roosts.push({ x, y: roofY - 5, district: di, taken: -1 });
      }
      // Windows: a loose grid, about a third lit.
      const cols = Math.max(1, Math.floor((t.w - 8) / 10));
      const rows = Math.max(1, Math.floor((groundY - t.top - 22) / 13));
      const ox = t.x + (t.w - (cols - 1) * 10) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (rnd() < 0.42) windows.push({ x: ox + c * 10, y: t.top + 16 + r * 13, lit: rnd() < 0.62 });
        }
      }
    }
    districts.push({
      id: d.id,
      label: d.label,
      cx: (x0 + x1) / 2,
      x0,
      x1,
      towers,
      roof,
      landing: { x: (x0 + x1) / 2, y: Math.max(roof - (phone ? 56 : 80), 90) },
      roosts: ids,
    });
  });

  return { w, h, groundY, skyTop, districts, roosts, windows, phone };
}

/** The district under a stage point (anywhere from just above its tallest roof down to the street), or -1. */
export function districtAt(city: CityLayout, x: number, y: number): number {
  for (let i = 0; i < city.districts.length; i++) {
    const d = city.districts[i]!;
    if (x >= d.x0 && x < d.x1 && y >= d.roof - 40 && y <= city.groundY + 40) return i;
  }
  return -1;
}
