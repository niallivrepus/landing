/**
 * **Purpose:** Re-capture the Gooey homepage screens (`public/gooey-home/captures/`) from the jokuh-live web app's Goo Lab
 * "Goo" views. Run the jokuh-live frontend dev server on :5199 first (`pnpm exec vite --port 5199`); the dev-only
 * `?canvasDevUnlock=1` flag opens the internal canvas without the staff password. Writes PNGs to the given dir;
 * convert with: magick <name>-<theme>.png -resize 720x -quality 78 public/gooey-home/captures/<name>-<theme>.webp
 * Usage: node scripts/capture-goo-lab.mjs <outDir> [namePrefix]
 */
import { chromium } from '@playwright/test';
const out = process.argv[2];
const only = process.argv[3];
const JOBS = [
  { name: 'calls-ring', lab: 'call', beat: 'Ringing', wait: 2200 },
  { name: 'calls-live', lab: 'call', beat: 'In the call', wait: 3500 },
  { name: 'text-dm', lab: 'dm-cards', beat: null, wait: 10600, noStill: true },
  { name: 'text-call', lab: 'dm-cards', beat: null, wait: 1500, noStill: true, waitText: 'is calling' },
  { name: 'id-page', lab: 'connect', beat: 'ID page', wait: 3000, themeLabel: 'Gooey ' },
  { name: 'spine-day', lab: 'spine', beat: null, wait: 3500 },
  { name: 'wallet-home', lab: 'wallet', beat: 'Home', wait: 3000 },
  { name: 'wallet-swap', lab: 'wallet', beat: 'Swap', wait: 3200 },
  { name: 'agents-city', lab: 'agents', beat: null, wait: 3500 },
  { name: 'home', lab: 'home', beat: null, wait: 3000 },
].filter(j => !only || j.name.startsWith(only));
const browser = await chromium.launch();
for (const theme of ['Dark', 'Light']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2, colorScheme: theme.toLowerCase() });
  for (const j of JOBS) {
    await page.goto(`http://localhost:5199/gooey/labs/${j.lab}?canvasDevUnlock=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const btn = (n) => page.locator('main button, aside button, section button, [role=group] button').filter({ hasText: new RegExp(`^${n}$`) });
    const click = async (n) => { const b = btn(n); const c = await b.count(); if (c) { await b.last().click().catch(()=>{}); return true; } return false; };
    await click('Goo');
    await page.waitForTimeout(600);
    await click((j.themeLabel ?? '') + theme);
    if (!j.noStill) await click('Still');
    if (j.beat) await click(j.beat);
    if (j.waitText) await page.getByText(j.waitText).first().waitFor({ timeout: 60000 }).catch(()=>console.log('nowait'));
    await page.waitForTimeout(j.wait);
    const el = page.locator('.goo-orb-full-fit, .ao-phone').first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await el.screenshot({ path: `${out}/${j.name}-${theme.toLowerCase()}.png` });
    console.log('ok', j.name, theme);
  }
  await page.close();
}
await browser.close();
