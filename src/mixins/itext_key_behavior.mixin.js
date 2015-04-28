var _set = fabric.IText.prototype._set;

fabric.util.object.extend(fabric.IText.prototype, /** @lends fabric.IText.prototype */ {

  /**
   * Initializes hidden textarea (needed to bring up keyboard in iOS)
   */
  initHiddenTextarea: function() {
    this.hiddenTextarea = fabric.document.createElement('textarea');
    this.hiddenTextarea.value = this.text;

    this.hiddenTextarea.style.cssText = 'position: absolute; overflow: hidden; resize: none';
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
      //The text's bounding rectangle, IN CANVAS SPACE (not fabric logical coordinates)
      var rect = this.getBoundingRect();

      // Compute the scale transform between fabric coords and DOM coords
      var canvasRect = this.canvas.lowerCanvasEl.getBoundingClientRect();
      var xScale = canvasRect.width / this.canvas.width;
      var yScale = canvasRect.height / this.canvas.height;
      var zoom = this.canvas.getZoom();

      this.hiddenTextarea.style.top = rect.top * yScale + 'px';
      this.hiddenTextarea.style.left = rect.left * xScale + 'px';
      this.hiddenTextarea.style.width = rect.width * xScale + 'px';
      this.hiddenTextarea.style.height = rect.height * yScale + 'px';
      this.hiddenTextarea.style.fontSize = this.fontSize * xScale * zoom + 'px';
      this.hiddenTextarea.style.color = this.fill;
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
