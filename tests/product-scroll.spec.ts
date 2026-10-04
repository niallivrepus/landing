import { expect, test } from "@playwright/test";
import { dismissCookieBanner, primeCookieConsent } from "./helpers";

test.beforeEach(async ({ page }) => {
  await primeCookieConsent(page);
});

test("calls page opens at the top after client-side navigation from a scrolled page", async ({ page }) => {
  // The homepage is one screen; the newsroom is long and its mega footer links to Calls.
  await page.goto("/newsroom");
  await page.waitForLoadState("networkidle");
  await dismissCookieBanner(page);

  const callsLink = page.getByRole("contentinfo").locator('a[href="/calls"]').first();
  await callsLink.scrollIntoViewIfNeeded();
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

  await callsLink.click();

  await expect(page).toHaveURL(/\/calls$/);
  await expect(page.getByRole("region", { name: "Calls preview" })).toBeVisible();
  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeLessThan(48);
});

test("calls page deep link scrolls to the showcase anchor", async ({ page }) => {
  await page.goto("/calls#showcase");
  await page.waitForLoadState("networkidle");
  await dismissCookieBanner(page);

  await expect.poll(async () => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await expect(page.locator("#showcase")).toBeInViewport({ ratio: 0.15 });
});

test("legacy /prompt redirects to the live demo", async ({ page }) => {
  await page.goto("/prompt");
  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/\/demo$/);
});
