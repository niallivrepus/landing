import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

/**
 * `/` (Console Home): the library rail's "Create a Bubble" preview stays entirely local — the new Bubble
 * appears in the rail and opens as a room with demo agents and OO's welcome — and any real action ends at the
 * Claim your identity prompt. Nothing may be sent anywhere (no non-GET requests).
 */
test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
});

test('console home is indexable and shows the centred app column', async ({ page }) => {
  await page.goto('/');
  await dismissCookieBanner(page);
  // The homepage must stay indexable (the old lab route set noindex).
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: 'Your mind. Your machine.' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Jokuh products' })).toBeVisible();
});

test('create your own Bubble stays local and ends at the claim prompt', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    // Our own backends only (same origin + Supabase); consented third-party analytics are out of scope here.
    const ours = url.startsWith('http://127.0.0.1:4173') || url.includes('.supabase.co');
    if (ours && request.method() !== 'GET' && request.method() !== 'HEAD') sent.push(`${request.method()} ${url}`);
  });

  await page.goto('/');
  await dismissCookieBanner(page);

  await page.getByRole('button', { name: 'Create a Bubble' }).click();
  const panel = page.getByRole('dialog', { name: 'Create a Bubble' });
  await expect(panel).toBeVisible();
  await expect(panel.getByText('Nothing is saved or sent.', { exact: false })).toBeVisible();

  await panel.getByLabel('Name').fill('Night swim club');
  await panel.getByRole('radio', { name: 'Emoji 🌿' }).click();
  await panel.getByRole('button', { name: 'Create Bubble' }).click();

  // The new Bubble is a pill in the rail right away, and opens as its room.
  await expect(page.getByRole('button', { name: 'Night swim club', exact: true })).toBeVisible();
  const room = page.getByRole('dialog', { name: 'Night swim club' });
  await expect(room.getByText('Kenji Sato joined')).toBeVisible();
  await expect(room.getByText(/Welcome to Night swim club/)).toBeVisible({ timeout: 6000 });

  // Any real action (invite, send) opens Claim your identity.
  await room.getByRole('button', { name: 'Invite people' }).click();
  await expect(page.locator('#claim-identity-title')).toBeVisible();

  expect(sent).toEqual([]);
});
