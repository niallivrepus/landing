import { expect, test } from '@playwright/test';
import { dismissCookieBanner, primeCookieConsent } from './helpers';

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
  await dismissCookieBanner(page);
});

test('renders the landing hero and waitlist prompt', async ({ page }) => {
  await expect(page).toHaveTitle(/Jokuh/);
  await expect(page.getByRole('heading', { level: 1, name: 'Your mind. Your machine.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download Jokuh' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Get a note when the next batch opens.' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Notify me' })).toBeVisible();
});

test('takes visitors from download to the download page', async ({ page }) => {
  await page.getByRole('link', { name: 'Download Jokuh' }).click();

  await expect(page).toHaveURL(/\/download/);
  await expect(page.getByRole('heading', { level: 1, name: /Download Jokuh|Create your Jokuh account/i })).toBeVisible();
});

test('opens pricing instead of bouncing home', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Early access is included.' })).toBeVisible();
});

test('unknown paths render a 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await expect(page.getByRole('heading', { level: 1, name: 'This page is not here.' })).toBeVisible();
  await expect(page.locator('body')).toContainText('This page is not here');
  await expect(page.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: 'Download' }).first()).toHaveAttribute('href', /\/download/);
  await expect(page.getByRole('link', { name: 'Support' }).first()).toHaveAttribute('href', /\/support/);
});

test('lets visitors join the waitlist from the homepage', async ({ page }) => {
  await page.route('**/api/contact-sales', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        message: "You're on the list. We'll email you when the next batch opens.",
      }),
    });
  });

  const waitlistEmail = page.getByRole('textbox', { name: 'Email' });
  await waitlistEmail.fill('designer@jokuh.com');
  await page.getByRole('button', { name: 'Notify me' }).click();

  await expect(page.getByText(/You're on the list/i)).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});
