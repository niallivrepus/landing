import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

const productCases = [
  {
    path: '/pods',
    hero: 'Building blocks on your profile: music, files, crypto, resumes, authored with the same Gooey glass system.',
  },
  {
    path: '/blurbs',
    hero:
      'Feed conversations from meetings and chats into inference that writes social posts for you—personalized per follower so the same update lands differently for investors, builders, and friends.',
  },
  {
    path: '/spine',
    hero:
      'Navigate time as simple bubbles—days, weeks, months, years—instead of an infinite scroll that erases context.',
  },
  {
    path: '/vortex',
    hero:
      'One converged layer to query across messengers, wallets, calendars, and agents—so “what did everyone decide?” has a single address instead of twelve tabs.',
  },
] as const;

test.describe('product page journeys', () => {
  for (const product of productCases) {
    test(`${product.path} renders its hero and routes the primary CTA to the waitlist`, async ({ page }) => {
      await primeCookieConsent(page);
      await page.goto(product.path);
      const main = page.getByRole('main');

      await expect(page.getByRole('heading', { level: 1, name: product.hero })).toBeVisible();
      await expect(page.getByRole('link', { name: 'On the home overview' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'What Jokuh is building' })).toBeVisible();
      await expect(main.getByRole('link', { name: 'Try Jokuh' })).toBeVisible();

      await main.getByRole('link', { name: 'Try Jokuh' }).click();

      await expect(page).toHaveURL(/\/waitlist$/);
      await expect(page.getByRole('heading', { level: 1, name: 'Waitlist' })).toBeVisible();
    });
  }
});
