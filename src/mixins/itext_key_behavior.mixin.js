var _set = fabric.IText.prototype._set;

fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea: function() {
    this.hiddenTextarea = fabric.document.createElement('textarea');
    this.hiddenTextarea.value = this.text;

    var ua = navigator.userAgent.toLowerCase();
    var isSafariOnOSX = ua.indexOf('applewebkit') >= 0 && ua.indexOf('safari') >= 0 && ua.indexOf('chrome') === -1 && ua.indexOf('os x') >= 0;

    var cssText = 'position: absolute; overflow: hidden; resize: none; margin: 0;' +
      'padding: 0; border: 0; box-shadow: none; border-radius: 0;';
    if (isSafariOnOSX) {
      // Safari on OSX does not show the cursor in an empty textarea that is transparent (#93615228)
      // Instead make it nearly transparent.
      // After some experimentation, this is the lowest alpha value you can have and still have the cursor.
      cssText += 'background-color: rgba(255, 255, 255, 0.004);';
    } else {
      // Don't do the above hack on other browsers to avoid pointless alpha blending.
      cssText += 'background-color: transparent;';
    }
    this.hiddenTextarea.style.cssText = cssText;
    //If at all possible, show the textarea within the canvas wrapper where it can exist
    //at the same height as the iText display. This prevents iOS from scrolling to whatever
    //height the textarea is at when you type.
    if (this.canvas && this.canvas.wrapperEl) {
      this.canvas.wrapperEl.appendChild(this.hiddenTextarea);

      var updateHiddenTextareaPosition = this._updateHiddenTextareaPosition.bind(this);
      this.on('event:scaling', updateHiddenTextareaPosition);
      this.on('event:moving', updateHiddenTextareaPosition);
      this.on('editing:exited', function() {
        this.off('event:scaling', updateHiddenTextareaPosition);
        this.off('event:moving', updateHiddenTextareaPosition);
      }.bind(this));

      this._updateHiddenTextareaPosition();
    }
    else {
      fabric.document.body.appendChild(this.hiddenTextarea);
    }

    fabric.util.addListener(this.hiddenTextarea, 'keydown', this.onKeyDown.bind(this));
    fabric.util.addListener(this.hiddenTextarea, 'input', this.onInput.bind(this));

    if (!this._clickHandlerInitialized && this.canvas) {
      fabric.util.addListener(this.canvas.upperCanvasEl, 'click', this.onClick.bind(this));
      this._clickHandlerInitialized = true;
    }
  },

  _initDimensions: function() {
    this.callSuper('_initDimensions');
    this._updateHiddenTextareaPosition();
  },

  _updateHiddenTextareaPosition: function() {
    if (this.isEditing && this.canvas.getActiveObject() === this) {
      // Compute the scale transform between fabric coords and DOM coords
      var canvasRect = this.canvas.lowerCanvasEl.getBoundingClientRect();
      var zoom = this.canvas.getZoom();
      var xScale = canvasRect.width / this.canvas.width * zoom;
      var yScale = canvasRect.height / this.canvas.height * zoom;

      //Use getCenterPoint() instead of this.left/top to calculate the appropriate top/left for
      //the textbox so that if the shape is rotated, we still draw ourselves within the rotated shape
      var top = (this.getCenterPoint().y - 0.5 * this.height) * yScale;
      var left = (this.getCenterPoint().x - 0.5 * this.width) * xScale;
      var width = this.getWidth() * xScale;
      var height = this.getHeight() * yScale;

      // Move the textarea to the left, top, bottom, or right as needed in order
      // to keep the textarea roughly on the canvas.
      // This has the effect of possibly making the textarea not in the same spot as
      // the rendered text.
      // Who cares. It's better than having the browser try and keep the cursor on
      // the screen, which it does even if clipped away.
      // Fixes #93604260

      // I'm leaving all of the pointless 0's in the code below to illustrate an important point:
      // The left/top of the canvasRect in its own coordinate space is 0,0
      // Therefore, you could consider canvasRect.left === canvasRect.top === 0
      var topOverflow = Math.max(0 - top, 0);
      var leftOverflow = Math.max(0 - left, 0);
      var bottomOverflow = Math.max((top + height) - (0 + canvasRect.height), 0);
      var rightOverflow = Math.max((left + width) - (0 + canvasRect.width), 0);

      if (topOverflow > 0) {
        top += topOverflow;
      }
      if (bottomOverflow > 0) {
        top -= bottomOverflow;
      }
      if (leftOverflow > 0) {
        left += leftOverflow;
      }
      if (rightOverflow > 0) {
        left -= rightOverflow;
      }

      this.hiddenTextarea.style.width = width + 'px';
      this.hiddenTextarea.style.height = height + 'px';
      this.hiddenTextarea.style.top = top + 'px';
      this.hiddenTextarea.style.left = left + 'px';

      // Calculate clipping rect for textarea so it doesn't overflow the canvas.
      //
      // Setting overflow: hidden doesn't work very well because browsers will still scroll to
      // keep the cursor on the screen, so this seems to be the best option.
      var widthOverflow = Math.max(left + width - canvasRect.width, 0);
      var heightOverflow = Math.max(top + height - canvasRect.height, 0);
      var clipWidth = 'auto';
      var clipHeight = 'auto';
      if (widthOverflow > 0) clipWidth = width - widthOverflow + 'px';
      if (heightOverflow > 0) clipHeight = height - heightOverflow + 'px';
      this.hiddenTextarea.style.clip = 'rect(auto,' + clipWidth + ',' + clipHeight + ',auto)';

      this.hiddenTextarea.style.fontSize = this.fontSize * xScale + 'px';
      this.hiddenTextarea.style.color = this.fill;
      this.hiddenTextarea.style.textAlign = this.textAlign;
      this.hiddenTextarea.style.lineHeight = this.lineHeight * this._fontSizeMult;

    }
  },

  _set: function(key, value) {
    _set.apply(this, arguments);

    // Update textarea color if the fill is modified
    if (key === 'fill') {
      this._updateHiddenTextareaPosition();
    }
  },

  /**
   * @private
   */
  _keysMap: {
    9:  'exitEditing',
    27: 'exitEditing',
  },

  /**
   * @private
   */
  _ctrlKeysMap: {
  },

  onClick: function() {
    // No need to trigger click event here, focus is enough to have the keyboard appear on Android
    this.hiddenTextarea && this.hiddenTextarea.focus();
  },

  /**
   * Handles keyup event
   * @param {Event} e Event object
   */
  onKeyDown: function(e) {
    if (!this.isEditing) {
      return;
    }
    if (e.keyCode in this._keysMap) {
      this[this._keysMap[e.keyCode]](e);
    }
    else if ((e.keyCode in this._ctrlKeysMap) && (e.ctrlKey || e.metaKey)) {
      this[this._ctrlKeysMap[e.keyCode]](e);
    }
    else {
      // Prevent other keydown handlers from calling preventDefault() on events the textarea needs to receive, like arrows and backspace.
      e.stopPropagation();
      return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
    this.canvas && this.canvas.renderAll();
  },

  /**
   * Handles input event
   * @param {Event} e Event object
   */
  onInput: function(e) {
    if (!this.isEditing) {
      return;
    }
    var newValue = stripControlCharacters(this.hiddenTextarea.value);
    if (this.hiddenTextarea.value !== newValue) {
      // If we stripped something, update the textarea. This will cause the cursor to jump, so we avoid it normally.
      this.hiddenTextarea.value = newValue;
    }

    this.set('text', this.hiddenTextarea.value);

    // Broadcast hiddenTextArea input events as 'changed' event on this itext instance
    this.fire('changed');
  }
});

function stripControlCharacters(text) {
  return text
    .replace(/\t/g, ' ')  // Replace TAB with a single space - that's how Fabric renders it, so it should look the same in the textarea
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, '') // Strip all ASCII control characters except LF (0x0A) and CR (0x0D)
  ;
}
