#!/usr/bin/env node
/**
 * Capture the REAL Jokuh web app's demo surfaces for the console homepage (`/`).
 *
 * The console home never re-draws the app: the centred column and the left rail play recordings of the real web
 * app's read-only `/demo` mode. This script makes those recordings. Re-run it whenever the app UI changes.
 *
 * Per surface (spine, calls, texts, id, blurbs, oo) and theme (dark, light) it makes two captures:
 *
 *   Column — `${APP_ORIGIN}/demo?surface=<s>&chrome=0&theme=<t>` at the app's desktop layout
 *            (SURFACE_PAGE_VIEWPORT, device scale 2), cropped to the surface's composition measured from the DOM
 *            (`measureSurface`: the ID pod stack, else the centred column). The crop size goes in the manifest; the
 *            console scales it to fit (never crops).
 *   Rail   — (opt-in: `--rail auto`) `${APP_ORIGIN}/demo?surface=<s>&chrome=rail&theme=<t>` at a desktop viewport (RAIL_PAGE_VIEWPORT): the
 *            real left rail + column. The rail's bounding box is measured from the DOM (RAIL_SELECTOR, else the
 *            leftmost tall narrow fixed element) — never hard-coded — and the recording is cropped to it. If the rail
 *            looks the same on every surface (pixel-identical stills), one shared rail capture is kept; otherwise one
 *            per surface (e.g. Texts highlighting the active chat). `--rail shared|per-surface` forces either.
 *
 * Each capture: wait for network idle, the optional `{type:'jokuh-embed-ready'}` postMessage and SETTLE_MS; record
 * --seconds of the autoplay loop through the DevTools screencast (device-pixel frames with real timestamps); a 2× JPEG
 * poster a few seconds in. With ffmpeg on PATH the frames become a clip (cropped, for the rail), its tail is crossfaded
 * into its head so it loops cleanly, and VP9
 * `.webm` + H.264 `.mp4` (faststart) are written at OUTPUT_SCALE× the CSS size (≈1 MB per loop). Without ffmpeg
 * only posters are written (the console shows the poster still).
 *
 * Output: `public/console/captures/` — `<surface>[-light].{webm,mp4,jpg}`, `rail[-<surface>][-light].{…}` and
 * `manifest.json` (what exists + the rail box in CSS px), which the console reads. Partial runs merge into it.
 * `--out <dir>` writes elsewhere (manifest paths follow the folder under `public/`), e.g. `/defense` reads
 * `public/defense/captures/`.
 *
 * Scenarios: `--scenario team` appends `&scenario=team` to every `/demo` URL (the civilian "Field Team North"
 * response team the app builds from real components) and records it in the manifest. Extra surfaces for it:
 * `drawer` (team Bubble + huddles), `docs`, `signin`. Without a scenario, `drawer` is a placeholder: the consumer
 * demo has no drawer surface, so it records `surface=docs` with the app chrome on and crops the Bubbles drawer
 * panel out of it (`measureSurface`).
 *
 * Usage (APP_ORIGIN is required on purpose — point it at a dev/staging app until the /demo fidelity fix ships):
 *   APP_ORIGIN=http://localhost:5173 node scripts/capture-app-demo.mjs
 *   APP_ORIGIN=https://app.jokuh.com node scripts/capture-app-demo.mjs --scenario team --out public/defense/captures \
 *     --surfaces signin,drawer,texts,calls,spine,docs,oo,id        (the /defense walkthrough)
 *   APP_ORIGIN=… node scripts/capture-app-demo.mjs --surfaces spine,texts --themes dark --seconds 12 --no-rail
 *   CAPTURE_OUT_DIR=/tmp/x APP_ORIGIN=… node scripts/capture-app-demo.mjs   (dry run elsewhere)
 *   RAIL_SELECTOR='[data-demo-rail]' APP_ORIGIN=… node scripts/capture-app-demo.mjs
 *
 * Needs: `@playwright/test` (devDependency) with Chromium (`npx playwright install chromium`); ffmpeg recommended.
 * Connects to: `src/components/landing/console/surfaces/ConsoleSurfaces.tsx` (manifest, `size` → column aspect),
 * `src/components/landing/console/ConsoleRail.tsx` (rail slot).
 */
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
/** Output folder (override with CAPTURE_OUT_DIR for dry runs; manifest paths stay `/console/captures/…`). */
const DEFAULT_OUT_DIR = process.env.CAPTURE_OUT_DIR ? resolve(process.env.CAPTURE_OUT_DIR) : join(ROOT, "public", "console", "captures");
/** Set by `--out` in `main()`; manifest paths are the folder's path under `public/`. */
let OUT_DIR = DEFAULT_OUT_DIR;
let PUBLIC_PREFIX = "/console/captures";

