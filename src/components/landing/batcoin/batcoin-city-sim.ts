/**
 * **Purpose:** The living Batcoin city's flock. One fixed-step (1/60 s) sim of every goo bat in the city: bats roost
 * on the roofs, take off, wander round the towers in loose flocks, carry Batcoin between districts, and come home.
 * The app's three bat celebrations are the city's verbs:
 * - **Send** ("bats away"): a delivery erupts from a district in the app's fan (`seedSend` numbers).
 * - **Receive** ("bats home"): the flock swoops in with the app's swirl, merges into one goo blob that grows by the
 *   bats it swallows, then pops with a glint and twelve droplets (`stepReceiveBat`, `stepBlob`). In the city the bats
 *   then spill back out of the pop and settle on the district's roofs.
 * - **Big**: a dense cloud sweeps the whole sky on a diagonal from the lower left (`seedBig`, `stepBigBat`).
 * **Ported 1:1 from (jokuh-live):** `Sources/gooey/celebrations/goo-bat-swarm-sim.swift`: boids (`flock`: radius 46,
 * personal space 0.42 × spans, separation 900 / 260 near the blob, alignment 0.9, cohesion 1.4, flutter
 * sin(6.3t)·90·0.6 / cos(5.1t)·70), `steer`, `move`, the send fan and speeds, the receive swirl, absorb (pull 14/s,
 * shrink 7/s), the blob (10 + 34·√(absorbed/n), pop swell 1.3 then collapse over 0.3 s, glint 0.5 s), the droplets
 * (drag 2.2, gravity 120, shrink), the big sweep, wing flap (`phase += 2π·flapHz·dt`).
 * **City-only (not in the app):** roosting, wandering, the pointer (attract / scatter), the return to roosts.
 * **Perf:** arrays allocated once; a step is O(n²) over ≤ 150 bats.
 */
import { DISTRICTS, mulberry32, type CityLayout } from "./batcoin-city-layout";

export const SIM_DT = 1 / 60;

export const enum Mode {
  Roost = 0,
  Wander = 1,
  Carry = 2,
  Absorb = 3,
  Hidden = 4,
  Home = 5,
  Sweep = 6,
}

export type Bat = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  flapHz: number;
  seed: number;
  mode: Mode;
  /** Draw scale 0…1 (absorb shrink, reserve bats growing in). */
  scale: number;
  born: number;
  goalX: number;
  goalY: number;
  /** Roost slot index, or -1. */
  roost: number;
  /** Delivery index for Carry / Absorb / Hidden, or -1. */
  job: number;
  /** Wander orbit centre + radius + speed. */
  ox: number;
  oy: number;
  or: number;
  ow: number;
  /** Seconds left in this mode before it changes its mind (roost ↔ wander). */
  timer: number;
  /** A reserve bat (only flies in the Big sweep). */
  reserve: boolean;
};

export type Drop = { x: number; y: number; vx: number; vy: number; r: number; shrink: number; live: boolean };

export type Coin = { x: number; y: number; carrier: number; job: number; state: 0 | 1 | 2; t: number; live: boolean };

export type Job = {
  live: boolean;
  from: number;
  to: number;
  x: number;
  y: number;
  started: number;
  total: number;
  absorbed: number;
  blobR: number;
  popAt: number;
  glint: number;
  coins: number;
  /** What the pop says (a visitor's own send), or null for the city's idle traffic. */
  tag: string | null;
  /** Bats in this delivery. */
  bats: number[];
};

export type SimEvent = { kind: "pop"; district: number; coins: number; x: number; y: number; tag: string | null };

const MAX_DROPS = 200;
const MAX_COINS = 40;
const MAX_JOBS = 8;

