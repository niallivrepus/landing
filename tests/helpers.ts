import { expect, type Page } from '@playwright/test';

export async function primeCookieConsent(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('jokuh.cookieConsent', 'custom');
    window.localStorage.setItem(
      'jokuh.cookiePreferences',
      JSON.stringify({ analytics: true, marketing: true }),
    );
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
