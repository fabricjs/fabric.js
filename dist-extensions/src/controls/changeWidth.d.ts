import type { TransformActionHandler } from '../EventTypeDefs';
/**
 * Action handler to change object's width
 * Needs to be wrapped with `wrapWithFixedAnchor` to be effective
 * @param {Event} eventData javascript event that is doing the transform
 * @param {Object} transform javascript object containing a series of information around the current transform
 * @param {number} x current mouse x position, canvas normalized
 * @param {number} y current mouse y position, canvas normalized
 * @return {Boolean} true if some change happened
 */
export declare const changeObjectWidth: TransformActionHandler;
export declare const changeWidth: TransformActionHandler<import("../EventTypeDefs").Transform>;
//# sourceMappingURL=changeWidth.d.ts.map