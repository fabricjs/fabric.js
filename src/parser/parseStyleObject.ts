//@ts-nocheck

export function parseStyleObject(style, oStyle) {
    var attr, value;
    for (var prop in style) {
        if (typeof style[prop] === 'undefined') {
            continue;
        }

        attr = prop.toLowerCase();
        value = style[prop];

        oStyle[attr] = value;
    }
}
