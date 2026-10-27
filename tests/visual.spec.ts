import { expect, test } from '@playwright/test';
import { primeCookieConsent, stabilizeForScreenshot } from './helpers';

/**
 * Pixel baselines are recorded on macOS (`*-chromium-darwin.png`). Font rasterization differs on
 * Linux, so CI (ubuntu) would have no baseline and fail with "missing snapshot"; skip off darwin rather
 * than committing linux baselines nobody can regenerate locally. Refresh with
 * `npx playwright test tests/visual.spec.ts --project=chromium --update-snapshots` on a Mac.
 */
test.skip(process.platform !== 'darwin', 'Visual baselines are recorded on macOS only.');

test.describe('visual snapshots', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are maintained for Chromium.');
  test.use({ viewport: { width: 1440, height: 900 } });

  test('Gooey home hero stays visually stable', async ({ page }) => {
    await primeCookieConsent(page);
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: /Your mind\. Your machine\./ })).toBeVisible();
    await stabilizeForScreenshot(page);

    // The viewport (the hero) only; the live goo canvases, real-app videos and the swarm are masked.
    await expect(page).toHaveScreenshot('home-hero-desktop.png', {
      mask: [page.locator('canvas, video, .gh-swarm')],
      maxDiffPixelRatio: 0.015,
    });
  });
});
