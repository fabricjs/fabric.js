import type { TextStyle, TextStyleDeclaration } from '../../shapes/Text/StyledText';
export type TextStyleArray = {
    start: number;
    end: number;
    style: TextStyleDeclaration;
}[];
/**
 * @param {Object} prevStyle first style to compare
 * @param {Object} thisStyle second style to compare
 * @param {boolean} forTextSpans whether to check overline, underline, and line-through properties
 * @return {boolean} true if the style changed
 */
export declare const hasStyleChanged: (prevStyle: TextStyleDeclaration, thisStyle: TextStyleDeclaration, forTextSpans?: boolean) => boolean;
/**
 * Returns the array form of a text object's inline styles property with styles grouped in ranges
 * rather than per character. This format is less verbose, and is better suited for storage
 * so it is used in serialization (not during runtime).
 * @param {object} styles per character styles for a text object
 * @param {String} text the text string that the styles are applied to
 * @return {{start: number, end: number, style: object}[]}
 */
export declare const stylesToArray: (styles: TextStyle, text: string) => TextStyleArray;
/**
 * Returns the object form of the styles property with styles that are assigned per
 * character rather than grouped by range. This format is more verbose, and is
 * only used during runtime (not for serialization/storage)
 * @param {Array} styles the serialized form of a text object's styles
 * @param {String} text the text string that the styles are applied to
 * @return {Object}
 */
export declare const stylesFromArray: (styles: TextStyleArray | TextStyle, text: string) => TextStyle;
//# sourceMappingURL=textStyles.d.ts.map