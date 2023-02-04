import type { Canvas } from 'canvas';

export type TCopyPasteData = {
  copiedText?: string;
  copiedStyle?: Record<string, string>;
};
export type TFabricEnv = {
  document: Document;
  window: Window;
  isTouchSupported: boolean;
  isLikelyNode: boolean;
  nodeCanvas?: Canvas;
  jsdomImplForWrapper?: any;
  copyPasteData: TCopyPasteData;
};
