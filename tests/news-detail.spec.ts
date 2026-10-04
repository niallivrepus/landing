import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test.describe('newsroom detail journeys', () => {
  test('opens the featured newsroom article from the listing and returns to the newsroom', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/newsroom');

    // Featured slot = newest post (`NEWS_FEED_ITEMS` sorts newest first).
    const featured = page.locator('main article').first();
    const title = (await featured.getByRole('heading').first().textContent())!.trim();
    const href = (await featured.getByRole('link').first().getAttribute('href'))!;
    expect(href).toMatch(/^\/newsroom\/[a-z0-9-]+$/);

    await featured.getByRole('heading', { name: title }).click();

    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();

    await page.goBack();

    await expect(page).toHaveURL(/\/newsroom$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Newsroom' })).toBeVisible();
  });

  test('renders a brief newsroom article with its follow-up body section', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/newsroom/blurbs-composer-markdown-tables-paste-cleanup');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Blurbs composer: markdown tables and paste cleanup' }),
    ).toBeVisible();
    await expect(
      page.getByText('Composer paste now normalizes tables, strips inline cruft, and keeps formatting safer across exports.').first(),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Editing quality' })).toBeVisible();
  });

  test('withdrawn newsroom slugs fall back to the newsroom instead of a stale article', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/newsroom/jokuh-spine-tighter-sync');

    await expect(page).toHaveURL(/\/newsroom$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Newsroom' })).toBeVisible();
  });
});
