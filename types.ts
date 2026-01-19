
export type BeadBrand = 'Original' | 'Mard' | 'Coco' | 'Manman' | 'Panpan' | 'Mixiaowo';
export type BeadSize = '2.6mm' | '5mm';

export interface BeadColor {
  hex: string;
  count: number;
  id: string; // The color ID
  name?: string;
  brand: BeadBrand;
}

export interface PatternConfig {
  pixelWidth: number;
  gridOpacity: number;
  gridColor: string;
  beadShape: 'square' | 'circle';
  brightness: number;
  contrast: number;
  saturation: number;
  posterizeLevels: number; // 0 (disabled) or 2-20
  selectedBrand: BeadBrand;
  showLabels: boolean;
  beadSize: BeadSize;
  exportDpi: 72 | 300;
  colorLimit: number; // 0 for no limit, or 16, 32, 64, 128
  isMirrored: boolean; 
  ditheringEnabled: boolean; // New: Toggle for error diffusion
}

export interface ProcessingState {
  isProcessing: boolean;
  status: string;
}
