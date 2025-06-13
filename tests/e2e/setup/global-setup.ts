import type { FullConfig } from '@playwright/test';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function globalSetup(_config: FullConfig) {
  const projectRoot = process.cwd();
  const sourceDir = join(projectRoot, 'tests', 'fixtures', 'content', 'blog');
  const targetDir = join(projectRoot, 'src', 'content', 'blog');

  // Ensure target directory exists
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // Copy test content to the actual content directory
  try {
    cpSync(sourceDir, targetDir, { recursive: true });
    console.log('✅ Test content copied to src/content/blog');
  } catch (error) {
    console.error('❌ Failed to copy test content:', error);
    throw error;
  }
}

export default globalSetup;