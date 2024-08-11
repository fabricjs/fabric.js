import type { ModifierKey, TOptionalModifierKey } from '../EventTypeDefs';
import type { TOptions } from '../typedefs';
import type { StaticCanvasOptions } from './StaticCanvasOptions';
export interface CanvasTransformOptions {
    /**
     * When true, objects can be transformed by one side (unproportionately)
     * when dragged on the corners that normally would not do that.
     * @type Boolean
     * @default
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
     * @default
     */
    uniScaleKey: TOptionalModifierKey;
    /**
     * When true, objects use center point as the origin of scale transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredScaling: boolean;
    /**
     * When true, objects use center point as the origin of rotate transformation.
     * <b>Backwards incompatibility note:</b> This property replaces "centerTransform" (Boolean).
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredRotation: boolean;
    /**
     * Indicates which key enable centered Transform
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type ModifierKey
     * @default
     */
    centeredKey: TOptionalModifierKey;
    /**
     * Indicates which key enable alternate action on corner
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled feature disabled.
     * @since 1.6.2
     * @type ModifierKey
     * @default
     */
    altActionKey: TOptionalModifierKey;
}
export interface CanvasSelectionOptions {
    /**
     * Indicates whether group selection should be enabled
     * @type Boolean
     * @default
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
     * @default
     */
    selectionKey: TOptionalModifierKey | ModifierKey[];
    /**
     * Indicates which key enable alternative selection
     * in case of target overlapping with active object
     * values: 'altKey', 'shiftKey', 'ctrlKey'.
     * For a series of reason that come from the general expectations on how
     * things should work, this feature works only for preserveObjectStacking true.
     * If `null` or 'none' or any other string that is not a modifier key
     * feature is disabled.
     * @since 1.6.5
     * @type null|ModifierKey
     * @default
     */
    altSelectionKey: TOptionalModifierKey;
    /**
     * Color of selection
     * @type String
     * @default
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
     * @default
     */
    selectionBorderColor: string;
    /**
     * Width of a line used in object/group selection
     * @type Number
     * @default
     */
    selectionLineWidth: number;
    /**
     * Select only shapes that are fully contained in the dragged selection rectangle.
     * @type Boolean
     * @default
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
     * @default
     */
    perPixelTargetFind: boolean;
    /**
     * Number of pixels around target pixel to tolerate (consider active) during object detection
     * @type Number
     * @default
     */
    targetFindTolerance: number;
    /**
     * When true, target detection is skipped. Target detection will return always undefined.
     * click selection won't work anymore, events will fire with no targets.
     * if something is selected before setting it to true, it will be deselected at the first click.
     * area selection will still work. check the `selection` property too.
     * if you deactivate both, you should look into staticCanvas.
     * @type Boolean
     * @default
     */
    skipTargetFind: boolean;
}
export interface CanvasEventsOptions {
    /**
     * Indicates if the right click on canvas can output the context menu or not
     * @type Boolean
     * @since 1.6.5
     * @default
     */
    stopContextMenu: boolean;
    /**
     * Indicates if the canvas can fire right click events
     * @type Boolean
     * @since 1.6.5
     * @default
     */
    fireRightClick: boolean;
    /**
     * Indicates if the canvas can fire middle click events
     * @type Boolean
     * @since 1.7.8
     * @default
     */
    fireMiddleClick: boolean;
    /**
     * When the option is enabled, PointerEvent is used instead of TPointerEvent.
     * @type Boolean
     * @default
     */
    enablePointerEvents: boolean;
}
export interface CanvasOptions extends StaticCanvasOptions, CanvasTransformOptions, CanvasSelectionOptions, CanvasCursorOptions, TargetFindOptions, CanvasEventsOptions {
    /**
     * Default element class that's given to wrapper (div) element of canvas
     * @type String
     * @default
     * @deprecated customize {@link CanvasDOMManager} instead or access {@link elements} directly
     */
    containerClass: string;
    /**
     * Indicates whether objects should remain in current stack position when selected.
     * When false objects are brought to top and rendered as part of the selection group
     * @type Boolean
     * @default
     */
    preserveObjectStacking: boolean;
}
export type TCanvasOptions = TOptions<CanvasOptions>;
export declare const canvasDefaults: TOptions<CanvasOptions>;
//# sourceMappingURL=CanvasOptions.d.ts.map