var _set = fabric.IText.prototype._set;

fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea: function() {
    this.hiddenTextarea = fabric.document.createElement('textarea');
    this.hiddenTextarea.value = this.text;

    this.hiddenTextarea.style.cssText = 'position: absolute; overflow: hidden; resize: none; margin: 0; padding: 0; border: 0; box-shadow: none; border-radius: 0; background-color: transparent;';
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

      var top = this.top * yScale;
      var left = this.left * xScale;
      var width = this.getWidth() * xScale;
      var heightFudgeFactor = this.fontSize * xScale;
      var height = (this._measuredHeight || this.getHeight()) * yScale + heightFudgeFactor;

      this.hiddenTextarea.style.width = width + 'px';
      this.hiddenTextarea.style.height = height + 'px';

      // Compensate for rotation of the text's topleft
      if (this.angle >= 45 && this.angle < 135) {
        this.hiddenTextarea.style.top = top + 'px';
        this.hiddenTextarea.style.left = left - height + 'px';
      } else if (this.angle >= 135 && this.angle < 225) {
        this.hiddenTextarea.style.top = top - height + 'px';
        this.hiddenTextarea.style.left = left - width + 'px';
      } else if (this.angle >= 225 && this.angle < 315) {
        this.hiddenTextarea.style.top = top - width + 'px';
        this.hiddenTextarea.style.left = left + 'px';
      } else { // angle >= 315 && angle < 45
        this.hiddenTextarea.style.top = top + 'px';
        this.hiddenTextarea.style.left = left + 'px';
      }

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
   * Handles keypress event
   * @param {Event} e Event object
   */
  onInput: function(e) {
    if (!this.isEditing) {
      return;
    }
    this.set('text', this.hiddenTextarea.value);
  }
});
