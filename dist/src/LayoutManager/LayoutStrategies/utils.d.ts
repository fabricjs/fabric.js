import { Point } from '../../Point';
import type { Group } from '../../shapes/Group';
import type { FabricObject } from '../../shapes/Object/FabricObject';
/**
 * @returns 2 points, the tl and br corners of the non rotated bounding box of an object
 * in the {@link group} plane, taking into account objects that {@link group} is their parent
 * but also belong to the active selection.
 */
export declare const getObjectBounds: (destinationGroup: Group, object: FabricObject) => Point[];
//# sourceMappingURL=utils.d.ts.map