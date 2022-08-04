//@ts-nocheck
import { Color } from '../color';
import { FabricObject } from '../shapes/object.class';
import { toFixed } from '../util';
import { colorAttributes } from './constants';

/**
 * @private
 * @param {Object} attributes Array of attributes to parse
 */

export function setStrokeFillOpacity(attributes) {
    for (var attr in colorAttributes) {

        if (typeof attributes[colorAttributes[attr]] === 'undefined' || attributes[attr] === '') {
            continue;
        }

        if (typeof attributes[attr] === 'undefined') {
            if (!FabricObject.prototype[attr]) {
                continue;
            }
            attributes[attr] = FabricObject.prototype[attr];
        }

        if (attributes[attr].indexOf('url(') === 0) {
            continue;
        }

        var color = new Color(attributes[attr]);
        attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2)).toRgba();
    }
    return attributes;
}
