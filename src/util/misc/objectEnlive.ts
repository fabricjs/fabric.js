import { noop } from '../../constants';
import type { Pattern } from '../../Pattern';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { Abortable, TCrossOrigin, TFiller } from '../../typedefs';
import { createImage } from './dom';
import { classRegistry } from '../../ClassRegistry';
import type { BaseFilter } from '../../filters/BaseFilter';
import type { FabricObject as BaseFabricObject } from '../../shapes/Object/Object';

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
export const loadImage = (
  url: string,
  { signal, crossOrigin = null }: LoadImageOptions = {}
) =>
  new Promise<HTMLImageElement>(function (resolve, reject) {
    if (signal && signal.aborted) {
      return reject(new Error('`options.signal` is in `aborted` state'));
    }
    const img = createImage();
    let abort: EventListenerOrEventListenerObject;
    if (signal) {
      abort = function (err: Event) {
        img.src = '';
        reject(err);
      };
      signal.addEventListener('abort', abort, { once: true });
    }
    const done = function () {
      img.onload = img.onerror = null;
      abort && signal?.removeEventListener('abort', abort);
      resolve(img);
    };
    if (!url) {
      done();
      return;
    }
    img.onload = done;
    img.onerror = function () {
      abort && signal?.removeEventListener('abort', abort);
      reject(new Error('Error loading ' + img.src));
    };
    crossOrigin && (img.crossOrigin = crossOrigin);
    img.src = url;
  });

export type EnlivenObjectOptions = Abortable & {
  /**
   * Method for further parsing of object elements,
   * called after each fabric object created.
   */
  reviver?: <T extends BaseFabricObject | FabricObject | BaseFilter>(
    serializedObj: Record<string, any>,
    instance: T
  ) => void;
};

/**
 * Creates corresponding fabric instances from their object representations
 * @param {Object[]} objects Objects to enliven
 * @param {EnlivenObjectOptions} [options]
 * @param {(serializedObj: object, instance: FabricObject) => any} [options.reviver] Method for further parsing of object elements,
 * called after each fabric object created.
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<FabricObject[]>}
 */
export const enlivenObjects = <
  T extends BaseFabricObject | FabricObject | BaseFilter
>(
  objects: any[],
  { signal, reviver = noop }: EnlivenObjectOptions = {}
) =>
  new Promise<T[]>((resolve, reject) => {
    const instances: T[] = [];
    signal && signal.addEventListener('abort', reject, { once: true });
    Promise.all(
      objects.map((obj) =>
        classRegistry
          .getClass(obj.type)
          .fromObject(obj, {
            signal,
            reviver,
          })
          .then((fabricInstance: T) => {
            reviver<T>(obj, fabricInstance);
            instances.push(fabricInstance);
            return fabricInstance;
          })
      )
    )
      .then(resolve)
      .catch((error) => {
        // cleanup
        instances.forEach((instance) => {
          (instance as FabricObject).dispose &&
            (instance as FabricObject).dispose();
        });
        reject(error);
      })
      .finally(() => {
        signal && signal.removeEventListener('abort', reject);
      });
  });

/**
 * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
 * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<Record<string, FabricObject | TFiller | null>>} the input object with enlived values
 */
export const enlivenObjectEnlivables = <
  R = Record<string, FabricObject | TFiller | null>
>(
  serializedObject: any,
  { signal }: Abortable = {}
) =>
  new Promise<R>((resolve, reject) => {
    const instances: (FabricObject | TFiller)[] = [];
    signal && signal.addEventListener('abort', reject, { once: true });
    // enlive every possible property
    const promises = Object.values(serializedObject).map((value: any) => {
      if (!value) {
        return value;
      }
      // gradient
      if (value.colorStops) {
        return new (classRegistry.getClass('gradient'))(value);
      }
      // clipPath
      if (value.type) {
        return enlivenObjects<FabricObject>([value], { signal }).then(
          ([enlived]) => {
            instances.push(enlived);
            return enlived;
          }
        );
      }
      // pattern
      if (value.source) {
        return classRegistry
          .getClass('pattern')
          .fromObject(value, { signal })
          .then((pattern: Pattern) => {
            instances.push(pattern);
            return pattern;
          });
      }
      return value;
    });
    const keys = Object.keys(serializedObject);
    Promise.all(promises)
      .then((enlived) => {
        return enlived.reduce((acc, instance, index) => {
          acc[keys[index]] = instance;
          return acc;
        }, {});
      })
      .then(resolve)
      .catch((error) => {
        // cleanup
        instances.forEach((instance: any) => {
          instance.dispose && instance.dispose();
        });
        reject(error);
      })
      .finally(() => {
        signal && signal.removeEventListener('abort', reject);
      });
  });
