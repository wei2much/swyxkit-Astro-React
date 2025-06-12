import { defineCollection, z } from 'astro:content';
import { POST_CATEGORIES } from '../lib/siteConfig';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string().optional(),
    date: z.date(),
    category: z.enum(POST_CATEGORIES),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    image: z.string().optional(),
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
