import { GLProbe } from '../filters/GLProbes/GLProbe';

export type TCopyPasteData = {
  copiedText?: string;
  copiedStyle?: Record<string, string>;
};
export type TFabricEnv = {
  document: Document;
  window: Window;
  isTouchSupported: boolean;
  GLProbe: GLProbe;
  dispose(element: Element): void;
  copyPasteData: TCopyPasteData;
};
