/**
 * Local Storage and Session Storage utility functions
 */

/**
 * Save data to localStorage with JSON serialization
 */
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get data from localStorage with JSON deserialization
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return null;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Remove item from localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Save data to sessionStorage with JSON serialization
 */
export function saveToSessionStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    sessionStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Error saving to sessionStorage:', error);
  }
}

/**
 * Get data from sessionStorage with JSON deserialization
 */
export function getFromSessionStorage<T>(key: string): T | null {
  try {
    const serialized = sessionStorage.getItem(key);
    if (serialized === null) return null;
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error('Error reading from sessionStorage:', error);
    return null;
  }
}

/**
 * Remove item from sessionStorage
 */
export function removeFromSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
  }
}

/**
 * Clear all sessionStorage
 */
export function clearSessionStorage(): void {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all keys from localStorage
 */
export function getLocalStorageKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys;
}

/**
 * Get localStorage size in bytes
 */
export function getLocalStorageSize(): number {
  let size = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        size += key.length + value.length;
      }
    }
  }
  return size;
}