function publicPrefixFor(dir) {
  const publicRoot = join(ROOT, "public");
  return dir.startsWith(`${publicRoot}/`) ? dir.slice(publicRoot.length).replace(/\\/g, "/") : "/console/captures";
}

/**
 * Surfaces are captured at the app's DESKTOP layout (so e.g. the ID page renders its wide pod bento, not the phone
 * stack), then cropped to the surface's composition measured from the DOM (`measureSurface`). The console scales
 * the crop to fit its column (object-fit: contain) — nothing is cropped there.
 */
const SURFACE_PAGE_VIEWPORT = { width: 1280, height: 900 };
/** Breathing room around a measured crop (CSS px), clamped to the viewport. */
const SURFACE_CROP_PAD = 16;
/** Desktop page the rail is measured on (the app's rail is sized against the full viewport). */
const RAIL_PAGE_VIEWPORT = { width: 1440, height: 900 };
const RAIL_SELECTOR =
  process.env.RAIL_SELECTOR ||
  '[data-demo-rail], [data-slot="library-rail"], [data-slot="workspaces-rail"], [aria-label="Library"], nav[aria-label*="Bubbles" i]';
const DEVICE_SCALE = 2;
/** Encoded loops are scaled to this multiple of the CSS viewport (≈720p-class for the column) to stay ≲1 MB. */
const OUTPUT_SCALE = 1.5;
const ALL_SURFACES = ["spine", "calls", "texts", "id", "blurbs", "oo", "docs", "drawer", "signin"];
/** The console home's default set (the extra surfaces are opt-in via `--surfaces`). */
const DEFAULT_SURFACES = ["spine", "calls", "texts", "id", "blurbs", "oo"];
const ALL_THEMES = ["dark", "light"];
const SETTLE_MS = 1500;
const READY_TIMEOUT_MS = 8000;
const POSTER_AT_MS = 3000;
/** Tail→head crossfade used to make the loop seamless (seconds). */
const LOOP_FADE_SECONDS = 0.6;

function parseArgs(argv) {
  // The rail is opt-in (`--rail auto|shared|per-surface`): the console uses the landing's own library rail today.
  const args = { surfaces: DEFAULT_SURFACES, themes: ALL_THEMES, seconds: 11, rail: "off", scenario: null, out: null };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === "--surfaces" && value) args.surfaces = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (flag === "--themes" && value) args.themes = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (flag === "--seconds" && value) args.seconds = Math.max(4, Math.min(30, Number(value) || 11));
    if (flag === "--rail" && value) args.rail = value;
    if (flag === "--no-rail") args.rail = "off";
    if (flag === "--scenario" && value) args.scenario = value.trim();
    if (flag === "--out" && value) args.out = resolve(ROOT, value);
  }
  if (args.scenario && !/^[a-z0-9-]+$/.test(args.scenario)) throw new Error(`Bad --scenario "${args.scenario}"`);
  for (const s of args.surfaces) if (!ALL_SURFACES.includes(s)) throw new Error(`Unknown surface "${s}"`);
  for (const t of args.themes) if (!ALL_THEMES.includes(t)) throw new Error(`Unknown theme "${t}"`);
  if (!["auto", "shared", "per-surface", "off"].includes(args.rail)) throw new Error(`Unknown --rail "${args.rail}"`);
  return args;
}

function hasFfmpeg() {
  return spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
}

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

/**
 * Trims [start, start+duration] out of the raw recording (optionally cropping it, in device px) and crossfades its
 * last F seconds into its first F, so the output (duration − F) ends on the frame it starts on. Writes webm + mp4.
 */
