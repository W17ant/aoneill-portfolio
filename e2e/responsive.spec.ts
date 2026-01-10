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

        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        const viewportWidth = viewport.width;

        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
      });

      test('navigation is accessible', async ({ page }) => {
        await page.goto('/');

        if (viewport.width < 768) {
          // Mobile: look for hamburger menu or mobile nav
          const mobileNav = page.locator('[data-testid="mobile-nav"], button[aria-label*="menu"], .mobile-menu-button, nav button');
          const navExists = await mobileNav.count() > 0;

          if (navExists) {
            await expect(mobileNav.first()).toBeVisible();
          } else {
            // If no mobile nav button, nav links should still be visible
            const navLinks = page.getByRole('link', { name: /projects|lab|contact/i });
            await expect(navLinks.first()).toBeVisible();
          }
        } else {
          // Desktop: full nav should be visible
          const navLinks = page.getByRole('link', { name: /projects/i });
          await expect(navLinks.first()).toBeVisible();
        }
      });

      test('projects page renders correctly', async ({ page }) => {
        await page.goto('/projects');

        // Page should load without errors
        await expect(page.locator('h1')).toBeVisible();

        // No horizontal overflow
        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 1);
      });

      test('lab page renders correctly', async ({ page }) => {
        await page.goto('/lab');

        await expect(page.locator('h1')).toBeVisible();

        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 1);
      });

      test('contact page renders correctly', async ({ page }) => {
        await page.goto('/contact');

        await expect(page.locator('h1')).toBeVisible();

        const body = page.locator('body');
        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 1);
      });
    });
  }
});

test.describe('Visual Regression', () => {
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
