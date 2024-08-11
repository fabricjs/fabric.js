import type { ControlCursorCallback, TransformActionHandler } from '../EventTypeDefs';
/**
 * Find the correct style for the control that is used for rotation.
 * this function is very simple and it just take care of not-allowed or standard cursor
 * @param {Event} eventData the javascript event that is causing the scale
 * @param {Control} control the control that is interested in the action
 * @param {FabricObject} fabricObject the fabric object that is interested in the action
 * @return {String} a valid css string for the cursor
 */
export declare const rotationStyleHandler: ControlCursorCallback;
export declare const rotationWithSnapping: TransformActionHandler<import("../EventTypeDefs").Transform>;
//# sourceMappingURL=rotate.d.ts.map