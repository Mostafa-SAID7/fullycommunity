/**
 * String utility functions
 */

/**
 * Truncate string to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate slug from string (e.g., "Hello World" -> "hello-world")
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  if (!text) return text;
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Extract initials from name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string, maxLength = 2): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  const initials = words.map(word => word.charAt(0).toUpperCase());
  return initials.slice(0, maxLength).join('');
}

/**
 * Format number with commas (e.g., 1000 -> "1,000")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format large numbers with K, M, B suffix (e.g., 1500 -> "1.5K")
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Generate excerpt from text
 */
export function generateExcerpt(text: string, maxLength = 150): string {
  const stripped = stripHtml(text);
  return truncate(stripped, maxLength);
}

/**
 * Check if string is valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if string is valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Highlight search term in text
 */
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
