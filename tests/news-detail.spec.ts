import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test.describe('newsroom detail journeys', () => {
  test('opens the featured newsroom article from the listing and returns to the newsroom', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/newsroom');

    const firstArticleHeading = page.locator('main article').first().getByRole('heading').first();
    const firstTitle = (await firstArticleHeading.textContent())?.trim();
    expect(firstTitle).toBeTruthy();
    await firstArticleHeading.click();

    await expect(page).toHaveURL(/\/newsroom\/[^/]+$/);
    await expect(page.getByRole('heading', { level: 1, name: firstTitle! })).toBeVisible();

    await page.goto('/newsroom');

    await expect(page).toHaveURL(/\/newsroom$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Newsroom' })).toBeVisible();
  });

  test('renders a brief newsroom article with its follow-up body section', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/newsroom/spine-ships-testflight');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Spine ships to TestFlight' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'What ships' })).toBeVisible();
  });
});
