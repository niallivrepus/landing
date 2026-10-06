import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test('defense page renders its heading and CTAs', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  await expect(page).toHaveURL(/\/defense$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Defense technology for free people' })).toBeVisible();
  // Government readers get the plain answer and the honest status.
  await expect(page.getByRole('heading', { level: 2, name: "What we're building" })).toBeVisible();
  await expect(page.getByText('Our solution', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Working with government' })).toBeVisible();
  await expect(page.getByText(/isn't approved for classified information or CUI/)).toBeVisible();

  const main = page.getByRole('main');
  await expect(main.getByRole('link', { name: 'Talk to our team' }).first()).toHaveAttribute('href', /\/contact$/);
  await expect(main.getByRole('link', { name: 'Read our security approach' }).first()).toHaveAttribute('href', /\/security$/);
  await expect(main.getByRole('heading', { level: 2, name: 'On our roadmap' })).toBeVisible();
});

test('defense page is the app: Docs sheet, corner pills, walkthrough, architecture, capabilities', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  // The center column is a Jokuh Docs sheet with the app's header flanks.
  await expect(page.locator('.center-sheet-paper-card')).toBeVisible();
  await expect(page.locator('.docs-sheet__header-title')).toHaveText('Docs');
  for (const name of ['Back', 'Share', 'More', 'Close']) {
    await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
  }

  // Walkthrough: labelled as an illustrative scenario of the real app on demo data.
  await expect(page.getByRole('heading', { level: 2, name: 'See it work' })).toBeVisible();
  await expect(page.getByText('Illustrative scenario · real app UI with demo data', { exact: true })).toBeVisible();
  for (const step of ['One identity', 'The team space', 'Encrypted coordination', 'Reach anyone', 'Shared memory', 'Private AI']) {
    await expect(page.getByRole('heading', { level: 3, name: step })).toBeVisible();
  }
  await expect(page.locator('.defense-media')).toHaveCount(6);

  // Architecture: honest trust boundaries; a part explains itself when picked.
  await expect(page.getByRole('heading', { level: 2, name: "How it's connected" })).toBeVisible();
  const store = page.locator('.defense-trust__node[data-kind="account"]');
  await store.scrollIntoViewIfNeeded();
  await store.click();
  await expect(page.locator('.defense-trust__line')).toContainText('not end-to-end encrypted');

  await expect(page.getByRole('heading', { level: 2, name: 'At a glance' })).toBeVisible();
  await expect(page.locator('.defense-cap')).toHaveCount(6);

  // The corner pills still navigate where they do on the rest of the site.
  await page.getByRole('button', { name: /^Profile/ }).click();
  await expect(page).toHaveURL(/\/profile$/);
});

test('defense doc plays itself and pauses on reader input', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  const toggle = page.getByRole('button', { name: 'Auto-play' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true', { timeout: 5000 });
  const progress = page.getByRole('progressbar', { name: 'Doc progress' });
  await expect(progress).toHaveAttribute('aria-valuenow', '2', { timeout: 12_000 });

  // Reader input pauses; the toggle resumes.
  await page.locator('[data-defense-scroller]').dispatchEvent('wheel');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
});

test('defense doc is static under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await primeCookieConsent(page);
  await page.goto('/defense');

  await expect(page.getByRole('heading', { level: 1, name: 'Defense technology for free people' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Auto-play' })).toHaveCount(0);
  await page.waitForTimeout(3000);
  // No auto-scroll, no recordings mounted: posters only.
  expect(await page.locator('[data-defense-scroller]').evaluate((el) => el.scrollTop)).toBe(0);
  await expect(page.locator('.defense-media video')).toHaveCount(0);
  await expect(page.getByText('Illustrative scenario · real app UI with demo data', { exact: true })).toBeVisible();
});
