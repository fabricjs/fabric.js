//@ts-nocheck
import { noop } from '../constants';

function addMethods(klass, source, parent) {
  for (const property in source) {
    if (
      property in klass.prototype &&
      typeof klass.prototype[property] === 'function' &&
      (source[property] + '').indexOf('callSuper') > -1
    ) {
      klass.prototype[property] = (function (property) {
        return function (...args) {
          const superclass = this.constructor.superclass;
          this.constructor.superclass = parent;
          const returnValue = source[property].call(this, ...args);
          this.constructor.superclass = superclass;

          if (property !== 'initialize') {
            return returnValue;
          }
        };
      })(property);
    } else {
      klass.prototype[property] = source[property];
    }
  }
}

function Subclass() {}

function callSuper(methodName, ...args) {
  let parentMethod = null,
    _this = this;

  // climb prototype chain to find method not equal to callee's method
  while (_this.constructor.superclass) {
    const superClassMethod = _this.constructor.superclass.prototype[methodName];
    if (_this[methodName] !== superClassMethod) {
      parentMethod = superClassMethod;
      break;
    }
    // eslint-disable-next-line
    _this = _this.constructor.superclass.prototype;
  }

  if (!parentMethod) {
    return console.log(
      'tried to callSuper ' +
        methodName +
        ', method not found in prototype chain',
      this
    );
  }

  return parentMethod.call(this, ...args);
}

/**
 * Helper for creation of "classes".
 * @memberOf fabric.util
 * @param {Function} [parent] optional "Class" to inherit from
 * @param {Object} [properties] Properties shared by all instances of this class
 *                  (be careful modifying objects defined here as this would affect all instances)
 */
export function createClass(...args) {
  let parent = null,
    properties = [...args];

  if (typeof args[0] === 'function') {
    parent = properties.shift();
  }
  function klass(...klassArgs) {
    this.initialize.call(this, ...klassArgs);
  }

  klass.superclass = parent;

  if (parent) {
    Subclass.prototype = parent.prototype;
    klass.prototype = new Subclass();
  }
  for (let i = 0, length = properties.length; i < length; i++) {
    addMethods(klass, properties[i], parent);
  }
  if (!klass.prototype.initialize) {
    klass.prototype.initialize = noop;
  }
  klass.prototype.constructor = klass;
  klass.prototype.callSuper = callSuper;
  return klass;
}
