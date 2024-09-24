import type { ControlCursorCallback, TPointerEvent, Transform, TransformActionHandler } from '../EventTypeDefs';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { TAxis } from '../typedefs';
type ScaleTransform = Transform & {
    gestureScale?: number;
    signX?: number;
    signY?: number;
};
type ScaleBy = TAxis | 'equally' | '' | undefined;
/**
 * Inspect event and fabricObject properties to understand if the scaling action
 * @param {Event} eventData from the user action
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @return {Boolean} true if scale is proportional
 */
export declare function scaleIsProportional(eventData: TPointerEvent, fabricObject: FabricObject): boolean;
/**
 * Inspect fabricObject to understand if the current scaling action is allowed
 * @param {FabricObject} fabricObject the fabric object about to scale
 * @param {String} by 'x' or 'y' or ''
 * @param {Boolean} scaleProportionally true if we are trying to scale proportionally
 * @return {Boolean} true if scaling is not allowed at current conditions
 */
export declare function scalingIsForbidden(fabricObject: FabricObject, by: ScaleBy, scaleProportionally: boolean): boolean;
/**
 * return the correct cursor style for the scale action
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
export declare const scaleCursorStyleHandler: ControlCursorCallback;
/**
 * Generic scaling logic, to scale from corners either equally or freely.
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export declare const scaleObjectFromCorner: TransformActionHandler<ScaleTransform>;
export declare const scalingEqually: TransformActionHandler<ScaleTransform>;
export declare const scalingX: TransformActionHandler<ScaleTransform>;
export declare const scalingY: TransformActionHandler<ScaleTransform>;
export {};
//# sourceMappingURL=scale.d.ts.map