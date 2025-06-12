import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  // Combine site and base URL from Astro config
  const site = context.site?.toString() || 'https://wei2much.github.io';
  const base = import.meta.env.BASE_URL || '';
  
  // Handle empty base path (when base is '' or '/')
  const siteUrl = (!base || base === '/') 
    ? site.replace(/\/$/, '') 
    : `${site.replace(/\/$/, '')}${base.replace(/\/$/, '')}`;
  
  const allPosts = await getCollection('blog');
  const pages = ['about', 'blog'];

  const body = sitemap(allPosts, pages, siteUrl);

  return new Response(body, {
    headers: {
      'Cache-Control': `public, max-age=${86400}`, // 24 hours
      'Content-Type': 'application/xml'
    }
  });
};

const sitemap = (posts: any[], pages: string[], siteUrl: string) => `<?xml version="1.0" encoding="UTF-8" ?>
  <urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
  >
    <url>
      <loc>${siteUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
    ${pages
      .map(
        (page) => `
    <url>
      <loc>${siteUrl}/${page}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>
    `
      )
      .join('')}
    ${posts
      .map(
        (post) => `
    <url>
      <loc>${siteUrl}/blog/${post.slug}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
      <lastmod>${post.data.date.toISOString()}</lastmod>
    </url>
    `
      )
      .join('')}
  </urlset>`;
