import { defineCollection, z } from 'astro:content';
import { POST_CATEGORIES } from '../lib/siteConfig';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{mdx,md}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      slug: z.string().optional(),
      date: z.coerce.date(),
      category: z.enum(POST_CATEGORIES),
      tags: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      canonical: z.string().url().optional()
    })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
});

export const collections = {
  blog,
  pages
};
