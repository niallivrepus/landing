import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

/** Unpublished marketing URLs must 404 — never 200 as the homepage or a ChatGPT stub. */
const unpublished404Paths = [
  '/pods',
  '/ecosystem/v1llains',
  '/platform/identity',
  '/platform/gooey',
  '/platform/wallet',
  '/platform/galaxy-nodes',
  '/chatgpt/explore',
  '/chatgpt/business',
  '/chatgpt/enterprise',
  '/chatgpt/education',
] as const;

test.describe('unpublished URLs 404', () => {
  for (const path of unpublished404Paths) {
    test(`${path} shows not-found`, async ({ page }) => {
      await primeCookieConsent(page);
      await page.goto(path);

      await expect(page.getByRole('heading', { name: /This page is not here/ })).toBeVisible();
      expect(new URL(page.url()).pathname).not.toBe('/');
    });
  }
});

test('security page is a real route', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/security');

  await expect(page).toHaveURL(/\/security$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Security' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', /\/privacy/);
});
