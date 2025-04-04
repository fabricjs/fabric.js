import type { Constructor } from '../typedefs';

/***
 * https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
 */
export function applyMixins<T extends Constructor, S extends Constructor>(
  derivedCtor: T,
  constructors: S[],
) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      name !== 'constructor' &&
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null),
        );
    });
  });
  return derivedCtor as T & { prototype: InstanceType<T & S> };
}
