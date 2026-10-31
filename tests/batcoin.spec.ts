import { expect, test, type Page } from '@playwright/test';
import { primeCookieConsent } from './helpers';

/** `/batcoin`: the living Batcoin city (`components/landing/batcoin/`). */

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
});

async function cityReady(page: Page) {
  await expect(page.getByRole('heading', { level: 1, name: 'Batcoin' })).toBeVisible();
  await page.waitForFunction(() => (window.__batcoinCity?.frames ?? 0) > 0);
}

test('/batcoin serves the page (200), not a redirect home', async ({ page, request }) => {
  const res = await request.get('/batcoin', { maxRedirects: 0 });
  expect(res.status()).toBe(200);
  const nav = await page.goto('/batcoin');
  expect(nav?.status()).toBe(200);
  await expect(page).toHaveURL(/\/batcoin$/);
  await cityReady(page);
  await expect(page).toHaveTitle(/Batcoin/);
});

test('the city canvas renders and the bats move', async ({ page }) => {
  await page.goto('/batcoin');
  await cityReady(page);
  const canvas = page.getByTestId('batcoin-canvas');
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box!.width).toBeGreaterThan(300);
  const before = await page.evaluate(() => ({ f: window.__batcoinCity!.frames, s: window.__batcoinCity!.sample() }));
  await page.waitForTimeout(800);
  const after = await page.evaluate(() => ({ f: window.__batcoinCity!.frames, s: window.__batcoinCity!.sample() }));
  expect(after.f).toBeGreaterThan(before.f + 5);
  expect(after.s).not.toEqual(before.s);
  const st = await page.evaluate(() => window.__batcoinCity!.state());
  expect(st.flying + st.roosting).toBeGreaterThan(30);
});

test('the five Batcoin facts are on the page', async ({ page }) => {
  await page.goto('/batcoin');
  await cityReady(page);
  const cards = page.getByRole('list', { name: 'How you get Batcoin' }).getByRole('listitem');
  await expect(cards).toHaveCount(5);
  for (const text of [
    'New accounts get 9 Batcoin when they join.',
    'When a friend you invite joins, you both get 9.',
    'Post a blurb every day: 1 a day, plus bonus coins on days 3, 6 and 9.',
    'Tip friends with Batcoin in Jokuh.',
    "Get more Batcoin in the app's Swap.",
  ]) {
    await expect(page.getByText(text, { exact: true })).toBeVisible();
  }
  // House voice: no em or en dashes anywhere in the copy.
  const copy = await page.locator('.bc-stage').innerText();
  expect(copy).not.toMatch(/[–—]/);
});

test('Download Jokuh opens the Download sheet', async ({ page }) => {
  await page.goto('/batcoin');
  await cityReady(page);
  await page.locator('.bc-head').getByRole('button', { name: 'Download Jokuh' }).click();
  await expect(page.getByRole('dialog', { name: 'Download Jokuh' })).toBeVisible();
  await expect(page).toHaveURL(/\/batcoin$/);
});

test('Gulp+ sends a coin flock and says nothing is really sent', async ({ page }) => {
  await page.goto('/batcoin');
  await cityReady(page);
  await page.getByRole('button', { name: 'Ask OO' }).click();
  const field = page.getByLabel('Tell the bats what to carry');
  await expect(field).toBeFocused();
  await field.fill('tip 5 to Maya');
  await field.press('Enter');
  await expect(page.locator('.bc-gulp__reply')).toHaveText('5 Batcoin flying to Maya. Just for show: nothing is sent.');
  await expect(page.locator('.bc-pop', { hasText: '+5 for Maya' })).toBeVisible({ timeout: 8000 });
});

test('a tap on a district sends a flock out with coins', async ({ page }) => {
  await page.goto('/batcoin');
  await cityReady(page);
  const name = page.locator('.bc-name', { hasText: 'Streaks' });
  const b = (await name.boundingBox())!;
  const jobs0 = await page.evaluate(() => window.__batcoinCity!.state().jobs);
  await page.mouse.click(b.x + b.width / 2, b.y - 60);
  await expect(name).toHaveClass(/is-on/);
  const jobs1 = await page.evaluate(() => window.__batcoinCity!.state().jobs);
  expect(jobs1).toBeGreaterThanOrEqual(Math.min(jobs0 + 1, 1));
});

test('Reduce Motion: one calm still frame that fades in, no loop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/batcoin');
  await cityReady(page);
  const canvas = page.getByTestId('batcoin-canvas');
  await expect(canvas).toHaveClass(/bc-bats--calm/);
  await expect(canvas).toHaveClass(/is-in/);
  const a = await page.evaluate(() => ({ f: window.__batcoinCity!.frames, s: window.__batcoinCity!.sample() }));
  await page.waitForTimeout(900);
  const b = await page.evaluate(() => ({ f: window.__batcoinCity!.frames, s: window.__batcoinCity!.sample() }));
  expect(b.s).toEqual(a.s);
  expect(b.f - a.f).toBeLessThanOrEqual(2);
  await expect(page.getByText('A still frame of the Batcoin city.')).toBeAttached();
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('phone layout: no sideways scroll, title, cards strip and Gulp+ on screen', async ({ page }) => {
    await page.goto('/batcoin');
    await cityReady(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.getByRole('heading', { level: 1, name: 'Batcoin' })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Ask OO' })).toBeInViewport();
    await expect(page.getByText('New accounts get 9 Batcoin when they join.')).toBeInViewport();
    const strip = page.getByRole('list', { name: 'How you get Batcoin' });
    const scrolls = await strip.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(scrolls).toBe(true);
    const bar = (await page.locator('.bc-gulp__shell').boundingBox())!;
    expect(bar.y + bar.height).toBeLessThanOrEqual(844);
  });
});

test('/batcoin is in the sitemap but not linked from home or the footer yet', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('https://www.jokuh.com/batcoin<');
  await page.goto('/');
  await expect(page.locator('a[href="/batcoin"]')).toHaveCount(0);
});