export class BatcoinCitySim {
  bats: Bat[] = [];
  drops: Drop[] = [];
  coins: Coin[] = [];
  jobs: Job[] = [];
  time = 0;
  city: CityLayout;
  pointer: { x: number; y: number; on: boolean } = { x: 0, y: 0, on: false };
  events: SimEvent[] = [];
  private rnd: () => number;
  private dropCursor = 0;
  private nextDelivery = 2.2;
  private nextSweep = 16;
  private sweepUntil = -1;

  constructor(city: CityLayout, seed = 7) {
    this.city = city;
    this.rnd = mulberry32(seed);
    for (let i = 0; i < MAX_DROPS; i++) this.drops.push({ x: 0, y: 0, vx: 0, vy: 0, r: 0, shrink: 10, live: false });
    for (let i = 0; i < MAX_COINS; i++) this.coins.push({ x: 0, y: 0, carrier: -1, job: -1, state: 0, t: 0, live: false });
    for (let i = 0; i < MAX_JOBS; i++)
      this.jobs.push({ live: false, from: 0, to: 0, x: 0, y: 0, started: 0, total: 0, absorbed: 0, blobR: 0, popAt: -1, glint: 0, coins: 0, tag: null, bats: [] });
    this.populate();
  }

  private range(lo: number, hi: number) {
    return lo + (hi - lo) * this.rnd();
  }

