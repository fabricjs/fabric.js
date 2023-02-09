const SOURCE_KEY = '__source__';

export type Hybrid<T extends object, S extends object> = T & {
  [SOURCE_KEY]: S;
};

export function createHybrid<T extends object, S extends object>(
  target: T,
  source?: S
) {
  return new Proxy(
    Object.defineProperties(target, {
      [SOURCE_KEY]: {
        value: source,
        configurable: false,
        enumerable: false,
        writable: true,
      },
    }),
    {
      get(target, p) {
        const source = Reflect.get(target, SOURCE_KEY);
        if (p === SOURCE_KEY) {
          return source;
        } else if (
          !Reflect.get(target, p) &&
          source &&
          Reflect.has(source, p)
        ) {
          return Reflect.get(source, p);
        } else {
          return Reflect.get(target, p);
        }
      },
      ownKeys(target) {
        const ownKeys = Reflect.ownKeys(target);
        Reflect.ownKeys(Reflect.get(target, SOURCE_KEY) || {}).forEach(
          (key) => !ownKeys.includes(key) && ownKeys.push(key)
        );
        return ownKeys;
      },
      getOwnPropertyDescriptor(target, p) {
        const source = Reflect.get(target, SOURCE_KEY);
        return (
          Reflect.getOwnPropertyDescriptor(target, p) ||
          (source && Reflect.getOwnPropertyDescriptor(source, p))
        );
      },
      has(target, p) {
        const source = Reflect.get(target, SOURCE_KEY);
        return Reflect.has(target, p) || (!!source && Reflect.has(source, p));
      },
    }
  ) as Hybrid<T, S>;
}
