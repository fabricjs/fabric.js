const SOURCE_KEY = '__source__';

export type Hybrid<T extends object, S extends object> = T & {
  getSource(): S | undefined;
  setSource(source: S): void;
};

export function createHybrid<T extends object, S extends object>(
  target: T,
  source?: S
) {
  return Object.defineProperties(
    new Proxy(target, {
      get(target, p, receiver) {
        const source = Reflect.get(target, SOURCE_KEY, receiver);
        if (p === SOURCE_KEY) {
          return source;
        } else if (!source) {
          return Reflect.get(target, p, receiver);
        } else {
          return Reflect.get(source, p, source);
        }
      },
      ownKeys(target) {
        return [
          ...Reflect.ownKeys(Reflect.get(target, SOURCE_KEY, target) || {}),
          ...Reflect.ownKeys(target),
        ];
      },
    }),
    {
      [SOURCE_KEY]: {
        value: source,
        configurable: false,
        enumerable: false,
        writable: true,
      },
      getSource: {
        value() {
          return this[SOURCE_KEY];
        },
        configurable: false,
        enumerable: false,
        writable: false,
      },
      setSource: {
        value(value: S) {
          this[SOURCE_KEY] = value;
        },
        configurable: false,
        enumerable: false,
        writable: false,
      },
    }
  ) as Hybrid<T, S>;
}
