// Site configuration - content and branding
export const SITE_TITLE = 'SwyxKit';
export const SITE_DESCRIPTION = "swyx's default Astro + React + Tailwind starter";
export const DEFAULT_OG_IMAGE =
  'https://user-images.githubusercontent.com/6764957/147861359-3ad9438f-41d1-47c8-aa05-95c7d18497f0.png';
export const MY_TWITTER_HANDLE = 'swyx';
export const MY_YOUTUBE = 'https://youtube.com/swyxTV';
export const POST_CATEGORIES = ['Essay', 'Note'] as const;

// Repository configuration  
export const REPO_URL = 'https://github.com/wei2much/swyxkit-Astro-React';
export const REPO_OWNER = 'wei2much';

// URL configuration - use Astro's built-in environment variables
// These are set from astro.config.mjs and available at runtime
export function getSiteUrl(): string {
  // In Astro, import.meta.env.SITE contains the full site URL from config
  if (typeof import.meta !== 'undefined' && import.meta.env?.SITE) {
    const site = import.meta.env.SITE;
    const base = import.meta.env.BASE_URL || '';
    
    // Handle empty base path (when base is '' or '/')
    if (!base || base === '/') {
      return site;
    }
    
    // Combine site and base path, ensuring no double slashes
    return `${site.replace(/\/$/, '')}${base}`;
  }
  
  // Fallback for build-time or when import.meta.env is not available
  return 'https://wei2much.github.io/swyxkit-Astro-React';
}

// Utility function to get the full URL for a path
export function getFullUrl(path: string): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export type PostCategory = (typeof POST_CATEGORIES)[number];
