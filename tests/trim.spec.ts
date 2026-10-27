import { expect, test } from '@playwright/test';
import { primeCookieConsent } from './helpers';

/** `config/hidden-routes.ts`: every one of these sends the visitor to `/` (the server sends a 302 as well). */
const HIDDEN = [
  '/pricing',
  '/about',
  '/newsroom',
  '/newsroom/some-post',
  '/shipped',
  '/contact',
  '/invest',
  '/manifesto',
  '/blurbs',
  '/spine',
  '/calls',
  '/agents',
  '/stories',
  '/developers',
  '/demo',
] as const;

/** The pages that stay: home, the four Jokuh Docs and the unlisted /defense. */
const KEPT = [
  ['/', /Your mind\. Your machine\./],
  ['/privacy', /^Privacy Policy$/],
  ['/terms', /^Terms of Service$/],
  ['/security', /^Security$/],
  ['/support', /^Support$/],
  ['/defense', /Defense technology for free people/],
] as const;

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
});

for (const path of HIDDEN) {
  test(`hidden page ${path} sends visitors home`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { level: 1, name: /Your mind\. Your machine\./ })).toBeVisible();
  });
}

for (const [path, heading] of KEPT) {
  test(`kept page ${path} serves its content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(`${path === '/' ? '/' : path}$`));
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  });
}

test('/download is gone: it redirects to the Download Jokuh sheet, query and all', async ({ page }) => {
  for (const url of ['/download', '/download?intent=identity']) {
    await page.goto(url);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('dialog', { name: 'Download Jokuh' })).toBeVisible();
  }
});

test('the six footer links reach their pages', async ({ page }) => {
  const targets = [
    ['Privacy Policy', /\/privacy$/, 'Privacy Policy'],
    ['Terms', /\/terms$/, 'Terms of Service'],
    ['Security', /\/security$/, 'Security'],
    ['Support', /\/support$/, 'Support'],
  ] as const;
  for (const [label, url, heading] of targets) {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(url);
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
  }

  await page.goto('/');
  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Cookies', exact: true }).click();
  await expect(page).toHaveURL(/\/privacy#cookies$/);
  await expect(page.locator('#cookies')).toBeInViewport({ ratio: 0.1 });

  await page.goto('/');
  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Download', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Download Jokuh' })).toBeVisible();
});

test('the sitemap lists the kept pages and no /download', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const path of ['/privacy', '/terms', '/security', '/support']) expect(xml).toContain(`https://www.jokuh.com${path}<`);
  expect(xml).not.toContain('/download');
});
