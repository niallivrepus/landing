import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
});

test('opens site search and returns source matches for an about query', async ({ page }) => {
  // Site search lives in the `SiteTopBar` on every page except the one-screen homepage.
  await page.goto('/pricing');
  await page.waitForLoadState('networkidle');
  await dismissCookieBanner(page);
  await page.getByRole('banner').getByRole('button', { name: 'Open search' }).click();

  const searchInput = page.getByRole('textbox', { name: 'Search Jokuh' });

  await expect(searchInput).toBeFocused();

  await searchInput.fill('about');
  await searchInput.press('Enter');

  const aboutLink = page.locator('a[href="/about"]').first();
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible();
});

test('reaches contact sales from the homepage via pricing', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);

  await page.getByRole('navigation', { name: 'Site links' }).getByRole('link', { name: 'Pricing', exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);

  const contactSalesLink = page.getByRole('link', { name: 'Contact sales', exact: true });
  await contactSalesLink.scrollIntoViewIfNeeded();
  await contactSalesLink.click();

  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Contact sales' })).toBeVisible();
});
