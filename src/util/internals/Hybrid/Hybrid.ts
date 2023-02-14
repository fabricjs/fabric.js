import { THybrid, HybridProtected, Hybrid } from './types';
import { TARGETS_KEY, MONITOR_KEY, SOURCE_KEY } from './constants';
import { disconnectSource, connectSource, bubbleChange } from './bubbling';

export function createHybrid<T extends THybrid<T>, S extends object>(
  target: T,
  source?: S,
  keyOrder: 'target-source' | 'source-target' = 'source-target'
): Hybrid<T, S> {
  return Object.defineProperties(
    new Proxy(target as HybridProtected<T, S>, {
      get(target, p) {
        const source = Reflect.get(target, SOURCE_KEY);
        if (p === SOURCE_KEY) {
          return source;
        } else if (p === TARGETS_KEY || p === MONITOR_KEY) {
          return Reflect.get(target, p);
        }
        const context =
          !Reflect.has(target, p) &&
          // `p` hasn't been monitored
          !Reflect.get(Reflect.get(target, MONITOR_KEY), p) &&
          source &&
          Reflect.has(source, p)
            ? // get `source` only if `p` was never touched by `target`
              source
            : target;
        const value = Reflect.get(context, p);
        return target.transformValue &&
          (
            Reflect.getOwnPropertyDescriptor(target, p) ||
            Reflect.getOwnPropertyDescriptor(source, p)
          )?.enumerable
          ? target.transformValue(
              {
                operation: 'get',
                key: p,
                value,
                isDefault: context === source,
              },
              target
            )
          : value;
      },
      defineProperty(target, property, attributes) {
        if (Reflect.defineProperty(target, property, attributes)) {
          if (property === SOURCE_KEY) {
            connectSource(target, attributes.value);
          } else if (attributes.enumerable) {
            // monitor `property`
            Reflect.set(Reflect.get(target, MONITOR_KEY), property, true);
          }
          return true;
        }
        return false;
      },
      set(target, p, newValue) {
        const has = Reflect.has(target, p);
        const monitor = Reflect.get(target, MONITOR_KEY);
        const source = Reflect.get(target, SOURCE_KEY);
        const prevValue = monitor[p]
          ? Reflect.get(target, p)
          : source && Reflect.get(source, p);
        const descriptor =
          Reflect.getOwnPropertyDescriptor(target, p) ||
          Reflect.getOwnPropertyDescriptor(source, p);

        if (target.transformValue) {
          newValue = target.transformValue(
            {
              operation: 'set',
              key: p,
              newValue,
              value: prevValue,
              isDefault: monitor[p],
            },
            target
          );
        }

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
          if (p === SOURCE_KEY) {
            disconnectSource(target, source);
            connectSource(target, newValue);
          } else if (
            prevValue === newValue ||
            !target.onChange ||
            // a change occurred => run side effects
            ((!descriptor || descriptor.enumerable) &&
              (target.onChange(
                { key: p, value: newValue, prevValue },
                target
              ) ||
                // change was refused by side effects => revert by resetting/deleting the property if it existed/didn't
                !(has
                  ? Reflect.set(target, p, prevValue)
                  : Reflect.deleteProperty(target, p))))
          ) {
            // the operation has succeeded
            // monitor `p`
            Reflect.set(Reflect.get(target, MONITOR_KEY), p, true);
            bubbleChange(
              { key: p, value: newValue, prevValue },
              target,
              descriptor
            );
          }
          return true;
        }
        return false;
      },
      deleteProperty(target, p) {
        const monitor = Reflect.get(target, MONITOR_KEY);
        const source = Reflect.get(target, SOURCE_KEY);
        const prevValue = monitor[p]
          ? Reflect.get(target, p)
          : source && Reflect.get(source, p);
        const descriptor =
          Reflect.getOwnPropertyDescriptor(target, p) ||
          Reflect.getOwnPropertyDescriptor(source, p);

        if (Reflect.deleteProperty(target, p)) {
          if (p === SOURCE_KEY) {
            disconnectSource(target, source);
          } else if (
            !prevValue ||
            !target.onChange ||
            // a change occurred => run side effects
            ((!descriptor || descriptor.enumerable) &&
              (target.onChange(
                { key: p, value: undefined, prevValue },
                target
              ) ||
                // change was refused by side effects => revert by redefining the property
                !Reflect.defineProperty(target, p, {
                  ...descriptor,
                  value: prevValue,
                })))
          ) {
            // the operation has succeeded
            // monitor `p`
            Reflect.set(Reflect.get(target, MONITOR_KEY), p, true);
            bubbleChange(
              { key: p, value: undefined, prevValue },
              target,
              descriptor
            );
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
        const targetKeys = Reflect.ownKeys(target);
        const uniqSourceKeys = Reflect.ownKeys(
          Reflect.get(target, SOURCE_KEY) || {}
        ).filter((key) => !monitor[key] && !targetKeys.includes(key));
        return keyOrder === 'target-source'
          ? [...targetKeys, ...uniqSourceKeys]
          : [...uniqSourceKeys, ...targetKeys];
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
    }),
    {
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
            boolean
          >
        ),
        configurable: false,
        enumerable: false,
        writable: false,
      },
      restoreDefault: {
        value(key: string) {
          if (
            key === SOURCE_KEY ||
            key === MONITOR_KEY ||
            !this[MONITOR_KEY][key]
          ) {
            return false;
          }
          const value = this[key];
          const srcValue = this[SOURCE_KEY][key];
          // set `target[key]` to `srcValue` in order to fire a correct `onChange`
          const changed =
            Reflect.set(this, key, srcValue) && srcValue !== value;
          // stop monitoring `key`
          this[MONITOR_KEY][key] = false;
          return changed;
        },
        configurable: false,
        enumerable: false,
        writable: false,
      },
      restoreDefaults: {
        value() {
          const monitor = this[MONITOR_KEY];
          const result = {} as Record<string, boolean>;
          for (const key in monitor) {
            if (key !== SOURCE_KEY && key !== MONITOR_KEY) {
              result[key] = this.restoreDefault(key);
            }
          }
          return result;
        },
        configurable: false,
        enumerable: false,
        writable: false,
      },
    }
  );
}
