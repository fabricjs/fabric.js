import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { FabricObject } from '../Object/FabricObject.mjs';
import { styleProperties } from './constants.mjs';
import '../../util/misc/vectors.mjs';
import '../../Point.mjs';
import '../../util/misc/projectStroke/StrokeLineJoinProjections.mjs';
import '../../config.mjs';
import '../Group.mjs';
import { pickBy, pick } from '../../util/misc/pick.mjs';
import '../../cache.mjs';
import '../../parser/constants.mjs';
import '../../util/animation/AnimationRegistry.mjs';

class StyledText extends FabricObject {
  /**
   * Returns true if object has no styling or no styling in a line
   * @param {Number} lineIndex , lineIndex is on wrapped lines.
   * @return {Boolean}
   */
  isEmptyStyles(lineIndex) {
    if (!this.styles) {
      return true;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return true;
    }
    const obj = typeof lineIndex === 'undefined' ? this.styles : {
      line: this.styles[lineIndex]
    };
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
  styleHas(property, lineIndex) {
    if (!this.styles) {
      return false;
    }
    if (typeof lineIndex !== 'undefined' && !this.styles[lineIndex]) {
      return false;
    }
    const obj = typeof lineIndex === 'undefined' ? this.styles : {
      0: this.styles[lineIndex]
    };
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
  cleanStyle(property) {
    if (!this.styles) {
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
        const styleObject = obj[p1][p2] || {},
          stylePropertyHasBeenSet = styleObject[property] !== undefined;
        stylesCount++;
        if (stylePropertyHasBeenSet) {
          if (!stylePropertyValue) {
            stylePropertyValue = styleObject[property];
          } else if (styleObject[property] !== stylePropertyValue) {
            allStyleObjectPropertiesMatch = false;
          }
          if (styleObject[property] === this[property]) {
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
      // @ts-expect-error conspiracy theory of TS
      this[property] = stylePropertyValue;
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
  removeStyle(property) {
    if (!this.styles) {
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
  _extendStyles(index, style) {
    const {
      lineIndex,
      charIndex
    } = this.get2DCursorLocation(index);
    if (!this._getLineStyle(lineIndex)) {
      this._setLineStyle(lineIndex);
    }
    const newStyle = pickBy(_objectSpread2(_objectSpread2({}, this._getStyleDeclaration(lineIndex, charIndex)), style), value => value !== undefined);

    // finally assign to the old position the new style
    this._setStyleDeclaration(lineIndex, charIndex, newStyle);
  }

  /**
   * Gets style of a current selection/cursor (at the start position)
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} endIndex End index to get styles at, if not specified startIndex + 1
   * @param {Boolean} [complete] get full style or not
   * @return {Array} styles an array with one, zero or more Style objects
   */
  getSelectionStyles(startIndex, endIndex, complete) {
    const styles = [];
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
  getStyleAtPosition(position, complete) {
    const {
      lineIndex,
      charIndex
    } = this.get2DCursorLocation(position);
    return complete ? this.getCompleteStyleDeclaration(lineIndex, charIndex) : this._getStyleDeclaration(lineIndex, charIndex);
  }

  /**
   * Sets style of a current selection, if no selection exist, do not set anything.
   * @param {Object} styles Styles object
   * @param {Number} startIndex Start index to get styles at
   * @param {Number} [endIndex] End index to get styles at, if not specified startIndex + 1
   */
  setSelectionStyles(styles, startIndex, endIndex) {
    for (let i = startIndex; i < (endIndex || startIndex); i++) {
      this._extendStyles(i, styles);
    }
    /* not included in _extendStyles to avoid clearing cache more than once */
    this._forceClearCache = true;
  }

  /**
   * Get a reference, not a clone, to the style object for a given character,
   * if no style is set for a line or char, return a new empty object.
   * This is tricky and confusing because when you get an empty object you can't
   * determine if it is a reference or a new one.
   * @TODO this should always return a reference or always a clone or undefined when necessary.
   * @protected
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @return {TextStyleDeclaration} a style object reference to the existing one or a new empty object when undefined
   */
  _getStyleDeclaration(lineIndex, charIndex) {
    var _lineStyle$charIndex;
    const lineStyle = this.styles && this.styles[lineIndex];
    return lineStyle ? (_lineStyle$charIndex = lineStyle[charIndex]) !== null && _lineStyle$charIndex !== void 0 ? _lineStyle$charIndex : {} : {};
  }

  /**
   * return a new object that contains all the style property for a character
   * the object returned is newly created
   * @param {Number} lineIndex of the line where the character is
   * @param {Number} charIndex position of the character on the line
   * @return {Object} style object
   */
  getCompleteStyleDeclaration(lineIndex, charIndex) {
    return _objectSpread2(_objectSpread2({}, pick(this, this.constructor._styleProperties)), this._getStyleDeclaration(lineIndex, charIndex));
  }

  /**
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @param {Object} style
   * @private
   */
  _setStyleDeclaration(lineIndex, charIndex, style) {
    this.styles[lineIndex][charIndex] = style;
  }

  /**
   *
   * @param {Number} lineIndex
   * @param {Number} charIndex
   * @private
   */
  _deleteStyleDeclaration(lineIndex, charIndex) {
    delete this.styles[lineIndex][charIndex];
  }

  /**
   * @param {Number} lineIndex
   * @return {Boolean} if the line exists or not
   * @private
   */
  _getLineStyle(lineIndex) {
    return !!this.styles[lineIndex];
  }

  /**
   * Set the line style to an empty object so that is initialized
   * @param {Number} lineIndex
   * @private
   */
  _setLineStyle(lineIndex) {
    this.styles[lineIndex] = {};
  }
  _deleteLineStyle(lineIndex) {
    delete this.styles[lineIndex];
  }
}
_defineProperty(StyledText, "_styleProperties", styleProperties);

export { StyledText };
//# sourceMappingURL=StyledText.mjs.map
