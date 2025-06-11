export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function generateTocFromHeadings(headings: any[]): TocItem[] {
  return headings.map((heading) => ({
    id: heading.slug,
    text: heading.text,
    level: heading.depth,
  }));
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}