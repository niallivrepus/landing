import { expect, test } from '@playwright/test';
import { mockLandingOoChat, primeCookieConsent } from './helpers';

/** The one footer of the trimmed site (`SiteFooter.tsx`): six links, then © and X. */
const FOOTER_LINKS = [
  ['Download', '/?get=1'],
  ['Privacy Policy', '/privacy'],
  ['Terms', '/terms'],
  ['Security', '/security'],
  ['Support', '/support'],
  ['Cookies', '/privacy#cookies'],
] as const;

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
});

test('renders the Gooey home: headline, prompt bar, chips, corner pills and the six footer links', async ({ page }) => {
  await expect(page).toHaveTitle(/Jokuh/);
  await expect(page.getByRole('heading', { level: 1, name: /Your mind\. Your machine\./ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Dictate' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Try asking' }).getByRole('listitem')).toHaveCount(3);

  for (const corner of ['ID: jump to ID', 'Spine: jump to Spine', 'Call: jump to Call', 'Text: jump to Text']) {
    await expect(page.getByRole('button', { name: corner })).toBeVisible();
  }

  const footer = page.getByRole('navigation', { name: 'Footer' });
  await expect(footer.getByRole('link')).toHaveCount(FOOTER_LINKS.length);
  for (const [label, href] of FOOTER_LINKS) {
    await expect(footer.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
  }
  await expect(page.locator('footer.gh-sitefoot').getByRole('link', { name: 'Jokuh on X' })).toHaveAttribute(
    'href',
    'https://x.com/J0KUH',
  );
});

test('the footer Download link opens the Download Jokuh sheet, again and again', async ({ page }) => {
  const footer = page.getByRole('navigation', { name: 'Footer' });
  const sheet = page.getByRole('dialog', { name: 'Download Jokuh' });

  await footer.getByRole('link', { name: 'Download', exact: true }).scrollIntoViewIfNeeded();
  await footer.getByRole('link', { name: 'Download', exact: true }).click();
  await expect(sheet).toBeVisible();
  await expect(page).toHaveURL(/\/$/);

  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();

  await footer.getByRole('link', { name: 'Download', exact: true }).click();
  await expect(sheet).toBeVisible();
});

test('/?get=1 opens the Download Jokuh sheet on arrival and tidies the address', async ({ page }) => {
  await page.goto('/?get=1');
  await expect(page.getByRole('dialog', { name: 'Download Jokuh' })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test('a suggestion chip opens a temporary OO chat that streams a reply', async ({ page }) => {
  const requests = await mockLandingOoChat(page, ['Private ', 'by default.']);

  await page.getByRole('list', { name: 'Try asking' }).getByText('Is Jokuh private?', { exact: true }).click();

  await expect(page.getByText('Temporary chat · not saved')).toBeVisible();
  await expect(page.getByText('Private by default.')).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(requests[0]?.messages.at(-1)?.content).toBe('Is Jokuh private?');
});

test('unknown paths render a 404 page', async ({ page }) => {
  await page.goto('/this-page-does-not-exist');
  await expect(page.getByRole('heading', { level: 1, name: 'This page is not here.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go home' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: 'Download' }).first()).toHaveAttribute('href', '/?get=1');
  await expect(page.getByRole('link', { name: 'Support' }).first()).toHaveAttribute('href', /\/support/);
});