  /** Bats per stage: fewer on a phone. Reserve bats only fly in the Big sweep. */
  private populate() {
    const { city } = this;
    const resident = city.phone ? 56 : Math.min(120, Math.round(70 + city.w / 30));
    const reserve = city.phone ? 26 : 44;
    const roostFrac = 0.55;
    for (let i = 0; i < resident + reserve; i++) {
      const res = i >= resident;
      const big = this.rnd() < 0.14;
      const scale = city.phone ? 0.95 : 1.2;
      const b: Bat = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: (big ? this.range(32, 40) : this.range(20, 29)) * scale,
        phase: this.range(0, Math.PI * 2),
        flapHz: this.range(6.5, 9.5),
        seed: this.range(0, 100),
        mode: Mode.Wander,
        scale: 1,
        born: 0,
        goalX: 0,
        goalY: 0,
        roost: -1,
        job: -1,
        ox: 0,
        oy: 0,
        or: 0,
        ow: 0,
        timer: this.range(4, 14),
        reserve: res,
      };
      this.bats.push(b);
      const idx = this.bats.length - 1;
      if (res) {
        b.mode = Mode.Hidden;
        continue;
      }
      if (this.rnd() < roostFrac && this.takeRoost(idx, -1)) {
        b.mode = Mode.Roost;
        const r = city.roosts[b.roost]!;
        b.x = r.x;
        b.y = r.y;
      } else {
        this.pickOrbit(b);
        const a = this.range(0, Math.PI * 2);
        b.x = b.ox + Math.cos(a) * b.or;
        b.y = b.oy + Math.sin(a) * b.or * 0.6;
        b.vx = -Math.sin(a) * 120 * Math.sign(b.ow);
        b.vy = Math.cos(a) * 60;
      }
    }
  }

  /** Re-fit to a new stage: roosts are re-taken, flyers are scaled into the new sky. */
  resize(city: CityLayout) {
    const sx = city.w / Math.max(1, this.city.w);
    const sy = city.h / Math.max(1, this.city.h);
    this.city = city;
    for (const b of this.bats) {
      b.x *= sx;
      b.y *= sy;
      b.roost = -1;
      if (b.mode === Mode.Roost || b.mode === Mode.Home) {
        b.mode = Mode.Wander;
        this.pickOrbit(b);
      }
      if (b.mode === Mode.Wander) this.pickOrbit(b);
    }
    for (const j of this.jobs) j.live = false;
    for (const c of this.coins) c.live = false;
    for (const b of this.bats) {
      if (b.mode === Mode.Carry || b.mode === Mode.Absorb || (b.mode === Mode.Hidden && !b.reserve)) {
        b.mode = Mode.Wander;
        b.job = -1;
        b.scale = 1;
        this.pickOrbit(b);
      }
    }
  }

  private takeRoost(i: number, district: number): boolean {
    const roosts = this.city.roosts;
    const pool = district >= 0 ? this.city.districts[district]!.roosts : roosts.map((_, k) => k);
    const free = pool.filter((k) => roosts[k]!.taken < 0);
    if (!free.length) return false;
    const b = this.bats[i]!;
    // Nearest free slot for a bat in the air, random for the opening scene.
    let pick = free[Math.floor(this.rnd() * free.length)]!;
    if (b.mode !== Mode.Roost && (b.x !== 0 || b.y !== 0)) {
      let best = Infinity;
      for (const k of free) {
        const r = roosts[k]!;
        const d = Math.hypot(r.x - b.x, r.y - b.y);
        if (d < best) {
          best = d;
          pick = k;
        }
      }
    }
    roosts[pick]!.taken = i;
    b.roost = pick;
    return true;
  }

  private freeRoost(b: Bat) {
    if (b.roost >= 0) {
      const r = this.city.roosts[b.roost];
      if (r) r.taken = -1;
    }
    b.roost = -1;
  }

  /** A loose orbit round a tower (wandering bats circle the skyline). */
  private pickOrbit(b: Bat) {
    const { city } = this;
    const d = city.districts[Math.floor(this.rnd() * city.districts.length)]!;
    const t = d.towers[Math.floor(this.rnd() * d.towers.length)]!;
    b.ox = t.x + t.w / 2 + this.range(-30, 30);
    const skyMin = city.phone ? city.h * 0.36 : city.h * 0.18;
    b.oy = Math.max(skyMin, t.top - this.range(40, 160));
    b.or = this.range(50, city.phone ? 110 : 170);
    b.ow = (this.rnd() < 0.5 ? -1 : 1) * this.range(0.5, 0.95);
  }

  private takeOff(i: number, up = 1) {
    const b = this.bats[i]!;
    this.freeRoost(b);
    b.mode = Mode.Wander;
    b.vx = this.range(-160, 160);
    b.vy = -this.range(180, 300) * up;
    b.timer = this.range(6, 16);
    this.pickOrbit(b);
  }

  /* ── Verbs ── */

  /**
   * A delivery: `n` bats leave district `from` in the app's Send fan carrying `coins` Batcoin, swoop into district
   * `to` with the Receive swirl, merge, pop. Returns false when nothing could fly.
   */
  deliver(from: number, to: number, n: number, coins: number, tag: string | null = null): boolean {
    const ji = this.jobs.findIndex((j) => !j.live);
    if (ji < 0) return false;
    const { city } = this;
    const src = city.districts[from]!;
    const dst = city.districts[to]!;
    // Roosting bats of the source district first, then the nearest wanderers.
    const picks: number[] = [];
    for (const k of src.roosts) {
      const who = city.roosts[k]!.taken;
      if (who >= 0 && picks.length < n) picks.push(who);
    }
    if (picks.length < n) {
      const free = this.bats
        .map((b, i) => ({ i, d: b.mode === Mode.Wander ? Math.hypot(b.x - src.cx, b.y - src.roof) : Infinity }))
        .filter((e) => e.d < Infinity)
        .sort((a, b) => a.d - b.d);
      for (const e of free) {
        if (picks.length >= n) break;
        picks.push(e.i);
      }
    }
    if (picks.length < 3) return false;
    const job = this.jobs[ji]!;
    Object.assign(job, {
      live: true,
      from,
      to,
      x: dst.landing.x,
      y: dst.landing.y,
      started: this.time,
      total: picks.length,
      absorbed: 0,
      blobR: 0,
      popAt: -1,
      glint: 0,
      coins: Math.max(0, Math.min(coins, picks.length, 9)),
      tag,
      bats: picks,
    });
    const ox = src.cx;
    const oy = src.roof - 8;
    picks.forEach((bi, k) => {
      const b = this.bats[bi]!;
      this.freeRoost(b);
      b.mode = Mode.Carry;
      b.job = ji;
      b.scale = 1;
      b.born = this.time + (k / picks.length) * 0.2;
      // The app's Send fan: mostly up, some wide to the sides, 300–560 pt/s.
      if (b.y > oy - 30) {
        b.x = ox + this.range(-8, 8) + (b.x - ox) * 0.3;
        b.y = oy + this.range(-5, 5);
      }
      const spread = (this.rnd() - 0.5) * 2.2;
      const ang = -Math.PI / 2 + spread;
      const sp = this.range(300, 560);
      b.vx = Math.cos(ang) * sp;
      b.vy = Math.sin(ang) * sp;
      b.goalX = job.x;
      b.goalY = job.y;
    });
    for (let c = 0; c < job.coins; c++) {
      const slot = this.coins.find((q) => !q.live);
      if (!slot) break;
      Object.assign(slot, { live: true, carrier: picks[c]!, job: ji, state: 0, t: 0, x: ox, y: oy });
    }
    return true;
  }

  /** The app's Big moment: the reserve swarm sweeps the sky on a diagonal from the lower left. */
  sweep() {
    const { city } = this;
    const w = city.w;
    const h = city.groundY;
    if (this.time < this.sweepUntil) return;
    this.sweepUntil = this.time + 2.6;
    for (const b of this.bats) {
      if (!b.reserve || b.mode !== Mode.Hidden) continue;
      b.mode = Mode.Sweep;
      b.born = this.time + this.range(0, 0.4);
      const lane = this.range(-0.15, 1.15);
      b.x = this.range(-170, -30) - lane * 60;
      b.y = h * lane + 40;
      const sp = this.range(430, 560);
      const ang = -0.32 + this.range(-0.08, 0.08);
      b.vx = Math.cos(ang) * sp;
      b.vy = Math.sin(ang) * sp;
      b.goalX = w + 220;
      b.goalY = b.y - (w + 260) * 0.33;
      b.scale = 1;
    }
  }

  /** Pointer tap on open sky: bats burst away from it; roosting bats nearby take off. */
  scatter(x: number, y: number) {
    this.bats.forEach((b, i) => {
      const d = Math.hypot(b.x - x, b.y - y);
      if (b.mode === Mode.Roost && d < 170) this.takeOff(i, 1.2);
      if ((b.mode === Mode.Wander || b.mode === Mode.Home) && d < 240 && d > 0.01) {
        const k = (1 - d / 240) * 520;
        b.vx += ((b.x - x) / d) * k;
        b.vy += ((b.y - y) / d) * k;
        if (b.mode === Mode.Home) this.takeOff(i, 0.4);
      }
    });
    this.spawnRing(x, y, 8, 140, 3.2);
  }

  private spawnRing(x: number, y: number, n: number, sp: number, r: number) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + 0.3;
      this.spawnDrop(x, y, Math.cos(a) * sp, Math.sin(a) * sp, r + (k % 2) * 1.4, 11);
    }
  }

  /* ── Stepping ── */

  /** Integrates up to `t` seconds in fixed 1/60 s steps (at most `maxSteps` per call). */
  advance(t: number, maxSteps = 6) {
    let n = 0;
    while (this.time + SIM_DT <= t + 1e-9 && n < maxSteps) {
      this.step(SIM_DT);
      n++;
    }
    // A long stall never replays: the clock jumps on.
    if (this.time + SIM_DT <= t) this.time = t;
  }

  step(dt: number) {
    this.time += dt;
    this.idle();
    this.flock(dt);
    const n = this.bats.length;
    for (let i = 0; i < n; i++) {
      const b = this.bats[i]!;
      switch (b.mode) {
        case Mode.Roost:
          this.stepRoost(i, dt);
          break;
        case Mode.Wander:
          this.stepWander(i, dt);
          break;
        case Mode.Home:
          this.stepHome(i, dt);
          break;
        case Mode.Carry:
          this.stepCarry(i, dt);
          break;
        case Mode.Absorb:
          this.stepAbsorb(i, dt);
          break;
        case Mode.Sweep:
          this.stepSweep(i, dt);
          break;
        default:
          break;
      }
      if (b.mode !== Mode.Hidden && b.mode !== Mode.Roost) b.phase += Math.PI * 2 * b.flapHz * dt;
      // Bats spilling out of a pop grow back to full size over ~0.3 s.
      if (b.scale < 1 && (b.mode === Mode.Home || b.mode === Mode.Wander)) b.scale = Math.min(1, b.scale + dt * 3);
    }
    for (let j = 0; j < this.jobs.length; j++) if (this.jobs[j]!.live) this.stepJob(j, dt);
    this.stepCoins(dt);
    this.stepDrops(dt);
  }

  /** Idle cycles so the city never looks static: deliveries every few seconds, a Big sweep now and then. */
  private idle() {
    if (this.time >= this.nextDelivery) {
      const nd = this.city.districts.length;
      const from = Math.floor(this.rnd() * nd);
      let to = Math.floor(this.rnd() * (nd - 1));
      if (to >= from) to++;
      this.deliver(from, to, Math.round(this.range(7, this.city.phone ? 10 : 13)), 2 + Math.floor(this.rnd() * 3));
      this.nextDelivery = this.time + this.range(2.6, 4.8);
    }
    if (this.time >= this.nextSweep) {
      this.sweep();
      this.nextSweep = this.time + this.range(22, 30);
    }
  }

  /** Boids over every bat in the air (the app's `flock`, same numbers). */
  private flock(dt: number) {
    const radius = 46;
    const r2 = radius * radius;
    const bats = this.bats;
    const n = bats.length;
    for (let i = 0; i < n; i++) {
      const bi = bats[i]!;
      if (!flying(bi) || this.time < bi.born) continue;
      let sx = 0,
        sy = 0,
        ax = 0,
        ay = 0,
        cx = 0,
        cy = 0,
        cnt = 0;
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const bj = bats[j]!;
        if (!flying(bj)) continue;
        const dx = bj.x - bi.x;
        const dy = bj.y - bi.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= r2 || d2 <= 0.01) continue;
        const d = Math.sqrt(d2);
        const personal = (bi.size + bj.size) * 0.42;
        if (d < personal) {
          const push = (personal - d) / personal;
          sx -= (dx / d) * push;
          sy -= (dy / d) * push;
        }
        ax += bj.vx;
        ay += bj.vy;
        cx += dx;
        cy += dy;
        cnt += 1;
      }
      let fx = 0,
        fy = 0;
      if (cnt > 0) {
        const sepK = this.nearBlob(bi) ? 260 : 900;
        fx += sx * sepK;
        fy += sy * sepK;
        fx += (ax / cnt - bi.vx) * 0.9;
        fy += (ay / cnt - bi.vy) * 0.9;
        fx += (cx / cnt) * 1.4;
        fy += (cy / cnt) * 1.4;
      }
      // Flutter: bats never fly straight.
      fx += Math.sin(this.time * 6.3 + bi.seed) * 90 * 0.6;
      fy += Math.cos(this.time * 5.1 + bi.seed * 1.7) * 70;
      bi.vx += fx * dt;
      bi.vy += fy * dt;
    }
  }

  private nearBlob(b: Bat): boolean {
    if (b.job < 0) return false;
    const j = this.jobs[b.job]!;
    return j.live && Math.hypot(b.x - j.x, b.y - j.y) < 70;
  }

  /** The app's `steer`. */
  private steer(b: Bat, gx: number, gy: number, maxSpeed: number, k: number, dt: number) {
    const dx = gx - b.x;
    const dy = gy - b.y;
    const d = Math.max(1, Math.hypot(dx, dy));
    b.vx += ((dx / d) * maxSpeed - b.vx) * k * dt;
    b.vy += ((dy / d) * maxSpeed - b.vy) * k * dt;
  }

  private move(b: Bat, dt: number) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }

  private stepRoost(i: number, dt: number) {
    const b = this.bats[i]!;
    const r = this.city.roosts[b.roost];
    if (!r) {
      this.takeOff(i);
      return;
    }
    b.x = r.x;
    b.y = r.y;
    b.vx = 0;
    b.vy = 0;
    // A roosting bat breathes and now and then stretches its wings.
    b.phase += dt * 1.3;
    b.timer -= dt;
    const p = this.pointer;
    if (p.on && Math.hypot(p.x - b.x, p.y - b.y) < 46) this.takeOff(i);
    else if (b.timer <= 0) this.takeOff(i);
  }

  private stepWander(i: number, dt: number) {
    const b = this.bats[i]!;
    // Orbit round the tower: the goal runs along an ellipse, so the flock swirls.
    const a = this.time * b.ow + b.seed;
    let gx = b.ox + Math.cos(a) * b.or;
    let gy = b.oy + Math.sin(a) * b.or * 0.55;
    let k = 1.1;
    let speed = 210;
    const p = this.pointer;
    if (p.on) {
      const d = Math.hypot(p.x - b.x, p.y - b.y);
      // The cursor attracts nearby bats: they follow it round in a little swirl.
      if (d < 230) {
        const sw = this.time * 2.4 + b.seed;
        gx = p.x + Math.cos(sw) * 34;
        gy = p.y + Math.sin(sw) * 26;
        k = 2.2;
        speed = 300;
      }
    }
    this.steer(b, gx, gy, speed, k, dt);
    this.keepInSky(b, dt);
    this.move(b, dt);
    b.timer -= dt;
    if (b.timer <= 0) {
      if (this.takeRoost(i, -1)) {
        b.mode = Mode.Home;
        b.timer = 8;
      } else {
        b.timer = this.range(4, 10);
        this.pickOrbit(b);
      }
    }
  }

  private stepHome(i: number, dt: number) {
    const b = this.bats[i]!;
    const r = this.city.roosts[b.roost];
    if (!r) {
      b.mode = Mode.Wander;
      this.pickOrbit(b);
      return;
    }
    const d = Math.hypot(r.x - b.x, r.y - b.y);
    this.steer(b, r.x, r.y - Math.min(40, d * 0.3), Math.min(320, 80 + d * 1.6), 2.4 + (d < 80 ? 4 : 0), dt);
    this.move(b, dt);
    b.timer -= dt;
    if (d < 7 || b.timer <= 0) {
      b.mode = Mode.Roost;
      b.x = r.x;
      b.y = r.y;
      b.timer = this.range(5, 18);
    }
  }

  /** Send out of the source, then the Receive swoop into the destination (the app's `stepSendBat` + `stepReceiveBat`). */
  private stepCarry(i: number, dt: number) {
    const b = this.bats[i]!;
    if (this.time < b.born) return;
    const job = this.jobs[b.job];
    if (!job || !job.live) {
      b.mode = Mode.Wander;
      b.job = -1;
      this.pickOrbit(b);
      return;
    }
    const age = this.time - b.born;
    const tx = job.x;
    const ty = job.y;
    const d = Math.hypot(tx - b.x, ty - b.y);
    // Swoop: a pull that tightens with time and a tangential swirl that fades as the bat closes in.
    const k = Math.min(9, 1.6 + age * age * 2.2);
    this.steer(b, tx, ty, Math.min(620, 360 + age * 160), k, dt);
    const swirl = Math.max(0, Math.min(1, (d - 60) / 220)) * 260;
    const nx = (tx - b.x) / Math.max(1, d);
    const ny = (ty - b.y) / Math.max(1, d);
    const dir = b.seed % 2 < 1 ? 1 : -1;
    b.vx += -ny * swirl * dir * dt;
    b.vy += nx * swirl * dir * dt;
    this.move(b, dt);
    if (d < Math.max(14, job.blobR) + b.size * 0.3 || age > 4) b.mode = Mode.Absorb;
  }

  private stepAbsorb(i: number, dt: number) {
    const b = this.bats[i]!;
    const job = this.jobs[b.job];
    if (!job) return;
    const pull = Math.min(1, dt * 14);
    b.x += (job.x - b.x) * pull;
    b.y += (job.y - b.y) * pull;
    b.scale -= dt * 7;
    if (b.scale <= 0) {
      b.scale = 0;
      b.mode = Mode.Hidden;
      job.absorbed += 1;
    }
  }

  /** The blob: grows by what it swallows, pops (swell 1.3, collapse, glint), then the bats spill back out and roost. */
  private stepJob(ji: number, dt: number) {
    const job = this.jobs[ji]!;
    const n = Math.max(1, job.total);
    const grown = 10 + 34 * Math.sqrt(job.absorbed / n);
    if (job.popAt < 0) {
      job.blobR += (grown - job.blobR) * Math.min(1, dt * 18);
      const everyone = job.absorbed >= job.total;
      const late = this.time - job.started > 4.6 && job.absorbed > 0;
      if (everyone || late) {
        job.popAt = this.time;
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2 + 0.3;
          const sp = 170 + (k % 3) * 60;
          this.spawnDrop(job.x, job.y, Math.cos(a) * sp, Math.sin(a) * sp, 4.2 + (k % 2) * 1.6, 13);
        }
        this.events.push({ kind: "pop", district: job.to, coins: job.coins, x: job.x, y: job.y, tag: job.tag });
        // Anyone still on the way is swallowed at the pop.
        for (const bi of job.bats) {
          const b = this.bats[bi]!;
          if (b.mode === Mode.Carry || b.mode === Mode.Absorb) {
            b.mode = Mode.Hidden;
            b.scale = 0;
          }
        }
        this.spill(ji);
      }
    } else {
      const p = (this.time - job.popAt) / 0.3;
      const swell = p < 0.25 ? 1 + (p / 0.25) * 0.3 : 1.3 * Math.max(0, 1 - (p - 0.25) / 0.75);
      job.blobR = grown * swell;
      job.glint = Math.min(1, Math.max(0, (this.time - job.popAt) / 0.5));
      if (job.glint >= 1) {
        job.glint = 0;
        job.blobR = 0;
        job.live = false;
      }
    }
  }

  /** After the pop the bats burst back out of the blob and settle on the destination's roofs. */
  private spill(ji: number) {
    const job = this.jobs[ji]!;
    for (const bi of job.bats) {
      const b = this.bats[bi]!;
      if (b.mode !== Mode.Hidden) continue;
      b.x = job.x + this.range(-6, 6);
      b.y = job.y + this.range(-6, 6);
      const a = -Math.PI / 2 + (this.rnd() - 0.5) * 2.6;
      const sp = this.range(220, 380);
      b.vx = Math.cos(a) * sp;
      b.vy = Math.sin(a) * sp;
      b.scale = 0.2;
      b.job = -1;
      b.born = this.time;
      if (this.takeRoost(bi, job.to) || this.takeRoost(bi, -1)) {
        b.mode = Mode.Home;
        b.timer = 6;
      } else {
        b.mode = Mode.Wander;
        b.timer = this.range(4, 10);
        this.pickOrbit(b);
      }
    }
  }

  private stepSweep(i: number, dt: number) {
    const b = this.bats[i]!;
    if (this.time < b.born) return;
    const wave = Math.sin(this.time * 3.1 + b.seed) * 40;
    this.steer(b, b.goalX, b.goalY + wave, 520, 1.4, dt);
    this.move(b, dt);
    if (b.x > this.city.w + 90 || b.y < -160) {
      b.mode = Mode.Hidden;
    }
  }

  /** Keep wanderers in the sky: off the street, under the top, inside the sides. */
  private keepInSky(b: Bat, dt: number) {
    const { city } = this;
    const floor = city.groundY - 20;
    if (b.y > floor) b.vy -= (b.y - floor) * 14 * dt;
    if (b.y < 30) b.vy += (30 - b.y) * 10 * dt;
    if (b.x < 10) b.vx += (10 - b.x) * 8 * dt;
    if (b.x > city.w - 10) b.vx -= (b.x - city.w + 10) * 8 * dt;
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > 420) {
      b.vx *= 420 / sp;
      b.vy *= 420 / sp;
    }
  }

  private stepCoins(dt: number) {
    for (const c of this.coins) {
      if (!c.live) continue;
      const job = this.jobs[c.job];
      const b = this.bats[c.carrier];
      c.t += dt;
      if (c.state === 0 && b) {
        if (b.mode === Mode.Carry) {
          // Held under the bat's feet.
          c.x += (b.x - c.x) * Math.min(1, dt * 30);
          c.y += (b.y + b.size * 0.42 - c.y) * Math.min(1, dt * 30);
        } else {
          c.state = 1;
          c.t = 0;
        }
      }
      if (c.state === 1 && job) {
        c.x += (job.x - c.x) * Math.min(1, dt * 10);
        c.y += (job.y - c.y) * Math.min(1, dt * 10);
        if (job.popAt >= 0) {
          c.state = 2;
          c.t = 0;
        }
      }
      if (c.state === 2 && c.t > 0.5) c.live = false;
      if (!job || (!job.live && c.state !== 2)) c.live = false;
    }
  }

  private spawnDrop(x: number, y: number, vx: number, vy: number, r: number, shrink: number) {
    this.drops[this.dropCursor] = { x, y, vx, vy, r, shrink, live: true };
    this.dropCursor = (this.dropCursor + 1) % MAX_DROPS;
  }

  /** The app's droplets: drag 2.2, gravity 120, shrink. */
  private stepDrops(dt: number) {
    for (const d of this.drops) {
      if (!d.live) continue;
      d.vx *= 1 - dt * 2.2;
      d.vy = d.vy * (1 - dt * 2.2) + 120 * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.r -= d.shrink * dt;
      if (d.r <= 0.4) d.live = false;
    }
  }
}

