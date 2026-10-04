import { expect, type Page } from '@playwright/test';

/**
 * Primes cookie consent and skips the homepage mission intro so e2e assertions
 * hit the hero immediately. **Connects to:** `mission-intro-storage.ts` (`jokuh.missionIntro.seen`).
 */
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
    try {
      window.sessionStorage.setItem('jokuh.missionIntro.seen', '1');
    } catch {
      /* ignore */
    }
  });
}

/** The app-wide consent banner (`CookieBanner.tsx`); its accessible name is the banner copy. */
export function cookieBanner(page: Page) {
  return page.getByRole('dialog', { name: /We use cookies for essential site function/ });
}

/** Rejects optional cookies if the consent banner is up (it is not when `primeCookieConsent` ran). */
export async function dismissCookieBanner(page: Page) {
  const dialog = cookieBanner(page);

  if (await dialog.waitFor({ state: 'visible', timeout: 1500 }).then(() => true).catch(() => false)) {
    await dialog.getByRole('button', { name: 'Reject optional' }).click();
    await expect(dialog).toBeHidden();
  }
}

/**
 * Stubs the homepage temporary OO chat (`landing-oo-chat` edge function) with an SSE reply in the
 * OpenRouter delta shape `landing-oo-chat-client.ts` parses, so tests never reach the real function.
 * Returns the request bodies the page sent.
 */
export async function mockLandingOoChat(page: Page, reply: string[]) {
  const requests: Array<{ messages: Array<{ role: string; content: string }> }> = [];

  await page.route('**/functions/v1/landing-oo-chat', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*' } });
      return;
    }

    requests.push(JSON.parse(route.request().postData() ?? '{}'));
    const body =
      ': OPENROUTER PROCESSING\n\n' +
      reply.map((chunk) => `data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`).join('') +
      'data: [DONE]\n\n';

    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream', 'access-control-allow-origin': '*' },
      body,
    });
  });

  return requests;
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
