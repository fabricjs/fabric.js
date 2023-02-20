import type { GLProbe } from '../filters/GLProbes/GLProbe';
import type { DOMWindow } from 'jsdom';

export type TFabricEnv = {
  document: Document;
  window: Window | DOMWindow;
  isTouchSupported: boolean;
  WebGLProbe: GLProbe;
  dispose(element: Element): void;
};
