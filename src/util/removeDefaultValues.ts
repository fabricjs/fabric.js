//@ts-nocheck
const include = ['left', 'top', 'type'];

function isEmptyArray(value) {
    return Array.isArray(value) && value.length === 0;
}

/**
 * mutates object
 * @param object 
 * @param defaults 
 * @returns 
 */
export function removeDefaultValues(object, defaults) {
    for (const key in object) {
        if (object[key] === defaults[key] || (isEmptyArray(object[key]) && isEmptyArray(defaults[key]))) {
            delete object[key];
        }
    }
    return object;
}

/**
 * mutates object
 * @param object 
 * @param defaults 
 * @returns 
 */
export function removeObjectDefaultValues(object, defaults) {
    return removeDefaultValues(object, include.reduce(key => {
        delete defaults[key];
    }, { ...defaults }));
}