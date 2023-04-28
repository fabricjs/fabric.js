//@ts-nocheck
import { Color } from '../color/Color';
import { toFixed } from '../util/misc/toFixed';
import { colorAttributes } from './constants';
import { FabricObject } from '../shapes/Object/FabricObject';

/**
 * @private
 * @param {Object} attributes Array of attributes to parse
 */

export function setStrokeFillOpacity(attributes) {
  for (const attr in colorAttributes) {
    if (
      typeof attributes[colorAttributes[attr]] === 'undefined' ||
      attributes[attr] === ''
    ) {
      continue;
    }
    const defaults = FabricObject.getDefaults();
    if (typeof attributes[attr] === 'undefined') {
      if (!defaults[attr]) {
        continue;
      }
      attributes[attr] = defaults[attr];
    }

    if (attributes[attr].indexOf('url(') === 0) {
      continue;
    }

    const color = new Color(attributes[attr]);
    attributes[attr] = color
      .setAlpha(
        toFixed(color.getAlpha() * attributes[colorAttributes[attr]], 2)
      )
      .toRgba();
  }
  return attributes;
}
