import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent, stabilizeForScreenshot } from './helpers';

/**
 * Pixel baselines are recorded on macOS (`*-chromium-darwin.png`). Font rasterization differs on
 * Linux, so CI (ubuntu) would have no baseline and fail with "missing snapshot"; skip off darwin rather
 * than committing linux baselines nobody can regenerate locally. Refresh with
 * `npx playwright test tests/visual.spec.ts --project=chromium --update-snapshots` on a Mac.
 */
test.skip(process.platform !== 'darwin', 'Visual baselines are recorded on macOS only.');

test.describe('visual snapshots', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are maintained for Chromium.');
  test.use({ viewport: { width: 1440, height: 1100 } });

  test('landing hero stays visually stable', async ({ page }) => {
    await primeCookieConsent(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Your mind. Your machine.' })).toBeVisible();
    await stabilizeForScreenshot(page);

    // The shipped ticker shows the newest weekly post; mask it so a new post doesn't break the baseline.
    await expect(page.getByRole('region', { name: 'Jokuh home' })).toHaveScreenshot('home-hero-desktop.png', {
      mask: [page.getByRole('link', { name: /^New on Shipped:/ })],
    });
  });

  test('download page hero stays visually stable', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/download');
    await stabilizeForScreenshot(page);

    await expect(page.locator('section').first()).toHaveScreenshot('download-hero-desktop.png', {
      mask: [page.getByRole('banner')],
    });
  });

  test('contact sales hero and form stay visually stable', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/contact');
    await stabilizeForScreenshot(page);

    await expect(page).toHaveScreenshot('contact-sales-desktop.png');
  });
});

test.describe('mobile visual snapshots', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are maintained for Chromium.');
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile menu overlay keeps its layout', async ({ page }) => {
    await primeCookieConsent(page);
    // The one-screen homepage has no top bar; the menu lives on every other page.
    await page.goto('/pricing');
    await dismissCookieBanner(page);
    await page.getByRole('banner').getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Primary menu' })).toBeVisible();
    await stabilizeForScreenshot(page);

    await expect(page).toHaveScreenshot('mobile-menu-overlay.png');
  });
});
