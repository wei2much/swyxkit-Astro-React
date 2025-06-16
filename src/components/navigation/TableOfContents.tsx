import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings?: TocItem[];
}

export default function TableOfContents({ headings = [] }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  // Set initial open state based on screen size
  useEffect(() => {
    if (window.matchMedia('(min-width: 640px)').matches) {
      setIsOpen(true);
    }
  }, []);

  // Track which heading is currently in view
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0% 0% -80% 0%',
        threshold: 0.1
      }
    );

    // Observe all headings
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Don't render if there are fewer than 2 headings
  if (headings.length < 2) {
    return null;
  }

  return (
    <section className="fixed right-4 bottom-1 max-w-[12em] rounded-xl bg-white/25 hover:bg-white/30 p-2 backdrop-blur z-50">
      {!isOpen && (
        <button
          className="flex justify-center items-center z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-orange-700 dark:text-orange-400">
            Table of <br /> Contents
          </h2>
        </button>
      )}

      {isOpen && (
        <ul className="space-y-2 max-h-80 overflow-auto">
          <h2 className="text-orange-700 dark:text-orange-400">
            Table of Contents
            <button className="hover:text-white ml-2" onClick={() => setIsOpen(!isOpen)}>
              [X]
            </button>
          </h2>
          {headings.map(({ id, text, level }) => (
            <a
              key={id}
              className={`ml-2 block bg-opacity-25 text-sm ${
                activeId === id ? '!text-red-300 underline' : 'text-current'
              }`}
              style={{ paddingLeft: `${(level - 1) * 0.5}rem` }}
              href={`#${id}`}
            >
              <li>{text}</li>
            </a>
          ))}
        </ul>
      )}
    </section>
  );
}
