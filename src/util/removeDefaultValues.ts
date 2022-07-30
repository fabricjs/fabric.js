
export function removeDefaultValues(object, prototype) {
    Object.keys(object).forEach(function (prop) {
        if (prop === 'left' || prop === 'top' || prop === 'type') {
            return;
        }
        if (object[prop] === prototype[prop]) {
            delete object[prop];
        }
        // basically a check for [] === []
        if (Array.isArray(object[prop]) && Array.isArray(prototype[prop])
            && object[prop].length === 0 && prototype[prop].length === 0) {
            delete object[prop];
        }
    });

    return object;
}