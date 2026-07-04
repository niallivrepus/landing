import { expect, test } from "@playwright/test";
import { dismissCookieBanner, primeCookieConsent } from "./helpers";

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await dismissCookieBanner(page);
});

test("calls page opens at the top after navigation from a scrolled home", async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 2400));
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

  await page.goto("/calls");
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/calls$/);
  await expect(page.getByRole("heading", { level: 1, name: "Calls" })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(48);
});

test("calls product nav omits closer look and showcase anchor scrolls correctly", async ({ page }) => {
  await page.goto("/calls");
  await page.waitForLoadState("networkidle");
  await dismissCookieBanner(page);

  const productNav = page.locator("[data-product-detail-nav]");
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect(productNav).toBeVisible();

  await expect(productNav.getByRole("link", { name: "Closer look" })).toHaveCount(0);

  await productNav.getByRole("link", { name: "Showcase" }).click();
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);

  const showcase = page.locator("#showcase");
  await expect(showcase).toBeInViewport({ ratio: 0.15 });
});

test("prompt hash lands on the home prompt block", async ({ page }) => {
  await page.goto("/prompt");
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/#prompt$/);
  await expect(page.locator("#prompt")).toBeInViewport({ ratio: 0.2 });
});
