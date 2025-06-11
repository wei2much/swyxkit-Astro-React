// Calculate reading time for a given text
export function calculateReadingTime(text: string): string {
  if (!text) return '0 min read';
  
  // Average reading speed is around 200-250 words per minute
  const wordsPerMinute = 225;
  
  // Remove HTML tags and count words
  const cleanText = text.replace(/<[^>]*>/g, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
  return `${readingTimeMinutes} min read`;
}