import { useEffect, useState } from 'react';
import YouTubeEmbed from './YouTubeEmbed';

interface YouTubeEmbedWrapperProps {
  videoId: string;
}

export default function YouTubeEmbedWrapper({ videoId }: YouTubeEmbedWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="my-6">
        <div
          className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center"
          style={{ height: '400px' }}
        >
          <p className="text-gray-600 dark:text-gray-400">Loading YouTube video...</p>
        </div>
      </div>
    );
  }

  return <YouTubeEmbed videoId={videoId} />;
}
