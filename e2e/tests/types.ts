import type { Canvas } from '../../fabric';

export type FabricNamespace = typeof import('../../fabric');

export type renderTestType = {
  size: [number, number];
  percentage: number;
  title: string;
  golden: string;
  disabled?: 'node' | 'browser' | boolean;
  renderFunction: (canvas: Canvas, fabric: FabricNamespace) => Promise<void>;
};
