import type { CSSRules } from './typedefs';

/**
 * Returns CSS rules for a given SVG document
 * @param {HTMLElement} doc SVG document to parse
 * @return {Object} CSS rules of this document
 */
export function getCSSRules(doc: Document) {
  const styles = doc.getElementsByTagName('style');
  let i;
  let len;
  const allRules: CSSRules = {};

  // very crude parsing of style contents
  for (i = 0, len = styles.length; i < len; i++) {
    const styleContents = (styles[i].textContent || '').replace(
      // remove comments
      /\/\*[\s\S]*?\*\//g,
      ''
    );

    if (styleContents.trim() === '') {
      continue;
    }
    // recovers all the rule in this form `body { style code... }`
    // rules = styleContents.match(/[^{]*\{[\s\S]*?\}/g);
    styleContents
      .split('}')
      // remove empty rules.
      .filter(function (rule) {
        return rule.trim();
      })
      // at this point we have hopefully an array of rules `body { style code... `
      // eslint-disable-next-line no-loop-func
      .forEach(function (rule) {
        const match = rule.split('{'),
          ruleObj: Record<string, string> = {},
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
        rule.split(',').forEach((_rule) => {
          _rule = _rule.replace(/^svg/i, '').trim();
          if (_rule === '') {
            return;
          }
          allRules[_rule] = {
            ...(allRules[_rule] || {}),
            ...ruleObj,
          };
        });
      });
  }
  return allRules;
}
