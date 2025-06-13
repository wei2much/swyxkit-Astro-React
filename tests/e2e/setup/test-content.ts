import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export interface TestPost {
  filename: string;
  content: string;
}

export const testPosts: TestPost[] = [
  {
    filename: 'test-post-1.mdx',
    content: `---
title: 'Test Post One'
description: 'This is a test post for E2E testing with search functionality'
date: 2024-01-01
category: 'Blog'
tags: ['testing', 'e2e', 'playwright']
---

# Test Post One

This is test content with **bold** and *italic* text for search testing.

## Code Example
\`\`\`javascript
const test = "hello world";
console.log(test);
\`\`\`

Some additional content to test search functionality and reading time calculation.
`
  },
  {
    filename: 'test-post-2.mdx',
    content: `---
title: 'Second Test Article'
description: 'A second test post for category filtering tests'
date: 2024-01-02
category: 'Tutorial'
tags: ['tutorial', 'guide', 'testing']
---

# Second Test Article

This article is in the Tutorial category to test category filtering.

## Table of Contents Testing

This post has multiple headings to test table of contents generation.

### Subheading One
Content under first subheading.

### Subheading Two  
Content under second subheading.

#### Deep Subheading
Content under deep subheading for TOC testing.
`
  },
  {
    filename: 'test-featured-post.mdx',
    content: `---
title: 'Featured Test Post'
description: 'A featured post for testing most popular section'
date: 2024-01-03
category: 'Tutorial'
tags: ['featured', 'testing', 'popular']
featured: true
---

# Featured Content

This is a featured post that should appear in the "Most Popular" section.

## MDX Component Testing

<TwitterEmbed id="1234567890" />

<YouTubeEmbed id="dQw4w9WgXcQ" />

## Newsletter Component

<Newsletter />

More content to ensure proper rendering and component functionality.
`
  },
  {
    filename: 'search-test-post.mdx',
    content: `---
title: 'Unique Search Terms Post'
description: 'A post with unique searchable content for testing fuzzy search'
date: 2024-01-04
category: 'Blog'
tags: ['search', 'unique', 'fuzzy']
---

# Unique Search Terms Post

This post contains unique searchable terms like "xylophone" and "quaternary" for testing search functionality.

## Special Characters and Content

Testing search with special characters: @mention #hashtag and email@example.com

\`\`\`typescript
// Code block for syntax highlighting tests
interface TestInterface {
  uniqueProperty: string;
  specialValue: number;
}
\`\`\`

The word "xylophone" should be easily searchable and highlighted in results.
`
  }
];

export function setupTestContent(contentDir: string) {
  if (!existsSync(contentDir)) {
    mkdirSync(contentDir, { recursive: true });
  }

  testPosts.forEach((post) => {
    const filePath = join(contentDir, post.filename);
    writeFileSync(filePath, post.content, 'utf-8');
  });
}

export function cleanupTestContent(contentDir: string) {
  testPosts.forEach((post) => {
    join(contentDir, post.filename);
    try {
      // We don't actually delete files in cleanup to avoid issues
      // The test content will be ignored by git
    } catch {
      // Ignore cleanup errors
    }
  });
}
