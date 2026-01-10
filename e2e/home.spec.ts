import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Antony O'Neill/i);
  });

  test('displays hero section', async ({ page }) => {
    const hero = page.locator('main').first();
    await expect(hero).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    // Check projects link
    await page.getByRole('link', { name: /projects/i }).first().click();
    await expect(page).toHaveURL(/\/projects/);

    // Navigate back home
    await page.goto('/');

    // Check lab link
    await page.getByRole('link', { name: /lab/i }).first().click();
    await expect(page).toHaveURL(/\/lab/);
  });

  test('contact link is present', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: /contact/i }).first();
    await expect(contactLink).toBeVisible();
  });
});