function encodeLoop(inputArgs, { start, duration, crop, cssWidth }, outBase) {
  const f = LOOP_FADE_SECONDS;
  // Screencast frames can change size mid-capture; normalise every frame to the first frame's size before cropping.
  const normalise = crop?.frame ? `,scale=${crop.frame.w}:${crop.frame.h}` : "";
  const cropFilter = crop ? `${normalise},crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}` : "";
  const target = cssWidth ? Math.round((cssWidth * OUTPUT_SCALE) / 2) * 2 : null;
  const scaleFilter = target ? `,scale='min(${target},iw)':-2:flags=lanczos` : "";
  const filter = [
    `[0:v]trim=start=${start}:duration=${duration},setpts=PTS-STARTPTS,fps=30${cropFilter}${scaleFilter},split[a][b]`,
    `[a]trim=start=${f},setpts=PTS-STARTPTS[body]`,
    `[b]trim=duration=${f},setpts=PTS-STARTPTS[head]`,
    `[body][head]xfade=transition=fade:duration=${f}:offset=${(duration - 2 * f).toFixed(3)},format=yuv420p[v]`,
  ].join(";");
  ffmpeg([...inputArgs, "-filter_complex", filter, "-map", "[v]", "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", `${outBase}.webm`]);
  ffmpeg([...inputArgs, "-filter_complex", filter, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-movflags", "+faststart", `${outBase}.mp4`]);
}

/**
 * Measures a surface's composition (CSS px, clamped to the viewport):
 *   id → the ID page's pod stack (the name row + `.profile-pod-bento` board: hero ID pod + every companion pod);
 *   everything else → the app's centred column (the largest element ≤ 720px wide centred on the viewport), which
 *   holds the paper-card sheet / transcript / feed.
 */
async function measureSurface(page, surface) {
  return page.evaluate(
    ({ surface, pad }) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const clamp = (r) => {
        const left = Math.max(0, Math.floor(r.left - pad));
        const top = Math.max(0, Math.floor(r.top - pad));
        const right = Math.min(vw, Math.ceil(r.right + pad));
        const bottom = Math.min(vh, Math.ceil(r.bottom + pad));
        return { left, top, width: right - left, height: bottom - top };
      };
      if (surface === "drawer") {
        // Placeholder (chrome on): the Bubbles drawer is the tall panel pinned to the left edge. With a scenario and
        // chrome=0 the drawer is the centred column, handled below.
        let panel = null;
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.left > 80 || r.width < 300 || r.width > 440 || r.height < 480) continue;
          if (!panel || r.width * r.height > panel.width * panel.height) panel = r;
        }
        if (panel && panel.left + panel.width < vw / 2) return { ...clamp(panel), via: "drawer-panel" };
      }
      if (surface === "signin") {
        // The passkey sheet floats over the ID pod stack and rises above it: crop the union of both, so the sheet's
        // header is never cut off.
        const stack = document.querySelector(".id-page-profile-stack") ?? document.querySelector(".profile-pod-bento")?.parentElement;
        let sheet = null;
        for (const el of document.querySelectorAll("body *")) {
          if (!el.textContent || !/Confirm it.s you/.test(el.textContent)) continue;
          for (let node = el; node && node !== document.body; node = node.parentElement) {
            const r = node.getBoundingClientRect();
            if (r.width >= 280 && r.width <= 560 && r.height >= 300) {
              sheet = r;
              break;
            }
          }
          if (sheet) break;
        }
        if (sheet) {
          const r = stack ? stack.getBoundingClientRect() : sheet;
          // The sheet drifts up a little as it settles (and its shadow spreads): give it 32px of extra air.
          const air = 32;
          const union = {
            left: Math.min(r.left, sheet.left) - air,
            top: Math.min(r.top, sheet.top) - air,
            right: Math.max(r.right, sheet.right) + air,
            bottom: Math.max(r.bottom, sheet.bottom) + air,
          };
          return { ...clamp(union), via: "signin-union" };
        }
      }
      if (surface === "id") {
        const bento = document.querySelector(".profile-pod-bento");
        const stack = document.querySelector(".id-page-profile-stack") ?? bento?.parentElement;
        const el = stack ?? bento;
        if (el) return { ...clamp(el.getBoundingClientRect()), via: stack ? "id-stack" : "bento" };
      }
      let best = null;
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width < 300 || r.width > 720 || r.height < 300) continue;
        if (Math.abs(r.left + r.width / 2 - vw / 2) > 40) continue;
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) * r.width;
        if (!best || visible > best.visible) best = { r, visible };
      }
      return best ? { ...clamp(best.r), via: "column" } : null;
    },
    { surface, pad: SURFACE_CROP_PAD },
  );
}

