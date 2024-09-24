import { Point } from '../../Point';
import type { FabricObject } from '../../shapes/Object/Object';
import type { TMat2D } from '../../typedefs';
/**
 * given an object and a transform, apply the inverse transform to the object,
 * this is equivalent to remove from that object that transformation, so that
 * added in a space with the removed transform, the object will be the same as before.
 * Removing from an object a transform that scale by 2 is like scaling it by 1/2.
 * Removing from an object a transform that rotate by 30deg is like rotating by 30deg
 * in the opposite direction.
 * This util is used to add objects inside transformed groups or nested groups.
 * @param {FabricObject} object the object you want to transform
 * @param {TMat2D} transform the destination transform
 */
export declare const removeTransformFromObject: (object: FabricObject, transform: TMat2D) => void;
/**
 * given an object and a transform, apply the transform to the object.
 * this is equivalent to change the space where the object is drawn.
 * Adding to an object a transform that scale by 2 is like scaling it by 2.
 * This is used when removing an object from an active selection for example.
 * @param {FabricObject} object the object you want to transform
 * @param {Array} transform the destination transform
 */
export declare const addTransformToObject: (object: FabricObject, transform: TMat2D) => void;
/**
 * discard an object transform state and apply the one from the matrix.
 * @param {FabricObject} object the object you want to transform
 * @param {Array} transform the destination transform
 */
export declare const applyTransformToObject: (object: FabricObject, transform: TMat2D) => void;
/**
 * reset an object transform state to neutral. Top and left are not accounted for
 * @param  {FabricObject} target object to transform
 */
export declare const resetObjectTransform: (target: FabricObject) => void;
/**
 * Extract Object transform values
 * @param  {FabricObject} target object to read from
 * @return {Object} Components of transform
 */
export declare const saveObjectTransform: (target: FabricObject) => {
    scaleX: number;
    scaleY: number;
    skewX: number;
    skewY: number;
    angle: import("../../typedefs").TDegree;
    left: number;
    flipX: boolean;
    flipY: boolean;
    top: number;
};
/**
 * given a width and height, return the size of the bounding box
 * that can contains the box with width/height with applied transform.
 * Use to calculate the boxes around objects for controls.
 * @param {Number} width
 * @param {Number} height
 * @param {TMat2D} t
 * @returns {Point} size
 */
export declare const sizeAfterTransform: (width: number, height: number, t: TMat2D) => Point;
//# sourceMappingURL=objectTransforms.d.ts.map