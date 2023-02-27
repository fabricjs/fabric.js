import { ObjectEvents } from '../../EventTypeDefs';
import { FabricObject } from '../Object/FabricObject';

export type TextStyleDeclaration = Record<string, any>;

export type TextStyle = {
  [line: number | string]: { [char: number | string]: TextStyleDeclaration };
};

export abstract class StyledText<
  EventSpec extends ObjectEvents
> extends FabricObject<EventSpec> {
  declare abstract styles: TextStyle;
  protected declare abstract _textLines: string[][];
  protected declare abstract _forceClearCache: boolean;
  protected declare abstract _styleProperties: string[];
  abstract get2DCursorLocation(
    selectionStart: number,
    skipWrapping?: boolean
  ): { charIndex: number; lineIndex: number };

  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(lineIndex?: number): boolean {
    if (!this.styles) {
      return true;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return true;
    }
    const obj =
      typeof lineIndex === 'undefined'
        ? this.styles
        : { line: this.styles[lineIndex] };
    for (const p1 in obj) {
      for (const p2 in obj[p1]) {
        // eslint-disable-next-line no-unused-vars
        for (const p3 in obj[p1][p2]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Returns true if object has a style property or has it ina specified line
   * This function is used to detect if a text will use a particular property or not.
   * @param {String} property to check for
   * @param {Number} lineIndex to check the style on
   * @return {Boolean}
   */
  styleHas(property: string, lineIndex?: number): boolean {
    if (!this.styles || !property || property === '') {
      return false;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return false;
    }
    const obj =
      typeof lineIndex === 'undefined'
        ? this.styles
        : { 0: this.styles[lineIndex] };
    // eslint-disable-next-line
    for (const p1 in obj) {
      // eslint-disable-next-line
      for (const p2 in obj[p1]) {
        if (typeof obj[p1][p2][property] !== 'undefined') {
          return true;
        }
      }
    }
    return false;
  }

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
  cleanStyle(property: string) {
    if (!this.styles || !property || property === '') {
      return false;
    }
    const obj = this.styles;
    let stylesCount = 0,
      letterCount,
      stylePropertyValue,
      allStyleObjectPropertiesMatch = true,
      graphemeCount = 0;
    for (const p1 in obj) {
      letterCount = 0;
      for (const p2 in obj[p1]) {
        const styleObject = obj[p1][p2],
          // TODO: this shouldn't be necessary anymore with modern browsers
          stylePropertyHasBeenSet = Object.prototype.hasOwnProperty.call(
            styleObject,
            property
          );

        stylesCount++;

        if (stylePropertyHasBeenSet) {
          if (!stylePropertyValue) {
            stylePropertyValue = styleObject[property];
          } else if (styleObject[property] !== stylePropertyValue) {
            allStyleObjectPropertiesMatch = false;
          }

          if (styleObject[property] === this[property as keyof this]) {
            delete styleObject[property];
          }
        } else {
          allStyleObjectPropertiesMatch = false;
        }

        if (Object.keys(styleObject).length !== 0) {
          letterCount++;
        } else {
          delete obj[p1][p2];
        }
      }

      if (letterCount === 0) {
        delete obj[p1];
      }
    }
    // if every grapheme has the same style set then
    // delete those styles and set it on the parent
    for (let i = 0; i < this._textLines.length; i++) {
      graphemeCount += this._textLines[i].length;
    }
    if (allStyleObjectPropertiesMatch && stylesCount === graphemeCount) {
      this[property as keyof this] = stylePropertyValue;
      this.removeStyle(property);
    }
  }

  /**
   * Remove a style property or properties from all individual character styles
   * in a text object.  Deletes the character style object if it contains no other style
   * props.  Deletes a line style object if it contains no other character styles.
   *
   * @param {String} props The property to remove from character styles.
   */
  removeStyle(property: string) {
    if (!this.styles || !property || property === '') {
      return;
    }
    const obj = this.styles;
    let line, lineNum, charNum;
    for (lineNum in obj) {
      line = obj[lineNum];
      for (charNum in line) {
        delete line[charNum][property];
        if (Object.keys(line[charNum]).length === 0) {
          delete line[charNum];
        }
      }
      if (Object.keys(line).length === 0) {
        delete obj[lineNum];
      }
    }
  }

  private _extendStyles(index: number, styles: TextStyleDeclaration) {
    const { lineIndex, charIndex } = this.get2DCursorLocation(index);

    if (!this._getLineStyle(lineIndex)) {
      this._setLineStyle(lineIndex);
    }

    if (!this._getStyleDeclaration(lineIndex, charIndex)) {
      this._setStyleDeclaration(lineIndex, charIndex, {});
    }

    return Object.assign(
      this._getStyleDeclaration(lineIndex, charIndex) || {},
      styles
    );
  }

  /**
   * Gets style of a current selection/cursor (at the start position)
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles(
    startIndex: number,
    endIndex?: number,
    complete?: boolean
  ) {
    const styles: TextStyleDeclaration[] = [];
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      styles.push(this.getStyleAtPosition(i, complete));
    }
    return styles;
  }

  /**
   * Gets style of a current selection/cursor position
   * @param {Number} position  to get styles at
   * @param {Boolean} [complete] full style if true
   * @return {Object} style Style object at a specified index
   * @private
   */
  getStyleAtPosition(position: number, complete?: boolean) {
    const { lineIndex, charIndex } = this.get2DCursorLocation(position);
    return (
      (complete
        ? this.getCompleteStyleDeclaration(lineIndex, charIndex)
        : this._getStyleDeclaration(lineIndex, charIndex)) || {}
    );
  }

  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} styles Styles object
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified startIndex + 1
   */
  setSelectionStyles(styles: object, startIndex: number, endIndex?: number) {
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      this._extendStyles(i, styles);
    }
    /* not included in _extendStyles to avoid clearing cache more than once */
    this._forceClearCache = true;
  }

  /**
   * get the reference, not a clone, of the style object for a given character
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {Object} style object
   */
  _getStyleDeclaration(lineIndex: number, charIndex: number) {
    const lineStyle = this.styles && this.styles[lineIndex];
    if (!lineStyle) {
      return null;
    }
    return lineStyle[charIndex];
  }

  /**
   * return a new object that contains all the style property for a character
   * the object returned is newly created
   * @param {Number} lineIndex of the line where the character is
   * @param {Number} charIndex position of the character on the line
   * @return {Object} style object
   */
  getCompleteStyleDeclaration(lineIndex: number, charIndex: number) {
    const style = this._getStyleDeclaration(lineIndex, charIndex) || {},
      styleObject: TextStyleDeclaration = {};
    for (let i = 0; i < this._styleProperties.length; i++) {
      const prop = this._styleProperties[i];
      styleObject[prop] =
        typeof style[prop] === 'undefined'
          ? this[prop as keyof this]
          : style[prop];
    }
    return styleObject;
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {Object} style
   * @private
   */
  protected _setStyleDeclaration(
    lineIndex: number,
    charIndex: number,
    style: object
  ) {
    this.styles[lineIndex][charIndex] = style;
  }

  /**
   *
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  protected _deleteStyleDeclaration(lineIndex: number, charIndex: number) {
    delete this.styles[lineIndex][charIndex];
  }

  /**
   * @param {Number} lineIndex
   * @return {Boolean} if the line exists or not
   * @private
   */
  protected _getLineStyle(lineIndex: number): boolean {
    return !!this.styles[lineIndex];
  }

  /**
   * Set the line style to an empty object so that is initialized
   * @param {Number} lineIndex
   * @private
   */
  protected _setLineStyle(lineIndex: number) {
    this.styles[lineIndex] = {};
  }

  protected _deleteLineStyle(lineIndex: number) {
    delete this.styles[lineIndex];
  }
}
