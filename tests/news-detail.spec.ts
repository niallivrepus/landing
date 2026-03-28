import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test.describe('newsroom detail journeys', () => {
  test('opens the featured newsroom article from the listing and returns to the newsroom', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/newsroom');

    await page.getByRole('heading', { name: 'Introducing Jokuh Cortex' }).click();

    await expect(page).toHaveURL(/\/newsroom\/introducing-jokuh-cortex$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Introducing Jokuh Cortex' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Knowledge work' })).toBeVisible();

    await page.goto('/newsroom');

    await expect(page).toHaveURL(/\/newsroom$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Newsroom' })).toBeVisible();
  });

  test('renders a brief newsroom article with its follow-up body section', async ({ page }) => {
    await primeCookieConsent(page);
    await page.goto('/newsroom/jokuh-spine-tighter-sync');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Jokuh Spine: tighter sync for multi-pod sessions' }),
    ).toBeVisible();
    await expect(page.getByText('Lower latency handoff when you move between pods on desktop and web.')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Why it matters' })).toBeVisible();
  });
});
