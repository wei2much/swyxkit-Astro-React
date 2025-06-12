import { useEffect, useRef, useState } from 'react';

interface TwitterEmbedProps {
	tweetId: string;
}

declare global {
	interface Window {
		twttr?: {
			widgets: {
				load: (element?: HTMLElement) => void;
				createTweet: (
					tweetId: string,
					element: HTMLElement,
					options?: { theme?: 'light' | 'dark'; dnt?: boolean }
				) => Promise<HTMLElement>;
			};
		};
	}
}

export default function TwitterEmbed({ tweetId: rawTweetId }: TwitterEmbedProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDark, setIsDark] = useState(false);

	// Extract tweet ID from URL if a full URL is provided
	const extractTweetId = (input: string): string => {
		// Handle x.com URLs (new format)
		const xMatch = input.match(/x\.com\/[^/]+\/status\/(\d+)/);
		if (xMatch) return xMatch[1];
		
		// Handle twitter.com URLs (legacy format)
		const twitterMatch = input.match(/twitter\.com\/[^/]+\/status\/(\d+)/);
		if (twitterMatch) return twitterMatch[1];
		
		// If it's just a tweet ID (numeric string), return as is
		return input;
	};

	const tweetId = extractTweetId(rawTweetId);

	// Detect theme changes
	useEffect(() => {
		const detectTheme = () => {
			const isDarkMode = document.documentElement.classList.contains('dark');
			setIsDark(isDarkMode);
		};

		// Initial detection
		detectTheme();

		// Watch for theme changes using MutationObserver
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					detectTheme();
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const loadTweet = () => {
			if (!containerRef.current) return;

			// Clear previous content
			containerRef.current.innerHTML = '';

			if (window.twttr?.widgets?.createTweet) {
				window.twttr.widgets.createTweet(
					tweetId,
					containerRef.current,
					{
						theme: isDark ? 'dark' : 'light',
						dnt: true // Do Not Track for privacy
					}
				).catch((error) => {
					console.error('Failed to load tweet:', error);
					if (containerRef.current) {
						containerRef.current.innerHTML = `
							<div class="border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
								<p class="text-gray-600 dark:text-gray-400">Failed to load tweet</p>
								<a href="https://x.com/i/status/${tweetId}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
									View on X
								</a>
							</div>
						`;
					}
				});
			}
		};

		// Load Twitter widget script if not already loaded
		if (!window.twttr) {
			const script = document.createElement('script');
			script.async = true;
			script.src = 'https://platform.twitter.com/widgets.js';
			script.charset = 'utf-8';
			script.integrity = 'sha256-+1eHOWKaYPuEWx6vMcfqp+j3LCcmJ+hCkl1/j1N+PjU='; // Add integrity check
			script.crossOrigin = 'anonymous'; // Security: prevent credential leakage
			document.head.appendChild(script);

			script.onload = () => {
				loadTweet();
			};

			script.onerror = () => {
				console.error('Failed to load Twitter widgets script');
				if (containerRef.current) {
					containerRef.current.innerHTML = `
						<div class="border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
							<p class="text-gray-600 dark:text-gray-400">Failed to load Twitter widgets</p>
							<a href="https://x.com/i/status/${tweetId}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
								View on X
							</a>
						</div>
					`;
				}
			};
		} else {
			loadTweet();
		}
	}, [tweetId, isDark]); // Re-load when theme changes

	return (
		<div className="my-6 flex justify-center">
			<div ref={containerRef} className="w-full max-w-lg">
				<div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
					<p className="text-gray-600 dark:text-gray-400">Loading tweet...</p>
				</div>
			</div>
		</div>
	);
}
