import { objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';

const cloneStyles = style => {
  const newObj = {};
  Object.keys(style).forEach(key => {
    newObj[key] = {};
    Object.keys(style[key]).forEach(keyInner => {
      newObj[key][keyInner] = _objectSpread2({}, style[key][keyInner]);
    });
  });
  return newObj;
};

export { cloneStyles };
//# sourceMappingURL=cloneStyles.mjs.map
