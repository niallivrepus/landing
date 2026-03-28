import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/stories');
});

test('opens a story detail page and navigates through the story rail', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Stories' })).toBeVisible();

  await page.getByRole('link', { name: /The Gooey app as a design island/ }).click();
  await expect(page).toHaveURL(/\/stories\/gooey-island-merge-hygiene$/);
  await expect(page.getByRole('heading', { level: 1, name: 'The Gooey app as a design island' })).toBeVisible();

  await page.locator('a[href="/stories/live-transcript-hooks-spine"]').first().click();
  await expect(page).toHaveURL(/\/stories\/live-transcript-hooks-spine$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Live transcript hooks on the spine' })).toBeVisible();
});
