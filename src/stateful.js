fabric.util.object.extend(fabric.Object.prototype, {

  /**
   * List of properties to consider when checking if state of an object is changed (fabric.Object#hasStateChanged);
   * as well as for history (undo/redo) purposes
   * @property
   * @type Array
   */
  stateProperties:  (
    'top left width height scaleX scaleY flipX flipY ' +
    'theta angle opacity cornersize fill overlayFill ' +
    'stroke strokeWidth strokeDashArray fillRule ' +
    'borderScaleFactor transformMatrix selectable'
  ).split(' '),

  /**
   * Returns true if state of an object (one if its state properties) was changed
   * @method hasStateChanged
   * @return {Boolean} true if instance' state has changed
   */
  hasStateChanged: function() {
    return this.stateProperties.some(function(prop) {
      return this[prop] !== this.originalState[prop];
    }, this);
  },

  /**
   * Saves a snapshot of object's state (its state properties)
   * @method saveState
   * @return {fabric.Object} thisArg
   * @chainable
   */
  saveState: function() {
    this.stateProperties.forEach(function(prop) {
      this.originalState[prop] = this.get(prop);
    }, this);
    return this;
  },

  /**
   * Setups state of an object
   * @method setupState
   */
  setupState: function() {
    this.originalState = { };
    this.saveState();
  }
});


// misc:

//     type

// object rendering:

//     top
//     left
//     width
//     height
//     scaleX
//     scaleY
//     flipX
//     flipY
//     theta
//     opacity
//     angle
//     fill
//     fillRule
//     overlayFill
//     stroke
//     strokeWidth
//     strokeDashArray
//     transformMatrix

// object controls:

//     cornersize
//     padding
//     borderColor
//     cornerColor
//     borderOpacityWhenMoving
//     borderScaleFactor
//     selectable
//     hasControls
//     hasBorders
//     hasRotatingPoint
//     rotatingPointOffset