interface LatestPostsProps {
  items: Array<{
    slug: string;
    title: string;
    date: Date;
  }>;
}

export default function LatestPosts({ items }: LatestPostsProps) {
  return (
    <section className="mb-8 w-full">
      <h3
        id="latest"
        className="mb-6 text-2xl font-bold tracking-tight text-black dark:text-white md:text-4xl"
      >
        Latest Posts
      </h3>
      <ul className="space-y-2 text-white">
        {items.map((item) => (
          <li key={item.slug}>
            <a className="font-bold" href={`/blog/${item.slug}`}>
              {item.title}
            </a>
            <span className="hidden text-xs text-black dark:text-gray-400 sm:inline">
              {item.date.toISOString().slice(0, 10)}
            </span>
          </li>
        ))}
      </ul>
      <a
        className="mt-2 flex h-6 rounded-lg leading-7 text-gray-600 transition-all dark:text-gray-400 dark:hover:text-gray-200"
        href="/blog"
      >
        Search and see all posts
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="ml-1 h-6 w-6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
          />
        </svg>
      </a>
    </section>
  );
}
