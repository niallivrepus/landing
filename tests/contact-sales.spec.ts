import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const now = new Date().toISOString();
    localStorage.setItem('jokuh.cookieConsent', 'custom');
    localStorage.setItem(
      'jokuh.cookiePreferences',
      JSON.stringify({
        version: 1,
        prefs: { analytics: false, marketing: false },
        createdAt: now,
        updatedAt: now,
      }),
    );
  });
});

async function fillContactSalesForm(page: Page) {
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
}

test('submits the contact sales form with a mocked backend', async ({ page }) => {
  let payload: Record<string, unknown> | null = null;

  await page.route('**/api/contact-sales', async (route) => {
    payload = JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>;

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        message: 'Thanks. Your inquiry was sent to Jokuh and our team will follow up by email.',
      }),
    });
  });

  await page.goto('/contact');
  await fillContactSalesForm(page);

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect.poll(() => payload, { timeout: 10_000 }).not.toBeNull();

  await expect(
    page.getByText(/Thanks\.\s+Your inquiry was sent to Jokuh and our team will follow up by email\./),
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

test('keeps form data and shows a clean error when contact delivery fails', async ({ page }) => {
  await page.route('**/api/contact-sales', async (route) => {
    await route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Email delivery is not configured yet. Add RESEND_API_KEY before accepting contact inquiries.',
      }),
    });
  });

  await page.goto('/contact');
  await fillContactSalesForm(page);

  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByRole('alert')).toContainText('Email delivery is not configured yet.');
  await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
  await expect(page.getByLabel('Work email *')).toHaveValue('designer@jokuh.com');
  await expect(page.getByLabel('Company name *')).toHaveValue('Jokuh Studio');
});
