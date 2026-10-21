import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

test('defense page renders its heading, plain answer and honest status', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  await expect(page).toHaveURL(/\/defense$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Defense technology for free people' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: "What we're building" })).toBeVisible();
  await expect(page.getByText('Our solution', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Working with government' })).toBeVisible();
  await expect(page.getByText(/isn't approved for classified information or CUI/)).toBeVisible();

  const main = page.locator('.defense-page');
  await expect(main.getByRole('link', { name: 'Talk to our team' }).first()).toHaveAttribute('href', /\/contact$/);
  await expect(main.getByRole('link', { name: 'Read our security approach' }).first()).toHaveAttribute('href', /\/security$/);
  await expect(main.getByRole('heading', { level: 2, name: 'On our roadmap' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'Capability statement (PDF)' })).toHaveAttribute('href', '/defense/capability-statement.pdf');
});

test('defense missions: scenarios and steps are interactive and labelled illustrative', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  await expect(page.getByRole('tab', { name: 'Missions' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('Illustrative scenarios · real app UI with demo data')).toBeVisible();

  await page.getByRole('button', { name: 'Incident response' }).click();
  await expect(page.getByRole('button', { name: 'Incident response' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.defense-chain__item')).toHaveCount(4);

  await page.getByRole('button', { name: /Keep sensitive detail in threads/ }).click();
  await expect(page.locator('.defense-stage__title')).toHaveText('Keep sensitive detail in threads');
  await expect(page.locator('.defense-stage__body')).toContainText('end-to-end encrypted');
  // Reader input pauses the autoplay.
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
});

test('defense system map keeps the trust claims honest', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  await page.getByRole('tab', { name: 'System map' }).click();
  await expect(page.getByRole('tab', { name: 'System map' })).toHaveAttribute('aria-selected', 'true');

  const detail = page.locator('.defense-detail');
  const map = page.locator('.defense-map__canvas');
  await map.getByRole('button', { name: /^Spine/ }).click();
  await expect(detail).toContainText('not end-to-end encrypted');
  await expect(detail).toContainText('Built today');

  await map.getByRole('button', { name: /^Calls/ }).click();
  await expect(detail).toContainText('no end-to-end encryption claim for calls');

  await map.getByRole('button', { name: /^OO/ }).click();
  await expect(detail).toContainText('third-party cloud AI models today');

  await map.getByRole('button', { name: /^Self-hosted/ }).click();
  await expect(detail).toContainText('Not available yet');
  await expect(detail).toContainText('On our roadmap');
});

test('defense day in the life and trust boundaries render', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');

  await expect(page.getByRole('heading', { level: 2, name: 'A day in the life' })).toBeVisible();
  await expect(page.locator('.defense-beat')).toHaveCount(7);

  await expect(page.getByRole('heading', { level: 2, name: "How it's connected" })).toBeVisible();
  const store = page.getByRole('button', { name: /Spine · Docs · Mail/ });
  await store.scrollIntoViewIfNeeded();
  await store.click();
  await expect(page.locator('.defense-trust2__line')).toContainText('not end-to-end encrypted');
});

test('defense page makes no claim it has no basis for', async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/defense');
  const text = await page.locator('.defense-page').innerText();
  for (const banned of [/FedRAMP (authorized|certified|moderate|high)/i, /FISMA/i, /air-?gapped/i, /sovereign/i, /contract award/i, /awarded/i, /endorsed by/i, /trusted by/i]) {
    expect(text, `unexpected claim ${banned}`).not.toMatch(banned);
  }
});

test('defense page is still under reduced motion: no recordings mounted', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await primeCookieConsent(page);
  await page.goto('/defense');

  await expect(page.getByRole('heading', { level: 1, name: 'Defense technology for free people' })).toBeVisible();
  await page.waitForTimeout(1500);
  await expect(page.locator('.defense-cap video')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Pause' })).toHaveCount(0);
});
