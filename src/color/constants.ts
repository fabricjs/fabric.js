/**
 * Regex matching color in RGB or RGBA formats (ex: `rgb(0, 0, 0)`, `rgba(255, 100, 10, 0.5)`, `rgba( 255 , 100 , 10 , 0.5 )`, `rgb(1,1,1)`, `rgba(100%, 60%, 10%, 0.5)`)
 * Also matching rgba(r g b / a) as per new specs
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
 * Formal syntax at the time of writing:
 * <rgb()> =
 *  rgb( [ <percentage> | none ]{3} [ / [ <alpha-value> | none ] ]? )  |
 *  rgb( [ <number> | none ]{3} [ / [ <alpha-value> | none ] ]? )
 * <alpha-value> = <number> | <percentage>
 *
 * For learners this is how you can read this regex
 * Regular expression for matching an rgba or rgb CSS color value
 *
 * /^          # Beginning of the string
 * rgba?       # "rgb" or "rgba"
 * \(\s*       # Opening parenthesis and optional whitespace
 * (\d{0,3}    # 0 to three digits R channel
 *  (?:\.\d+)? # Optional decimal with one or more digits
 * )           # End of capturing group for the first color component
 * %?          # Optional percent sign after the first color component
 * \s*         # Optional whitespace
 * [\s|,]      # Separator between color components can be a space or comma
 * \s*         # Optional whitespace
 * (\d{0,3}    # 0 to three digits G channel
 *  (?:\.\d+)? # Optional decimal with one or more digits
 * )           # End of capturing group for the second color component
 * %?          # Optional percent sign after the second color component
 * \s*         # Optional whitespace
 * [\s|,]      # Separator between color components can be a space or comma
 * \s*         # Optional whitespace
 * (\d{0,3}    # 0 to three digits B channel
 *  (?:\.\d+)? # Optional decimal with one or more digits
 * )           # End of capturing group for the third color component
 * %?          # Optional percent sign after the third color component
 * \s*         # Optional whitespace
 * (?:         # Beginning of non-capturing group for alpha value
 *  \s*        # Optional whitespace
 *  [,/]       # Comma or slash separator for alpha value
 *  \s*        # Optional whitespace
 *  (\d{0,3}   # Zero to three digits
 *    (?:\.\d+)? # Optional decimal with one or more digits
 *  )          # End of capturing group for alpha value
 *  %?         # Optional percent sign after alpha value
 *  \s*        # Optional whitespace
 * )?          # End of non-capturing group for alpha value (optional)
 * \)          # Closing parenthesis
 * $           # End of the string
 *
 * The alpha channel can be in the format 0.4 .7 or 1 or 73%
 *
 * WARNING this regex doesn't fail on off spec colors. it matches everything that could be a color.
 * So the spec does not allow for `rgba(30 , 45%  35, 49%)` but this will work anyways for us
 */
export const reRGBa = () =>
  /^rgba?\(\s*(\d{0,3}(?:\.\d+)?%?)\s*[\s|,]\s*(\d{0,3}(?:\.\d+)?%?)\s*[\s|,]\s*(\d{0,3}(?:\.\d+)?%?)\s*(?:\s*[,/]\s*(\d{0,3}(?:\.\d+)?%?)\s*)?\)$/i;

/**
 * Regex matching color in HSL or HSLA formats (ex: hsl(0, 0, 0), rgba(255, 100, 10, 0.5), rgba( 255 , 100 , 10 , 0.5 ), rgb(1,1,1), rgba(100%, 60%, 10%, 0.5))
 * Also matching rgba(r g b / a) as per new specs
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
 * Formal syntax at the time of writing:
 * <hsl()> =
 *   hsl( [ <hue> | none ] [ <percentage> | none ] [ <percentage> | none ] [ / [ <alpha-value> | none ] ]? )
 *
 * <hue> =
 *   <number>  |
 *   <angle>
 *
 * <alpha-value> =
 *   <number>      |
 *   <percentage>
 *
 * For learners this is how you can read this regex
 * Regular expression for matching an hsla or hsl CSS color value
 *
 * /^hsla?\(         // Matches the beginning of the string and the opening parenthesis of "hsl" or "hsla"
 * \s*               // Matches any whitespace characters (space, tab, etc.) zero or more times
 * (\d{1,3})         // Hue: Matches one to three digits and captures it in a group
 * \s*               // Matches any whitespace characters zero or more times
 * [\s|,]            // Matches a space, tab or comma
 * \s*               // Matches any whitespace characters zero or more times
 * (\d{1,3}%)        // Saturation: Matches one to three digits followed by a percentage sign and captures it in a group
 * \s*               // Matches any whitespace characters zero or more times
 * [\s|,]            // Matches a space, tab or comma
 * \s*               // Matches any whitespace characters zero or more times
 * (\d{1,3}%)        // Lightness: Matches one to three digits followed by a percentage sign and captures it in a group
 * \s*               // Matches any whitespace characters zero or more times
 * (?:               // Alpha: Begins a non-capturing group for the alpha value
 *   \s*             // Matches any whitespace characters zero or more times
 *   [,/]            // Matches a comma or forward slash
 *   \s*             // Matches any whitespace characters zero or more times
 *   (\d*(?:\.\d+)?%?) // Matches zero or more digits, optionally followed by a decimal point and one or more digits, followed by an optional percentage sign and captures it in a group
 *   \s*             // Matches any whitespace characters zero or more times
 * )?                // Makes the alpha value group optional
 * \)                // Matches the closing parenthesis
 * $/i               // Matches the end of the string and sets the regular expression to case-insensitive mode
 *
 * WARNING this regex doesn't fail on off spec colors. It matches everything that could be a color.
 * So the spec does not allow `hsl(30 , 45%  35, 49%)` but this will work anyways for us.
 */
export const reHSLa = () =>
  /^hsla?\(\s*([+-]?\d{1,3})\s*[\s|,]\s*(\d{1,3}%)\s*[\s|,]\s*(\d{1,3}%)\s*(?:\s*[,/]\s*(\d*(?:\.\d+)?%?)\s*)?\)$/i;

/**
 * Regex matching color in HEX format (ex: #FF5544CC, #FF5555, 010155, aff)
 */
export const reHex = () => /^#?(([0-9a-f]){3,4}|([0-9a-f]{2}){3,4})$/i;
