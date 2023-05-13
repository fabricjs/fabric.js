/**
 * Those regexes do not support the newest css syntax as described in
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
 * or
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
 * You still need to use the comma separated values.
 * There is some laxity introduced in order to have simpler code.
 *
 */

const raw = String.raw;
// matches 80% 80.1% 133 133.2 0.4
const rgbNumber = raw`\d{1,3}(?:\.\d+)?%?`;
const rgbPercentage = raw`${rgbNumber}%?`;
const optionalSurroundingSpace = (value: string) => raw`\s*(${value})\s*`;
// matches 12.4 0.4 .4
const alpha = raw`(?:\d*\.?\d+)?`;
const optionalAlphaWithSpaces = raw`(?:\s*,(${optionalSurroundingSpace(
  alpha
)}))?`;
const cssColorNumber = optionalSurroundingSpace(rgbNumber);
const cssColorPercentage = optionalSurroundingSpace(rgbPercentage);
const hex = `[0-9a-f]`;
/**
 * Regex matching color in RGB or RGBA formats (ex: rgb(0, 0, 0), rgba(255, 100, 10, 0.5), rgba( 255 , 100 , 10 , 0.5 ), rgb(1,1,1), rgba(100%, 60%, 10%, 0.5))
 * @static
 * @field
 * @memberOf Color
 */
// eslint-disable-next-line max-len
export const reRGBa = raw`^rgba?\(${cssColorNumber},${cssColorNumber},${cssColorNumber}${optionalAlphaWithSpaces}\)$`;

/**
 * Regex matching color in HSL or HSLA formats (ex: hsl(200, 80%, 10%), hsla(300, 50%, 80%, 0.5), hsla( 300 , 50% , 80% , 0.5 ))
 * @static
 * @field
 * @memberOf Color
 */
export const reHSLa = raw`^hsla?\(${cssColorNumber},${cssColorPercentage},${cssColorPercentage}${optionalAlphaWithSpaces}\)$`;

/**
 * Regex matching color in HEX format (ex: #FF5544CC, #FF5555, 010155, aff)
 * @static
 * @field
 * @memberOf Color
 */
export const reHex = `^#?((${hex}{3}){1,2}|(${hex}{4}){1,2})$`;
