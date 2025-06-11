import { useEffect } from 'react';

declare global {
  interface Window {
    Prism: any;
  }
}

export default function PrismHighlight() {
  useEffect(() => {
    // Import Prism and the Shades of Purple theme
    const loadPrism = async () => {
      // Load Prism core
      await import('prismjs');
      
      // Load common language components
      await import('prismjs/components/prism-typescript');
      await import('prismjs/components/prism-javascript');
      await import('prismjs/components/prism-jsx');
      await import('prismjs/components/prism-tsx');
      await import('prismjs/components/prism-css');
      await import('prismjs/components/prism-bash');
      await import('prismjs/components/prism-json');
      await import('prismjs/components/prism-yaml');
      await import('prismjs/components/prism-python');
      await import('prismjs/components/prism-rust');
      await import('prismjs/components/prism-go');
      await import('prismjs/components/prism-sql');
      await import('prismjs/components/prism-markdown');

      // Load the Shades of Purple theme CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/prism-themes@1.9.0/themes/prism-shades-of-purple.min.css';
      document.head.appendChild(link);

      // Wait for the CSS to load, then highlight
      link.onload = () => {
        if (window.Prism) {
          window.Prism.highlightAll();
        }
      };
    };

    loadPrism();
  }, []);

  return null;
}