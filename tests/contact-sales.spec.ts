import { expect, test } from '@playwright/test';

test('submits the contact sales form with a mocked backend', async ({ page }) => {
  let payload: Record<string, unknown> | null = null;

  await page.route('**/api/contact-sales', async (route) => {
    payload = JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });

  await page.goto('/contact');

  await page.getByLabel('What are you interested in? *').selectOption('Jokuh enterprise platform');
  await page.getByLabel('Work email *').fill('designer@jokuh.com');
  await page.getByLabel('Company size *').selectOption('21-100 employees');
  await page.getByLabel('Company name *').fill('Jokuh Studio');
  await page.getByLabel('First name *').fill('Hyke');
  await page.getByLabel('Last name *').fill('Designer');
  await page.getByLabel('Phone number *').fill('+31 6 12 34 56 78');
  await page
    .getByLabel('Can you share more about your business needs and challenges?')
    .fill('We want help evaluating rollout, governance, and integrations for multiple teams.');

  await page.getByRole('button', { name: 'Submit inquiry' }).click();
  await expect.poll(() => payload, { timeout: 10_000 }).not.toBeNull();

  await expect(
    page.getByText(/Thanks\.\s+Our sales team will review your details and follow up using your work email\./),
  ).toBeVisible({ timeout: 10_000 });

  expect(payload).toMatchObject({
    interest: 'Jokuh enterprise platform',
    workEmail: 'designer@jokuh.com',
    companySize: '21-100 employees',
    companyName: 'Jokuh Studio',
    firstName: 'Hyke',
    lastName: 'Designer',
    phoneNumber: '+31 6 12 34 56 78',
    marketingOptIn: true,
  });
});
