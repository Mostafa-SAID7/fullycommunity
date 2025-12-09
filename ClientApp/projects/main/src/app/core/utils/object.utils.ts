/**
 * Object utility functions
 */

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue as any;
    }
  });

  return result;
}

/**
 * Check if value is an object
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Get nested property value safely
 */
export function getNestedValue<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

/**
 * Set nested property value
 */
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

/**
 * Flatten nested object
 */
export function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (isObject(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

/**
 * Compare two objects for equality (deep comparison)
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== typeof obj2) return false;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => isEqual(item, obj2[index]));
  }

  if (isObject(obj1) && isObject(obj2)) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;
    return keys1.every(key => isEqual(obj1[key], obj2[key]));
  }

  return false;
}

/**
 * Remove null and undefined values from object
 */
export function removeNullish<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: any = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      result[key] = isObject(value) ? removeNullish(value) : value;
    }
  });

  return result;
}

/**
 * Convert object to FormData
 */
export function objectToFormData(obj: Record<string, any>, formData = new FormData(), parentKey = ''): FormData {
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (isObject(item)) {
          objectToFormData(item, formData, `${formKey}[${index}]`);
        } else {
          formData.append(`${formKey}[${index}]`, String(item));
        }
      });
    } else if (isObject(value)) {
      objectToFormData(value, formData, formKey);
    } else if (value !== null && value !== undefined) {
      formData.append(formKey, String(value));
    }
  });

  return formData;
}
