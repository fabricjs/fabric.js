import type { TPointerEvent, Transform, TransformAction, BasicTransformEvent } from '../EventTypeDefs';
import { Point } from '../Point';
import type { FabricObject } from '../shapes/Object/FabricObject';
import type { TOriginX, TOriginY } from '../typedefs';
import type { Control } from './Control';
export declare const NOT_ALLOWED_CURSOR = "not-allowed";
/**
 * @param {Boolean} alreadySelected true if target is already selected
 * @param {String} corner a string representing the corner ml, mr, tl ...
 * @param {Event} e Event object
 * @param {FabricObject} [target] inserted back to help overriding. Unused
 */
export declare const getActionFromCorner: (alreadySelected: boolean, corner: string | undefined, e: TPointerEvent, target: FabricObject) => string;
/**
 * Checks if transform is centered
 * @param {Object} transform transform data
 * @return {Boolean} true if transform is centered
 */
export declare function isTransformCentered(transform: Transform): boolean;
export declare function invertOrigin(origin: TOriginX | TOriginY): number;
export declare const isLocked: (target: FabricObject, lockingKey: "lockMovementX" | "lockMovementY" | "lockRotation" | "lockScalingX" | "lockScalingY" | "lockSkewingX" | "lockSkewingY" | "lockScalingFlip") => boolean;
export declare const commonEventInfo: TransformAction<Transform, BasicTransformEvent>;
/**
 * Combine control position and object angle to find the control direction compared
 * to the object center.
 * @param {FabricObject} fabricObject the fabric object for which we are rendering controls
 * @param {Control} control the control class
 * @return {Number} 0 - 7 a quadrant number
 */
export declare function findCornerQuadrant(fabricObject: FabricObject, control: Control): number;
/**
 * Transforms a point to the offset from the given origin
 * @param {Object} transform
 * @param {String} originX
 * @param {String} originY
 * @param {number} x
 * @param {number} y
 * @return {Fabric.Point} the normalized point
 */
export declare function getLocalPoint({ target, corner }: Transform, originX: TOriginX, originY: TOriginY, x: number, y: number): Point;
//# sourceMappingURL=util.d.ts.map