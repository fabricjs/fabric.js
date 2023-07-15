import type { TextStyleDeclaration } from '../../fabric';
import type { GLProbe } from '../filters/GLProbes/GLProbe';
import type { DOMWindow } from 'jsdom';

export type TCopyPasteData = {
  copiedText?: string;
  copiedTextStyle?: TextStyleDeclaration[];
};
export type TFabricEnv = {
  document: Document;
  window: (Window & typeof globalThis) | DOMWindow;
  isTouchSupported: boolean;
  WebGLProbe: GLProbe;
  dispose(element: Element): void;
  copyPasteData: TCopyPasteData;
};
