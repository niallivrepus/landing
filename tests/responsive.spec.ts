import { expect, test, type Page } from '@playwright/test';
import { primeCookieConsent } from './helpers';

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 2);
}

const WIDTHS = [
  { name: 'small-mobile', width: 375, height: 667 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1194 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

test.describe('kept pages do not overflow sideways', () => {
  for (const { name, width, height } of WIDTHS) {
    test(`${name} (${width} px)`, async ({ page }) => {
      await primeCookieConsent(page);
      await page.setViewportSize({ width, height });
      for (const path of ['/', '/privacy', '/terms', '/security', '/support', '/defense']) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        await expectNoHorizontalOverflow(page);
      }
    });
  }
});

test('home: the footer links stay inside the viewport on a phone', async ({ page }) => {
  await primeCookieConsent(page);
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const footer = page.getByRole('navigation', { name: 'Footer' });
  await footer.scrollIntoViewIfNeeded();
  for (const label of ['Download', 'Privacy Policy', 'Terms', 'Security', 'Support', 'Cookies']) {
    const box = await footer.getByRole('link', { name: label, exact: true }).boundingBox();
    expect(box, label).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(376);
  }
});
