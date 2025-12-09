import { HttpParams } from '@angular/common/http';

/**
 * HTTP/API utility functions
 */

/**
 * Build HTTP params from object
 */
export function buildHttpParams(params: { [key: string]: any }): HttpParams {
  let httpParams = new HttpParams();

  Object.keys(params).forEach(key => {
    const value = params[key];
    
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => {
          httpParams = httpParams.append(key, String(item));
        });
      } else if (value instanceof Date) {
        httpParams = httpParams.append(key, value.toISOString());
      } else {
        httpParams = httpParams.append(key, String(value));
      }
    }
  });

  return httpParams;
}

/**
 * Extract error message from HTTP error response
 */
export function extractErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  
  if (error?.error?.message) return error.error.message;
  if (error?.error?.error) return error.error.error;
  if (error?.message) return error.message;
  if (error?.statusText) return error.statusText;
  
  return 'An unexpected error occurred';
}

/**
 * Check if HTTP error is authentication error
 */
export function isAuthError(error: any): boolean {
  return error?.status === 401 || error?.status === 403;
}

/**
 * Check if HTTP error is network error
 */
export function isNetworkError(error: any): boolean {
  return error?.status === 0 || error?.statusText === 'Unknown Error';
}

/**
 * Check if HTTP error is server error
 */
export function isServerError(error: any): boolean {
  return error?.status >= 500 && error?.status < 600;
}

/**
 * Check if HTTP error is client error
 */
export function isClientError(error: any): boolean {
  return error?.status >= 400 && error?.status < 500;
}

/**
 * Retry HTTP request with exponential backoff
 */
export function getRetryDelay(attempt: number, baseDelay = 1000, maxDelay = 30000): number {
  const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
  // Add jitter to prevent thundering herd
  return delay + Math.random() * 1000;
}

/**
 * Build query string from object
 */
export function buildQueryString(params: { [key: string]: any }): string {
  const queryParams: string[] = [];

  Object.keys(params).forEach(key => {
    const value = params[key];
    
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => {
          queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
        });
      } else {
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  });

  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): { [key: string]: string | string[] } {
  const params: { [key: string]: string | string[] } = {};
  const search = queryString.startsWith('?') ? queryString.substring(1) : queryString;

  if (!search) return params;

  search.split('&').forEach(param => {
    const [key, value] = param.split('=').map(decodeURIComponent);
    
    if (key in params) {
      const existing = params[key];
      params[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      params[key] = value;
    }
  });

  return params;
}

/**
 * Download file from blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Get content type from file extension
 */
export function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const contentTypes: { [key: string]: string } = {
    'json': 'application/json',
    'xml': 'application/xml',
    'pdf': 'application/pdf',
    'zip': 'application/zip',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg'
  };
  
  return contentTypes[ext || ''] || 'application/octet-stream';
}
