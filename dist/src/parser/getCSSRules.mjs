import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';

/**
 * Returns CSS rules for a given SVG document
 * @param {HTMLElement} doc SVG document to parse
 * @return {Object} CSS rules of this document
 */
function getCSSRules(doc) {
  const styles = doc.getElementsByTagName('style');
  let i;
  let len;
  const allRules = {};

  // very crude parsing of style contents
  for (i = 0, len = styles.length; i < len; i++) {
    const styleContents = (styles[i].textContent || '').replace(
    // remove comments
    /\/\*[\s\S]*?\*\//g, '');
    if (styleContents.trim() === '') {
      continue;
    }
    // recovers all the rule in this form `body { style code... }`
    // rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
    styleContents.split('}')
    // remove empty rules and remove everything if we didn't split in at least 2 pieces
    .filter((rule, index, array) => array.length > 1 && rule.trim())
    // at this point we have hopefully an array of rules `body { style code... `
    .forEach(rule => {
      // if there is more than one opening bracket and the rule starts with '@', it is likely
      // a nested at-rule like @media, @supports, @scope, etc. Ignore these as the code below
      // can not handle it.
      if ((rule.match(/{/g) || []).length > 1 && rule.trim().startsWith('@')) {
        return;
      }
      const match = rule.split('{'),
        ruleObj = {},
        declaration = match[1].trim(),
        propertyValuePairs = declaration.split(';').filter(function (pair) {
          return pair.trim();
        });
      for (i = 0, len = propertyValuePairs.length; i < len; i++) {
        const pair = propertyValuePairs[i].split(':'),
          property = pair[0].trim(),
          value = pair[1].trim();
        ruleObj[property] = value;
      }
      rule = match[0].trim();
      rule.split(',').forEach(_rule => {
        _rule = _rule.replace(/^svg/i, '').trim();
        if (_rule === '') {
          return;
        }
        allRules[_rule] = _objectSpread2(_objectSpread2({}, allRules[_rule] || {}), ruleObj);
      });
    });
  }
  return allRules;
}

export { getCSSRules };
//# sourceMappingURL=getCSSRules.mjs.map
