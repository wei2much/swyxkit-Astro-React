import type { ReactNode } from 'react';

interface IndexCardProps {
  href?: string;
  title?: string;
  stringData?: string;
  category?: string;
  tags?: string[];
  readingTime?: string;
  ghMetadata?: {
    reactions: {
      total_count: number;
    };
  } | null;
  children?: ReactNode;
}

export default function IndexCard({
  href = '#',
  title = 'Untitled post',
  stringData = 'no date',
  category = 'note',
  tags = [],
  readingTime,
  ghMetadata = null,
  children
}: IndexCardProps) {
  return (
    <a
      className="w-full text-gray-900 hover:text-yellow-600 dark:text-gray-100 dark:hover:text-yellow-100 hover:no-underline"
      href={href}
    >
      <div className="w-full">
        <div className="flex flex-col justify-between md:flex-row">
          <h4 className="flex-auto w-full mb-2 text-lg font-bold md:text-xl">
            {title}
          </h4>
        </div>
        <p className="text-gray-600 mb-2 break-all sm:break-words dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-100">
          {children}
        </p>
        <div className="flex justify-between items-center gap-1 text-left text-gray-500 sm:justify-start sm:flex-row sm:gap-4 md:mb-0 md:text-sm">
          <p>{stringData}</p>
          {readingTime && (
            <p className="hidden sm:inline-block">{readingTime}</p>
          )}
          <span className="px-4 max-h-6 flex items-center capitalize bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-400">
            {category}
          </span>
          {tags.length > 0 && (
            <div className="hidden md:block flex-1">
              {tags.map((tag) => (
                <span key={tag} className="px-1">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {ghMetadata && ghMetadata.reactions.total_count > 0 && (
            <p className="">{ghMetadata.reactions.total_count} ♥</p>
          )}
        </div>
      </div>
    </a>
  );
}