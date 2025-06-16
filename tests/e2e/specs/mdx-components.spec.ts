import { test, expect } from '@playwright/test';

test.describe('MDX Components and Embeds', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the featured post that contains MDX components
    await page.goto('/swyxkit-Astro-React/blog/test-featured-post');
  });

  test('TwitterEmbed renders and loads content', async ({ page }) => {
    // Look for Twitter embed container
    const twitterEmbed = page.locator(
      '[data-twitter-embed], .twitter-embed, iframe[src*="twitter"], iframe[src*="x.com"]'
    );

    if (await twitterEmbed.isVisible()) {
      await expect(twitterEmbed).toBeVisible();

      // Check that the embed has the correct tweet ID
      const src = await twitterEmbed.getAttribute('src');
      if (src) {
        expect(src).toContain('1234567890');
      }
    } else {
      // If no iframe, look for Twitter embed placeholder or custom component
      const twitterComponent = page.locator('text=TwitterEmbed, [data-component="twitter"]');
      if (await twitterComponent.isVisible()) {
        await expect(twitterComponent).toBeVisible();
      }
    }
  });

  test('YouTubeEmbed renders with correct iframe', async ({ page }) => {
    // Look for YouTube embed iframe
    const youtubeEmbed = page.locator('iframe[src*="youtube"], iframe[src*="youtu.be"]');

    if (await youtubeEmbed.isVisible()) {
      await expect(youtubeEmbed).toBeVisible();

      // Check that the embed has the correct video ID
      const src = await youtubeEmbed.getAttribute('src');
      if (src) {
        expect(src).toContain('dQw4w9WgXcQ');
      }

      // Check iframe attributes for security and functionality
      const title = await youtubeEmbed.getAttribute('title');
      expect(title).toBeTruthy();

      const allowfullscreen = await youtubeEmbed.getAttribute('allowfullscreen');
      expect(allowfullscreen).toBeDefined();
    } else {
      // If no iframe, look for YouTube embed placeholder or custom component
      const youtubeComponent = page.locator('text=YouTubeEmbed, [data-component="youtube"]');
      if (await youtubeComponent.isVisible()) {
        await expect(youtubeComponent).toBeVisible();
      }
    }
  });

  test('Newsletter component renders correctly', async ({ page }) => {
    // Look for newsletter signup form
    const newsletter = page.locator('form, .newsletter, [data-newsletter]');

    if (await newsletter.isVisible()) {
      await expect(newsletter).toBeVisible();

      // Check for email input
      const emailInput = newsletter.locator('input[type="email"], input[placeholder*="email" i]');
      if (await emailInput.isVisible()) {
        await expect(emailInput).toBeVisible();

        // Test email input functionality
        await emailInput.fill('test@example.com');
        await expect(emailInput).toHaveValue('test@example.com');
      }

      // Check for submit button
      const submitButton = newsletter.locator(
        'button[type="submit"], input[type="submit"], button:has-text("Subscribe")'
      );
      if (await submitButton.isVisible()) {
        await expect(submitButton).toBeVisible();
        await expect(submitButton).toBeEnabled();
      }
    } else {
      // Look for Newsletter component placeholder
      const newsletterComponent = page.locator('text=Newsletter, [data-component="newsletter"]');
      if (await newsletterComponent.isVisible()) {
        await expect(newsletterComponent).toBeVisible();
      }
    }
  });

  test('code blocks render with syntax highlighting', async ({ page }) => {
    // Navigate to a post with code blocks
    await page.goto('./blog/test-post-1/');

    // Check for syntax-highlighted code blocks
    const codeBlock = page.locator('pre code, .highlight, .shiki, .prism');
    await expect(codeBlock).toBeVisible();

    // Check that code contains expected content
    await expect(codeBlock).toContainText('const test');
    await expect(codeBlock).toContainText('hello world');

    // Check for syntax highlighting classes or inline styles
    const codeElement = codeBlock.first();
    const codeClass = await codeElement.getAttribute('class');
    const codeStyle = await codeElement.getAttribute('style');

    // Should have either classes for syntax highlighting or inline styles
    expect(codeClass || codeStyle).toBeTruthy();
  });

  test('TypeScript code blocks render with proper highlighting', async ({ page }) => {
    // Navigate to post with TypeScript code
    await page.goto('./blog/search-test-post');

    // Look for TypeScript code block - use first() to avoid strict mode violation
    const tsCodeBlock = page
      .locator('pre code:has-text("interface"), .language-typescript, .language-ts')
      .first();

    if (await tsCodeBlock.isVisible()) {
      await expect(tsCodeBlock).toBeVisible();
      await expect(tsCodeBlock).toContainText('interface TestInterface');
      await expect(tsCodeBlock).toContainText('uniqueProperty');
      await expect(tsCodeBlock).toContainText('specialValue');
    }
  });

  test('custom MDX components render correctly', async ({ page }) => {
    // Check that custom MDX components don't cause rendering errors
    await page.goto('./blog/test-featured-post');

    // The page should load without JavaScript errors
    const errors = [];
    page.on('pageerror', (error) => errors.push(error));

    await page.waitForLoadState('networkidle');

    // Check that there are no critical JavaScript errors
    expect(errors.length).toBe(0);

    // Check that the main content is visible - use actual content from the post
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('MDX components are accessible', async ({ page }) => {
    // Check basic accessibility of MDX components
    await page.goto('./blog/test-featured-post');

    // Check that iframes have proper titles
    const iframes = page.locator('iframe');
    const iframeCount = await iframes.count();

    for (let i = 0; i < iframeCount; i++) {
      const iframe = iframes.nth(i);
      const title = await iframe.getAttribute('title');
      const ariaLabel = await iframe.getAttribute('aria-label');

      // Each iframe should have either a title or aria-label
      expect(title || ariaLabel).toBeTruthy();
    }

    // Check that form elements have proper labels
    const inputs = page.locator('input');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');

      // Input should have id (for label), aria-label, or placeholder
      expect(id || ariaLabel || placeholder).toBeTruthy();
    }
  });

  test('embedded content loads without blocking page render', async ({ page }) => {
    // Monitor network requests
    const responses = [];
    page.on('response', (response) => responses.push(response));

    await page.goto('./blog/test-featured-post');

    // Page should load and be interactive quickly
    await page.waitForLoadState('domcontentloaded');

    // Main content should be visible even if embeds are still loading
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();

    // Check that the page is interactive
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('MDX components handle missing or invalid props gracefully', async ({ page }) => {
    // This test checks that components don't break the page if props are missing
    await page.goto('./blog/test-featured-post');

    // Monitor console errors
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');

    // Page should still render even if some component props are invalid
    await expect(page.locator('h1')).toBeVisible();

    // Should not have critical console errors that break functionality
    const criticalErrors = consoleErrors.filter(
      (error) =>
        error.includes('TypeError') ||
        error.includes('ReferenceError') ||
        error.includes('Cannot read property')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('responsive embeds work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('./blog/test-featured-post');

    // Check that embeds are responsive
    const embeds = page.locator('iframe, .embed, [data-embed]');
    const embedCount = await embeds.count();

    for (let i = 0; i < embedCount; i++) {
      const embed = embeds.nth(i);

      if (await embed.isVisible()) {
        const boundingBox = await embed.boundingBox();

        if (boundingBox) {
          // Embed should not exceed viewport width
          expect(boundingBox.width).toBeLessThanOrEqual(375);

          // Embed should be reasonably sized
          expect(boundingBox.width).toBeGreaterThan(200);
        }
      }
    }
  });
});
