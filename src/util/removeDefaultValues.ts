//@ts-nocheck
const include = ['left', 'top', 'type'];

function isEmptyArray(value) {
    return Array.isArray(value) && value.length === 0;
}

export function removeDefaultValues(object, defaults, include = []) {
    const dest = {};
    for (const key in object) {
        if (include.includes(key)
            || !(object[key] === defaults[key] || (isEmptyArray(object[key]) && isEmptyArray(defaults[key])))) {
            dest[key] = object[key];
        }
    }
    return dest;
}

export function removeObjectDefaultValues(object, defaults) {
    return removeDefaultValues(object, defaults, include);
}