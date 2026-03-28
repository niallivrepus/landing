import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent, stabilizeForScreenshot } from './helpers';

test.describe('visual snapshots', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are maintained for Chromium.');
  test.use({ viewport: { width: 1440, height: 1100 } });

  test('landing hero stays visually stable', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/');
    await stabilizeForScreenshot(page);

    await expect(page.locator('section').first()).toHaveScreenshot('home-hero-desktop.png', {
      mask: [page.getByRole('banner')],
    });
  });

  test('homepage newsroom block keeps its desktop composition', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/');
    const newsroom = page.locator('#newsroom');
    await newsroom.scrollIntoViewIfNeeded();
    await stabilizeForScreenshot(page);

    await expect(newsroom).toHaveScreenshot('home-newsroom-desktop.png', {
      mask: [page.getByRole('banner')],
    });
  });

  test('pods hero stays visually stable', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/pods');
    await stabilizeForScreenshot(page);

    await expect(page.locator('section').first()).toHaveScreenshot('pods-hero-desktop.png', {
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
    await page.goto('/');
    await dismissCookieBanner(page);
    await page.getByRole('button', { name: 'Open menu' }).click();
    await stabilizeForScreenshot(page);

    await expect(page).toHaveScreenshot('mobile-menu-overlay.png');
  });
});
