(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      degreesToRadians = fabric.util.degreesToRadians,
      renderCircleControl = fabric.controlRenderers.renderCircleControl,
      renderSquareControl = fabric.controlRenderers.renderSquareControl;

  function Control(options) {
    if (options.position) {
      this.x = options.position.x;
      this.y = options.position.y;
    }
    delete options.position;
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
    visibility: true,

    /**
     * Drawing angle of the control.
     * Used to reuse the same drawing function for different rotated controls
     * @type {Number}
     * @default 0
     */
    angle: 0,

    /**
     * Maybe useless, maybe will get removed before releaseing
     * @type {String}
     * @default ''
     */
    name: '',

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
     * A styles object for the active state of a control
     * Defines fill
     * @type {Object}
     * @default { fill: '#ffffff', stroke: '#ffffff' }
     */
    activeStyle: { fill: '#ffffff', stroke: '#ffffff'},

    /**
     * Returns control actionHandler
     * @param {fabric.Object} object on which the control is displayed
     * @return {Function}
     */
    getActionHandler: function(/* eventData, transformData, fabricObject */) {
      return this.actionHandler;
    },

    /**
     * Returns control cursorStyle for css using cursorStyle. If you need a more elaborate
     * function you can pass one in the constructor
     * the cursorStyle property
     * @param {fabric.Object} object on which the control is displayed
     * @return {String}
     */
    cursorStyleHandler: function(/* eventData, target, fabricObject */) {
      return this.cursorStyle;
    },

    /**
     * Returns controls visibility
     * @param {fabric.Object} object on which the control is displayed
     * @return {Boolean}
     */
    getVisibility: function(/*fabricObject, name */) {
      return this.visibility;
    },

    /**
     * Sets controls visibility
     * @param {Boolean} visibility for the object
     * @return {Void}
     */
    setVisibility: function(visibility /* name, fabricObject */) {
      this.visibility = visibility;
    },


    positionHandler: function(dim, finalMatrix, fabricObject /* currentControl */ ) {
      var padding = fabricObject.padding, angle = degreesToRadians(fabricObject.angle),
          cos = fabric.util.cos(angle), sin = fabric.util.sin(angle), offsetX = this.offsetX,
          offsetY = this.offsetY, cosP = cos * padding, sinP = sin * padding, cosY = cos * offsetY,
          cosX = cos * offsetX, sinY = sin * offsetY, sinX = sin * offsetX,
          point = fabric.util.transformPoint({
            x: (this.x * dim.x),
            y: (this.y * dim.y) }, finalMatrix);
      if (this.x > 0) {
        point.y += sinP + sinX + cosY;
        point.x += cosP + cosX - sinY;
      }
      if (this.y > 0) {
        point.y += cosP + sinX + cosY;
        point.x += -sinP + cosX - sinY;
      }
      if (this.x < 0) {
        point.y += -sinP;
        point.x += -cosP;
      }
      if (this.y < 0) {
        point.y += -cosP + sinX + cosY;
        point.x += sinP - cosX + sinY;
      }
      return point;
    },

    /**
    * Render function for the control.
    * When this function runs the context is already centered on the object and rotated with
    * object angle. So when thinking of your rendering function think of the object align with the
    * axis and your origin 0,0 is the center point of the control. Dimensions are in pixels, object
    * scale or skew does not count.
    * @param {RenderingContext2D} ctx the context where the control will be drawn
    * @param {String} methodName fill or stroke, This is probably removed
    * @param {Number} left position of the canvas where we are about to render the control.
    * @param {Number} top position of the canvas where we are about to render the control.
    * @param {Object} styleOverride
    * @param {fabric.Object} fabricObject the object where the control is about to be rendered
    */
    render: function(ctx, methodName, left, top, styleOverride, fabricObject) {
      styleOverride = styleOverride || {};
      if (!this.getVisibility()) {
        return;
      }
      switch (styleOverride.cornerStyle || fabricObject.cornerStyle) {
        case 'circle':
          renderCircleControl.call(this, ctx, methodName, left, top, styleOverride, fabricObject);
          break;
        default:
          renderSquareControl.call(this, ctx, methodName, left, top, styleOverride, fabricObject);
      }
    },
  };

})(typeof exports !== 'undefined' ? exports : this);
