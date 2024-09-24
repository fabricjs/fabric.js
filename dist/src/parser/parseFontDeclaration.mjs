import { parseUnit } from '../util/misc/svgParsing.mjs';
import { reFontDeclaration } from './constants.mjs';

/**
 * Parses a short font declaration, building adding its properties to a style object
 * @static
 * @function
 * @memberOf fabric
 * @param {String} value font declaration
 * @param {Object} oStyle definition
 */
function parseFontDeclaration(value, oStyle) {
  const match = value.match(reFontDeclaration);
  if (!match) {
    return;
  }
  const fontStyle = match[1],
    // font variant is not used
    // fontVariant = match[2],
    fontWeight = match[3],
    fontSize = match[4],
    lineHeight = match[5],
    fontFamily = match[6];
  if (fontStyle) {
    oStyle.fontStyle = fontStyle;
  }
  if (fontWeight) {
    oStyle.fontWeight = isNaN(parseFloat(fontWeight)) ? fontWeight : parseFloat(fontWeight);
  }
  if (fontSize) {
    oStyle.fontSize = parseUnit(fontSize);
  }
  if (fontFamily) {
    oStyle.fontFamily = fontFamily;
  }
  if (lineHeight) {
    oStyle.lineHeight = lineHeight === 'normal' ? 1 : lineHeight;
  }
}

export { parseFontDeclaration };
//# sourceMappingURL=parseFontDeclaration.mjs.map
