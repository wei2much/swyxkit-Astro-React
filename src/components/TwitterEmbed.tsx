import { useEffect } from 'react';

interface TwitterEmbedProps {
  tweetId: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

export default function TwitterEmbed({ tweetId: rawTweetId }: TwitterEmbedProps) {
  const tweetUrl = rawTweetId.startsWith('https://twitter.com/') 
    ? rawTweetId 
    : `https://twitter.com/x/status/${rawTweetId}`;

  useEffect(() => {
    // Load Twitter widget script if not already loaded
    if (!window.twttr) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://platform.twitter.com/widgets.js';
      script.charset = 'utf-8';
      document.head.appendChild(script);
      
      script.onload = () => {
        if (window.twttr?.widgets) {
          window.twttr.widgets.load();
        }
      };
    } else {
      // Script already loaded, just reload widgets
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <blockquote 
        className="twitter-tweet" 
        data-lang="en" 
        data-dnt="true" 
        data-theme="dark"
      >
        <a href={tweetUrl}></a>
      </blockquote>
    </div>
  );
}