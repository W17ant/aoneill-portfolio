import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('can navigate to all main pages', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Navigate to Projects
    await page.getByRole('link', { name: /projects/i }).first().click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator('h1')).toBeVisible();

    // Navigate to Lab
    await page.getByRole('link', { name: /lab/i }).first().click();
    await expect(page).toHaveURL(/\/lab/);
    await expect(page.locator('h1')).toBeVisible();

    // Navigate to Contact
    await page.getByRole('link', { name: /contact/i }).first().click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('logo/home link returns to homepage', async ({ page }) => {
    await page.goto('/projects');

    // Click on the home link (usually logo or name)
    const homeLink = page.getByRole('link', { name: /antony|home|ao/i }).first();
    await homeLink.click();

    await expect(page).toHaveURL('/');
  });

  test('404 page displays for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
