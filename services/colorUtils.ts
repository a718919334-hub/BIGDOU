
import { BRAND_PALETTES, PaletteEntry } from '../constants';
import { BeadBrand } from '../types';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/**
 * Calculates perceptual luminance of an RGB color.
 * Using standard formula: 0.299R + 0.587G + 0.114B
 */
function getLuminance(rgb: {r: number, g: number, b: number}) {
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
}

function colorDistance(c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

export const getClosestBrandColor = (hex: string, brand: BeadBrand): PaletteEntry => {
  if (brand === 'Original') {
    return { id: hex.toUpperCase(), hex: hex, name: 'Original Color' };
  }

  const targetRgb = hexToRgb(hex);
  const targetLum = getLuminance(targetRgb);
  const palette = BRAND_PALETTES[brand];
  
  let closest = palette[0];
  let minScore = Infinity;

  for (const entry of palette) {
    const entryRgb = hexToRgb(entry.hex);
    const entryLum = getLuminance(entryRgb);
    
    // Balanced Score calculation: 
    // rgbDist captures the 'hue' and 'saturation' unity
    // lumDiff captures the 'value' and 'brightness' unity
    const lumDiff = Math.abs(targetLum - entryLum);
    const rgbDist = colorDistance(targetRgb, entryRgb);
    
    // Weighting them together: RGB distance is the baseline, 
    // plus a significant weight on Luminance to ensure tonal clarity.
    const score = rgbDist + (lumDiff * 1.5);

    if (score < minScore) {
      minScore = score;
      closest = entry;
    }
  }

  return closest;
};
