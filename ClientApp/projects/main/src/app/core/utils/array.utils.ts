/**
 * Array utility functions
 */

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Remove duplicates from array of objects by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Group array of objects by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array of objects by key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array randomly
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 */
export function randomItem<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Move item in array from one index to another
 */
export function moveItem<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Paginate array
 */
export function paginate<T>(array: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return array.slice(start, start + pageSize);
}

/**
 * Find item by property value
 */
export function findBy<T>(array: T[], key: keyof T, value: any): T | undefined {
  return array.find(item => item[key] === value);
}

/**
 * Filter array by search term (searches multiple keys)
 */
export function searchBy<T>(array: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    keys.some(key => {
      const value = item[key];
      return value && String(value).toLowerCase().includes(term);
    })
  );
}
