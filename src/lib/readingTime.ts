import sanitizeHtml from 'sanitize-html';

// Calculate reading time for a given text
export function calculateReadingTime(text: string): string {
  if (!text) return '0 min read';

  // Average reading speed is around 200-250 words per minute
  const wordsPerMinute = 225;

  // Use sanitize-html to safely remove script tags while preserving other content
  const textWithoutScripts = sanitizeHtml(text, {
    disallowedTagsMode: 'discard',
    allowedTags: sanitizeHtml.defaults.allowedTags.filter(tag => tag !== 'script'),
    allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
  });

  // Now strip all remaining HTML tags for word counting
  const cleanText = textWithoutScripts.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

  const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;

  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

  return `${readingTimeMinutes} min read`;
}
