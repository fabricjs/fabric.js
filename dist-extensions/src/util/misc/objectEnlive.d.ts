import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { Abortable, TCrossOrigin, TFiller } from '../../typedefs';
import type { BaseFilter } from '../../filters/BaseFilter';
import type { FabricObject as BaseFabricObject } from '../../shapes/Object/Object';
import type { Shadow } from '../../Shadow';
export type LoadImageOptions = Abortable & {
    /**
     * cors value for the image loading, default to anonymous
     */
    crossOrigin?: TCrossOrigin;
};
/**
 * Loads image element from given url and resolve it, or catch.
 * @param {String} url URL representing an image
 * @param {LoadImageOptions} [options] image loading options
 * @returns {Promise<HTMLImageElement>} the loaded image.
 */
export declare const loadImage: (url: string, { signal, crossOrigin }?: LoadImageOptions) => Promise<HTMLImageElement>;
export type EnlivenObjectOptions = Abortable & {
    /**
     * Method for further parsing of object elements,
     * called after each fabric object created.
     */
    reviver?: <T extends BaseFabricObject | FabricObject | BaseFilter<string> | Shadow | TFiller>(serializedObj: Record<string, any>, instance: T) => void;
};
/**
 * @TODO type this correctly.
 * Creates corresponding fabric instances from their object representations
 * @param {Object[]} objects Objects to enliven
 * @param {EnlivenObjectOptions} [options]
 * @param {(serializedObj: object, instance: FabricObject) => any} [options.reviver] Method for further parsing of object elements,
 * called after each fabric object created.
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<FabricObject[]>}
 */
export declare const enlivenObjects: <T extends BaseFabricObject | FabricObject | BaseFilter<string> | Shadow | TFiller>(objects: any[], { signal, reviver }?: EnlivenObjectOptions) => Promise<T[]>;
/**
 * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
 * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<Record<string, FabricObject | TFiller | null>>} the input object with enlived values
 */
export declare const enlivenObjectEnlivables: <R = Record<string, FabricObject<Partial<import("../../..").FabricObjectProps>, import("../../..").SerializedObjectProps, import("../../EventTypeDefs").ObjectEvents> | TFiller | null>>(serializedObject: any, { signal }?: Abortable) => Promise<R>;
//# sourceMappingURL=objectEnlive.d.ts.map