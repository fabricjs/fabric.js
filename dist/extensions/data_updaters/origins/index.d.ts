import { type FabricObject, type TOriginX, type TOriginY } from 'fabric';
/**
 * Updates the fromObject function of a class to return a version that can restore old data
 * with values of originX and originY that are different from 'center', 'center'
 * Used to upgrade from fabric 6 to fabric 7
 * @param originalFn the original fromObject function of an object,
 * @param defaultOriginX optional default value for non exported originX,
 * @param defaultOriginY optional default value for non exported originY,
 * @returns a wrapped fromObject function for the object
 */
export declare const originUpdaterWrapper: <T extends FabricObject = FabricObject<Partial<import("fabric").FabricObjectProps>, import("fabric").SerializedObjectProps, import("fabric").ObjectEvents>>(originalFn: (...args: any[]) => Promise<T>, defaultOriginX?: TOriginX, defaultOriginY?: TOriginY) => ((...args: any[]) => Promise<T>);
/**
 * Wraps and override the current fabricJS fromObject static functions
 * Used to upgrade from fabric 6 to fabric 7
 * @param defaultOriginX optional default value for non exported originX,
 * @param defaultOriginY optional default value for non exported originY,
 * @returns a wrapped fromObject function for the object
 */
export declare const installOriginWrapperUpdater: (originX?: TOriginX, originY?: TOriginY) => void;
//# sourceMappingURL=index.d.ts.map