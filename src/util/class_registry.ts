/*
 * This Map connects the objects type value with their
 * class implementation. It used from any object to understand which are
 * the classes to enlive when requesting a object.type = 'path' for example.
 * Objects uses it for clipPath, Canvas uses it for everything.
 * This is necessary for generic code to run and enlive instances from serialized representation.
 * You can customize which classes get enlived from SVG parsing using this classRegistry.
 * The Registry start empty and gets filled in depending which files you import.
 * If you want to be able to parse arbitrary SVGs or JSON representation of canvases, coming from
 * differnet sources you will need to import all fabric because you may need all classes.
 */

export const JSON = 'json';
export const SVG = 'svg';

export class ClassRegistry {
  [JSON]: Map<string, any>;
  [SVG]: Map<string, any>;

  constructor() {
    this[JSON] = new Map();
    this[SVG] = new Map();
  }

  getClass(classType: string): any {
    const constructor = this[JSON].get(classType);
    if (!constructor) {
      throw new Error(`No class registered for ${classType}`);
    }
    return constructor;
  }

  setClass(classConstructor: any, classType?: string) {
    this[JSON].set(
      classType ?? classConstructor.prototype.type,
      classConstructor
    );
  }

  getSVGClass(SVGTagName: string): any {
    return this[SVG].get(SVGTagName);
  }

  setSVGClass(classConstructor: any, SVGTagName?: string) {
    this[SVG].set(
      SVGTagName ?? classConstructor.prototype.type,
      classConstructor
    );
  }
}

const classRegistry = new ClassRegistry();

export { classRegistry };
