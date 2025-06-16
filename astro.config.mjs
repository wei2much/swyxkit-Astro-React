// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwind from '@tailwindcss/vite';
import { remarkShortcodes } from './src/lib/remarkShortcodes.ts';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  site: 'https://wei2much.github.io',
  // All internal links are using relative paths e.g. ./blog/ so if you do set base
  // all the links will still work as BASE_URL is being set in Layout.astro
  base: 'swyxkit-Astro-React',
  trailingSlash: 'always',
  integrations: [
    react({
      experimentalReactChildren: true // For React 19
    }),
    mdx({
      syntaxHighlight: 'prism',
      remarkPlugins: [remarkShortcodes],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap' // Same as original SwyxKit
          }
        ]
      ],
      extendMarkdownConfig: false
    })
  ],
  vite: {
    plugins: [tailwind()]
  },
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkShortcodes]
  }
});
