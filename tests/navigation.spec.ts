import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await dismissCookieBanner(page);
});

test('opens site search and returns source matches for an about query', async ({ page }) => {
  await page.locator('button[aria-label="Open search"]:visible').click();

  const dialog = page.getByRole('dialog', { name: 'Site search' });
  const searchInput = dialog.getByRole('textbox', { name: 'Search Jokuh' });

  await expect(dialog).toBeVisible();
  await expect(searchInput).toBeFocused();

  await searchInput.fill('about');
  await searchInput.press('Enter');

  await expect(dialog.getByRole('button', { name: 'Clear conversation' })).toBeVisible();
  const aboutLink = dialog.locator('a[href="/about"]').first();
  await expect(aboutLink).toBeVisible();
  await aboutLink.click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible();
});

test('reaches contact sales from the footer', async ({ page }) => {
  const contactSalesLink = page.getByRole('contentinfo').getByRole('link', { name: 'Contact sales' });
  await contactSalesLink.scrollIntoViewIfNeeded();
  await contactSalesLink.click();

  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Contact sales' })).toBeVisible();
});
