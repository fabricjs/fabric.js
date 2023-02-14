import { THybrid, ChangeContext, HybridProtected, Hybrid } from './types';
import { TARGETS_KEY, MONITOR_KEY } from './constants';

export function bubbleChange<T extends THybrid<T>, S extends object>(
  { key, value, prevValue }: ChangeContext<T>,
  source: HybridProtected<T, S>,
  descriptor: TypedPropertyDescriptor<S>
) {
  const targets = Reflect.get(source, TARGETS_KEY);
  targets &&
    targets.forEach((__, target) => {
      const monitor = Reflect.get(target, MONITOR_KEY);
      if (Reflect.get(monitor, key)) {
        return;
      } else if (
        target.onChange &&
        target.onChange(
          {
            key,
            value,
            prevValue,
          },
          target
        )
      ) {
        // bubble change
        bubbleChange({ key, value, prevValue }, target, descriptor);
      } else if (
        Reflect.defineProperty(target, key, {
          ...descriptor,
          value: prevValue,
        })
      ) {
        // change was refused => define and monitor `key`
        Reflect.set(monitor, key, true);
        // stop bubbling (subTargets will not be affected by the change since it is blocked)
      }
    });
}
/**
 * adds target to source's targets monitor in order to bubble changes from source to target
 * @param target
 * @param source
 * @returns
 */
export function connectSource(target: object, source?: object) {
  if (!source) return;
  if (!Reflect.get(source, TARGETS_KEY)) {
    Reflect.defineProperty(source, TARGETS_KEY, {
      value: new Map(),
      configurable: true,
      enumerable: false,
      writable: false,
    });
  }
  Reflect.get(source, TARGETS_KEY).set(target, true);
}
/**
 * removes target from source's targets monitor
 * @param target
 * @param source
 */
export function disconnectSource(
  target: Hybrid<object, object>,
  source: object
) {
  (
    Reflect.get(source, TARGETS_KEY) as Map<Hybrid<object, object>, true>
  )?.delete(target);
}
