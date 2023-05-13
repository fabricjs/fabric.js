/**
 * Regex matching color in RGB or RGBA formats (ex: rgb(0, 0, 0), rgba(255, 100, 10, 0.5), rgba( 255 , 100 , 10 , 0.5 ), rgb(1,1,1), rgba(100%, 60%, 10%, 0.5))
 * Also matching rgba(r g b / a) as per new specs
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
 * Formal syntax at the time of writing:
 * <rgb()> =
 *  rgb( [ <percentage> | none ]{3} [ / [ <alpha-value> | none ] ]? )  |
 *  rgb( [ <number> | none ]{3} [ / [ <alpha-value> | none ] ]? )
 * <alpha-value> = <number> | <percentage>
 *
 * For learners this is how you can read this regex
 * rgba?\( - match "rgb(" or "rgba("
 * (?:\s*(\d{1,3}(?:\.\d+)?%?)\s*,?){3} - match three sets of digits,
 * optionally followed by a decimal point and more digits,
 * followed by an optional percent sign,
 * surrounded by optional whitespace and an optional comma.
 *   (?: match the start of a non capturing group, used just to use te  3x repetition.
 *     \s* - match zero or more whitespace characters, but don't capture them
 *     (   - match a capturing group to capture the value of the r,g,b channels
 *       \d{1,3}    - match between one and three digits, capturing
 *       (?:\.\d+)? - start and close a non capturin group, for delimiting optional decimals
 *                    \. is the literal dot and d+ are an arbitrary number of digits
 *       %?         - an optional % in case is a percentage number
 *     ) - closes the capturin group
 *     \s*,? - match optional whitespace followed by an optional comma
 *   ){3} - closes the non capturing group of the float/percentage with comma
 *          and specifies we want 3
 *
 * (?:\s*[,/]\s*(\d{0,3}(?:\.\d+)?%?)\s*)? using the reference above, this is a non capturin group
 * made to define the optional alpha, include starting optional spaces,
 *   (?: match the start of a non capturing group, used just to use te optional at the end.
 *      \s*[,/]\s*  then either a comma or a slash, preceeded or followed by more optional space,
 *      (\d{0,3}(?:\.\d+)?%?) the cualt capturing group with either
 *        \d{0,3}    - 0 to 3 digits,
 *        (?:\.\d+)? - optional decimals
 *        %?         - optional percentage symbol
 *      \s* additional optional spacing before the closing braket of rgba()
 * and a capturing group that specify our alpha channel, with optional decimals and optional percentage
 *
 * The alpha channel can be in the format 0.4 .7 or 1 or 73%
 *
 * WARNING this regex doesn't match exact colors. it matches everything that could be a color.
 * So the spec does not allow for rgba(30 / 45%  35, 49%) but this will work anyway for us
 * @static
 * @field
 * @memberOf Color
 */
export const reRGBa = () =>
  /^rgba?\((?:\s*(\d{1,3}(?:\.\d+)?%?)\s*,?){3}(?:\s*[,/]\s*(\d{0,3}(?:\.\d+)?%?)\s*)?\)$/i;

/**
 * Regex matching color in HSL or HSLA formats (ex: hsl(200, 80%, 10%), hsla(300, 50%, 80%, 0.5), hsla( 300 , 50% , 80% , 0.5 ))
 * @static
 * @field
 * @memberOf Color
 */
export const reHSLa = () =>
  /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}%)\s*,\s*(\d{1,3}%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i;
/**
 * Regex matching color in HEX format (ex: #FF5544CC, #FF5555, 010155, aff)
 * @static
 * @field
 * @memberOf Color
 */
export const reHex = () => /^#?(([0-9a-f]){3,4}|([0-9a-f]{2}){3,4})$/i;
