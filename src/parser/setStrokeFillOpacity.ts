import { Color } from '../color/Color';
import { toFixed } from '../util/misc/toFixed';
import { FabricObject } from '../shapes/Object/FabricObject';

const colorAttributesMap = {
  stroke: 'strokeOpacity',
  fill: 'fillOpacity',
};

/**
 * @private
 * @param {Object} attributes Array of attributes to parse
 */

export function setStrokeFillOpacity(
  attributes: Record<string, any>,
): Record<string, any> {
  const defaults = FabricObject.getDefaults();
  Object.entries(colorAttributesMap).forEach(([attr, colorAttr]) => {
    if (
      typeof attributes[colorAttr] === 'undefined' ||
      attributes[attr] === ''
    ) {
      return;
    }
    if (typeof attributes[attr] === 'undefined') {
      if (!defaults[attr]) {
        return;
      }
      attributes[attr] = defaults[attr];
    }
    if (attributes[attr].indexOf('url(') === 0) {
      return;
    }
    const color = new Color(attributes[attr]);
    attributes[attr] = color
      .setAlpha(toFixed(color.getAlpha() * attributes[colorAttr], 2))
      .toRgba();
  });
  return attributes;
}
