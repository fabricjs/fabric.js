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

import type { ParsedViewboxTransform } from './parser/applyViewboxTransform';
import type { CSSRules } from './parser/typedefs';
import type { Constructor } from './typedefs';
import type { LoadImageOptions } from './util';

export const JSON = 'json';
export const SVG = 'svg';

type ConstructorWithType<T extends object> = Constructor<T> & {
  type: string;
};

export type TJSONResolver<T extends object = any> = ConstructorWithType<T> & {
  fromObject(data: unknown, options?: unknown): T | Promise<T>;
};

export type TSVGResolver<T extends object = any> = ConstructorWithType<T> & {
  fromElement(
    element: Element,
    options: LoadImageOptions & ParsedViewboxTransform & Record<string, any>,
    cssRules?: CSSRules
  ): T | null | Promise<T | null>;
};

type ResolverReturnValue<T extends object, S = true> = S extends true
  ? T
  : T | undefined;

export class ClassRegistry {
  declare [JSON]: Map<string, TJSONResolver>;
  declare [SVG]: Map<string, TSVGResolver>;

  constructor() {
    this[JSON] = new Map();
    this[SVG] = new Map();
  }

  getClass<T extends object>(
    classType: string,
    strict?: true
  ): ResolverReturnValue<TJSONResolver<T>>;
  getClass<T extends object>(
    classType: string,
    strict: false
  ): ResolverReturnValue<TJSONResolver<T>, false>;
  getClass<T extends object>(
    data: Record<string, any>,
    strict?: true
  ): ResolverReturnValue<TJSONResolver<T>>;
  getClass<T extends object>(
    data: Record<string, any>,
    strict: false
  ): ResolverReturnValue<TJSONResolver<T>, false>;
  getClass<T extends object, S extends boolean = true>(
    arg0: string | Record<string, any>,
    strict: S = true as S
  ): ResolverReturnValue<TJSONResolver<T>, S> {
    if (typeof arg0 === 'object' && arg0.colorStops) {
      // TODO: remove this backward compat condition once Gradient aligns its type
      arg0 = 'gradient';
    }
    if (
      typeof arg0 === 'object' &&
      ('blur' in arg0 || 'offsetX' in arg0 || 'offsetY' in arg0)
    ) {
      // TODO: remove this backward compat condition in v7
      arg0 = 'shadow';
    }
    const constructor = this[JSON].get(
      typeof arg0 === 'string' ? arg0 : arg0.type
    );
    if (!constructor && strict) {
      throw new Error(`No class registered for ${arg0}`);
    }
    return constructor as ResolverReturnValue<TJSONResolver<T>, S>;
  }

  setClass<T extends object>(
    classConstructor: ConstructorWithType<T>,
    classType?: string
  ) {
    if (classType) {
      this[JSON].set(classType, classConstructor as TJSONResolver<T>);
    } else {
      this[JSON].set(
        classConstructor.type,
        classConstructor as TJSONResolver<T>
      );
      // legacy
      // @TODO: needs to be removed in fabric 7 or 8
      this[JSON].set(
        classConstructor.type.toLowerCase(),
        classConstructor as TJSONResolver<T>
      );
    }
  }

  getSVGClass<T extends object, S extends boolean = true>(
    SVGTagName: string,
    strict: S = true as S
  ): ResolverReturnValue<TSVGResolver<T>, S> {
    const constructor = this[SVG].get(SVGTagName);
    if (!constructor && strict) {
      throw new Error(`No class registered for SVG tag ${SVGTagName}`);
    }
    return constructor as ResolverReturnValue<TSVGResolver<T>, S>;
  }

  setSVGClass<T extends object>(
    classConstructor: ConstructorWithType<T>,
    SVGTagName?: string
  ) {
    this[SVG].set(
      SVGTagName ?? classConstructor.type.toLowerCase(),
      classConstructor as TSVGResolver<T>
    );
  }
}

export const classRegistry = new ClassRegistry();
