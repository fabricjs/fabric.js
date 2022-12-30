import { ObjectEvents } from '../EventTypeDefs';
import { FabricObject } from '../shapes/Object/FabricObject';
export type TextStyleDeclaration = Record<string, any>;
export type TextStyle = {
    [line: number | string]: {
        [char: number | string]: TextStyleDeclaration;
    };
};
export declare abstract class TextStyleMixin<EventSpec extends ObjectEvents> extends FabricObject<EventSpec> {
    abstract styles: TextStyle;
    protected abstract _textLines: string[][];
    protected abstract _forceClearCache: boolean;
    protected abstract _styleProperties: string[];
    abstract get2DCursorLocation(selectionStart: number, skipWrapping?: boolean): {
        charIndex: number;
        lineIndex: number;
    };
    /**
     * Returns true if object has no styling or no styling in a line
     * @param {Number} lineIndex , lineIndex is on wrapped lines.
     * @return {Boolean}
     */
    isEmptyStyles(lineIndex?: number): boolean;
    /**
     * Returns true if object has a style property or has it ina specified line
     * This function is used to detect if a text will use a particular property or not.
     * @param {String} property to check for
     * @param {Number} lineIndex to check the style on
     * @return {Boolean}
     */
    styleHas(property: string, lineIndex?: number): boolean;
    /**
     * Check if characters in a text have a value for a property
     * whose value matches the textbox's value for that property.  If so,
     * the character-level property is deleted.  If the character
     * has no other properties, then it is also deleted.  Finally,
     * if the line containing that character has no other characters
     * then it also is deleted.
     *
     * @param {string} property The property to compare between characters and text.
     */
    cleanStyle(property: string): false | undefined;
    /**
     * Remove a style property or properties from all individual character styles
     * in a text object.  Deletes the character style object if it contains no other style
     * props.  Deletes a line style object if it contains no other character styles.
     *
     * @param {String} props The property to remove from character styles.
     */
    removeStyle(property: string): void;
    private _extendStyles;
    /**
     * Gets style of a current selection/cursor (at the start position)
     * @param {Number} startIndex Start index to get styles at
     * @param {Number} endIndex End index to get styles at, if not specified startIndex + 1
     * @param {Boolean} [complete] get full style or not
     * @return {Array} styles an array with one, zero or more Style objects
     */
    getSelectionStyles(startIndex: number, endIndex?: number, complete?: boolean): TextStyleDeclaration[];
    /**
     * Gets style of a current selection/cursor position
     * @param {Number} position  to get styles at
     * @param {Boolean} [complete] full style if true
     * @return {Object} style Style object at a specified index
     * @private
     */
    getStyleAtPosition(position: number, complete?: boolean): TextStyleDeclaration;
    /**
     * Sets style of a current selection, if no selection exist, do not set anything.
     * @param {Object} styles Styles object
     * @param {Number} startIndex Start index to get styles at
     * @param {Number} [endIndex] End index to get styles at, if not specified startIndex + 1
     */
    setSelectionStyles(styles: object, startIndex: number, endIndex?: number): void;
    /**
     * get the reference, not a clone, of the style object for a given character
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @return {Object} style object
     */
    _getStyleDeclaration(lineIndex: number, charIndex: number): TextStyleDeclaration | null;
    /**
     * return a new object that contains all the style property for a character
     * the object returned is newly created
     * @param {Number} lineIndex of the line where the character is
     * @param {Number} charIndex position of the character on the line
     * @return {Object} style object
     */
    getCompleteStyleDeclaration(lineIndex: number, charIndex: number): TextStyleDeclaration;
    /**
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @param {Object} style
     * @private
     */
    protected _setStyleDeclaration(lineIndex: number, charIndex: number, style: object): void;
    /**
     *
     * @param {Number} lineIndex
     * @param {Number} charIndex
     * @private
     */
    protected _deleteStyleDeclaration(lineIndex: number, charIndex: number): void;
    /**
     * @param {Number} lineIndex
     * @return {Boolean} if the line exists or not
     * @private
     */
    protected _getLineStyle(lineIndex: number): boolean;
    /**
     * Set the line style to an empty object so that is initialized
     * @param {Number} lineIndex
     * @private
     */
    protected _setLineStyle(lineIndex: number): void;
    protected _deleteLineStyle(lineIndex: number): void;
}
//# sourceMappingURL=text_style.mixin.d.ts.map