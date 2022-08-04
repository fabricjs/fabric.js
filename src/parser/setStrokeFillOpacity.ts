//@ts-nocheck
import { fabric } from '../../HEADER';
import { Color } from '../color';
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
            if (!fabric.Object.prototype[attr]) {
                continue;
            }
            attributes[attr] = fabric.Object.prototype[attr];
        }

        if (attributes[attr].indexOf('url(') === 0) {
            continue;
        }

        var color = new Color(attributes[attr]);
        attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2)).toRgba();
    }
    return attributes;
}
