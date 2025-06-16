import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test.skip('home page should pass accessibility audit', async ({ page }) => {
    // Skip due to this open issue https://github.com/dequelabs/axe-core/issues/4335
    await page.goto('./');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('body', { state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.skip('about page should pass accessibility audit', async ({ page }) => {
    // Skip due to this open issue https://github.com/dequelabs/axe-core/issues/4335
    await page.goto('./about');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.skip('blog index should pass accessibility audit', async ({ page }) => {
    // Skip due to this open issue https://github.com/dequelabs/axe-core/issues/4335
    await page.goto('./blog');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.skip('individual blog post should pass accessibility audit', async ({ page }) => {
    // Skip due to this open issue https://github.com/dequelabs/axe-core/issues/4335
    await page.goto('./blog/test-post-1');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test.skip('blog post with MDX components should pass accessibility audit', async ({ page }) => {
    // Skip due to this open issue https://github.com/dequelabs/axe-core/issues/4335
    await page.goto('./blog/test-featured-post');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('search functionality should be accessible', async ({ page }) => {
    await page.goto('./blog/');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('[placeholder*="search" i], #search-input');

    // Check search input has proper labels
    const ariaLabel = await searchInput.getAttribute('aria-label');
    const id = await searchInput.getAttribute('id');
    const associatedLabel = id ? page.locator(`label[for="${id}"]`) : null;

    // Should have either aria-label or associated label
    expect(ariaLabel || (associatedLabel && (await associatedLabel.isVisible()))).toBeTruthy();

    // Check search input is keyboard accessible
    await searchInput.focus();
    await expect(searchInput).toBeFocused();

    // Test keyboard navigation
    await page.keyboard.press('Tab');

    // Next focusable element should receive focus
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('./');

    // Tab through navigation
    await page.keyboard.press('Tab');
    let focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Should be able to navigate through all main nav links
    const navLinks = page.locator('nav a, header a');
    const linkCount = await navLinks.count();

    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      focusedElement = page.locator(':focus');

      if (await focusedElement.isVisible()) {
        // Check that focused element is actually a link
        const tagName = await focusedElement.evaluate((el) => el.tagName.toLowerCase());
        if (tagName === 'a') {
          // Test Enter key activation
          const href = await focusedElement.getAttribute('href');
          if (href && href !== '#') {
            // This is a valid navigation link
            expect(href).toBeTruthy();
          }
        }
      }

      await page.keyboard.press('Tab');
    }
  });

  test('category filters should be accessible', async ({ page }) => {
    await page.goto('./blog/');

    // Look for category filter inputs
    const categoryInputs = page.locator('input[type="checkbox"]');
    const inputCount = await categoryInputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = categoryInputs.nth(i);
      const id = await input.getAttribute('id');

      if (id) {
        // Should have associated label
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();

        // Label should have meaningful text
        const labelText = await label.textContent();
        expect(labelText?.trim()).toBeTruthy();

        // Should be keyboard accessible
        await input.focus();
        await expect(input).toBeFocused();

        // Should be toggleable with spacebar
        const initialChecked = await input.isChecked();
        await page.keyboard.press('Space');
        await page.waitForTimeout(100);
        const afterSpaceChecked = await input.isChecked();
        expect(afterSpaceChecked).toBe(!initialChecked);
      }
    }
  });

  test('headings should have proper hierarchy', async ({ page }) => {
    await page.goto('./blog/test-post-2/');

    // Get all headings in order
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();

    if (headingCount > 0) {
      const headingLevels = [];

      for (let i = 0; i < headingCount; i++) {
        const heading = headings.nth(i);
        const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
        const level = parseInt(tagName.charAt(1));
        headingLevels.push(level);
      }

      // Should start with h1
      expect(headingLevels[0]).toBe(1);

      // Check that heading levels don't skip (e.g., h1 -> h3)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];

        // Current level should not be more than 1 level deeper than previous
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('./');

    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);

      // Skip decorative images or icons (usually small or have specific classes)
      const src = await img.getAttribute('src');
      const className = await img.getAttribute('class');

      // Skip favicon, icons, or decorative images
      if (
        src?.includes('favicon') ||
        src?.includes('icon') ||
        className?.includes('icon') ||
        className?.includes('logo')
      ) {
        continue;
      }

      const alt = await img.getAttribute('alt');

      // Content images should have alt text
      expect(alt).toBeDefined();

      // Alt text should not be just filename
      if (alt) {
        expect(alt).not.toMatch(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
      }
    }
  });

  test('dark mode should maintain accessibility', async ({ page }) => {
    await page.goto('./');

    // Look for dark mode toggle
    const darkModeToggle = page.locator(
      'button:has-text("dark"), button:has-text("theme"), [aria-label*="theme" i]'
    );

    if (await darkModeToggle.isVisible()) {
      // Toggle dark mode
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      // Run accessibility audit in dark mode
      await page.waitForLoadState('networkidle');
      const accessibilityScanResults = await new AxeBuilder(page)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);

      // Check that text is still readable (basic contrast check)
      const bodyElement = page.locator('body');
      const computedStyle = await bodyElement.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          backgroundColor: style.backgroundColor,
          color: style.color
        };
      });

      // In dark mode, background should be dark and text should be light
      expect(computedStyle.backgroundColor).toBeTruthy();
      expect(computedStyle.color).toBeTruthy();
    }
  });

  test('mobile navigation should be accessible', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('./');

    // Look for mobile menu toggle
    const mobileMenuToggle = page.locator(
      '[aria-label*="menu" i], button:has-text("Menu"), .mobile-menu-button'
    );

    if (await mobileMenuToggle.isVisible()) {
      // Should have proper ARIA attributes
      const ariaLabel = await mobileMenuToggle.getAttribute('aria-label');
      const ariaExpanded = await mobileMenuToggle.getAttribute('aria-expanded');

      expect(ariaLabel || ariaExpanded !== null).toBeTruthy();

      // Should be keyboard accessible
      await mobileMenuToggle.focus();
      await expect(mobileMenuToggle).toBeFocused();

      // Should open with Enter/Space
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      // Menu should be visible and accessible
      const mobileMenu = page.locator('.mobile-menu, [data-mobile-menu], nav ul').first();
      if (await mobileMenu.isVisible()) {
        // Menu items should be keyboard navigable
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
      }
    }
  });

  test('form elements should be properly labeled and accessible', async ({ page }) => {
    // Check newsletter form if it exists
    await page.goto('./blog/test-featured-post/');

    const forms = page.locator('form');
    const formCount = await forms.count();

    for (let i = 0; i < formCount; i++) {
      const form = forms.nth(i);
      const inputs = form.locator('input, textarea, select');
      const inputCount = await inputs.count();

      for (let j = 0; j < inputCount; j++) {
        const input = inputs.nth(j);
        const inputType = await input.getAttribute('type');

        // Skip hidden inputs
        if (inputType === 'hidden') continue;

        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const placeholder = await input.getAttribute('placeholder');

        // Input should have proper labeling
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.isVisible();

          if (!hasLabel) {
            // If no label, should have aria-label or meaningful placeholder
            expect(ariaLabel || placeholder).toBeTruthy();
          }
        } else {
          // If no id, must have aria-label
          expect(ariaLabel).toBeTruthy();
        }

        // Should be keyboard accessible
        await input.focus();
        await expect(input).toBeFocused();
      }
    }
  });
});
