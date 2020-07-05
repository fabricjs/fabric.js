(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { });

  function Control(options) {
    for (var i in options) {
      this[i] = options[i];
    }
  }

  fabric.Control = Control;

  fabric.Control.prototype = /** @lends fabric.Control.prototype */ {

    /**
     * keep track of control visibility.
     * mainly for backward compatibility.
     * if you do not want to see a control, you can remove it
     * from the controlset.
     * @type {Boolean}
     * @default true
     */
    visible: true,

    /**
     * Name of the action that the controll will likely execute.
     * This is optional. FabricJS uses to identify what the user is doing for some
     * extra optimizations. If you are writing a custom control and you want to know
     * somewhere else in the code what is going on, you can use this string here.
     * you can also provide a custom getActionName if your control run multiple actions
     * depending on some external state.
     * default to scale since is the most common, used on 4 corners by default
     * @type {String}
     * @default 'scale'
     */
    actionName: 'scale',

    /**
     * Drawing angle of the control.
     * NOT used for now, but name marked as needed for internal logic
     * example: to reuse the same drawing function for different rotated controls
     * @type {Number}
     * @default 0
     */
    angle: 0,

    /**
     * Relative position of the control. X
     * 0,0 is the center of the Object, while -0.5 (left) or 0.5 (right) are the extremities
     * of the bounding box.
     * @type {Number}
     * @default 0
     */
    x: 0,

    /**
     * Relative position of the control. Y
     * 0,0 is the center of the Object, while -0.5 (top) or 0.5 (bottom) are the extremities
     * of the bounding box.
     * @type {Number}
     * @default 0
     */
    y: 0,

    /**
     * Horizontal offset of the control from the defined position. In pixels
     * Positive offset moves the control to the right, negative to the left.
     * It used when you want to have position of control that does not scale with
     * the bounding box. Example: rotation control is placed at x:0, y: 0.5 on
     * the boundindbox, with an offset of 30 pixels vertivally. Those 30 pixels will
     * stay 30 pixels no matter how the object is big. Another example is having 2
     * controls in the corner, that stay in the same position when the object scale.
     * of the bounding box.
     * @type {Number}
     * @default 0
     */
    offsetX: 0,

    /**
     * Vertical offset of the control from the defined position. In pixels
     * Positive offset moves the control to the bottom, negative to the top.
     * @type {Number}
     * @default 0
     */
    offsetY: 0,

    /**
     * Css cursor style to display when the control is hovered.
     * if the method `cursorStyleHandler` is provided, this property is ignored.
     * @type {String}
     * @default 'crosshair'
     */
    cursorStyle: 'crosshair',

    /**
     * If controls has an offsetY or offsetX, draw a line that connects
     * the control to the bounding box
     * @type {Boolean}
     * @default false
     */
    withConnection: false,

    /**
     * The control actionHandler, provide one to handle action ( control being moved )
     * @param {Event} eventData the native mouse event
     * @param {Object} transformData properties of the current transform
     * @param {fabric.Object} object on which the control is displayed
     * @return {Function}
     */
    actionHandler: function(/* eventData, transformData, fabricObject */) { },

    /**
     * The control handler for mouse down, provide one to handle mouse down on control
     * @param {Event} eventData the native mouse event
     * @param {Object} transformData properties of the current transform
     * @param {fabric.Object} object on which the control is displayed
     * @return {Function}
     */
    mouseDownHandler: function(/* eventData, transformData, fabricObject */) { },

    /**
     * The control mouseUpHandler, provide one to handle an effect on mouse up.
     * @param {Event} eventData the native mouse event
     * @param {Object} transformData properties of the current transform
     * @param {fabric.Object} object on which the control is displayed
     * @return {Function}
     */
    mouseUpHandler: function(/* eventData, transformData, fabricObject */) { },

    /**
     * Returns control actionHandler
     * @param {Event} eventData the native mouse event
     * @param {Object} transformData properties of the current transform
     * @param {fabric.Object} object on which the control is displayed
     * @return {Function}
     */
    getActionHandler: function(/* eventData, transformData, fabricObject */) {
      return this.actionHandler;
    },

    /**
     * Returns control mouseDown handler
     * @param {Event} eventData the native mouse event
     * @param {Object} transformData properties of the current transform
     * @param {fabric.Object} object on which the control is displayed
     * @return {Function}
     */
    getMouseDownHandler: function(/* eventData, fabricObject, control */) {
      return this.mouseDownHandler;
    },

    /**
     * Returns control mouseUp handler
     * @param {Event} eventData the native mouse event
     * @param {Object} transformData properties of the current transform
     * @param {fabric.Object} object on which the control is displayed
     * @return {Function}
     */
    getMouseUpHandler: function(/* eventData, fabricObject, control */) {
      return this.mouseUpHandler;
    },

    /**
     * Returns control cursorStyle for css using cursorStyle. If you need a more elaborate
     * function you can pass one in the constructor
     * the cursorStyle property
     * @param {Event} eventData the native mouse event
     * @param {fabric.Control} control the current control ( likely this)
     * @param {fabric.Object} object on which the control is displayed
     * @return {String}
     */
    cursorStyleHandler: function(eventData, control /* fabricObject */) {
      return control.cursorStyle;
    },

    /**
     * Returns the action name. The basic implementation just return the actionName property.
     * @param {Event} eventData the native mouse event
     * @param {fabric.Control} control the current control ( likely this)
     * @param {fabric.Object} object on which the control is displayed
     * @return {String}
     */
    getActionName: function(eventData, control /* fabricObject */) {
      return control.actionName;
    },

    /**
     * Returns controls visibility
     * @param {fabric.Object} object on which the control is displayed
     * @param {String} controlKey key where the control is memorized on the
     * @return {Boolean}
     */
    getVisibility: function(fabricObject, controlKey) {
      var objectVisibility = fabricObject._controlsVisibility;
      if (objectVisibility && typeof objectVisibility[controlKey] !== 'undefined') {
        return objectVisibility[controlKey];
      }
      return this.visible;
    },

    /**
     * Sets controls visibility
     * @param {Boolean} visibility for the object
     * @return {Void}
     */
    setVisibility: function(visibility /* name, fabricObject */) {
      this.visible = visibility;
    },


    positionHandler: function(dim, finalMatrix /*, fabricObject, currentControl */) {
      var point = fabric.util.transformPoint({
        x: this.x * dim.x + this.offsetX,
        y: this.y * dim.y + this.offsetY }, finalMatrix);
      return point;
    },

    /**
    * Render function for the control.
    * When this function runs the context is unscaled. unrotate. Just retina scaled.
    * all the functions will have to translate to the point left,top before starting Drawing
    * if they want to draw a control where the position is detected.
    * left and top are the result of the positionHandler function
    * @param {RenderingContext2D} ctx the context where the control will be drawn
    * @param {Number} left position of the canvas where we are about to render the control.
    * @param {Number} top position of the canvas where we are about to render the control.
    * @param {Object} styleOverride
    * @param {fabric.Object} fabricObject the object where the control is about to be rendered
    */
    render: function(ctx, left, top, styleOverride, fabricObject) {
      styleOverride = styleOverride || {};
      switch (styleOverride.cornerStyle || fabricObject.cornerStyle) {
        case 'circle':
          fabric.controlsUtils.renderCircleControl.call(this, ctx, left, top, styleOverride, fabricObject);
          break;
        default:
          fabric.controlsUtils.renderSquareControl.call(this, ctx, left, top, styleOverride, fabricObject);
      }
    },
  };

})(typeof exports !== 'undefined' ? exports : this);