/** Measures the rail's box (CSS px): RAIL_SELECTOR first, else the leftmost tall, narrow, pinned element. */
async function measureRail(page) {
  return page.evaluate((selector) => {
    const toBox = (el) => {
      const r = el.getBoundingClientRect();
      return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    };
    const explicit = document.querySelector(selector);
    if (explicit) return { ...toBox(explicit), via: "selector" };
    const vh = window.innerHeight;
    const candidates = [...document.querySelectorAll("body *")].filter((el) => {
      const r = el.getBoundingClientRect();
      const pos = getComputedStyle(el).position;
      return (pos === "fixed" || pos === "absolute") && r.left < 80 && r.width >= 32 && r.width <= 140 && r.height >= vh * 0.4;
    });
    candidates.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    return candidates[0] ? { ...toBox(candidates[0]), via: "heuristic" } : null;
  }, RAIL_SELECTOR);
}

/**
 * Opens one `/demo` URL, records `seconds` of its loop, writes poster + loop to `outBase`. With `rail: true` the page
 * is measured for the rail and everything is cropped to it. Returns `{ files, box, still }` (`still` = PNG of the
 * cropped region, used to decide whether the rail is shared across surfaces).
 */
async function capture(browser, { url, theme, seconds, viewport, rail, surface, outBase, useFfmpeg }) {
  const workDir = mkdtempSync(join(tmpdir(), "jokuh-capture-"));
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: DEVICE_SCALE,
    colorScheme: theme,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.addEventListener("message", (event) => {
      if (event?.data?.type === "jokuh-embed-ready") window.__jokuhEmbedReady = true;
    });
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
  await page.waitForFunction(() => window.__jokuhEmbedReady === true, null, { timeout: READY_TIMEOUT_MS }).catch(() => {});
  await page.waitForTimeout(SETTLE_MS);
  // The passkey sheet's contents appear a few seconds after the page settles: wait for them so it can be measured.
  if (surface === "signin") {
    await page
      .waitForFunction(() => /Confirm it.s you/.test(document.body.textContent ?? ""), null, { timeout: 10_000 })
      .catch(() => {});
    await page.waitForTimeout(600);
  }

  let box = null;
  if (rail) {
    box = await measureRail(page);
    if (!box) {
      await context.close();
      rmSync(workDir, { recursive: true, force: true });
      throw new Error(`Rail not found on ${url} (set RAIL_SELECTOR)`);
    }
  } else if (surface) {
    box = await measureSurface(page, surface);
    if (!box) {
      await context.close();
      rmSync(workDir, { recursive: true, force: true });
      throw new Error(`Surface composition not found on ${url}`);
    }
  }
  const clip = box ? { x: box.left, y: box.top, width: box.width, height: box.height } : undefined;
  const still = await page.screenshot({ type: "png", clip });

  // Record through the DevTools screencast: frames arrive at device-pixel resolution (Playwright's recordVideo
  // captures at CSS size and pads the rest), only when something changes, each with its own timestamp.
  const frames = [];
  const cdp = await context.newCDPSession(page);
  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    frames.push({ data, t: metadata.timestamp });
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", {
    format: "jpeg",
    quality: 90,
    maxWidth: viewport.width * DEVICE_SCALE,
    maxHeight: viewport.height * DEVICE_SCALE,
    everyNthFrame: 1,
  });
  const startedAt = Date.now() / 1000;
  await page.waitForTimeout(POSTER_AT_MS);
  await page.screenshot({ path: `${outBase}.jpg`, type: "jpeg", quality: 82, clip });
  await page.waitForTimeout(Math.max(0, seconds * 1000 - POSTER_AT_MS));
  await cdp.send("Page.stopScreencast").catch(() => {});
  const endedAt = Date.now() / 1000;
  await context.close();

  const name = outBase.slice(outBase.lastIndexOf("/") + 1);
  const files = { poster: `${PUBLIC_PREFIX}/${name}.jpg` };
  if (box) files.size = { width: box.width, height: box.height };
  if (useFfmpeg && frames.length > 0) {
    // Concat list with real per-frame durations (static stretches produce no frames, so durations carry them).
    const list = [];
    frames.forEach((frame, index) => {
      const file = join(workDir, `f${String(index).padStart(5, "0")}.jpg`);
      writeFileSync(file, Buffer.from(frame.data, "base64"));
      const next = frames[index + 1]?.t ?? Math.max(endedAt, frame.t + 1 / 30);
      list.push(`file '${file}'`, `duration ${Math.max(1 / 60, next - frame.t).toFixed(4)}`);
    });
    list.push(`file '${join(workDir, `f${String(frames.length - 1).padStart(5, "0")}.jpg`)}'`);
    const listPath = join(workDir, "frames.txt");
    writeFileSync(listPath, `${list.join("\n")}\n`);
    const duration = Math.min(seconds, endedAt - Math.max(startedAt, frames[0].t) + 0.001);
    // Screencast frames can come back smaller than viewport × DPR (the compositor caps them); crop in frame pixels.
    const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=width", "-of", "csv=p=0", join(workDir, "f00000.jpg")]);
    const frameWidth = Number(String(probe.stdout).trim()) || viewport.width * DEVICE_SCALE;
    const k = frameWidth / viewport.width;
    const even = (n) => Math.max(2, Math.floor(n / 2) * 2);
    const crop = box
      ? {
          x: Math.round(box.left * k),
          y: Math.round(box.top * k),
          w: even(box.width * k),
          h: even(box.height * k),
          frame: { w: even(viewport.width * k), h: even(viewport.height * k) },
        }
      : undefined;
    encodeLoop(["-f", "concat", "-safe", "0", "-i", listPath], { start: 0, duration, crop, cssWidth: box ? box.width : viewport.width }, outBase);
    files.webm = `${PUBLIC_PREFIX}/${name}.webm`;
    files.mp4 = `${PUBLIC_PREFIX}/${name}.mp4`;
  }
  rmSync(workDir, { recursive: true, force: true });
  return { files, box: box ? { left: box.left, top: box.top, width: box.width, height: box.height } : null, still };
}

