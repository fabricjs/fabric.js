//@ts-nocheck
export function removeDefaultValues(object, defaults) {
    Object.keys(object).forEach(function (prop) {
        if (prop === 'left' || prop === 'top' || prop === 'type') {
            return;
        }
        if (object[prop] === defaults[prop]) {
            delete object[prop];
        }
        // basically a check for [] === []
        if (Array.isArray(object[prop]) && Array.isArray(defaults[prop])
            && object[prop].length === 0 && defaults[prop].length === 0) {
            delete object[prop];
        }
    });

    return object;
}