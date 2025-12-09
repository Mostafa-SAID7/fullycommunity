/**
 * URL utility functions
 */

/**
 * Build URL with query parameters
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });

  return url.toString();
}

/**
 * Parse query parameters from URL
 */
export function parseQueryParams(url: string = window.location.href): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Get query parameter value by key
 */
export function getQueryParam(key: string, url: string = window.location.href): string | null {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(key);
}

/**
 * Add or update query parameter
 */
export function setQueryParam(key: string, value: string, url: string = window.location.href): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set(key, value);
  return urlObj.toString();
}

/**
 * Remove query parameter
 */
export function removeQueryParam(key: string, url: string = window.location.href): string {
  const urlObj = new URL(url);
  urlObj.searchParams.delete(key);
  return urlObj.toString();
}

/**
 * Get domain from URL
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * Check if URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Convert relative URL to absolute
 */
export function toAbsoluteUrl(relativeUrl: string, baseUrl: string = window.location.origin): string {
  if (isAbsoluteUrl(relativeUrl)) return relativeUrl;
  return new URL(relativeUrl, baseUrl).toString();
}

/**
 * Extract path from URL
 */
export function getPath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return url;
  }
}

/**
 * Check if two URLs are the same (ignoring query params and hash)
 */
export function isSameUrl(url1: string, url2: string): boolean {
  try {
    const urlObj1 = new URL(url1, window.location.origin);
    const urlObj2 = new URL(url2, window.location.origin);
    return urlObj1.origin === urlObj2.origin && urlObj1.pathname === urlObj2.pathname;
  } catch {
    return false;
  }
}

/**
 * Open URL in new tab
 */
export function openInNewTab(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copy URL to clipboard
 */
export async function copyUrlToClipboard(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share URL using Web Share API
 */
export async function shareUrl(url: string, title?: string, text?: string): Promise<boolean> {
  if (!navigator.share) return false;

  try {
    await navigator.share({ url, title, text });
    return true;
  } catch {
    return false;
  }
}
