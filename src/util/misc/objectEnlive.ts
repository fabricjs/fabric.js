import { fabric } from '../../../HEADER';
import { noop } from '../../constants';
import { registry, TRegistry } from '../../Registry';
import { TCrossOrigin } from '../../typedefs';
import { TObject } from '../../__types__';
import { createImage } from './dom';

type LoadImageOptions = {
  signal?: AbortSignal;
  crossOrigin?: TCrossOrigin;
};

/**
 * Loads image element from given url and resolve it, or catch.
 * @memberOf fabric.util
 * @param {String} url URL representing an image
 * @param {Object} [options] image loading options
 * @param {string} [options.crossOrigin] cors value for the image loading, default to anonymous
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @param {Promise<fabric.Image>} img the loaded image.
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

type EnlivenObjectOptions = {
  signal?: AbortSignal;
  reviver?: (arg: any, arg2: any) => void;
  namespace?: any;
};

/**
 * Creates corresponding fabric instances from their object representations
 * @static
 * @memberOf fabric.util
 * @param {Object[]} objects Objects to enliven
 * @param {object} [options]
 * @param {object} [options.namespace] Namespace to get klass "Class" object from
 * @param {(serializedObj: object, instance: fabric.Object) => any} [options.reviver] Method for further parsing of object elements,
 * called after each fabric object created.
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<fabric.Object[]>}
 */
export const enlivenObjects = (
  objects: TObject[],
  { signal, reviver = noop, namespace = fabric }: EnlivenObjectOptions = {}
) =>
  new Promise<TObject[]>((resolve, reject) => {
    const instances: TObject[] = [];
    signal && signal.addEventListener('abort', reject, { once: true });
    Promise.all(
      objects.map(async (obj) => {
        const handler = registry.assertJSONHandler(obj);
        const fabricInstance = (await handler(obj, {
          signal,
          reviver,
          namespace,
        })) as TObject;
        reviver(obj, fabricInstance);
        instances.push(fabricInstance);
        return fabricInstance;
      })
    )
      .then(resolve)
      .catch((error) => {
        // cleanup
        instances.forEach(function (instance) {
          instance.dispose && instance.dispose();
        });
        reject(error);
      })
      .finally(() => {
        signal && signal.removeEventListener('abort', reject);
      });
  });

/**
 * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
 * @static
 * @memberOf fabric.util
 * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<{[key:string]:fabric.Object|fabric.Pattern|fabric.Gradient|null}>} the input object with enlived values
 */
export const enlivenObjectEnlivables = <
  D extends Record<string, Record<string, unknown>>,
  T extends FunctionConstructor & { dispose?(): unknown },
  R extends Record<keyof D, T>
>(
  serializedObject: D,
  { signal }: { signal?: AbortSignal } = {}
) =>
  new Promise<R>((resolve, reject) => {
    const instances: T[] = [];
    signal && signal.addEventListener('abort', reject, { once: true });
    const promises = Object.values(serializedObject).map(async (value) => {
      const { handler } =
        (!!value &&
          typeof value === 'object' &&
          registry.getJSONHandler(value)) ||
        {};
      if (!handler) {
        return;
      }
      const instance = (await handler(value, { signal })) as T;
      instances.push(instance);
      return instance;
    });
    const keys = Object.keys(serializedObject) as (keyof D)[];
    Promise.all(promises)
      .then((enlived) => {
        return enlived.reduce((acc, instance, index) => {
          // @ts-expect-error can't get it to work
          instance && (acc[keys[index]] = instance);
          return acc;
        }, {} as R);
      })
      .then(resolve)
      .catch((error) => {
        // cleanup
        instances.forEach((instance) => {
          instance.dispose && instance.dispose();
        });
        reject(error);
      })
      .finally(() => {
        signal && signal.removeEventListener('abort', reject);
      });
  });
