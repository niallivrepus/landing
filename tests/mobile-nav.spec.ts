import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

test.use({ viewport: { width: 390, height: 844 } });

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await dismissCookieBanner(page);
});

test('opens the mobile menu and navigates to the About page', async ({ page }) => {
  await page.locator('button[aria-label="Open menu"]:visible').click();

  await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible();

  await page.getByRole('button', { name: 'Company' }).click();

  const aboutLink = page.getByLabel('Company menu').getByRole('link', { name: 'About us' });
  await aboutLink.scrollIntoViewIfNeeded();
  await aboutLink.click({ force: true });

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About Jokuh' })).toBeVisible();
});
