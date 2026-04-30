import { expect, test } from '@playwright/test';

test('persists custom cookie preferences after reload and reopening the dialog', async ({ page }) => {
  await page.goto('/');

  const dialog = page.getByRole('dialog', { name: 'Cookie preferences center' });
  const analytics = page.getByRole('checkbox', { name: 'Analytics cookies' });
  const marketing = page.getByRole('checkbox', { name: 'Marketing and performance cookies' });

  await expect(dialog).toBeVisible();
  await expect(analytics).toBeChecked();
  await expect(marketing).toBeChecked();

  await analytics.uncheck();
  await marketing.uncheck();
  await dialog.getByRole('button', { name: 'Done' }).click();

  await expect(dialog).toBeHidden();
  await expect
    .poll(async () => page.context().cookies())
    .toContainEqual(expect.objectContaining({ name: 'jokuh_cookie_consent' }));

  const consentCookie = (await page.context().cookies()).find((cookie) => cookie.name === 'jokuh_cookie_consent');
  expect(consentCookie).toBeTruthy();
  expect(consentCookie).toEqual(
    expect.objectContaining({
      path: '/',
      sameSite: 'Lax',
    }),
  );

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
  await expect(dialog).toHaveCount(0);

  await page.getByRole('button', { name: 'Manage cookies' }).click();

  await expect(dialog).toBeVisible();
  await expect(analytics).not.toBeChecked();
  await expect(marketing).not.toBeChecked();
});
