const SOURCE_KEY = '__source__';
const MONITOR_KEY = '__monitor__';

export type OnChange<T, K extends keyof T = keyof T> = (
  key: T,
  value: T[K],
  prevValue: T[K],
  /**
   * {@link Reflect} target
   */
  target: T
) => boolean;

export type Hybrid<
  T extends object & {
    onChange?: OnChange<T>;
  },
  S extends object
> = T &
  // S is partial since keys of T might be monitored and deleted
  Partial<S> & {
    [SOURCE_KEY]: S;
  };

export function createHybrid<
  T extends object & {
    /**
     * @returns true if the change is accepted
     */
    onChange?: OnChange<T>;
  },
  S extends object
>(target: T, source?: S): Hybrid<T, S> {
  return new Proxy(
    Object.defineProperties(target, {
      [SOURCE_KEY]: {
        value: source,
        configurable: true,
        enumerable: false,
        writable: true,
      },
      [MONITOR_KEY]: {
        value: Object.keys(target).reduce(
          (monitor, key) => {
            monitor[key] = true;
            return monitor;
          },
          { [SOURCE_KEY]: true, [MONITOR_KEY]: true } as Record<
            string | symbol,
            true
          >
        ),
        configurable: false,
        enumerable: false,
        writable: false,
      },
    }) as T & {
      [SOURCE_KEY]: S;
      [MONITOR_KEY]: Record<string | symbol, true>;
    },
    {
      get(target, p) {
        const source = Reflect.get(target, SOURCE_KEY);
        if (p === SOURCE_KEY) {
          return source;
        } else if (
          !Reflect.has(target, p) &&
          // `p` hasn't been monitored
          !Reflect.get(Reflect.get(target, MONITOR_KEY), p) &&
          source &&
          Reflect.has(source, p)
        ) {
          // get `source` only if `p` was never touched by `target`
          return Reflect.get(source, p);
        } else {
          return Reflect.get(target, p);
        }
      },
      set(target, p, newValue, receiver) {
        const has = Reflect.has(target, p);
        // call with `receiver` to run `get` through this proxy in order to obtain the correct value of target or source
        const prevValue = Reflect.get(target, p, receiver);
        const source = Reflect.get(target, SOURCE_KEY);
        const descriptor =
          Reflect.getOwnPropertyDescriptor(target, p) ||
          Reflect.getOwnPropertyDescriptor(source, p);
        if (
          !has &&
          descriptor &&
          // define `source` descriptor on `target` before setting the new value (or else it becomes frozen)
          !Reflect.defineProperty(target, p, {
            ...descriptor,
            // make sure we use the correct value
            value: prevValue,
          })
        ) {
          // the object is frozen => operation failed
          return false;
        }
        if (Reflect.set(target, p, newValue)) {
          if (
            p === SOURCE_KEY ||
            prevValue === newValue ||
            !target.onChange ||
            // a change occurred => run side effects
            ((!descriptor || descriptor.enumerable) &&
              !target.onChange(p, newValue, prevValue, target) &&
              // change was refused by side effects => revert by resetting/deleting the property if it existed/didn't
              !(has
                ? Reflect.set(target, p, prevValue)
                : Reflect.deleteProperty(target, p)))
          ) {
            // the operation has succeeded
            // monitor `p`
            Reflect.set(Reflect.get(target, MONITOR_KEY), p, true);
          }
          return true;
        }
        return false;
      },
      defineProperty(target, property, attributes) {
        if (Reflect.defineProperty(target, property, attributes)) {
          // monitor `property`
          Reflect.set(Reflect.get(target, MONITOR_KEY), property, true);
          return true;
        }
        return false;
      },
      deleteProperty(target, p) {
        const monitor = Reflect.get(target, MONITOR_KEY);
        const source = Reflect.get(target, SOURCE_KEY);
        const prevTargetValue = Reflect.get(target, p);
        const prevValue = monitor[p]
          ? prevTargetValue
          : source && Reflect.get(source, p);
        const descriptor =
          Reflect.getOwnPropertyDescriptor(target, p) ||
          Reflect.getOwnPropertyDescriptor(source, p);
        if (Reflect.deleteProperty(target, p)) {
          if (
            p === SOURCE_KEY ||
            !prevTargetValue ||
            !target.onChange ||
            // a change occurred => run side effects
            ((!descriptor || descriptor.enumerable) &&
              !target.onChange(p, undefined, prevValue, target) &&
              // change was refused by side effects => revert by redefining the property
              !Reflect.defineProperty(target, p, {
                ...descriptor,
                value: prevValue,
              }))
          ) {
            // the operation has succeeded
            // monitor `p`
            Reflect.set(Reflect.get(target, MONITOR_KEY), p, true);
          }
          return true;
        }
        return false;
      },
      has(target, p) {
        const monitor = Reflect.get(target, MONITOR_KEY);
        const source = Reflect.get(target, SOURCE_KEY);
        return (
          Reflect.has(target, p) ||
          (!!source && Reflect.has(source, p) && !monitor[p])
        );
      },
      ownKeys(target) {
        const monitor = Reflect.get(target, MONITOR_KEY);
        const ownKeys = Reflect.ownKeys(target);
        return [
          ...ownKeys,
          ...Reflect.ownKeys(Reflect.get(target, SOURCE_KEY) || {}).filter(
            (key) => !monitor[key] && !ownKeys.includes(key)
          ),
        ];
      },
      getOwnPropertyDescriptor(target, p) {
        const monitor = Reflect.get(target, MONITOR_KEY);
        const source = Reflect.get(target, SOURCE_KEY);
        return (
          Reflect.getOwnPropertyDescriptor(target, p) ||
          (source &&
            !monitor[p] &&
            Reflect.getOwnPropertyDescriptor(source, p)) ||
          undefined
        );
      },
    }
  );
}
