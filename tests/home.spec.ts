import { expect, test } from '@playwright/test';
import { dismissCookieBanner, mockLandingOoChat, primeCookieConsent } from './helpers';

/** Footer row on the one-screen homepage (`HomeFooterRow.tsx`). */
const SITE_LINKS = [
  ['Download', '/download'],
  ['Pricing', '/pricing'],
  ['Shipped', '/shipped'],
  ['News', '/newsroom'],
  ['Invest', '/invest'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Support', '/support'],
] as const;

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto('/');
  await dismissCookieBanner(page);
});

test('renders the one-screen hero with prompt bar, chips and site links', async ({ page }) => {
  await expect(page).toHaveTitle(/Jokuh/);

  const home = page.getByRole('region', { name: 'Jokuh home' });
  await expect(home.getByRole('heading', { level: 1, name: 'Your mind. Your machine.' })).toBeVisible();
  await expect(home.locator('[data-slot="prompt-frame"]')).toBeVisible();
  await expect(home.getByRole('button', { name: /^Suggested prompt:/ }).first()).toBeVisible();
  await expect(home.getByRole('link', { name: 'Get started' })).toBeVisible();
  await expect(home.getByRole('link', { name: 'Download Jokuh' })).toBeVisible();

  // Chrome: Nexus home pill, shipped ticker, four corner pills, Blurbs pill.
  await expect(home.getByRole('link', { name: 'Jokuh home' })).toHaveAttribute('href', '/');
  await expect(home.getByRole('link', { name: /^New on Shipped:/ })).toHaveAttribute('href', /^\/shipped\//);
  for (const corner of ['Profile — id', 'Spine — spine', 'Calls — call', 'Texts — text']) {
    await expect(home.getByRole('button', { name: corner })).toBeVisible();
  }
  await expect(home.getByRole('link', { name: 'Blurbs' })).toHaveAttribute('href', '/blurbs');

  const siteLinks = page.getByRole('navigation', { name: 'Site links' });
  for (const [label, href] of SITE_LINKS) {
    await expect(siteLinks.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
  }
  await expect(siteLinks.getByRole('button', { name: 'Cookies' })).toBeVisible();

  // The homepage is one screen: no waitlist form, newsroom block or mega footer.
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveCount(0);
  await expect(page.locator('#newsroom')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Manage cookies' })).toHaveCount(0);
});

test('a suggestion chip opens a temporary OO chat that streams a reply', async ({ page }) => {
  const requests = await mockLandingOoChat(page, ['Private ', 'by default.']);

  await page.getByRole('button', { name: 'Suggested prompt: How private is this?' }).click();

  const chat = page.getByRole('region', { name: 'Temporary chat with OO' });
  await expect(chat).toBeVisible();
  await expect(chat.getByText('Not saved · closes when you leave')).toBeVisible();
  await expect(chat.getByText('Private by default.', { exact: true })).toBeVisible();

  // The chip sends its full query (not just its label) as the visitor's first turn, and it shows as their bubble.
  expect(requests).toHaveLength(1);
  const [firstTurn] = requests[0]!.messages;
  expect(requests[0]!.messages).toHaveLength(1);
  expect(firstTurn).toEqual({ role: 'user', content: expect.stringMatching(/private/i) });
  await expect(chat.getByText(firstTurn!.content, { exact: true })).toBeVisible();

  await chat.getByRole('button', { name: 'Close chat' }).click();
  await expect(chat).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: 'Your mind. Your machine.' })).toBeVisible();
});

test('shows a clean error when the temporary chat is unavailable', async ({ page }) => {
  await page.route('**/functions/v1/landing-oo-chat', (route) =>
    route.fulfill({
      status: 503,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      body: JSON.stringify({ error: 'unavailable' }),
    }),
  );

  await page.getByRole('button', { name: 'Suggested prompt: What does OO know?' }).click();

  const chat = page.getByRole('region', { name: 'Temporary chat with OO' });
  await expect(chat).toBeVisible();
  await expect(chat.getByText("OO can't answer right now. Try again in a moment.")).toBeVisible();
  await expect(chat.getByText('OO is thinking…')).toHaveCount(0);
});

test('takes visitors from download to the download page', async ({ page }) => {
  await page.getByRole('link', { name: 'Download Jokuh' }).click();

  await expect(page).toHaveURL(/\/download/);
  await expect(page.getByRole('heading', { level: 1, name: /Download Jokuh|Create your Jokuh account/i })).toBeVisible();
});

test('footer row reaches the shipped log', async ({ page }) => {
  await page.getByRole('navigation', { name: 'Site links' }).getByRole('link', { name: 'Shipped', exact: true }).click();

  await expect(page).toHaveURL(/\/shipped$/);
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