const suffix = (theme) => (theme === "dark" ? "" : `-${theme}`);

/** The `/demo` URL for one surface: the scenario's own surface, or (no scenario) the drawer placeholder's docs page. */
function demoUrl(origin, surface, theme, scenario, chrome = "0") {
  const params = new URLSearchParams();
  if (surface === "drawer") {
    // The Bubbles drawer exists only with the app chrome on (`chrome=0` falls back to Spine): record it with the
    // chrome and crop the drawer panel (`measureSurface`). No scenario = the consumer demo's drawer lives on `docs`.
    params.set("surface", scenario ? "drawer" : "docs");
  } else {
    params.set("surface", surface);
    params.set("chrome", chrome);
  }
  params.set("theme", theme);
  if (scenario) params.set("scenario", scenario);
  return `${origin}/demo?${params.toString()}`;
}

async function main() {
  const origin = process.env.APP_ORIGIN?.trim().replace(/\/$/, "");
  if (!origin) {
    console.error("APP_ORIGIN is required, e.g. APP_ORIGIN=http://localhost:5173 node scripts/capture-app-demo.mjs");
    process.exit(1);
  }
  const { surfaces, themes, seconds, rail: railMode, scenario, out } = parseArgs(process.argv.slice(2));
  if (out) {
    OUT_DIR = out;
    PUBLIC_PREFIX = publicPrefixFor(out);
  }
  const useFfmpeg = hasFfmpeg();
  if (!useFfmpeg) console.warn("ffmpeg not found: writing posters only (the console shows the still).");
  mkdirSync(OUT_DIR, { recursive: true });

  const manifestPath = join(OUT_DIR, "manifest.json");
  let previous = { surfaces: {} };
  try {
    previous = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    /* first run */
  }
  const manifest = {
    capturedAt: new Date().toISOString(),
    origin,
    viewport: SURFACE_PAGE_VIEWPORT,
    // Per surface: `scenario` says which demo data it shows (`consumer` = the default demo, a placeholder on /defense).
    surfaces: { ...(previous.surfaces ?? {}) },
    ...(previous.rail ? { rail: previous.rail } : {}),
  };

  // `--force-device-scale-factor` makes the DevTools screencast deliver device-pixel (2×) frames; with only the
  // context's deviceScaleFactor, screencast frames come back at CSS size.
  const browser = await chromium.launch({ args: [`--force-device-scale-factor=${DEVICE_SCALE}`] });
  try {
    for (const theme of themes) {
      // Column captures.
      for (const surface of surfaces) {
        process.stdout.write(`column ${surface} (${theme})… `);
        const { files } = await capture(browser, {
          url: demoUrl(origin, surface, theme, scenario),
          theme,
          seconds,
          viewport: SURFACE_PAGE_VIEWPORT,
          rail: false,
          surface,
          outBase: join(OUT_DIR, `${surface}${suffix(theme)}`),
          useFfmpeg,
        });
        files.scenario = scenario ?? "consumer";
        if (!scenario && surface === "drawer") files.placeholderOf = "docs";
        manifest.surfaces[surface] = { ...manifest.surfaces[surface], [theme]: files };
        process.stdout.write("done\n");
      }

      // Rail captures: per surface first, then collapse to one shared capture when they're identical.
      if (railMode === "off") continue;
      const perSurface = {};
      let box = null;
      for (const surface of surfaces) {
        process.stdout.write(`rail ${surface} (${theme})… `);
        const result = await capture(browser, {
          url: demoUrl(origin, surface, theme, scenario, "rail"),
          theme,
          seconds: Math.min(seconds, 8),
          viewport: RAIL_PAGE_VIEWPORT,
          rail: true,
          outBase: join(OUT_DIR, `rail-${surface}${suffix(theme)}`),
          useFfmpeg,
        });
        perSurface[surface] = result;
        box ??= result.box;
        process.stdout.write("done\n");
      }
      const stills = Object.values(perSurface).map((r) => r.still.toString("base64"));
      const identical = stills.every((s) => s === stills[0]);
      const shared = railMode === "shared" || (railMode === "auto" && identical);
      const railEntry = manifest.rail ?? { surfaces: {} };
      railEntry.box = box;
      railEntry.pageViewport = RAIL_PAGE_VIEWPORT;
      railEntry.surfaces ??= {};
      if (shared) {
        const first = surfaces[0];
        for (const ext of ["jpg", "webm", "mp4"]) {
          const from = join(OUT_DIR, `rail-${first}${suffix(theme)}.${ext}`);
          if (existsSync(from)) copyFileSync(from, join(OUT_DIR, `rail${suffix(theme)}.${ext}`));
        }
        const files = Object.fromEntries(
          Object.entries(perSurface[first].files).map(([k, v]) => [k, v.replace(`rail-${first}`, "rail")]),
        );
        railEntry.shared = { ...railEntry.shared, [theme]: files };
        for (const surface of surfaces) {
          for (const ext of ["jpg", "webm", "mp4"]) rmSync(join(OUT_DIR, `rail-${surface}${suffix(theme)}.${ext}`), { force: true });
          if (railEntry.surfaces[surface]) delete railEntry.surfaces[surface][theme];
        }
      } else {
        for (const surface of surfaces) {
          railEntry.surfaces[surface] = { ...railEntry.surfaces[surface], [theme]: perSurface[surface].files };
        }
      }
      manifest.rail = railEntry;
      console.log(`rail (${theme}): ${shared ? "shared" : "per surface"} · box ${JSON.stringify(box)}`);
    }
  } finally {
    await browser.close();
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`wrote ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
