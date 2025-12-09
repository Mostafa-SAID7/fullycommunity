/**
 * Color utility functions
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Generate random hex color
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Lighten color by percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * (percent / 100)));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * (percent / 100)));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * (percent / 100)));

  return rgbToHex(r, g, b);
}

/**
 * Darken color by percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.floor(rgb.r * (1 - percent / 100)));
  const g = Math.max(0, Math.floor(rgb.g * (1 - percent / 100)));
  const b = Math.max(0, Math.floor(rgb.b * (1 - percent / 100)));

  return rgbToHex(r, g, b);
}

/**
 * Check if color is light or dark
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Get contrasting text color (black or white) for background
 */
export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? '#000000' : '#FFFFFF';
}

/**
 * Generate color palette from base color
 */
export function generatePalette(baseColor: string, count = 5): string[] {
  const palette: string[] = [];
  const step = 100 / (count - 1);

  for (let i = 0; i < count; i++) {
    const percent = i * step;
    if (percent < 50) {
      palette.push(lightenColor(baseColor, (50 - percent) * 2));
    } else if (percent > 50) {
      palette.push(darkenColor(baseColor, (percent - 50) * 2));
    } else {
      palette.push(baseColor);
    }
  }

  return palette;
}

/**
 * Convert color name to hex
 */
export function colorNameToHex(colorName: string): string {
  const colors: Record<string, string> = {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    yellow: '#FFFF00',
    orange: '#FFA500',
    purple: '#800080',
    pink: '#FFC0CB',
    brown: '#A52A2A',
    gray: '#808080',
    black: '#000000',
    white: '#FFFFFF'
  };

  return colors[colorName.toLowerCase()] || '#000000';
}
