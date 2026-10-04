import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/newsroom');
});

test('filters the newsroom by topic and supports list view', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1, name: 'Newsroom' })).toBeVisible();

  await page.getByRole('button', { name: 'Filter' }).click();
  await page.getByRole('checkbox', { name: 'Blurbs' }).check();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'List view' }).click();

  await expect(page.getByRole('button', { name: 'List view' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Blurbs composer: markdown tables and paste cleanup' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spine ships to TestFlight' })).toHaveCount(0);
  await expect(page.getByText(/^\d+ articles$/)).toBeVisible();
});

test('can sort topic-filtered posts oldest first', async ({ page }) => {
  await page.getByRole('button', { name: 'Filter' }).click();
  await page.getByRole('checkbox', { name: 'Blurbs' }).check();
  await page.getByRole('button', { name: 'Sort' }).click();
  await page.getByRole('radio', { name: 'Oldest first' }).check();

  await expect(page.locator('main article').first().getByRole('heading')).toContainText(
    'Blurbs composer: markdown tables and paste cleanup',
  );
});
