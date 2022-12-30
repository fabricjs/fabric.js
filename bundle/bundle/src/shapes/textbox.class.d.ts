import { TClassProperties } from '../typedefs';
import { IText } from './itext.class';
/**
 * Textbox class, based on IText, allows the user to resize the text rectangle
 * and wraps lines automatically. Textboxes have their Y scaling locked, the
 * user can only change width. Height is adjusted automatically based on the
 * wrapping of lines.
 */
export declare class Textbox extends IText {
    /**
     * Minimum width of textbox, in pixels.
     * @type Number
     * @default
     */
    minWidth: number;
    /**
     * Minimum calculated width of a textbox, in pixels.
     * fixed to 2 so that an empty textbox cannot go to 0
     * and is still selectable without text.
     * @type Number
     * @default
     */
    dynamicMinWidth: number;
    /**
     * Cached array of text wrapping.
     * @type Array
     */
    __cachedLines: Array<any> | null;
    /**
     * Use this boolean property in order to split strings that have no white space concept.
     * this is a cheap way to help with chinese/japanese
     * @type Boolean
     * @since 2.6.0
     */
    splitByGrapheme: boolean;
    /**
     * Unlike superclass's version of this function, Textbox does not update
     * its width.
     * @private
     * @override
     */
    initDimensions(): void;
    /**
     * Generate an object that translates the style object so that it is
     * broken up by visual lines (new lines and automatic wrapping).
     * The original text styles object is broken up by actual lines (new lines only),
     * which is only sufficient for Text / IText
     * @private
     */
    _generateStyleMap(textInfo: any): {};
    /**
     * Returns true if object has a style property or has it on a specified line
     * @param {Number} lineIndex
     * @return {Boolean}
     */
    styleHas(property: any, lineIndex: number): boolean;
    /**
     * Returns true if object has no styling or no styling in a line
     * @param {Number} lineIndex , lineIndex is on wrapped lines.
     * @return {Boolean}
     */
    isEmptyStyles(lineIndex: number): boolean;
    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @private
     */
    _getStyleDeclaration(lineIndex: number, charIndex: number): import("../mixins/text_style.mixin").TextStyleDeclaration | null;
    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {Object} style
     * @private
     */
    _setStyleDeclaration(lineIndex: number, charIndex: number, style: object): void;
    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @private
     */
    _deleteStyleDeclaration(lineIndex: number, charIndex: number): void;
    /**
     * probably broken need a fix
     * Returns the real style line that correspond to the wrapped lineIndex line
     * Used just to verify if the line does exist or not.
     * @param {Number} lineIndex
     * @returns {Boolean} if the line exists or not
     * @private
     */
    _getLineStyle(lineIndex: number): boolean;
    /**
     * Set the line style to an empty object so that is initialized
     * @param {Number} lineIndex
     * @param {Object} style
     * @private
     */
    _setLineStyle(lineIndex: number): void;
    /**
     * Wraps text using the 'width' property of Textbox. First this function
     * splits text on newlines, so we preserve newlines entered by the user.
     * Then it wraps each line using the width of the Textbox by calling
     * _wrapLine().
     * @param {Array} lines The string array of text that is split into lines
     * @param {Number} desiredWidth width you want to wrap to
     * @returns {Array} Array of lines
     */
    _wrapText(lines: Array<any>, desiredWidth: number): Array<any>;
    /**
     * Helper function to measure a string of text, given its lineIndex and charIndex offset
     * It gets called when charBounds are not available yet.
     * Override if necessary
     * Use with {@link Textbox#wordSplit}
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {String} text
     * @param {number} lineIndex
     * @param {number} charOffset
     * @returns {number}
     */
    _measureWord(word: any, lineIndex: number, charOffset?: number): number;
    /**
     * Override this method to customize word splitting
     * Use with {@link Textbox#_measureWord}
     * @param {string} value
     * @returns {string[]} array of words
     */
    wordSplit(value: string): string[];
    /**
     * Wraps a line of text using the width of the Textbox and a context.
     * @param {Array} line The grapheme array that represent the line
     * @param {Number} lineIndex
     * @param {Number} desiredWidth width you want to wrap the line to
     * @param {Number} reservedSpace space to remove from wrapping for custom functionalities
     * @returns {Array} Array of line(s) into which the given text is wrapped
     * to.
     */
    _wrapLine(_line: any, lineIndex: number, desiredWidth: number, reservedSpace?: number): Array<any>;
    /**
     * Detect if the text line is ended with an hard break
     * text and itext do not have wrapping, return false
     * @param {Number} lineIndex text to split
     * @return {Boolean}
     */
    isEndOfWrapping(lineIndex: number): boolean;
    /**
     * Detect if a line has a linebreak and so we need to account for it when moving
     * and counting style.
     * @return Number
     */
    missingNewlineOffset(lineIndex: any): 1 | 0;
    /**
     * Gets lines of text to render in the Textbox. This function calculates
     * text wrapping on the fly every time it is called.
     * @param {String} text text to split
     * @returns {Array} Array of lines in the Textbox.
     * @override
     */
    _splitTextIntoLines(text: string): {
        _unwrappedLines: string[][];
        lines: string[];
        graphemeText: string[];
        graphemeLines: string[][];
    };
    getMinWidth(): number;
    _removeExtraneousStyles(): void;
    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude: Array<any>): object;
}
export declare const textboxDefaultValues: Partial<TClassProperties<Textbox>>;
//# sourceMappingURL=textbox.class.d.ts.map