function flying(b: Bat): boolean {
  return b.mode === Mode.Wander || b.mode === Mode.Carry || b.mode === Mode.Home || b.mode === Mode.Sweep;
}

/** Draw-time pose of a bat: span, flap, bank (`GooBatSwarmRenderer.buildPaths` rules + roost folding). */
export function batPose(b: Bat): { span: number; flap: number; bank: number; visible: boolean } {
  if (b.mode === Mode.Hidden) return { span: 0, flap: 0, bank: 0, visible: false };
  if (b.mode === Mode.Roost) {
    // Folded on the roof; a slow breath and now and then a stretch.
    const stretch = Math.max(0, Math.sin(b.phase * 0.37 + b.seed)) ** 12;
    return { span: b.size * (0.6 + 0.25 * stretch), flap: -1 + 0.12 * Math.sin(b.phase) + 1.1 * stretch, bank: 0, visible: true };
  }
  const grow = b.mode === Mode.Home || b.mode === Mode.Wander ? Math.min(1, b.scale) : b.scale;
  return {
    span: b.size * Math.max(0, grow),
    flap: Math.sin(b.phase),
    bank: Math.max(-1, Math.min(1, b.vx / 700)) * 0.5,
    visible: b.scale > 0.03,
  };
}

export const DISTRICT_COUNT = DISTRICTS.length;
