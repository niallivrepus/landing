import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await primeCookieConsent(page);
  await page.goto('/stories');
});

test('opens a story detail page and navigates through the story rail', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Stories' })).toBeVisible();

  await page.getByText('A psychotherapy practice in New York', { exact: true }).first().click();
  await expect(page).toHaveURL(/\/stories\/aaron-liebowitz-psychotherapy-nyc$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'A psychotherapy practice in New York' }),
  ).toBeVisible();

  await page.locator('a[href="/stories/made-from-memory"]').first().click();
  await expect(page).toHaveURL(/\/stories\/made-from-memory$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Made from Memory' })).toBeVisible();
});

test('memory story stays vertically scrollable', async ({ page }) => {
  await page.goto('/stories/made-from-memory');
  await expect(page.getByRole('heading', { level: 1, name: 'Made from Memory' })).toBeVisible();

  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
});

test('share your story page loads', async ({ page }) => {
  await page.goto('/stories/share');
  await expect(page).toHaveURL(/\/stories\/share$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Share your story' })).toBeVisible();
  await expect(page.getByText('We collect real stories from people using Jokuh', { exact: false })).toBeVisible();
});
