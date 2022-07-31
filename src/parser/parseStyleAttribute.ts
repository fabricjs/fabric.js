import { parseStyleString, parseStyleObject } from './_parser';


export function parseStyleAttribute(element) {
    var oStyle = {}, style = element.getAttribute('style');

    if (!style) {
        return oStyle;
    }

    if (typeof style === 'string') {
        parseStyleString(style, oStyle);
    }
    else {
        parseStyleObject(style, oStyle);
    }

    return oStyle;
}
