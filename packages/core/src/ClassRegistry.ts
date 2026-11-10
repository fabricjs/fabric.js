import { FabricError } from './util/internals/console';

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

export const JSON = 'json';
export const SVG = 'svg';

export class ClassRegistry {
  declare [JSON]: Map<string, any>;
  declare [SVG]: Map<string, any>;

  constructor() {
    this[JSON] = new Map();
    this[SVG] = new Map();
  }

  has(classType: string): boolean {
    return this[JSON].has(classType);
  }

  getClass<T>(classType: string): T {
    const constructor = this[JSON].get(classType);
    if (!constructor) {
      throw new FabricError(`No class registered for ${classType}`);
    }
    return constructor;
  }

  setClass(classConstructor: any, classType?: string) {
    if (classType) {
      this[JSON].set(classType, classConstructor);
    } else {
      this[JSON].set(classConstructor.type, classConstructor);
      // legacy
      // @TODO: needs to be removed in fabric 7 or 8
      this[JSON].set(classConstructor.type.toLowerCase(), classConstructor);
    }
  }

  getSVGClass(SVGTagName: string): any {
    return this[SVG].get(SVGTagName);
  }

  setSVGClass(classConstructor: any, SVGTagName?: string) {
    this[SVG].set(
      SVGTagName ?? classConstructor.type.toLowerCase(),
      classConstructor,
    );
  }
}

export const classRegistry = new ClassRegistry();
