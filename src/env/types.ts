import { GLProbe } from '../filters/GLProbes/GLProbe';
import type { DOMWindow } from 'jsdom';

export type TCopyPasteData = {
  copiedText?: string;
  copiedStyle?: Record<string, string>;
};
export type TFabricEnv = {
  document: Document;
  window: (Window & typeof globalThis) | DOMWindow;
  isTouchSupported: boolean;
  WebGLProbe: GLProbe;
  dispose(element: Element): void;
  copyPasteData: TCopyPasteData;
};
