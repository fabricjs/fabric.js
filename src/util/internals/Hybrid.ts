const SOURCE_KEY = '__source__';

export type OnChange<T, K extends keyof T = keyof T> = (
  key: T,
  value: T[K],
  prevValue: T[K]
) => boolean;

export type Hybrid<
  T extends object & {
    onChange?: OnChange<T>;
  },
  S extends object
> = T & {
  [SOURCE_KEY]: S;
};

export function createHybrid<
  T extends object & {
    onChange?: OnChange<T>;
  },
  S extends object
>(target: T, source?: S) {
  return new Proxy(
    Object.defineProperties(target, {
      [SOURCE_KEY]: {
        value: source,
        configurable: true,
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
      set(target, p, newValue, receiver) {
        const has = Reflect.has(target, p);
        const prevValue = Reflect.get(target, p, receiver);
        if (Reflect.set(target, p, newValue, receiver)) {
          if (
            p === SOURCE_KEY ||
            !Object.getOwnPropertyDescriptor(target, p)?.enumerable ||
            prevValue === newValue ||
            !target.onChange
          ) {
            return true;
          } else {
            return (
              // run side effects
              target.onChange(p, newValue, prevValue) ||
              // change was refused so we revert
              (has
                ? Reflect.set(target, p, prevValue, receiver)
                : Reflect.deleteProperty(target, p))
            );
          }
        }
        return false;
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
