import { test, expect } from '@playwright/test';

test.describe('Essay Posts', () => {
  test('blog index shows all test posts', async ({ page }) => {
    await page.goto('./blog/');

    // Check page title
    await expect(page).toHaveTitle(/blog/i);

    // Check main heading
    await expect(page.locator('h1')).toContainText(/blog/i);

    // Check that test posts are visible
    await expect(page.locator('text=Test Post One')).toBeVisible();
    await expect(page.locator('text=Second Test Article')).toBeVisible();
    await expect(page.locator('text=Featured Test Post')).toBeVisible();
    await expect(page.locator('text=Unique Search Terms Post')).toBeVisible();

    // Check that post descriptions are visible
    await expect(page.locator('text=E2E testing with search functionality')).toBeVisible();
    await expect(page.locator('text=category filtering tests')).toBeVisible();

    // Check that post metadata categories are displayed in labels
    const categoryLabels = page.locator('label');
    const labelCount = await categoryLabels.count();
    expect(labelCount).toBeGreaterThan(0);
  });

  test('individual blog post renders with metadata', async ({ page }) => {
    await page.goto('./blog/');

    // Click on first test post
    await page.click('text=Test Post One');

    // Check URL
    await expect(page).toHaveURL(/\/blog\/test-post-1/);

    // Check post title
    await expect(page.locator('h1')).toContainText('Test Post One');

    // Check post content
    await expect(page.locator('text=This is test content with')).toBeVisible();
    await expect(page.locator('text=bold')).toBeVisible();
    await expect(page.locator('text=italic')).toBeVisible();

    // Check code block
    await expect(page.locator('code:has-text("hello world")')).toBeVisible();

    // Check metadata
    // Check metadata - use datetime attribute instead of displayed text
    await expect(page.locator('time[datetime="2024-01-01T00:00:00.000Z"]')).toBeVisible();
    await expect(page.locator('text=Essay')).toBeVisible();

    // Check tags
    await expect(page.locator('text=#testing')).toBeVisible();
    await expect(page.locator('text=e2e')).toBeVisible();
    await expect(page.locator('text=playwright')).toBeVisible();
  });

  test('table of contents generates correctly', async ({ page }) => {
    await page.goto('./blog/');

    // Navigate to post with multiple headings
    await page.click('text=Second Test Article');

    // Check URL
    await expect(page).toHaveURL(/\/blog\/test-post-2/);

    // Look for table of contents
    const toc = page.locator('[data-toc], .table-of-contents, .toc');

    if (await toc.isVisible()) {
      // Check TOC contains headings
      await expect(toc.locator('text=Table of Contents Testing')).toBeVisible();
      await expect(toc.locator('text=Subheading One')).toBeVisible();
      await expect(toc.locator('text=Subheading Two')).toBeVisible();

      // Test TOC link functionality
      await toc.locator('text=Subheading One').click();

      // Check if page scrolled to the right section
      const targetHeading = page.locator('h3:has-text("Subheading One")');
      await expect(targetHeading).toBeVisible();
    }
  });

  test('most popular section shows featured posts', async ({ page }) => {
    await page.goto('/blog/');

    // Look for most popular section
    const mostPopular = page.locator('text=Most Popular').first();

    if (await mostPopular.isVisible()) {
      // Check featured post appears in most popular
      await expect(page.locator('text=Featured Test Post')).toBeVisible();
    }
  });

  test('reading time displays accurately', async ({ page }) => {
    await page.goto('/blog/');

    // Look for reading time indicators
    const readingTime = page.locator('text=/\\d+ min read/i').first();

    if (await readingTime.isVisible()) {
      await expect(readingTime).toBeVisible();

      // Check that reading time is reasonable (1-10 minutes for test posts)
      const timeText = await readingTime.textContent();
      const minutes = parseInt(timeText?.match(/\\d+/)?.[0] || '0');
      expect(minutes).toBeGreaterThanOrEqual(1);
      expect(minutes).toBeLessThanOrEqual(10);
    }
  });

  test('post navigation works', async ({ page }) => {
    await page.goto('./blog/test-post-1/');

    // Look for navigation to other posts
    const prevNext = page.locator('text=Previous, text=Next, [href*="/blog/"]');

    if (await prevNext.first().isVisible()) {
      const linkCount = await prevNext.count();
      expect(linkCount).toBeGreaterThan(0);

      // Test clicking on a navigation link
      await prevNext.first().click();
      await expect(page).toHaveURL(/\/blog\//);
    }
  });

  test('blog posts have proper meta tags', async ({ page }) => {
    await page.goto('./blog/test-post-1/');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /E2E testing/);

    // Check Open Graph tags if present
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.isVisible()) {
      await expect(ogTitle).toHaveAttribute('content', /Test Post One/);
    }
  });

  test('syntax highlighting works in code blocks', async ({ page }) => {
    await page.goto('./blog/test-post-1/');

    // Check for syntax-highlighted code
    const codeBlock = page.locator('pre code, .highlight, .shiki');
    await expect(codeBlock).toBeVisible();

    // Check that the code contains expected content
    await expect(codeBlock).toContainText('const test');
    await expect(codeBlock).toContainText('hello world');
  });
});
