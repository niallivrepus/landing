import { expect, test, type Page } from '@playwright/test';
import { primeCookieConsent } from './helpers';

const DOCS = [
  ['/privacy', 'Privacy Policy', 'cookies'],
  ['/terms', 'Terms of Service', null],
  ['/security', 'Security', 'not-encrypted'],
  ['/support', 'Support', 'contact'],
] as const;

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
});

const sheet = (page: Page) => page.locator('.da-sheet');
const scroller = (page: Page) => page.locator('[data-doc-scroller]');

for (const [path, title] of DOCS) {
  test(`${path} is a Jokuh Doc in the recap-style Docs sheet`, async ({ page }) => {
    await page.goto(path);

    // The sheet: exact squircle paint bound, rim drawn, header title "Docs".
    await expect(sheet(page)).toBeVisible();
    await expect(sheet(page)).toHaveAttribute('data-continuous-corners', '');
    await expect(page.locator('.da-sheet__rim path')).toHaveCount(2);
    await expect(page.locator('.da-header__title')).toHaveText('Docs');

    // Header pebbles: Back + Share | Docs | More + Close.
    for (const name of ['Back', 'Share', 'More', 'Close']) {
      await expect(sheet(page).getByRole('button', { name, exact: true })).toBeVisible();
    }
    await expect(sheet(page).getByRole('button', { name: 'More' })).toHaveAttribute('aria-haspopup', 'menu');

    // Nexus: dot + the doc's name. Four goo corner pills.
    await expect(page.locator('.da-nexus')).toContainText(title);
    await expect(page.locator('.da-nexus .gcf-nexus__dot')).toBeVisible();
    await expect(page.locator('.da-frame .gh-corner__btn')).toHaveCount(4);

    // The backdrop is the swarm of baby OOs, not a photo stage.
    await expect(page.locator('.da .gh-swarm__baby')).toHaveCount(8);
    await expect(page.locator('.console-stage, [class*="ConsoleStage"]')).toHaveCount(0);

    // Doc body: kicker, title, a footer inside the scroller.
    await expect(page.getByRole('heading', { level: 1, name: title, exact: true })).toBeVisible();
    await expect(page.locator('.da-kicker')).toHaveText('Jokuh Docs');
    await expect(scroller(page).locator('footer.gh-sitefoot')).toHaveCount(1);
    expect(await scroller(page).evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  });
}

test('the four corner pills go to their homepage sections', async ({ page }) => {
  for (const [label, hash] of [
    ['ID', 'id'],
    ['Spine', 'spine'],
    ['Call', 'calls'],
    ['Text', 'text'],
  ] as const) {
    await page.goto('/privacy');
    await page.getByRole('button', { name: `${label}: jump to ${label}` }).click();
    await expect(page).toHaveURL(new RegExp(`/#${hash}$`));
  }
});

test('contents beads and hash deep links scroll inside the sheet', async ({ page }) => {
  await page.goto('/privacy');
  const doc = scroller(page);
  expect(await doc.evaluate((el) => el.scrollTop)).toBe(0);

  await page.getByRole('navigation', { name: 'Contents' }).getByRole('link', { name: 'Retention' }).click();
  await expect.poll(() => doc.evaluate((el) => el.scrollTop)).toBeGreaterThan(300);
  await expect(page).toHaveURL(/\/privacy#retention$/);
  await expect(page.locator('#retention')).toBeInViewport();

  // Cold load on an anchor.
  await page.goto('/privacy#cookies');
  await expect.poll(() => scroller(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(300);
  await expect(page.locator('#cookies')).toBeInViewport({ ratio: 0.1 });
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test('Share copies the link', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/security');
  await sheet(page).getByRole('button', { name: 'Share' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Link copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/security$/);
});

test('More lists Download Jokuh and the other docs; Download opens the sheet', async ({ page }) => {
  await page.goto('/terms');
  await sheet(page).getByRole('button', { name: 'More' }).click();

  const menu = page.getByRole('menu');
  await expect(menu.getByRole('menuitem')).toHaveText(['Download Jokuh', 'Privacy Policy', 'Security', 'Support']);
  await expect(menu.getByRole('menuitem', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');

  // Escape closes it.
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);

  await sheet(page).getByRole('button', { name: 'More' }).click();
  await menu.getByRole('menuitem', { name: 'Download Jokuh' }).click();
  await expect(page.getByRole('dialog', { name: 'Download Jokuh' })).toBeVisible();
  await expect(menu).toHaveCount(0);
});

test('Close goes home and Back returns to the previous page', async ({ page }) => {
  await page.goto('/support');
  await sheet(page).getByRole('button', { name: 'Close' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto('/');
  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Terms', exact: true }).click();
  await expect(page).toHaveURL(/\/terms$/);
  await sheet(page).getByRole('button', { name: 'Back' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('light and dark follow the theme, and the paper repaints', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/privacy');
  await expect(page.locator('.da')).toHaveAttribute('data-scheme', 'light');
  await expect(sheet(page)).toHaveAttribute('data-scheme', 'light');

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/privacy');
  await expect(page.locator('.da')).toHaveAttribute('data-scheme', 'dark');
});

test('a phone keeps the doc inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [path] of DOCS) {
    await page.goto(path);
    await expect(sheet(page)).toBeVisible();
    const metrics = await page.evaluate(() => ({ viewport: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 1);
    const box = await sheet(page).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    // The header pills never sit under the title: Back and Close stay on screen.
    await expect(sheet(page).getByRole('button', { name: 'Close' })).toBeInViewport();
  }
});

test('Support questions open and close', async ({ page }) => {
  await page.goto('/support');
  const item = page.locator('details.doc-qa').first();
  await expect(item).not.toHaveAttribute('open', '');
  await item.locator('summary').scrollIntoViewIfNeeded();
  await item.locator('summary').click();
  await expect(item).toHaveAttribute('open', '');
});

test('Wallet is described as live and consistent across Privacy, Terms and Support', async ({ page }) => {
  await page.goto('/privacy#wallet');
  const wallet = page.locator('#wallet');
  await expect(wallet).toBeInViewport({ ratio: 0.1 });
  await expect(wallet).toContainText('Balances Jokuh holds for you');
  await expect(wallet).toContainText('Zcash on your device');

  for (const path of ['/privacy', '/terms', '/support']) {
    await page.goto(path);
    await expect(page.locator('.doc-legal')).not.toContainText(/Wallet (is|are) not currently|not currently (offered|available)/i);
  }

  await page.goto('/terms');
  await expect(page.locator('.doc-legal')).toContainText("It can't be sold, swapped for other coins or withdrawn.");

  await page.goto('/support');
  const qa = page.locator('details.doc-qa', { hasText: 'Where is Wallet, and what can it do?' });
  await qa.locator('summary').click();
  await expect(qa).toContainText('Open Wallet from your ID in the app.');
});
