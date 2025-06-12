import RSS from 'rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_URL } from '../lib/siteConfig';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const feed = new RSS({
    title: SITE_TITLE + ' RSS Feed',
    site_url: SITE_URL,
    feed_url: SITE_URL + '/rss.xml',
    description: `Latest posts from ${SITE_TITLE}`,
    language: 'en-US',
    managingEditor: 'noreply@example.com', // Change this to your email
    webMaster: 'noreply@example.com' // Change this to your email
  });

  const allPosts = await getCollection('blog');
  const sortedPosts = allPosts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  sortedPosts.forEach((post) => {
    feed.item({
      title: post.data.title,
      url: SITE_URL + `/blog/${post.slug}`,
      date: post.data.date,
      description: post.data.description,
      categories: [post.data.category, ...post.data.tags]
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Cache-Control': `public, max-age=${86400}`, // 24 hours
      'Content-Type': 'application/rss+xml'
    }
  });
};
