/**
 * DOM utility functions
 */

/**
 * Scroll to element smoothly
 */
export function scrollToElement(element: HTMLElement | string, offset = 0): void {
  const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Scroll to top of page
 */
export function scrollToTop(smooth = true): void {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get element offset from top of page
 */
export function getElementOffset(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
}

/**
 * Disable page scroll
 */
export function disableScroll(): void {
  document.body.style.overflow = 'hidden';
}

/**
 * Enable page scroll
 */
export function enableScroll(): void {
  document.body.style.overflow = '';
}

/**
 * Check if element has class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className);
}

/**
 * Toggle class on element
 */
export function toggleClass(element: HTMLElement, className: string): void {
  element.classList.toggle(className);
}

/**
 * Add multiple classes to element
 */
export function addClasses(element: HTMLElement, ...classNames: string[]): void {
  element.classList.add(...classNames);
}

/**
 * Remove multiple classes from element
 */
export function removeClasses(element: HTMLElement, ...classNames: string[]): void {
  element.classList.remove(...classNames);
}

/**
 * Get computed style of element
 */
export function getComputedStyle(element: HTMLElement, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  return /iPad|Android/i.test(navigator.userAgent) && !isMobile();
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  return !isMobile() && !isTablet();
}

/**
 * Get viewport dimensions
 */
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Wait for element to exist in DOM
 */
export function waitForElement(selector: string, timeout = 5000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}
