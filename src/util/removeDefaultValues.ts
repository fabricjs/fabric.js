//@ts-nocheck
import { pick } from "./pick";

const include = ['left', 'top', 'type'];

function isEmptyArray(value) {
    return Array.isArray(value) && value.length === 0;
}

/**
 * mutates object
 * @todo don't mutate object (need to import clone)
 * @param object 
 * @param defaults 
 * @returns 
 */
export function removeDefaultValues(object, defaults) {
    for (const key in object) {
        if (key in defaults && (object[key] === defaults[key] || (isEmptyArray(object[key]) && isEmptyArray(defaults[key])))) {
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
    const _include = pick(object, include);
    return {
        ...removeDefaultValues(object, defaults),
        ..._include
    };
}