import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test('defense page renders its heading and CTAs', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  await expect(page).toHaveURL(/\/defense$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Defense technology for free people' })).toBeVisible();

  const main = page.getByRole('main');
  await expect(main.getByRole('link', { name: 'Talk to our team' }).first()).toHaveAttribute('href', /\/contact$/);
  await expect(main.getByRole('link', { name: 'Read our security approach' })).toHaveAttribute('href', /\/security$/);
  await expect(main.getByRole('heading', { level: 2, name: 'On our roadmap' })).toBeVisible();
});
