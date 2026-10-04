import { expect, test } from '@playwright/test';
import { cookieBanner } from './helpers';

test.beforeEach(async ({ page }) => {
  // Fresh visitor (no consent yet); only the once-per-session mission intro is skipped.
  await page.addInitScript(() => {
    try {
      window.sessionStorage.setItem('jokuh.missionIntro.seen', '1');
    } catch {
      /* ignore */
    }
  });
});

test('persists custom cookie preferences after reload and reopening the banner', async ({ page }) => {
  await page.goto('/');

  const banner = cookieBanner(page);
  const analytics = banner.getByRole('checkbox', { name: 'Analytics cookies' });
  const marketing = banner.getByRole('checkbox', { name: 'Marketing cookies' });

  await expect(banner).toBeVisible();
  await expect(banner.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy#cookies');

  await banner.getByRole('button', { name: 'Customize' }).click();
  await expect(analytics).toBeChecked();
  await expect(marketing).toBeChecked();

  await analytics.uncheck();
  await marketing.uncheck();
  await banner.getByRole('button', { name: 'Save preferences' }).click();

  await expect(banner).toBeHidden();
  await expect
    .poll(async () => page.context().cookies())
    .toContainEqual(expect.objectContaining({ name: 'jokuh_cookie_consent' }));

  const consentCookie = (await page.context().cookies()).find((cookie) => cookie.name === 'jokuh_cookie_consent');
  expect(consentCookie).toEqual(expect.objectContaining({ path: '/', sameSite: 'Lax' }));

  const consentRecord = JSON.parse(decodeURIComponent(consentCookie!.value));
  expect(consentRecord).toEqual(
    expect.objectContaining({
      version: 1,
      prefs: { analytics: false, marketing: false },
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }),
  );

  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Your mind. Your machine.' })).toBeVisible();
  await expect(banner).toHaveCount(0);

  // Homepage footer row "Cookies" reopens the banner straight into its preferences.
  await page.getByRole('navigation', { name: 'Site links' }).getByRole('button', { name: 'Cookies' }).click();

  await expect(banner).toBeVisible();
  await expect(analytics).not.toBeChecked();
  await expect(marketing).not.toBeChecked();
});

test('rejecting optional cookies records the decision and keeps the banner away', async ({ page }) => {
  await page.goto('/pricing');

  const banner = cookieBanner(page);
  await expect(banner).toBeVisible();
  await banner.getByRole('button', { name: 'Reject optional' }).click();
  await expect(banner).toBeHidden();

  const consentCookie = (await page.context().cookies()).find((cookie) => cookie.name === 'jokuh_cookie_consent');
  expect(JSON.parse(decodeURIComponent(consentCookie!.value)).prefs).toEqual({ analytics: false, marketing: false });

  await page.goto('/support');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(banner).toHaveCount(0);

  // Mega footer "Manage cookies" reopens the saved preferences.
  await page.getByRole('button', { name: 'Manage cookies' }).click();
  await expect(banner.getByRole('checkbox', { name: 'Analytics cookies' })).not.toBeChecked();
});

test('banner Privacy Policy link lands on the cookies section of the privacy policy', async ({ page }) => {
  await page.goto('/pricing');

  const banner = cookieBanner(page);
  await banner.getByRole('link', { name: 'Privacy Policy' }).click();

  await expect(page).toHaveURL(/\/privacy#cookies$/);
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await expect(page.locator('#cookies')).toBeInViewport({ ratio: 0.1 });
});
