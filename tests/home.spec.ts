import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
  await dismissCookieBanner(page);
});

test('renders the landing hero and waitlist prompt', async ({ page }) => {
  await expect(page).toHaveTitle(/Jokuh/);
  await expect(page.getByRole('heading', { level: 1, name: 'Your thinking is the product.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Learn about Jokuh Pods' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Get a note when the next batch opens.' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Notify me' })).toBeVisible();
});

test('takes visitors from the header CTA to the waitlist page', async ({ page }) => {
  await page.getByRole('link', { name: 'Try Jokuh' }).click();

  await expect(page).toHaveURL(/\/waitlist$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Waitlist' })).toBeVisible();
});

test('lets visitors type into the waitlist prompt without leaving the homepage', async ({ page }) => {
  const waitlistEmail = page.getByRole('textbox', { name: 'Email' });

  await waitlistEmail.fill('designer@jokuh.com');
  await page.getByRole('button', { name: 'Notify me' }).click();

  await expect(waitlistEmail).toHaveValue('designer@jokuh.com');
  await expect(page).toHaveURL(/\/$/);
});
