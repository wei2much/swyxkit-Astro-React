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
  base: '/swyxkit-Astro-React',
  integrations: [
    react({
      experimentalReactChildren: true, // For React 19
    }),
    mdx({
      syntaxHighlight: false,
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
    syntaxHighlight: false,
    remarkPlugins: [remarkShortcodes]
  }
});
