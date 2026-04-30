import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

const redirectHomePaths = [
  '/pods',
  '/blurbs',
  '/spine',
  '/vortex',
  '/passport',
  '/realms',
  '/orb',
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

test.describe('unpublished URLs redirect to home', () => {
  for (const path of redirectHomePaths) {
    test(`${path} redirects to home`, async ({ page }) => {
      await primeCookieConsent(page);
      await page.goto(path);

      await expect(page).toHaveURL(/\/$/);
    });
  }
});
