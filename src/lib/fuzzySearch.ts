import Fuse from 'fuse.js';

interface SearchablePost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content?: string;
  subtitle?: string;
}

// Export search configuration
export let isSearchExact = false;

export function setIsSearchExact(value = !isSearchExact) {
  isSearchExact = value;
}

export function changeSearchMode() {
  isSearchExact = !isSearchExact;
}

// Debounce function for search performance
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: number;
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      const later = () => {
        timeout = 0;
        resolve(func.apply(null, args));
      };
      const callNow = !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) resolve(func.apply(null, args));
    });
  };
}

function _fuzzySearch(
  items: SearchablePost[],
  selectedCategories: string[],
  search: string
): (SearchablePost & { highlightedResults?: string })[] {
  // Filter by categories first
  const filteredItems = items.filter((item) => {
    if (selectedCategories?.length < 1) return true;
    return selectedCategories
      .map((element) => element.toLowerCase())
      .includes(item.category.toLowerCase());
  });

  if (search) {
    // Configure Fuse.js options
    const fuseOptions = {
      includeScore: true,
      includeMatches: true,
      threshold: isSearchExact ? 0.0 : 0.4, // 0.0 = exact match, 0.4 = fuzzy
      ignoreLocation: true,
      keys: [
        { name: 'title', weight: 0.3 },
        { name: 'subtitle', weight: 0.2 },
        { name: 'description', weight: 0.2 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ]
    };

    const fuse = new Fuse(filteredItems, fuseOptions);
    const results = fuse.search(search);

    return results.map((result) => {
      const item = result.item;

      // Generate highlighted results from matches
      let highlightedResults = '';
      if (result.matches && result.matches.length > 0) {
        const match = result.matches[0];
        if (match.value) {
          const value = match.value;
          const indices = match.indices || [];

          if (indices.length > 0) {
            let highlighted = '';
            let lastIndex = 0;

            indices.forEach(([start, end]) => {
              // Add text before match
              highlighted += value.slice(lastIndex, start);
              // Add highlighted match
              highlighted += `<b style="color:var(--brand-accent)">${value.slice(start, end + 1)}</b>`;
              lastIndex = end + 1;
            });

            // Add remaining text
            highlighted += value.slice(lastIndex);

            // Extract context around match (200 chars before/after)
            const firstMatch = indices[0][0];
            const contextStart = Math.max(0, firstMatch - 200);
            const contextEnd = Math.min(value.length, indices[indices.length - 1][1] + 200);

            highlightedResults = highlighted
              .slice(contextStart, contextEnd)
              .split(' ')
              .slice(1, -1)
              .join(' ');
          }
        }
      }

      return {
        ...item,
        highlightedResults: highlightedResults || item.description?.slice(0, 200) + '...'
      };
    });
  } else {
    return filteredItems;
  }
}

export function fuzzySearch(items: SearchablePost[], selectedCategories: string[], search: string) {
  return debounce(_fuzzySearch, 100)(items, selectedCategories, search);
}
