export type Hybrid<T extends object> = T & { source: S };

export function createHybrid<
  T extends object & { source?: never },
  S extends object
>(target: T, source?: S) {
  if (target.source) throw new Error('fabric.js: source is a reserved key');
  return Object.defineProperty(
    new Proxy(target, {
      get(target, p, receiver) {
        const source = Reflect.get(target, 'source', receiver);
        if (p === 'source') {
          return source;
        } else if (!source) {
          return Reflect.get(target, p, receiver);
        } else {
          return Reflect.get(source, p, source);
        }
      },
      ownKeys(target) {
        return [
          ...Reflect.ownKeys(Reflect.get(target, 'source', target) || {}),
          ...Reflect.ownKeys(target),
        ];
      },
    }),
    'source',
    {
      value: source,
      configurable: false,
      enumerable: false,
      writable: true,
    }
  ) as Hybrid<T>;
}
