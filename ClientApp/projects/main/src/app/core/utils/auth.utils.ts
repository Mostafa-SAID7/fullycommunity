/**
 * Authentication utility functions
 */

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: string | Date): boolean {
  const expiration = new Date(expiresAt);
  return expiration.getTime() < Date.now();
}

/**
 * Get time until token expires (in seconds)
 */
export function getTokenExpiryTime(expiresAt: string | Date): number {
  const expiration = new Date(expiresAt);
  return Math.max(0, Math.floor((expiration.getTime() - Date.now()) / 1000));
}

/**
 * Parse JWT token (without verification)
 */
export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(token: string): string | null {
  const payload = parseJwt(token);
  return payload?.sub || payload?.userId || payload?.id || null;
}

/**
 * Get user roles from JWT token
 */
export function getRolesFromToken(token: string): string[] {
  const payload = parseJwt(token);
  const roles = payload?.role || payload?.roles || [];
  return Array.isArray(roles) ? roles : [roles];
}

/**
 * Check if user has specific role
 */
export function hasRole(token: string, role: string): boolean {
  const roles = getRolesFromToken(token);
  return roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(token: string, roles: string[]): boolean {
  const userRoles = getRolesFromToken(token);
  return roles.some(role => userRoles.includes(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(token: string, roles: string[]): boolean {
  const userRoles = getRolesFromToken(token);
  return roles.every(role => userRoles.includes(role));
}

/**
 * Generate device ID for tracking
 */
export function generateDeviceId(): string {
  const nav = navigator as any;
  const screen = window.screen;
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  const components = [
    nav.userAgent,
    nav.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    guid
  ];

  return btoa(components.join('|')).substring(0, 32);
}

/**
 * Mask email for display (e.g., "j***@example.com")
 */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  
  const maskedName = name.length > 2 
    ? name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
    : name[0] + '*';
  
  return `${maskedName}@${domain}`;
}

/**
 * Mask phone number for display (e.g., "***-***-1234")
 */
export function maskPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  
  const lastFour = digits.slice(-4);
  const masked = '*'.repeat(digits.length - 4);
  
  return masked + lastFour;
}

/**
 * Generate random password
 */
export function generatePassword(length = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const all = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
