import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check if current pathname matches the href
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Handle relative paths for active state checking
      if (href === './') {
        setIsActive(
          currentPath.endsWith('/') &&
            !currentPath.includes('/blog') &&
            !currentPath.includes('/about')
        );
      } else if (href === './blog/') {
        setIsActive(currentPath.includes('/blog'));
      } else if (href === './about/') {
        setIsActive(currentPath.includes('/about'));
      } else {
        setIsActive(currentPath === href);
      }
    }
  }, [href]);

  return (
    <a
      className={`hidden rounded-lg p-1 text-gray-800 transition-all hover:bg-yellow-200 dark:text-gray-200 dark:hover:bg-yellow-800 sm:px-3 sm:py-2 md:inline-block ${
        isActive ? 'font-semibold' : ''
      }`}
      href={href}
    >
      <span className="capsize">{children}</span>
    </a>
  );
}
