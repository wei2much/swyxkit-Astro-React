import { useState, useEffect, useMemo } from 'react';
import { fuzzySearch, changeSearchMode, isSearchExact } from '../lib/fuzzySearch';
import IndexCard from './IndexCard';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: Date;
  featured?: boolean;
  content?: string;
  subtitle?: string;
}

interface BlogSearchProps {
  posts: BlogPost[];
  categories: string[];
}

export default function BlogSearch({ posts, categories }: BlogSearchProps) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [results, setResults] = useState<(BlogPost & { highlightedResults?: string })[]>(posts);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search and filtering
  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      try {
        const searchResults = await fuzzySearch(posts, selectedCategories, search);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults(posts);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [search, selectedCategories, posts]);

  // Handle keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target !== document.querySelector('#search-input')) {
        e.preventDefault();
        const searchInput = document.querySelector('#search-input') as HTMLInputElement;
        searchInput?.focus();
        searchInput?.select();
      }
    };

    window.addEventListener('keyup', handleKeyPress);
    return () => window.removeEventListener('keyup', handleKeyPress);
  }, []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearSearch = () => {
    setSearch('');
    setSelectedCategories([]);
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative mb-4 w-full">
        <input
          id="search-input"
          aria-label="Search articles"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hit / to search"
          className="block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
        />
        <svg
          className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="mt-2 mb-8 flex items-center">
          <div className="mr-2 text-gray-900 dark:text-gray-400">Filter:</div>
          <div className="grid grid-cols-2 rounded-md shadow-sm sm:grid-cols-2">
            {categories.map((category) => (
              <div key={category}>
                <input
                  id={`category-${category}`}
                  className="peer sr-only"
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className={`inline-flex w-full cursor-pointer items-center justify-between border border-gray-200 bg-white px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 ${
                    selectedCategories.includes(category)
                      ? 'border-purple-600 text-purple-600 dark:text-purple-500'
                      : ''
                  }`}
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Mode Toggle */}
      {search && (
        <div className="mb-4">
          <button
            onClick={changeSearchMode}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Search Mode: {isSearchExact ? 'Exact' : 'Fuzzy'} (click to toggle)
          </button>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
        </div>
      ) : results.length > 0 ? (
        <ul className="space-y-8">
          {results.map((post) => (
            <li key={post.slug} className="text-lg">
              <IndexCard
                href={`/blog/${post.slug}`}
                title={post.title}
                stringData={post.date.toISOString().slice(0, 10)}
                category={post.category}
                tags={post.tags}
                readingTime={undefined} // We don't have reading time calculated
              >
                {post.highlightedResults ? (
                  <span
                    className="italic"
                    dangerouslySetInnerHTML={{ __html: post.highlightedResults }}
                  />
                ) : (
                  post.description
                )}
              </IndexCard>
            </li>
          ))}
        </ul>
      ) : search ? (
        <div className="prose dark:prose-invert">
          <p>
            No posts found for <code>{search}</code>.
          </p>
          <button
            className="bg-slate-500 p-2 rounded text-white"
            onClick={clearSearch}
          >
            Clear your search
          </button>
        </div>
      ) : (
        <div className="prose dark:prose-invert">
          <p>No blog posts found!</p>
        </div>
      )}
    </div>
  );
}