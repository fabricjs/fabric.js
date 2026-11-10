import type { GLProbe } from '../filters/GLProbes/GLProbe';
import type { TextStyleDeclaration } from '../shapes/Text/StyledText';

export type TCopyPasteData = {
  copiedText?: string;
  copiedTextStyle?: TextStyleDeclaration[];
};

export type TFabricWindow = Window & typeof globalThis;

export type TFabricEnv = {
  readonly document: Document;
  readonly window: TFabricWindow;
  readonly isTouchSupported: boolean;
  WebGLProbe: GLProbe;
  dispose(element: Element): void;
  copyPasteData: TCopyPasteData;
};
