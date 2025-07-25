import { useState, useEffect } from 'react';
import { REPO_URL } from '../../lib/siteConfig';
import NavLink from './NavLink';
import MobileMenu from './MobileMenu';

export default function Nav() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <nav className="relative mx-auto flex w-full max-w-2xl items-center justify-between border-gray-200 bg-gray-50 bg-opacity-60 py-8 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 sm:pb-16">
      <MobileMenu />
      <ul className="ml-[-0.60rem] flex">
        <li>
          <NavLink href="./">Home</NavLink>
        </li>
        <li>
          <NavLink href="./blog/">Blog</NavLink>
        </li>
        <li>
          <NavLink href="./about/">About</NavLink>
        </li>
      </ul>
      <div className="flex items-center space-x-4">
        {/* RSS */}
        <a
          className="rounded-lg text-gray-700 hover:bg-yellow-200 dark:text-gray-200 dark:hover:bg-yellow-800"
          rel="external"
          href="./rss.xml"
          aria-label="RSS feed"
        >
          <svg aria-hidden="true" className="h-9 w-9 p-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248S0 22.546 0 20.752s1.456-3.248 3.252-3.248 3.251 1.454 3.251 3.248zM1.677 6.462v4.003c6.988 0 12.65 5.662 12.65 12.65h4.003c0-9.186-7.467-16.653-16.653-16.653zM1.677.683v4.002C12.18 4.685 20.597 13.101 20.597 23.605h4.003C24.6 11.297 13.984.683 1.677.683z" />
          </svg>
        </a>
        {/* GitHub */}
        <a
          className="rounded-lg text-gray-700 hover:bg-yellow-200 dark:text-gray-200 dark:hover:bg-yellow-800"
          href={REPO_URL}
          aria-label="GitHub source"
        >
          <svg aria-hidden="true" className="h-9 w-9 p-1" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <button
          aria-label="Toggle Dark Mode"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 ring-yellow-400 transition-all hover:ring-2 dark:bg-yellow-800"
          onClick={toggleDarkMode}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5 text-gray-800 dark:text-yellow-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5 text-gray-800 dark:text-gray-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
