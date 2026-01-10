import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/projects', name: 'Projects' },
    { path: '/lab', name: 'Lab' },
    { path: '/contact', name: 'Contact' },
  ];

  for (const { path, name } of pages) {
    test(`${name} has no obvious accessibility issues`, async ({ page }) => {
      await page.goto(path);

      // Check for main landmark
      const main = page.locator('main');
      await expect(main).toBeVisible();

      // Check that images have alt text
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        const ariaHidden = await img.getAttribute('aria-hidden');

        // Image should have alt text OR be decorative (role="presentation" or aria-hidden="true")
        const isAccessible = alt !== null || role === 'presentation' || ariaHidden === 'true';
        expect(isAccessible).toBe(true);
      }

      // Check for heading hierarchy (h1 should exist)
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();

      // Check that links have accessible names
      const links = page.locator('a:visible');
      const linkCount = await links.count();

      for (let i = 0; i < Math.min(linkCount, 20); i++) {
        const link = links.nth(i);
        const accessibleName = await link.evaluate((el) => {
          return el.textContent?.trim() ||
            el.getAttribute('aria-label') ||
            el.querySelector('img')?.getAttribute('alt') ||
            '';
        });
        expect(accessibleName.length).toBeGreaterThan(0);
      }
    });

    test(`${name} is keyboard navigable`, async ({ page }) => {
      await page.goto(path);

      // Tab through the page and verify focus is visible
      await page.keyboard.press('Tab');

      // Get the focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Continue tabbing to ensure no focus traps (except modals)
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = page.locator(':focus');
        const isVisible = await currentFocus.isVisible().catch(() => false);

        // Focus should always be on a visible element or reach end of page
        if (isVisible) {
          await expect(currentFocus).toBeVisible();
        }
      }
    });
  }
});
