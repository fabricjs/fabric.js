import type { FabricObject } from '../shapes/Object/FabricObject';
import type { TMat2D } from '../typedefs';
type FabricObjectWithTransformMatrix = FabricObject & {
    transformMatrix?: TMat2D;
};
/**
 * This function is an helper for svg import. it removes the transform matrix
 * and set to object properties that fabricjs can handle
 * @private
 * @param {Object} preserveAspectRatioOptions
 */
export declare const removeTransformMatrixForSvgParsing: (object: FabricObjectWithTransformMatrix, preserveAspectRatioOptions?: any) => void;
export {};
//# sourceMappingURL=transform_matrix_removal.d.ts.map