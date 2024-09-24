import { Color } from '../color/Color.mjs';
import { toFixed } from '../util/misc/toFixed.mjs';
import { FabricObject } from '../shapes/Object/FabricObject.mjs';

const colorAttributesMap = {
  stroke: 'strokeOpacity',
  fill: 'fillOpacity'
};

/**
 * @private
 * @param {Object} attributes Array of attributes to parse
 */

function setStrokeFillOpacity(attributes) {
  const defaults = FabricObject.getDefaults();
  Object.entries(colorAttributesMap).forEach(_ref => {
    let [attr, colorAttr] = _ref;
    if (typeof attributes[colorAttr] === 'undefined' || attributes[attr] === '') {
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
    attributes[attr] = color.setAlpha(toFixed(color.getAlpha() * attributes[colorAttr], 2)).toRgba();
  });
  return attributes;
}

export { setStrokeFillOpacity };
//# sourceMappingURL=setStrokeFillOpacity.mjs.map
