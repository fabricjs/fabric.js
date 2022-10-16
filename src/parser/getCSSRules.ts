export type TCSSRules = Record<string, string>;
export type TCSSRulesCollection = Record<string, TCSSRules>;

/**
 * Returns CSS rules for a given SVG document
 * @param {SVGDocument} doc SVG document to parse
 * @return {Object} CSS rules of this document
 */
export function getCSSRules(doc: Document | HTMLElement): TCSSRulesCollection {
  const styles = doc.getElementsByTagName('style'),
    allRules: TCSSRulesCollection = {};
  let rules: Array<string>;

  // very crude parsing of style contents
  for (const style of styles) {
    let styleContents = style.textContent;
    if(!styleContents) continue;

    // remove comments
    styleContents = styleContents.replace(/\/\*[\s\S]*?\*\//g, '');
    if (styleContents.trim() === '') {
      continue;
    }
    // recovers all the rule in this form `body { style code... }`
    // rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
    rules = styleContents.split('}');
    // remove empty rules.
    rules = rules.filter(function (rule) {
      return rule.trim();
    });
    // at this point we have hopefully an array of rules `body { style code... `
    // eslint-disable-next-line no-loop-func
    rules.forEach(function (rule) {
      const match = rule.split('{'),
        ruleObj: TCSSRules = {},
        declaration = match[1].trim(),
        propertyValuePairs = declaration.split(';').filter(function (pair) {
          return pair.trim();
        });

      for (const propertyValuePair of propertyValuePairs) {
        const pair = propertyValuePair.split(':'),
          property = pair[0].trim(),
          value = pair[1].trim();
        ruleObj[property] = value;
      }
      rule = match[0].trim();
      rule.split(',').forEach(function (_rule) {
        _rule = _rule.replace(/^svg/i, '').trim();
        if (_rule === '') {
          return;
        }
        if (allRules[_rule]) {
          Object.assign(allRules[_rule], ruleObj);
        } else {
          allRules[_rule] = Object.assign<TCSSRules, TCSSRules>({}, ruleObj);
        }
      });
    });
  }
  return allRules;
}
