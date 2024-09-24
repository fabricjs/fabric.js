import { noop } from '../../constants.mjs';
import { createImage } from './dom.mjs';
import { classRegistry } from '../../ClassRegistry.mjs';
import { SignalAbortedError, FabricError } from '../internals/console.mjs';

/**
 * Loads image element from given url and resolve it, or catch.
 * @param {String} url URL representing an image
 * @param {LoadImageOptions} [options] image loading options
 * @returns {Promise<HTMLImageElement>} the loaded image.
 */
const loadImage = function (url) {
  let {
    signal,
    crossOrigin = null
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    if (signal && signal.aborted) {
      return reject(new SignalAbortedError('loadImage'));
    }
    const img = createImage();
    let abort;
    if (signal) {
      abort = function (err) {
        img.src = '';
        reject(err);
      };
      signal.addEventListener('abort', abort, {
        once: true
      });
    }
    const done = function () {
      img.onload = img.onerror = null;
      abort && (signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort));
      resolve(img);
    };
    if (!url) {
      done();
      return;
    }
    img.onload = done;
    img.onerror = function () {
      abort && (signal === null || signal === void 0 ? void 0 : signal.removeEventListener('abort', abort));
      reject(new FabricError("Error loading ".concat(img.src)));
    };
    crossOrigin && (img.crossOrigin = crossOrigin);
    img.src = url;
  });
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
const enlivenObjects = function (objects) {
  let {
    signal,
    reviver = noop
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise((resolve, reject) => {
    const instances = [];
    signal && signal.addEventListener('abort', reject, {
      once: true
    });
    Promise.all(objects.map(obj => classRegistry.getClass(obj.type).fromObject(obj, {
      signal
    }).then(fabricInstance => {
      reviver(obj, fabricInstance);
      instances.push(fabricInstance);
      return fabricInstance;
    }))).then(resolve).catch(error => {
      // cleanup
      instances.forEach(instance => {
        instance.dispose && instance.dispose();
      });
      reject(error);
    }).finally(() => {
      signal && signal.removeEventListener('abort', reject);
    });
  });
};

/**
 * Creates corresponding fabric instances residing in an object, e.g. `clipPath`
 * @param {Object} object with properties to enlive ( fill, stroke, clipPath, path )
 * @param {object} [options]
 * @param {AbortSignal} [options.signal] handle aborting, see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
 * @returns {Promise<Record<string, FabricObject | TFiller | null>>} the input object with enlived values
 */
const enlivenObjectEnlivables = function (serializedObject) {
  let {
    signal
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise((resolve, reject) => {
    const instances = [];
    signal && signal.addEventListener('abort', reject, {
      once: true
    });
    // enlive every possible property
    const promises = Object.values(serializedObject).map(value => {
      if (!value) {
        return value;
      }
      /**
       * clipPath or shadow or gradient or text on a path or a pattern,
       * or the backgroundImage or overlayImage of canvas
       * If we have a type and there is a classe registered for it, we enlive it.
       * If there is no class registered for it we return the value as is
       * */
      if (value.type && classRegistry.has(value.type)) {
        return enlivenObjects([value], {
          signal
        }).then(_ref => {
          let [enlived] = _ref;
          instances.push(enlived);
          return enlived;
        });
      }
      return value;
    });
    const keys = Object.keys(serializedObject);
    Promise.all(promises).then(enlived => {
      return enlived.reduce((acc, instance, index) => {
        acc[keys[index]] = instance;
        return acc;
      }, {});
    }).then(resolve).catch(error => {
      // cleanup
      instances.forEach(instance => {
        instance.dispose && instance.dispose();
      });
      reject(error);
    }).finally(() => {
      signal && signal.removeEventListener('abort', reject);
    });
  });
};

export { enlivenObjectEnlivables, enlivenObjects, loadImage };
//# sourceMappingURL=objectEnlive.mjs.map
