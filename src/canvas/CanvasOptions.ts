import type { ModifierKey, TOptionalModifierKey } from '../EventTypeDefs';
import type { TColorArg } from '../color/typedefs';
import type { TOptions } from '../typedefs';
import type { StaticCanvasOptions } from './StaticCanvasOptions';

export interface CanvasOptions extends StaticCanvasOptions {
  uniformScaling: boolean;
  uniScaleKey: TOptionalModifierKey;
  centeredScaling: boolean;
  centeredRotation: boolean;
  centeredKey: TOptionalModifierKey;
  altActionKey: TOptionalModifierKey;
  selection: boolean;
  selectionKey: TOptionalModifierKey | ModifierKey[];
  selectionColor: TColorArg;
  selectionDashArray: number[];
  selectionBorderColor: TColorArg;
  selectionLineWidth: number;
  selectionFullyContained: boolean;
  hoverCursor: CSSStyleDeclaration['cursor'];
  moveCursor: CSSStyleDeclaration['cursor'];
  defaultCursor: CSSStyleDeclaration['cursor'];
  freeDrawingCursor: CSSStyleDeclaration['cursor'];
  notAllowedCursor: CSSStyleDeclaration['cursor'];
  containerClass: string;
  perPixelTargetFind: boolean;
  targetFindTolerance: number;
  skipTargetFind: boolean;
  preserveObjectStacking: boolean;
  stopContextMenu: boolean;
  fireRightClick: boolean;
  fireMiddleClick: boolean;
  enablePointerEvents: boolean;
}

export const canvasDefaults: TOptions<CanvasOptions> = {
  uniformScaling: true,
  uniScaleKey: 'shiftKey',
  centeredScaling: false,
  centeredRotation: false,
  centeredKey: 'altKey',
  altActionKey: 'shiftKey',
  selection: true,
  selectionKey: 'shiftKey',
  selectionColor: 'rgba(100, 100, 255, 0.3)',
  selectionDashArray: [],
  selectionBorderColor: 'rgba(255, 255, 255, 0.3)',
  selectionLineWidth: 1,
  selectionFullyContained: false,
  hoverCursor: 'move',
  moveCursor: 'move',
  defaultCursor: 'default',
  freeDrawingCursor: 'crosshair',
  notAllowedCursor: 'not-allowed',
  containerClass: 'canvas-container',
  perPixelTargetFind: false,
  targetFindTolerance: 0,
  skipTargetFind: false,
  preserveObjectStacking: false,
  stopContextMenu: false,
  fireRightClick: false,
  fireMiddleClick: false,
  enablePointerEvents: false,
};
