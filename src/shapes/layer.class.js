(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {});

  if (fabric.Layer) {
    fabric.warn('fabric.Layer is already defined');
    return;
  }

  /**
   * Layer class
   * @class fabric.Layer
   * @extends fabric.Object
   * @mixes fabric.Collection
   * @see {@link fabric.Layer#initialize} for constructor definition
   */
  fabric.Layer = fabric.util.createClass(fabric.ICollection, /** @lends fabric.ICollection.prototype */ {

    /**
     * @default
     * @type string
     */
    type: 'layer',

    /**
     * @override
     * @default
     */
    layout: 'auto',

    /**
     * @override
     * @default
     */
    strokeWidth: 0,

    /**
     * @override
     * @default
     */
    hasControls: false,

    /**
     * @override
     * @default
     */
    hasBorders: false,

    /**
     * @override
     * @default
     */
    lockMovementX: true,

    /**
     * @override
     * @default
     */
    lockMovementY: true,

    /**
     * 
     * @param {string} key 
     * @param {*} value 
     */
    _set: function (key, value) {
      this.callSuper('_set', key, value);
      if (key === 'canvas') {
        this._applyLayoutStrategy({ type: 'canvas' });
      }
    },

    /**
     * used by canvas' active object logic to determine `subTargets`
     * @private
     * @memberOf fabric.Object.prototype
     * @returns {boolean}
     */
    isSelectable: function () {
      return false;
    },

    /**
     * we do not need to invalidate layout because layer fills the entire canvas
     * @override
     * @private
     */
    __objectMonitor: function () {
      //  noop
    },

    /**
     * Override this method to customize layout
     * @public
     * @param {string} layoutDirective
     * @param {fabric.Object[]} objects
     * @param {object} context object with data regarding what triggered the call
     * @param {'initializion'|'object_modified'|'object_added'|'object_removed'|'layout_change'} context.type
     * @param {fabric.Object[]} context.path array of objects starting from the object that triggered the call to the current one
     * @returns {Object} options object
     */
    getLayoutStrategyResult: function (layoutDirective, objects, context) {  // eslint-disable-line no-unused-vars
      if (context.type === 'canvas' && this.canvas) {
        return {
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          width: this.canvas.width,
          height: this.canvas.height
        };
      }
    },

    toString: function () {
      return '#<fabric.Layer: (' + this.complexity() + ')>';
    },

  });

  /**
   * Returns fabric.Layer instance from an object representation
   * @static
   * @memberOf fabric.Layer
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] invoked with new instance as first argument
   */
  fabric.Layer.fromObject = function (object, callback) {
    callback && fabric.ICollection._fromObject(object, function (objects, options) {
      callback(new fabric.Layer(objects, options));
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
