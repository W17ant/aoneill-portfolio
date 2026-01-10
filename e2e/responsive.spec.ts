import { test, expect } from '@playwright/test';

const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 },
};

test.describe('Responsive Design', () => {
  for (const [name, viewport] of Object.entries(viewports)) {
    test.describe(`${name} viewport (${viewport.width}x${viewport.height})`, () => {
      test.use({ viewport });

      test('homepage renders without horizontal overflow', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        const viewportWidth = viewport.width;

        // Allow small tolerance for scrollbars and minor rendering differences
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
      });

      test('navigation is accessible', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check that navigation element exists (could be visible links or a menu button)
        const nav = page.locator('nav, header');
        await expect(nav.first()).toBeVisible();

        if (viewport.width >= 768) {
          // Desktop: navigation links should be visible
          const navLinks = page.getByRole('link', { name: /projects/i });
          await expect(navLinks.first()).toBeVisible();
        }
        // On mobile, we just verify nav exists - the site may use various mobile nav patterns
      });

      test('projects page renders correctly', async ({ page }) => {
        await page.goto('/projects');
        await page.waitForLoadState('networkidle');

        // Page should load without errors
        await expect(page.locator('h1')).toBeVisible();

        // No horizontal overflow (with tolerance)
        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20);
      });

      test('lab page renders correctly', async ({ page }) => {
        await page.goto('/lab');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('h1')).toBeVisible();

        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20);
      });

      test('contact page renders correctly', async ({ page }) => {
        await page.goto('/contact');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('h1')).toBeVisible();

        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20);
      });
    });
  }
});

// Visual Regression tests are skipped in CI - they require platform-specific baselines
// Run locally with: npx playwright test --update-snapshots
test.describe.skip('Visual Regression', () => {
  const pages = ['/', '/projects', '/lab', '/contact'];

  for (const path of pages) {
    test(`${path} page visual snapshot`, async ({ page }) => {
      await page.goto(path);

      // Wait for any animations to complete
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`${path.replace(/\//g, '-') || 'home'}.png`, {
        fullPage: true,
        maxDiffPixels: 100,
      });
    });
  }
});
