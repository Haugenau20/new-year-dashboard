export interface CSSFilters {
  hueRotate: number;
  saturation: number;
  brightness: number;
}

/**
 * Convert RGB hex color to CSS filter values
 * @param rgbHex - Hex color string (e.g., "#FF5733")
 * @returns CSS filter values for hue-rotate, saturate, and brightness
 */
export function rgbToFilters(rgbHex: string): CSSFilters {
  const { h, s, l } = hexToHSL(rgbHex);

  return {
    hueRotate: Math.round(h),
    saturation: Math.round(s * 100),
    brightness: l > 50 ? 120 : 90
  };
}

/**
 * Convert hex color to HSL
 * @param hex - Hex color string (e.g., "#FF5733" or "FF5733")
 * @returns HSL values (h: 0-360, s: 0-100, l: 0-100)
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  // Achromatic (grayscale)
  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}
