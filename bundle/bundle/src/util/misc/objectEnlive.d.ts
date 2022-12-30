import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { TCrossOrigin, TFiller } from '../../typedefs';
export type LoadImageOptions = {
    /**
     * see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     */
    signal?: AbortSignal;
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
export type EnlivenObjectOptions = {
    /**
     * handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
     */
    signal?: AbortSignal;
    /**
     * Method for further parsing of object elements,
     * called after each fabric object created.
     */
    reviver?: (serializedObj: Record<string, any>, instance: FabricObject) => void;
    /**
     * Namespace to get klass "Class" object from
     */
    namespace?: any;
};
/**
 * Creates corresponding fabric instances from their object representations
 * @param {Object[]} objects Objects to enliven
 * @param {EnlivenObjectOptions} [options]
 * @param {object} [options.namespace] Namespace to get klass "Class" object from
 * @param {(serializedObj: object, instance: FabricObject) => any} [options.reviver] Method for further parsing of object elements,
 * called after each fabric object created.
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<FabricObject[]>}
 */
export declare const enlivenObjects: (objects: any[], { signal, reviver }?: EnlivenObjectOptions) => Promise<FabricObject<import("../../EventTypeDefs").ObjectEvents>[]>;
/**
 * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
 * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<Record<string, FabricObject | TFiller | null>>} the input object with enlived values
 */
export declare const enlivenObjectEnlivables: <R = Record<string, FabricObject<import("../../EventTypeDefs").ObjectEvents> | TFiller | null>>(serializedObject: any, { signal }?: {
    signal?: AbortSignal | undefined;
}) => Promise<R>;
//# sourceMappingURL=objectEnlive.d.ts.map