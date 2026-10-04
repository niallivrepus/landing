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

async function expectWithinViewportWidth(page: Page, locator: Locator) {
  const box = await bounds(locator);
  const width = await page.evaluate(() => window.innerWidth);
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
}

const HOME_SITE_LINKS = ['Download', 'Pricing', 'Shipped', 'News', 'Invest', 'Privacy', 'Terms', 'Support'] as const;

test.describe('homepage responsiveness', () => {
  const cases = [
    { name: 'mobile', viewport: { width: 390, height: 844 } },
    { name: 'small-mobile', viewport: { width: 375, height: 667 } },
    { name: 'pre-desktop-threshold', viewport: { width: 799, height: 900 } },
    { name: 'desktop-threshold', viewport: { width: 800, height: 900 } },
    { name: 'tablet', viewport: { width: 834, height: 1194 } },
    { name: 'wide-tablet', viewport: { width: 1120, height: 900 } },
    { name: 'large-desktop-threshold', viewport: { width: 1200, height: 900 } },
    { name: 'desktop', viewport: { width: 1440, height: 1100 } },
  ] as const;

  for (const variant of cases) {
    test(`${variant.name} homepage keeps hero, prompt bar and site links reachable`, async ({ page }) => {
      await page.setViewportSize(variant.viewport);
      await primeCookieConsent(page);
      await page.goto('/');

      const home = page.getByRole('region', { name: 'Jokuh home' });
      const headline = home.getByRole('heading', { level: 1, name: 'Your mind. Your machine.' });
      const prompt = home.locator('[data-slot="prompt-frame"]');
      const firstChip = home.getByRole('button', { name: /^Suggested prompt:/ }).first();

      await expect(headline).toBeVisible();
      await expect(prompt).toBeVisible();
      await expect(firstChip).toBeVisible();
      await expectWithinViewportWidth(page, headline);
      await expectWithinViewportWidth(page, prompt);

      for (const corner of ['Profile — id', 'Spine — spine', 'Calls — call', 'Texts — text']) {
        const pill = home.getByRole('button', { name: corner });
        await expect(pill).toBeInViewport();
      }

      // The one-screen home has no top bar or hamburger; the footer row is the site nav at every width.
      await expect(page.getByRole('button', { name: 'Open menu' })).toHaveCount(0);
      const siteLinks = page.getByRole('navigation', { name: 'Site links' });
      for (const label of HOME_SITE_LINKS) {
        const link = siteLinks.getByRole('link', { name: label, exact: true });
        await link.scrollIntoViewIfNeeded();
        await expect(link).toBeVisible();
        await expectWithinViewportWidth(page, link);
      }
      await expect(siteLinks.getByRole('button', { name: 'Cookies' })).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }
});

test.describe('newsroom mobile card rail', () => {
  test('lays the supporting newsroom cards out as a horizontal rail', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await primeCookieConsent(page);
    await page.goto('/newsroom');

    // Under the featured card, phones get a snap rail of the next posts (`JournalFeedGrid`).
    const railCards = page.locator('main [class*="snap-x"] > div');
    await expect(railCards.first()).toBeVisible();
    expect(await railCards.count()).toBeGreaterThanOrEqual(2);

    await railCards.first().scrollIntoViewIfNeeded();
    const firstBox = await bounds(railCards.nth(0));
    const secondBox = await bounds(railCards.nth(1));

    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(8);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width - 12);
    await expectNoHorizontalOverflow(page);
  });
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
  // Stories reuse the newsroom layout: a featured story, then the next stories as a snap rail on
  // phones and a side column beside the featured card on desktop (both rendered, one hidden per width).
  const visibleStory = (page: Page, name: RegExp) => page.getByRole('link', { name }).filter({ visible: true });

  test('stacks the featured story above a horizontal rail on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await primeCookieConsent(page);
    await page.goto('/stories');

    const featured = page.locator('main article').first().getByRole('link');
    const first = visibleStory(page, /Made from Memory/);
    const second = visibleStory(page, /A psychotherapy practice in New York/);
    await expect(first).toBeVisible();

    const featuredBox = await bounds(featured);
    const firstBox = await bounds(first);
    const secondBox = await bounds(second);

    expect(firstBox.y).toBeGreaterThan(featuredBox.y + featuredBox.height - 4);
    expect(Math.abs(firstBox.y - secondBox.y)).toBeLessThan(8);
    expect(secondBox.x).toBeGreaterThan(firstBox.x + firstBox.width - 12);
    await expectNoHorizontalOverflow(page);
  });

  test('puts the next stories in a side column on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await primeCookieConsent(page);
    await page.goto('/stories');

    const featured = page.locator('main article').first().getByRole('link');
    const first = visibleStory(page, /Made from Memory/);
    const second = visibleStory(page, /A psychotherapy practice in New York/);
    await expect(first).toBeVisible();

    const featuredBox = await bounds(featured);
    const firstBox = await bounds(first);
    const secondBox = await bounds(second);

    expect(firstBox.x).toBeGreaterThan(featuredBox.x + featuredBox.width - 4);
    expect(Math.abs(firstBox.y - featuredBox.y)).toBeLessThan(24);
    expect(Math.abs(firstBox.x - secondBox.x)).toBeLessThan(8);
    expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 4);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe('newsroom sticky featured card', () => {
  test('pins the featured newsroom card, then releases it after the side column ends', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await primeCookieConsent(page);
    await page.goto('/newsroom');
    await expect(page.locator('main article').first()).toBeVisible();

    // Featured card sits in a `lg:sticky` wrapper beside a taller column of compact cards (`JournalFeedGrid`).
    const read = () =>
      page.evaluate(() => {
        const featuredEl = document.querySelector<HTMLElement>('main article a[href^="/newsroom/"]');
        let sticky: HTMLElement | null = featuredEl?.parentElement ?? null;
        while (sticky && window.getComputedStyle(sticky).position !== 'sticky') sticky = sticky.parentElement;
        const sideColumn = sticky?.parentElement?.nextElementSibling as HTMLElement | null | undefined;
        const sideLinks = Array.from(sideColumn?.querySelectorAll<HTMLElement>('a[href^="/newsroom/"]') ?? []).filter(
          (link) => link.getBoundingClientRect().width > 0,
        );
        const lastSide = sideLinks.at(-1) ?? null;

        if (!featuredEl || !sticky || !lastSide) return null;

        return {
          featuredTop: featuredEl.getBoundingClientRect().top,
          stickyTop: Number.parseFloat(window.getComputedStyle(sticky).top || '0'),
          stickyHeight: sticky.getBoundingClientRect().height,
          lastBottom: lastSide.getBoundingClientRect().bottom,
        };
      });

    await expect.poll(async () => (await read()) !== null).toBe(true);
    let state = (await read())!;

    // Scroll until the card reaches its sticky offset (`lg:top-16`).
    for (let i = 0; i < 12 && state.featuredTop > state.stickyTop + 4; i += 1) {
      await scrollPageBy(page, 120);
      state = (await read())!;
    }

    expect(state.featuredTop).toBeLessThanOrEqual(state.stickyTop + 4);
    const pinnedTop = state.featuredTop;

    await scrollPageBy(page, 200);
    const pinnedAgain = (await read())!;
    // Still pinned: the featured card did not move while the page scrolled 200px.
    expect(Math.abs(pinnedAgain.featuredTop - pinnedTop)).toBeLessThan(8);

    let releaseProbe = pinnedAgain;
    for (let i = 0; i < 12; i += 1) {
      if (releaseProbe.lastBottom < releaseProbe.stickyHeight + releaseProbe.stickyTop + 20) break;
      await scrollPageBy(page, 160);
      releaseProbe = (await read())!;
    }

    await scrollPageBy(page, 180);
    const released = (await read())!;
    expect(released.featuredTop).toBeLessThan(pinnedAgain.featuredTop - 40);
  });
});
