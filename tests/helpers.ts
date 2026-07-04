import { expect, type Page } from '@playwright/test';

export async function primeCookieConsent(page: Page) {
  await page.addInitScript(() => {
    const record = {
      version: 1,
      prefs: { analytics: true, marketing: true },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem('jokuh.cookieConsent', 'custom');
    window.localStorage.setItem('jokuh.cookiePreferences', JSON.stringify(record));
    document.cookie = `jokuh_cookie_consent=${encodeURIComponent(JSON.stringify(record))}; Path=/; Max-Age=15552000; SameSite=Lax`;
  });
}

export async function dismissCookieBanner(page: Page) {
  const dialog = page.getByRole('dialog', { name: 'Cookie preferences center' });

  if (await dialog.waitFor({ state: 'visible', timeout: 1500 }).then(() => true).catch(() => false)) {
    await dialog.getByRole('button', { name: 'Done' }).click();
    await expect(dialog).toBeHidden();
  }
}

export async function stabilizeForScreenshot(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({
    content: `
      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(300);
}
