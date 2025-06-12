import { useEffect, useState } from 'react';
import TwitterEmbed from './TwitterEmbed';

interface TwitterEmbedWrapperProps {
  tweetId: string;
}

export default function TwitterEmbedWrapper({ tweetId }: TwitterEmbedWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="my-6 flex justify-center">
        <div className="w-full max-w-lg">
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading tweet...</p>
          </div>
        </div>
      </div>
    );
  }

  return <TwitterEmbed tweetId={tweetId} />;
}
