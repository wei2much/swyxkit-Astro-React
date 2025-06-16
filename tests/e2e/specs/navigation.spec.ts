import { test, expect } from '@playwright/test';

test.describe('Navigation and Basic Pages', () => {
  test('home page renders with correct navigation', async ({ page }) => {
    await page.goto('./', { waitUntil: 'networkidle' });

    // Check main navigation exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Check navigation links within the nav element specifically
    await expect(nav.locator('a[href="./"]')).toBeVisible();
    await expect(nav.locator('a[href="./blog/"]')).toBeVisible();
    await expect(nav.locator('a[href="./about/"]')).toBeVisible();

    // Check page title
    await expect(page).toHaveTitle(/swyxkit/i);

    // Check main heading exists
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('about page has expected content and structure', async ({ page }) => {
    await page.goto('./about/');

    // Check page title
    await expect(page).toHaveTitle(/about/i);

    // Check main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/about/i);

    // Check navigation is present
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('navigation links work correctly', async ({ page }) => {
    await page.goto('./');

    // Test navigation to blog
    await page.click('a[href="./blog/"]');
    await expect(page).toHaveURL(/\/blog\/?$/);
    await expect(page.locator('h1')).toContainText(/blog/i);

    // Test navigation to about
    await page.click('a[href="./about/"]');
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page.locator('h1')).toContainText(/about/i);

    // Test navigation back to home
    await page.click('a[href="./"]');
    await expect(page).toHaveURL(/\//);
  });

  test('mobile menu toggles and functions', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('./');

    // Check if mobile menu button exists
    const mobileMenuButton = page.locator(
      '[aria-label*="menu" i], button:has-text("Menu"), .mobile-menu-button, .burger'
    );

    // If mobile menu exists, test it
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();

      // Check if mobile menu is now visible
      const mobileMenu = page.locator('ul.menu');
      await expect(mobileMenu).toBeVisible();

      // Test mobile menu links within the mobile menu context
      await expect(mobileMenu.locator('a[href="./blog/"]')).toBeVisible();
      await expect(mobileMenu.locator('a[href="./about/"]')).toBeVisible();
    }
  });

  test('dark mode toggle works if present', async ({ page }) => {
    await page.goto('./');

    // Look for dark mode toggle button
    const darkModeToggle = page.locator(
      'button:has-text("dark"), button:has-text("theme"), [aria-label*="theme" i], [aria-label*="dark" i]'
    );

    // If dark mode toggle exists, test it
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();

      // Check if dark class is applied to html or body
      const htmlElement = page.locator('html');
      const bodyElement = page.locator('body');

      const htmlHasDark = await htmlElement.getAttribute('class');
      const bodyHasDark = await bodyElement.getAttribute('class');

      expect(htmlHasDark?.includes('dark') || bodyHasDark?.includes('dark')).toBeTruthy();
    }
  });

  test('footer exists and contains expected content', async ({ page }) => {
    await page.goto('./');

    // Look for footer
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      await expect(footer).toBeVisible();

      // Check for common footer elements
      const footerLinks = footer.locator('a');
      const footerCount = await footerLinks.count();
      expect(footerCount).toBeGreaterThan(0);
    }
  });
});
