


export function applyMixins<T extends new (...args: unknown[]) => unknown, M extends (klass: T) => T &(new (...args: unknown[]) => unknown)>(klass:T, mixins:M[]) {
    return mixins.reduce((mixed, mixin) => mixin(mixed), klass) as T & ReturnType<M>;
}
