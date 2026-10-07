import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

/** `/agents` (`AgentsPage.tsx`) and the homepage Agents tile that links to it. */
test('agents page renders its sections and marks what is still rolling out', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/agents');

  await expect(page).toHaveURL(/\/agents$/);
  await expect(page).toHaveTitle('Agents — Jokuh');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'Your agents. Answer in a tap.' })).toBeVisible();

  for (const name of ['How it works', 'You stay in charge', 'Where to find it']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 3, name: 'Approvals' })).toBeVisible();
  await expect(page.getByText('Rolling out').first()).toBeVisible();
  await expect(page.getByRole('img', { name: /Example Agents inbox/ })).toBeVisible();

  const main = page.getByRole('main');
  await expect(main.getByRole('link', { name: 'Get Jokuh' }).first()).toHaveAttribute('href', /\/download/);
  await expect(main.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '#how-it-works');
});

test('the homepage Agents tile leads to /agents', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
  await dismissCookieBanner(page);

  const tile = page.locator('.console-tile[data-product="agents"]');
  await tile.focus();
  await expect(page.getByRole('heading', { level: 2, name: 'Agents', exact: true })).toBeVisible();
  // The context line crossfades, so the outgoing product's links can linger for a beat; wait for Agents' own.
  await expect(page.locator('.console-context').getByRole('link', { name: 'Learn more' }).and(page.locator('[href="/agents"]'))).toBeVisible();

  await tile.press('Enter');
  await expect(page).toHaveURL(/\/agents$/);
});
