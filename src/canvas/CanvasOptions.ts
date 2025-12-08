import type { ModifierKey, TOptionalModifierKey } from '../EventTypeDefs';
import type { TOptions } from '../typedefs';
import type { StaticCanvasOptions } from './StaticCanvasOptions';

export interface CanvasTransformOptions {
  /**
   * When true, objects can be transformed by one side (unproportionately)
   * when dragged on the corners that normally would not do that.
   * @type Boolean
   * @since fabric 4.0 // changed name and default value
   */
  uniformScaling: boolean;

  /**
   * Indicates which key switches uniform scaling.
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled.
   * totally wrong named. this sounds like `uniform scaling`
   * if Canvas.uniformScaling is true, pressing this will set it to false
   * and viceversa.
   * @since 1.6.2
   * @type ModifierKey
   */
  uniScaleKey: TOptionalModifierKey;

  /**
   * When true, objects use center point as the origin of scale transformation.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   */
  centeredScaling: boolean;

  /**
   * When true, objects use center point as the origin of rotate transformation.
   * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
   * @since 1.3.4
   * @type Boolean
   */
  centeredRotation: boolean;

  /**
   * Indicates which key enable centered Transform
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.2
   * @type ModifierKey
   */
  centeredKey: TOptionalModifierKey;

  /**
   * Indicates which key enable alternate action on corner
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled feature disabled.
   * @since 1.6.2
   * @type ModifierKey
   */
  altActionKey: TOptionalModifierKey;
}

export interface CanvasSelectionOptions {
  /**
   * Indicates whether group selection should be enabled
   * @type Boolean
   */
  selection: boolean;

  /**
   * Indicates which key or keys enable multiple click selection
   * Pass value as a string or array of strings
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * If `null` or empty or containing any other string that is not a modifier key
   * feature is disabled.
   * @since 1.6.2
   * @type ModifierKey|ModifierKey[]
   */
  selectionKey: TOptionalModifierKey | ModifierKey[];

  /**
   * Indicates which key enable alternative selection
   * in case of a target overlapping with active object and we don't want to loose the
   * active selection, we can press this modifier key and continue selecting the current
   * selected object also when is covered by another or many valid targets for selection.
   * values: 'altKey', 'shiftKey', 'ctrlKey'.
   * For a series of reason that come from the general expectations on how
   * things should work, this feature works only for preserveObjectStacking true.
   * If `null` or 'none' or any other string that is not a modifier key
   * feature is disabled.
   * @since 1.6.5
   * @type null|ModifierKey
   */
  altSelectionKey: TOptionalModifierKey;

  /**
   * Color of selection
   * @type String
   */
  selectionColor: string;

  /**
   * Default dash array pattern
   * If not empty the selection border is dashed
   * @type Array
   */
  selectionDashArray: number[];

  /**
   * Color of the border of selection (usually slightly darker than color of selection itself)
   * @type String
   */
  selectionBorderColor: string;

  /**
   * Width of a line used in object/group selection
   * @type Number
   */
  selectionLineWidth: number;

  /**
   * Select only shapes that are fully contained in the dragged selection rectangle.
   * @type Boolean
   */
  selectionFullyContained: boolean;
}

export interface CanvasCursorOptions {
  /**
   * Default cursor value used when hovering over an object on canvas
   * @type CSSStyleDeclaration['cursor']
   * @default move
   */
  hoverCursor: CSSStyleDeclaration['cursor'];

  /**
   * Default cursor value used when moving an object on canvas
   * @type CSSStyleDeclaration['cursor']
   * @default move
   */
  moveCursor: CSSStyleDeclaration['cursor'];

  /**
   * Default cursor value used for the entire canvas
   * @type String
   * @default default
   */
  defaultCursor: CSSStyleDeclaration['cursor'];

  /**
   * Cursor value used during free drawing
   * @type String
   * @default crosshair
   */
  freeDrawingCursor: CSSStyleDeclaration['cursor'];

  /**
   * Cursor value used for disabled elements ( corners with disabled action )
   * @type String
   * @since 2.0.0
   * @default not-allowed
   */
  notAllowedCursor: CSSStyleDeclaration['cursor'];
}

export interface TargetFindOptions {
  /**
   * When true, object detection happens on per-pixel basis rather than on per-bounding-box
   * @type Boolean
   */
  perPixelTargetFind: boolean;

  /**
   * Number of pixels around target pixel to tolerate (consider active) during object detection
   * @type Number
   */
  targetFindTolerance: number;

  /**
   * When true, target detection is skipped. Target detection will return always undefined.
   * click selection won't work anymore, events will fire with no targets.
   * if something is selected before setting it to true, it will be deselected at the first click.
   * area selection will still work. check the `selection` property too.
   * if you deactivate both, you should look into staticCanvas.
   * @type Boolean
   */
  skipTargetFind: boolean;
}

export interface CanvasEventsOptions {
  /**
   * Indicates if the right click on canvas can output the context menu or not
   * The default value changed from false to true in Fabric 7.0
   * @see https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/
   * @deprecated since 7.0, Will be removed in Fabric 8.0
   * @type Boolean
   * @since 1.6.5
   */
  stopContextMenu: boolean;

  /**
   * Indicates if the canvas can fire right click events
   * The default value changed from false to true in Fabric 7.0
   * @see https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/
   * @deprecated since 7.0, Will be removed in Fabric 8.0
   * @type Boolean
   * @since 1.6.5
   */
  fireRightClick: boolean;

  /**
   * Indicates if the canvas can fire middle click events
   * The default value changed from false to true in Fabric 7.0
   * @see https://fabricjs.com/docs/upgrading/upgrading-to-fabric-70/
   * @deprecated since 7.0, Will be removed in Fabric 8.0
   * @type Boolean
   * @since 1.7.8
   */
  fireMiddleClick: boolean;

  /**
   * When the option is enabled, PointerEvent is used instead of TPointerEvent.
   * @type Boolean
   */
  enablePointerEvents: boolean;
}

export interface CanvasOptions
  extends StaticCanvasOptions,
    CanvasTransformOptions,
    CanvasSelectionOptions,
    CanvasCursorOptions,
    TargetFindOptions,
    CanvasEventsOptions {
  /**
   * Default element class that's given to wrapper (div) element of canvas
   * @type String
   * @deprecated customize {@link CanvasDOMManager} instead or access {@link elements} directly
   */
  containerClass: string;

  /**
   * Indicates whether objects should remain in current stack position when selected.
   * When false objects are brought to top and rendered as part of the selection group
   * @type Boolean
   * @default true
   */
  preserveObjectStacking: boolean;
}

export type TCanvasOptions = TOptions<CanvasOptions>;

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

  perPixelTargetFind: false,
  targetFindTolerance: 0,
  skipTargetFind: false,

  stopContextMenu: true,
  fireRightClick: true,
  fireMiddleClick: true,
  enablePointerEvents: false,

  containerClass: 'canvas-container',
  preserveObjectStacking: true,
};
