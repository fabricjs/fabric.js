import type { ProxyTarget } from './types';

export function createProxy<T extends ProxyTarget>(target: T) {
  const proxy = new Proxy(target, {
    get(target, p, receiver) {
      const value = Reflect.get(target, p);
      return target.transformValue &&
        Reflect.getOwnPropertyDescriptor(target, p)?.enumerable
        ? target.transformValue(
            {
              operation: 'get',
              key: p as keyof T,
              value,
            },
            receiver
          )
        : value;
    },

    set(target, p, newValue, receiver) {
      const has = Reflect.has(target, p);
      const prevValue = Reflect.get(target, p);
      const descriptor = Reflect.getOwnPropertyDescriptor(target, p);
      const enumerable = !descriptor || descriptor.enumerable;
      const changed = prevValue !== newValue;
      // transform value
      if (changed && target.transformValue && enumerable) {
        newValue = target.transformValue(
          {
            operation: 'set',
            key: p as keyof T,
            newValue,
            value: prevValue,
          },
          receiver
        );
      }
      // set property
      if (Reflect.set(target, p, newValue)) {
        if (changed && target.onChange && enumerable) {
          // a change occurred => run side effects
          target.onChange(
            {
              operation: 'set',
              key: p as keyof T,
              value: newValue,
              prevValue,
            },
            receiver
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
            {
              operation: 'delete',
              key: p as keyof T,
              value: undefined,
              prevValue,
            },
            // the receiver is not passed to the trap, see https://github.com/tc39/ecma262/issues/1198
            proxy
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
  return proxy;
}
