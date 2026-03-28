import { expect, test, type Locator, type Page } from '@playwright/test';
import { primeCookieConsent } from './helpers';

async function bounds(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewport + 2);
}

async function scrollPageBy(page: Page, amount: number) {
  await page.evaluate((delta) => window.scrollBy(0, delta), amount);
  await page.waitForTimeout(120);
}

test.describe('homepage responsiveness', () => {
  const cases = [
    { name: 'mobile', viewport: { width: 390, height: 844 }, expectMenuButton: true },
    { name: 'tablet', viewport: { width: 834, height: 1194 }, expectMenuButton: false },
    { name: 'desktop', viewport: { width: 1440, height: 1100 }, expectMenuButton: false },
  ] as const;

  for (const variant of cases) {
    test(`${variant.name} homepage keeps hero and waitlist controls accessible`, async ({ page }) => {
      await page.setViewportSize(variant.viewport);
      await primeCookieConsent(page);
      await page.goto('/');

      await expect(page.getByRole('heading', { level: 1, name: 'Your thinking is the product.' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Notify me' })).toBeVisible();

      const openMenu = page.getByRole('button', { name: 'Open menu' });
      if (variant.expectMenuButton) {
        await expect(openMenu).toBeVisible();
      } else {
        await expect(openMenu).toHaveCount(0);
        await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
      }

      await expectNoHorizontalOverflow(page);
    });
  }
});

test.describe('contact form responsiveness', () => {
  test('stacks the first form row on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await primeCookieConsent(page);
    await page.goto('/contact');

    const interest = page.getByLabel('What are you interested in? *');
    const email = page.getByLabel('Work email *');
    const interestBox = await bounds(interest);
    const emailBox = await bounds(email);

    expect(Math.abs(interestBox.x - emailBox.x)).toBeLessThan(8);
    expect(emailBox.y).toBeGreaterThan(interestBox.y + 10);
    await expectNoHorizontalOverflow(page);
  });

  test('uses a two-column first form row on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await primeCookieConsent(page);
    await page.goto('/contact');

    const interest = page.getByLabel('What are you interested in? *');
    const email = page.getByLabel('Work email *');
    const interestBox = await bounds(interest);
    const emailBox = await bounds(email);

    expect(Math.abs(interestBox.y - emailBox.y)).toBeLessThan(60);
    expect(emailBox.x).toBeGreaterThan(interestBox.x + 40);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe('stories responsiveness', () => {
  test('uses a single-column grid on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await primeCookieConsent(page);
    await page.goto('/stories');

    const first = page.getByRole('link', { name: /Treasury loops and the API grid/ });
    const second = page.getByRole('link', { name: /Live transcript hooks on the spine/ });
    const firstBox = await bounds(first);
    const secondBox = await bounds(second);

    expect(Math.abs(firstBox.x - secondBox.x)).toBeLessThan(8);
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 4);
    await expectNoHorizontalOverflow(page);
  });

  test('uses multiple columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await primeCookieConsent(page);
    await page.goto('/stories');

    const first = page.getByRole('link', { name: /Treasury loops and the API grid/ });
    const second = page.getByRole('link', { name: /Live transcript hooks on the spine/ });
    const firstBox = await bounds(first);
    const secondBox = await bounds(second);

    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(24);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + 40);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe('landing newsroom sticky behavior', () => {
  test('pins the featured newsroom card, then releases it after the side column ends', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await primeCookieConsent(page);
    await page.goto('/');
    const featured = page.locator('#newsroom a[href="/newsroom/jokuh-spine-tighter-sync"]').first();
    await expect(featured).toBeVisible();

    const read = () =>
      page.evaluate(() => {
        const featuredEl = document.querySelector('#newsroom a[href="/newsroom/jokuh-spine-tighter-sync"]') as HTMLElement | null;
        const sticky = featuredEl?.parentElement as HTMLElement | null;
        const sideLinks = Array.from(
          document.querySelectorAll<HTMLElement>('#newsroom a[href^="/newsroom/"]'),
        ).filter((link) => link.getBoundingClientRect().width > 0);
        const lastSide = sideLinks.at(-1) ?? null;

        if (!featuredEl || !sticky || !lastSide) return null;

        return {
          scrollY: window.scrollY,
          featuredTop: featuredEl.getBoundingClientRect().top,
          stickyPosition: window.getComputedStyle(sticky).position,
          stickyTop: Number.parseFloat(window.getComputedStyle(sticky).top || '0'),
          stickyHeight: sticky.getBoundingClientRect().height,
          lastBottom: lastSide.getBoundingClientRect().bottom,
        };
      });

    await page.locator('#newsroom').scrollIntoViewIfNeeded();

    await expect
      .poll(async () => {
        const snapshot = await read();
        return snapshot?.stickyPosition ?? null;
      })
      .toBe('sticky');

    let state = await read();
    expect(state).not.toBeNull();

    for (let i = 0; i < 8 && state!.featuredTop > 120; i += 1) {
      await scrollPageBy(page, 180);
      state = await read();
    }

    expect(state!.featuredTop).toBeLessThan(120);
    const pinnedTop = state!.featuredTop;

    await scrollPageBy(page, 260);
    const pinnedAgain = await read();

    expect(pinnedAgain).not.toBeNull();
    expect(Math.abs(pinnedAgain!.featuredTop - pinnedTop)).toBeLessThan(36);

    let releaseProbe = pinnedAgain!;
    for (let i = 0; i < 10; i += 1) {
      if (releaseProbe.lastBottom < releaseProbe.stickyHeight + releaseProbe.stickyTop + 20) break;
      await scrollPageBy(page, 160);
      releaseProbe = (await read())!;
    }

    await scrollPageBy(page, 180);
    const released = await read();

    expect(released).not.toBeNull();
    expect(released!.featuredTop).toBeLessThan(pinnedAgain!.featuredTop - 40);
  });
});
