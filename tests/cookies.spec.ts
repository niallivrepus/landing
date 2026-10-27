import { expect, test } from '@playwright/test';
import { cookieBanner } from './helpers';

/**
 * The cookie banner is built only when optional tracking is configured (`VITE_GA_MEASUREMENT_ID`,
 * `lib/cookie-consent.ts`). Without it the site sets essential cookies only, so there is no banner and the footer's
 * Cookies link goes to the Privacy Policy's cookie section. (Sean has not yet decided whether to remove the banner code.)
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.sessionStorage.setItem('jokuh.missionIntro.seen', '1');
    } catch {
      /* ignore */
    }
  });
});

test('no optional tracking configured: no banner, and Cookies opens the policy section', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /Your mind\. Your machine\./ })).toBeVisible();
  await expect(cookieBanner(page)).toHaveCount(0);

  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Cookies', exact: true }).click();
  await expect(page).toHaveURL(/\/privacy#cookies$/);
  await expect(page.locator('#cookies')).toBeInViewport({ ratio: 0.1 });
  await expect(page.locator('#cookies')).toContainText(/cookie/i);
});
