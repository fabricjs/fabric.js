import { GLProbe } from '../filters/GLProbes/GLProbe';
import type { DOMWindow } from 'jsdom';

export type TCopyPasteData = {
  copiedText?: string;
  copiedStyle?: Record<string, string>;
};

export type AbstractCanvasElement = Pick<
  HTMLCanvasElement,
  | 'width'
  | 'height' /*| 'captureStream' | 'toBlob'*/
  | 'toDataURL'
  | 'getContext'
>;

export type AbstractImageElement = Pick<
  HTMLImageElement,
  'width' | 'height' | 'src'
>;

export type TFabricEnv = {
  document: Document;
  window: Window | DOMWindow;
  isTouchSupported: boolean;
  WebGLProbe: GLProbe;
  createCanvasElement(width?: number, height?: number): AbstractCanvasElement;
  createImageElement(): AbstractImageElement;
  copyPasteData: TCopyPasteData;
};
