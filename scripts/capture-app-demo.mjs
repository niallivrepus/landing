#!/usr/bin/env node
/**
 * Capture the REAL Jokuh web app's demo surfaces for the console home (`/lab/home`).
 *
 * The console home never re-draws the app: the centred column and the left rail play recordings of the real web
 * app's read-only `/demo` mode. This script makes those recordings. Re-run it whenever the app UI changes.
 *
 * Per surface (spine, calls, texts, id, blurbs, oo) and theme (dark, light) it makes two captures:
 *
 *   Column — `${APP_ORIGIN}/demo?surface=<s>&chrome=0&theme=<t>` at the column viewport (COLUMN_VIEWPORT, CSS px),
 *            device scale 2: the center column's content, edge to edge.
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
 *
 * Usage (APP_ORIGIN is required on purpose — point it at a dev/staging app until the /demo fidelity fix ships):
 *   APP_ORIGIN=http://localhost:5173 node scripts/capture-app-demo.mjs
 *   APP_ORIGIN=… node scripts/capture-app-demo.mjs --surfaces spine,texts --themes dark --seconds 12 --no-rail
 *   CAPTURE_OUT_DIR=/tmp/x APP_ORIGIN=… node scripts/capture-app-demo.mjs   (dry run elsewhere)
 *   RAIL_SELECTOR='[data-demo-rail]' APP_ORIGIN=… node scripts/capture-app-demo.mjs
 *
 * Needs: `@playwright/test` (devDependency) with Chromium (`npx playwright install chromium`); ffmpeg recommended.
 * Connects to: `src/components/landing/console/surfaces/ConsoleSurfaces.tsx` (`CONSOLE_CAPTURE_VIEWPORT`, manifest),
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
const OUT_DIR = process.env.CAPTURE_OUT_DIR ? resolve(process.env.CAPTURE_OUT_DIR) : join(ROOT, "public", "console", "captures");
const PUBLIC_PREFIX = "/console/captures";

/** Keep in sync with `CONSOLE_CAPTURE_VIEWPORT` in `ConsoleSurfaces.tsx`. */
const COLUMN_VIEWPORT = { width: 560, height: 640 };
/** Desktop page the rail is measured on (the app's rail is sized against the full viewport). */
const RAIL_PAGE_VIEWPORT = { width: 1440, height: 900 };
const RAIL_SELECTOR =
  process.env.RAIL_SELECTOR ||
  '[data-demo-rail], [data-slot="library-rail"], [data-slot="workspaces-rail"], [aria-label="Library"], nav[aria-label*="Bubbles" i]';
const DEVICE_SCALE = 2;
/** Encoded loops are scaled to this multiple of the CSS viewport (≈720p-class for the column) to stay ≲1 MB. */
const OUTPUT_SCALE = 1.5;
const ALL_SURFACES = ["spine", "calls", "texts", "id", "blurbs", "oo"];
const ALL_THEMES = ["dark", "light"];
const SETTLE_MS = 1500;
const READY_TIMEOUT_MS = 8000;
const POSTER_AT_MS = 3000;
/** Tail→head crossfade used to make the loop seamless (seconds). */
const LOOP_FADE_SECONDS = 0.6;

function parseArgs(argv) {
  // The rail is opt-in (`--rail auto|shared|per-surface`): the console uses the landing's own library rail today.
  const args = { surfaces: ALL_SURFACES, themes: ALL_THEMES, seconds: 11, rail: "off" };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === "--surfaces" && value) args.surfaces = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (flag === "--themes" && value) args.themes = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (flag === "--seconds" && value) args.seconds = Math.max(4, Math.min(30, Number(value) || 11));
    if (flag === "--rail" && value) args.rail = value;
    if (flag === "--no-rail") args.rail = "off";
  }
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
function encodeLoop(inputArgs, { start, duration, crop }, outBase) {
  const f = LOOP_FADE_SECONDS;
  const cropFilter = crop ? `,crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}` : "";
  const scaleFilter = `,scale=trunc(iw*${OUTPUT_SCALE / DEVICE_SCALE}/2)*2:-2:flags=lanczos`;
  const filter = [
    `[0:v]trim=start=${start}:duration=${duration},setpts=PTS-STARTPTS,fps=30${cropFilter}${scaleFilter},split[a][b]`,
    `[a]trim=start=${f},setpts=PTS-STARTPTS[body]`,
    `[b]trim=duration=${f},setpts=PTS-STARTPTS[head]`,
    `[body][head]xfade=transition=fade:duration=${f}:offset=${(duration - 2 * f).toFixed(3)},format=yuv420p[v]`,
  ].join(";");
  ffmpeg([...inputArgs, "-filter_complex", filter, "-map", "[v]", "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", `${outBase}.webm`]);
  ffmpeg([...inputArgs, "-filter_complex", filter, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-movflags", "+faststart", `${outBase}.mp4`]);
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
async function capture(browser, { url, theme, seconds, viewport, rail, outBase, useFfmpeg }) {
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

  let box = null;
  if (rail) {
    box = await measureRail(page);
    if (!box) {
      await context.close();
      rmSync(workDir, { recursive: true, force: true });
      throw new Error(`Rail not found on ${url} (set RAIL_SELECTOR)`);
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
    const crop = box
      ? { x: box.left * DEVICE_SCALE, y: box.top * DEVICE_SCALE, w: box.width * DEVICE_SCALE, h: box.height * DEVICE_SCALE }
      : undefined;
    encodeLoop(["-f", "concat", "-safe", "0", "-i", listPath], { start: 0, duration, crop }, outBase);
    files.webm = `${PUBLIC_PREFIX}/${name}.webm`;
    files.mp4 = `${PUBLIC_PREFIX}/${name}.mp4`;
  }
  rmSync(workDir, { recursive: true, force: true });
  return { files, box: box ? { left: box.left, top: box.top, width: box.width, height: box.height } : null, still };
}

const suffix = (theme) => (theme === "dark" ? "" : `-${theme}`);

async function main() {
  const origin = process.env.APP_ORIGIN?.trim().replace(/\/$/, "");
  if (!origin) {
    console.error("APP_ORIGIN is required, e.g. APP_ORIGIN=http://localhost:5173 node scripts/capture-app-demo.mjs");
    process.exit(1);
  }
  const { surfaces, themes, seconds, rail: railMode } = parseArgs(process.argv.slice(2));
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
    viewport: COLUMN_VIEWPORT,
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
          url: `${origin}/demo?surface=${encodeURIComponent(surface)}&chrome=0&theme=${theme}`,
          theme,
          seconds,
          viewport: COLUMN_VIEWPORT,
          rail: false,
          outBase: join(OUT_DIR, `${surface}${suffix(theme)}`),
          useFfmpeg,
        });
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
          url: `${origin}/demo?surface=${encodeURIComponent(surface)}&chrome=rail&theme=${theme}`,
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
