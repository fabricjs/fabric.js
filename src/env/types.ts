export type TCopyPasteData = {
  copiedText?: string;
  copiedStyle?: Record<string, string>;
};
export type TFabricEnv = {
  document: Document;
  window: Window;
  isTouchSupported: boolean;
  isLikelyNode: boolean;
  dispose(element: Element): void;
  copyPasteData: TCopyPasteData;
};
