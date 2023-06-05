import type { ProxyTarget } from './types';

export function createProxy<T extends ProxyTarget>(target: T) {
  return new Proxy(target, {
    get(target, p) {
      const value = Reflect.get(target, p);
      return target.transformValue &&
        Reflect.getOwnPropertyDescriptor(target, p)?.enumerable
        ? target.transformValue(
            {
              operation: 'get',
              key: p as keyof T,
              value,
            },
            target
          )
        : value;
    },

    set(target, p, newValue) {
      const has = Reflect.has(target, p);
      const prevValue = Reflect.get(target, p);
      const descriptor = Reflect.getOwnPropertyDescriptor(target, p);
      const enumerable = !descriptor || descriptor.enumerable;
      // transform value
      if (target.transformValue && enumerable) {
        newValue = target.transformValue(
          {
            operation: 'set',
            key: p as keyof T,
            newValue,
            value: prevValue,
          },
          target
        );
      }
      // set property
      if (Reflect.set(target, p, newValue)) {
        if (prevValue !== newValue && target.onChange && enumerable) {
          // a change occurred => run side effects
          target.onChange(
            { key: p as keyof T, value: newValue, prevValue },
            target
          ) ||
            // change was refused by side effects => revert by resetting/deleting the property if it existed/didn't
            !(has
              ? Reflect.set(target, p, prevValue)
              : Reflect.deleteProperty(target, p));
        }
        return true;
      }
      return false;
    },

    deleteProperty(target, p) {
      const prevValue = Reflect.get(target, p);
      const descriptor = Reflect.getOwnPropertyDescriptor(target, p);
      // delete property
      if (Reflect.deleteProperty(target, p)) {
        if (
          prevValue &&
          target.onChange &&
          (!descriptor || descriptor.enumerable)
        ) {
          // a change occurred => run side effects
          target.onChange(
            { key: p as keyof T, value: undefined, prevValue },
            target
          ) ||
            // change was refused by side effects => revert by redefining the property
            !Reflect.defineProperty(target, p, {
              ...descriptor,
              value: prevValue,
            });
        }
        return true;
      }
      return false;
    },
  });
}
