import type { Canvas } from 'fabric';

export type FabricNamespace = typeof import('fabric');

export type renderTestType = {
  size: [number, number];
  percentage: number;
  title: string;
  snapshotSuffix?: string;
  enableGLFiltering?: boolean;
  golden: string;
  only?: boolean;
  disabled?: 'node' | 'browser' | boolean;
  renderFunction: (
    canvas: Canvas,
    fabric: FabricNamespace,
  ) => Promise<void | string>;
};
