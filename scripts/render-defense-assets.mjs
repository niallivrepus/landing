/**
 * **Purpose:** Renders the `/defense` marketing assets into `public/defense/assets/`:
 * the capability statement PDF, share images (OG 1200×630, square 1080, LinkedIn banner 1584×396, story 1080×1920),
 * and short loops (GIF + MP4) of the live goo Missions chain and System map.
 * **Usage:** `node scripts/render-defense-assets.mjs [--base http://localhost:4174] [--only pdf,social,clips]`
 * (`--base` must serve the landing site; stills/PDF need no server). Chromium via `PLAYWRIGHT_BROWSERS_PATH`
 * or the system Playwright install; ffmpeg must be on PATH for the clips.
 * **Connects to:** `marketing/defense/*` (sources), `pages/DefensePage.tsx` (clips), `pages/DefensePage` copy rules in
 * `data/defense.ts` — the assets repeat only claims that page already makes.
 */
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const base = opt("base", "http://localhost:4174");
const only = new Set(opt("only", "pdf,social,clips").split(","));
const out = join(root, "public/defense/assets");
const tmp = join(root, ".render-tmp");
mkdirSync(out, { recursive: true });
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const src = (file, query = "") => pathToFileURL(join(root, "marketing/defense", file)).href + query;

const launch = () => chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const browser = await launch();

if (only.has("pdf")) {
  const page = await browser.newPage();
  await page.goto(src("capability-statement.html"), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(out, "../capability-statement.pdf"), preferCSSPageSize: true, printBackground: true });
  await page.close();
  console.log("pdf  public/defense/capability-statement.pdf");
}

if (only.has("social")) {
  const sizes = [
    ["og", 1200, 630, "defense-og-1200x630.png"],
    ["square", 1080, 1080, "defense-square-1080.png"],
    ["banner", 1584, 396, "defense-linkedin-banner-1584x396.png"],
    ["story", 1080, 1920, "defense-story-1080x1920.png"],
  ];
  for (const [variant, width, height, file] of sizes) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(src("social.html", `?v=${variant}`), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(out, file) });
    await page.close();
    console.log("png ", `public/defense/assets/${file}`);
  }
}

if (only.has("clips")) {
  const clips = [
    {
      name: "defense-missions",
      selector: ".defense-missions",
      run: async (page) => {
        await page.getByRole("button", { name: "Pause" }).click();
        const items = page.locator(".defense-chain__btn");
        for (let i = 0; i < (await items.count()); i += 1) {
          await items.nth(i).click();
          await page.waitForTimeout(2600);
        }
        await page.getByRole("button", { name: "Incident response" }).click();
        await page.waitForTimeout(1800);
        await items.nth(2).click();
        await page.waitForTimeout(2400);
      },
    },
    {
      name: "defense-system-map",
      selector: ".defense-map",
      pre: async (page) => page.getByRole("tab", { name: "System map" }).click(),
      run: async (page) => {
        const canvas = page.locator(".defense-map__canvas");
        for (const label of ["Identity", "Messages", "Spine", "Docs", "OO", "Calls"]) {
          await canvas.getByRole("button", { name: new RegExp(`^${label}`) }).click();
          await page.waitForTimeout(2200);
        }
      },
    },
  ];
  for (const clip of clips) {
    const dir = join(tmp, clip.name);
    const context = await browser.newContext({ viewport: { width: 1280, height: 1200 }, colorScheme: "dark", recordVideo: { dir, size: { width: 1280, height: 1200 } } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        localStorage.setItem("jokuh.cookieConsent", "custom");
      } catch {}
    });
    await page.goto(`${base}/defense`, { waitUntil: "networkidle" });
    await page.evaluate(() => (document.documentElement.className = "dark"));
    await clip.pre?.(page);
    const el = page.locator(clip.selector);
    await el.scrollIntoViewIfNeeded();
    await page.evaluate((sel) => window.scrollBy(0, document.querySelector(sel).getBoundingClientRect().top - 84), clip.selector);
    await page.waitForTimeout(1200);
    const box = await el.boundingBox();
    const t0 = Date.now();
    await clip.run(page);
    const duration = (Date.now() - t0) / 1000;
    await context.close();
    const video = readdirSync(dir).find((f) => f.endsWith(".webm"));
    // Offset of the interaction inside the recording = recording length - duration (recording ends at close).
    const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", join(dir, video)]).toString();
    const start = Math.max(0, parseFloat(probe) - duration - 0.2);
    const w = Math.floor(box.width / 2) * 2;
    const h = Math.floor(box.height / 2) * 2;
    const crop = `crop=${w}:${h}:${Math.round(box.x)}:${Math.round(box.y)}`;
    const input = ["-y", "-v", "error", "-ss", start.toFixed(2), "-t", duration.toFixed(2), "-i", join(dir, video)];
    execFileSync("ffmpeg", [...input, "-vf", `fps=12,${crop},scale=960:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=160[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`, join(out, `${clip.name}.gif`)]);
    execFileSync("ffmpeg", [...input, "-vf", `fps=30,${crop},scale=1280:-2:flags=lanczos`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", "-an", join(out, `${clip.name}.mp4`)]);
    console.log("clip", `public/defense/assets/${clip.name}.{gif,mp4}`, `${duration.toFixed(1)}s`);
  }
}

await browser.close();
rmSync(tmp, { recursive: true, force: true });
