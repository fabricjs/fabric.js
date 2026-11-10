import type { Canvas } from 'fabric';

export type FabricNamespace = typeof import('fabric');

export type RenderCallback = () => void | string | Promise<void | string>;

export type renderTestType = {
  size: [number, number];
  percentage: number;
  title: string;
  snapshotSuffix?: string;
  enableGLFiltering?: boolean;
  golden: string;
  only?: boolean;
  disabled?: 'node' | 'browser' | boolean;
  /** Assert a rendering invariant instead of comparing a cross-renderer golden. */
  assertRendering?: (
    canvas: Canvas,
    fabric: FabricNamespace,
  ) => void | Promise<void>;
  renderFunction: (
    canvas: Canvas,
    fabric: FabricNamespace,
  ) => Promise<void | string>;
};
