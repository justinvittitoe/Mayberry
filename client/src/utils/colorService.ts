// Color service utilities for managing color schemes and color operations

import { ColorScheme } from '../components/ColorableSVG';

/**
 * Convert a hex color to RGB values
 * @param hex - Hex color string (e.g., "#ff0000" or "ff0000")
 * @returns RGB object with r, g, b values
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB values to hex color
 * @param r - Red value (0-255)
 * @param g - Green value (0-255) 
 * @param b - Blue value (0-255)
 * @returns Hex color string
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Check if a color is considered "light" (useful for determining text color)
 * @param hex - Hex color string
 * @returns True if the color is light
 */
export const isLightColor = (hex: string): boolean => {
  const rgb = hexToRgb(hex);
  if (!rgb) return true; // Default to light if can't parse
  
  // Calculate luminance using standard formula
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
};

/**
 * Generate a contrasting text color for a given background color
 * @param backgroundColor - Background color hex string
 * @returns Either "#000000" or "#ffffff" for optimal contrast
 */
export const getContrastingTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? "#000000" : "#ffffff";
};

/**
 * Create a color preview element for display purposes
 * @param color - Hex color string
 * @param size - Size in pixels (default: 30)
 * @returns CSS style object for color preview
 */
export const createColorPreviewStyle = (color: string, size: number = 30) => ({
  width: `${size}px`,
  height: `${size}px`,
  backgroundColor: color,
  borderRadius: '4px',
  border: '1px solid #dee2e6',
  display: 'inline-block'
});

/**
 * Validate if a string is a valid hex color
 * @param color - Color string to validate
 * @returns True if valid hex color
 */
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Get a preview color for color scheme names (for backward compatibility)
 * This maps color scheme names to preview colors for display purposes
 * @param colorName - Name of the color scheme
 * @returns Hex color string for preview
 */
export const getColorPreviewFromName = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Classic White': '#f8f9fa',
    'Warm Beige': '#f5f1eb',
    'Natural Stone': '#e9ecef',
    'Modern Gray': '#6c757d',
    'Charcoal': '#495057',
    'Sage Green': '#8fbc8f',
    'Navy Blue': '#1e3a8a',
    'Forest Green': '#2d5016',
    'Desert Sand': '#ddbf85'
  };
  return colorMap[colorName] || '#e9ecef';
};

/**
 * Generate a color palette from a ColorScheme
 * @param colorScheme - ColorScheme object
 * @returns Array of color values for display
 */
export const getColorPalette = (colorScheme: ColorScheme): string[] => {
  const palette = [
    colorScheme.colorValues.primary,
    colorScheme.colorValues.secondary,
    colorScheme.colorValues.roof,
    colorScheme.colorValues.accent
  ];
  
  if (colorScheme.colorValues.foundation) {
    palette.push(colorScheme.colorValues.foundation);
  }
  
  return palette;
};

/**
 * Create a gradient CSS string from a color palette
 * @param colors - Array of color strings
 * @returns CSS gradient string
 */
export const createGradientFromPalette = (colors: string[]): string => {
  if (colors.length === 1) return colors[0];
  
  const step = 100 / (colors.length - 1);
  const stops = colors.map((color, index) => `${color} ${index * step}%`);
  
  return `linear-gradient(90deg, ${stops.join(', ')})`;
};

/**
 * Apply alpha/opacity to a hex color
 * @param hex - Hex color string
 * @param alpha - Alpha value (0-1)
 * @returns RGBA color string
 */
export const addAlphaToHex = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

/**
 * Darken a hex color by a percentage
 * @param hex - Hex color string
 * @param percent - Percentage to darken (0-100)
 * @returns Darkened hex color
 */
export const darkenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = (100 - percent) / 100;
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);
  
  return rgbToHex(r, g, b);
};

/**
 * Lighten a hex color by a percentage
 * @param hex - Hex color string  
 * @param percent - Percentage to lighten (0-100)
 * @returns Lightened hex color
 */
export const lightenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = percent / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);
  
  return rgbToHex(r, g, b);
};