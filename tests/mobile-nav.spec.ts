import { expect, test, type Locator } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

test.use({ viewport: { width: 390, height: 844 } });

async function expectBlurredBackdrop(locator: Locator) {
  const style = await locator.evaluate((node) => {
    const styles = window.getComputedStyle(node);
    return {
      backgroundColor: styles.backgroundColor,
      backdropFilter: styles.backdropFilter || styles.webkitBackdropFilter,
    };
  });

  expect(style.backgroundColor).toMatch(/rgba|\/\s*0?\./);
  expect(style.backdropFilter).toContain('blur');
}

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await dismissCookieBanner(page);
});

test('opens the mobile menu and navigates to the About page', async ({ page }) => {
  await page.locator('button[aria-label="Open menu"]:visible').click();

  const menu = page.getByRole('dialog', { name: 'Primary menu' });
  await expect(menu.getByRole('button', { name: 'Close menu' })).toBeVisible();
  await expectBlurredBackdrop(menu);

  await menu.getByRole('button', { name: 'Company' }).click();

  const aboutLink = menu.getByRole('link', { name: 'About us' });
  await expect(aboutLink).toBeVisible();
  await aboutLink.scrollIntoViewIfNeeded();
  await aboutLink.click();

  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible();
});

test('opens search with a blurred backdrop', async ({ page }) => {
  await page.locator('button[aria-label="Open search"]:visible').first().click();

  const search = page.getByRole('dialog', { name: 'Site search' });
  await expect(search.getByRole('button', { name: 'Close search' })).toBeVisible();
  await expect(search.getByRole('textbox', { name: 'Search Jokuh' })).toBeVisible();
  await expectBlurredBackdrop(search);
});
