(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { });

  if (fabric.ActiveSelection) {
    return;
  }

  /**
   * Group class
   * @class fabric.ActiveSelection
   * @extends fabric.Group
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#groups}
   * @see {@link fabric.ActiveSelection#initialize} for constructor definition
   */
  fabric.ActiveSelection = fabric.util.createClass(fabric.ICollection, /** @lends fabric.ActiveSelection.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'activeSelection',

    objectCaching: false,

    /**
     * @override we want instance to render selected objects
     * @private
     */
    __objectSelectionMonitor: function () {
      //  disabled
    },

    /**
     * @private
     * @override
     * @param {fabric.Object} object
     */
    _onObjectRemoved: function (object) {
      delete object.parent;
      this._watchObject(false, object);
      object.fire('removed', { target: this });
    },

    /**
     * Renders controls and borders for the object
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Object} [styleOverride] properties to override the object style
     * @param {Object} [childrenOverride] properties to override the children overrides
     */
    _renderControls: function (ctx, styleOverride, childrenOverride) {
      ctx.save();
      ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
      this.callSuper('_renderControls', ctx, styleOverride);
      childrenOverride = childrenOverride || {};
      if (typeof childrenOverride.hasControls === 'undefined') {
        childrenOverride.hasControls = false;
      }
      childrenOverride.forActiveSelection = true;
      this.forEachObject(function (object) {
        object._renderControls(ctx, childrenOverride);
      });
      ctx.restore();
    },

    /**
     * Returns string representation of a group
     * @return {String}
     */
    toString: function() {
      return '#<fabric.ActiveSelection: (' + this.complexity() + ')>';
    }
  });

  /**
   * Returns {@link fabric.ActiveSelection} instance from an object representation
   * @static
   * @memberOf fabric.ActiveSelection
   * @param {Object} object Object to create a group from
   * @param {Function} [callback] Callback to invoke when an ActiveSelection instance is created
   */
  fabric.ActiveSelection.fromObject = function(object, callback) {
    callback && fabric.ICollection._fromObject(object, function (objects, options) {
      callback(new fabric.ActiveSelection(objects, options));
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
