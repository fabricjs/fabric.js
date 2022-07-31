

//@ts-nocheck
export function applyMixins(klass, mixins) {
    return mixins.reduce((mixed, mixin) => mixin(mixed), klass);
}
