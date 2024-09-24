import { FabricError } from './util/internals/console.mjs';

/*
 * This Map connects the objects type value with their
 * class implementation. It used from any object to understand which are
 * the classes to enlive when requesting a object.type = 'path' for example.
 * Objects uses it for clipPath, Canvas uses it for everything.
 * This is necessary for generic code to run and enlive instances from serialized representation.
 * You can customize which classes get enlived from SVG parsing using this classRegistry.
 * The Registry start empty and gets filled in depending which files you import.
 * If you want to be able to parse arbitrary SVGs or JSON representation of canvases, coming from
 * different sources you will need to import all fabric because you may need all classes.
 */

const JSON = 'json';
const SVG = 'svg';
class ClassRegistry {
  constructor() {
    this[JSON] = new Map();
    this[SVG] = new Map();
  }
  has(classType) {
    return this[JSON].has(classType);
  }
  getClass(classType) {
    const constructor = this[JSON].get(classType);
    if (!constructor) {
      throw new FabricError("No class registered for ".concat(classType));
    }
    return constructor;
  }
  setClass(classConstructor, classType) {
    if (classType) {
      this[JSON].set(classType, classConstructor);
    } else {
      this[JSON].set(classConstructor.type, classConstructor);
      // legacy
      // @TODO: needs to be removed in fabric 7 or 8
      this[JSON].set(classConstructor.type.toLowerCase(), classConstructor);
    }
  }
  getSVGClass(SVGTagName) {
    return this[SVG].get(SVGTagName);
  }
  setSVGClass(classConstructor, SVGTagName) {
    this[SVG].set(SVGTagName !== null && SVGTagName !== void 0 ? SVGTagName : classConstructor.type.toLowerCase(), classConstructor);
  }
}
const classRegistry = new ClassRegistry();

export { ClassRegistry, JSON, SVG, classRegistry };
//# sourceMappingURL=ClassRegistry.mjs.map
