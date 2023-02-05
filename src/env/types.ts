import type { Canvas } from 'canvas';
import type { DOMWindow } from 'jsdom';

export type TCopyPasteData = {
  copiedText?: string;
  copiedStyle?: Record<string, string>;
};
export type TFabricEnv = {
  document: Document;
  window: Window | DOMWindow;
  isTouchSupported: boolean;
  isLikelyNode: boolean;
  nodeCanvas?: Canvas;
  jsdomImplForWrapper?: any;
  copyPasteData: TCopyPasteData;
};
