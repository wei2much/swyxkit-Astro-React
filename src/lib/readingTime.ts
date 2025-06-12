import sanitizeHtml from 'sanitize-html';

// Calculate reading time for a given text
export function calculateReadingTime(text: string): string {
  if (!text) return '0 min read';

  // Average reading speed is around 200-250 words per minute
  const wordsPerMinute = 225;

  // Use sanitize-html with safe defaults, explicitly excluding script tags
  const sanitizedText = sanitizeHtml(text, {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'pre', 'code', 'span', 'div',
      'a', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ],
    allowedAttributes: {
      'a': ['href', 'title'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'id']
    },
    disallowedTagsMode: 'discard'
  });

  // Extract text content for word counting by removing all HTML tags
  const cleanText = sanitizeHtml(sanitizedText, {
    allowedTags: [], // Strip all remaining HTML tags
    allowedAttributes: {}
  })
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = cleanText.split(/\s+/).filter((word) => word.length > 0).length;

  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

  return `${readingTimeMinutes} min read`;
}
