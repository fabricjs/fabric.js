import { clone } from '../lang_object';

/**
 * @param {Object} prevStyle first style to compare
 * @param {Object} thisStyle second style to compare
 * @param {boolean} forTextSpans whether to check overline, underline, and line-through properties
 * @return {boolean} true if the style changed
 */
export const hasStyleChanged = (
  prevStyle: any,
  thisStyle: any,
  forTextSpans = false
) =>
  prevStyle.fill !== thisStyle.fill ||
  prevStyle.stroke !== thisStyle.stroke ||
  prevStyle.strokeWidth !== thisStyle.strokeWidth ||
  prevStyle.fontSize !== thisStyle.fontSize ||
  prevStyle.fontFamily !== thisStyle.fontFamily ||
  prevStyle.fontWeight !== thisStyle.fontWeight ||
  prevStyle.fontStyle !== thisStyle.fontStyle ||
  prevStyle.textBackgroundColor !== thisStyle.textBackgroundColor ||
  prevStyle.deltaY !== thisStyle.deltaY ||
  (forTextSpans &&
    (prevStyle.overline !== thisStyle.overline ||
      prevStyle.underline !== thisStyle.underline ||
      prevStyle.linethrough !== thisStyle.linethrough));

/**
 * Returns the array form of a text object's inline styles property with styles grouped in ranges
 * rather than per character. This format is less verbose, and is better suited for storage
 * so it is used in serialization (not during runtime).
 * @param {object} styles per character styles for a text object
 * @param {String} text the text string that the styles are applied to
 * @return {{start: number, end: number, style: object}[]}
 */
export const stylesToArray = (styles: any, text: string) => {
  const textLines = text.split('\n'),
    stylesArray = [];
  let charIndex = -1,
    prevStyle = {};
  // clone style structure to prevent mutation
  styles = clone(styles, true);

  //loop through each textLine
  for (let i = 0; i < textLines.length; i++) {
    if (!styles[i]) {
      //no styles exist for this line, so add the line's length to the charIndex total
      charIndex += textLines[i].length;
      continue;
    }
    //loop through each character of the current line
    for (let c = 0; c < textLines[i].length; c++) {
      charIndex++;
      const thisStyle = styles[i][c];
      //check if style exists for this character
      if (thisStyle && Object.keys(thisStyle).length > 0) {
        if (hasStyleChanged(prevStyle, thisStyle, true)) {
          stylesArray.push({
            start: charIndex,
            end: charIndex + 1,
            style: thisStyle,
          });
        } else {
          //if style is the same as previous character, increase end index
          stylesArray[stylesArray.length - 1].end++;
        }
      }
      prevStyle = thisStyle || {};
    }
  }
  return stylesArray;
};

/**
 * Returns the object form of the styles property with styles that are assigned per
 * character rather than grouped by range. This format is more verbose, and is
 * only used during runtime (not for serialization/storage)
 * @param {Array} styles the serialized form of a text object's styles
 * @param {String} text the text string that the styles are applied to
 * @return {Object}
 */
export const stylesFromArray = (styles: any, text: string) => {
  if (!Array.isArray(styles)) {
    return styles;
  }
  const textLines = text.split('\n'),
    stylesObject = {} as any;
  let charIndex = -1,
    styleIndex = 0;
  //loop through each textLine
  for (let i = 0; i < textLines.length; i++) {
    //loop through each character of the current line
    for (let c = 0; c < textLines[i].length; c++) {
      charIndex++;
      //check if there's a style collection that includes the current character
      if (
        styles[styleIndex] &&
        styles[styleIndex].start <= charIndex &&
        charIndex < styles[styleIndex].end
      ) {
        //create object for line index if it doesn't exist
        stylesObject[i] = stylesObject[i] || {};
        //assign a style at this character's index
        stylesObject[i][c] = { ...styles[styleIndex].style };
        //if character is at the end of the current style collection, move to the next
        if (charIndex === styles[styleIndex].end - 1) {
          styleIndex++;
        }
      }
    }
  }
  return stylesObject;
};
