(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
      extend = fabric.util.object.extend;

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

    type: 'layer',

    layout: 'spread',

    initialize: function (objects, options) {
      this.callSuper('initialize', objects, extend(options || {}, {
        left: 0,
        top: 0,
        width: options ? options.width : 0,
        height: options ? options.height : 0,
        angle: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        originX: 'left',
        originY: 'top',
        lockRotation: true,
        strokeWidth: 0,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
      }));
      this.once('added', this._applyLayoutStrategy.bind(this, { type: 'added' }));
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
      if (layoutDirective === 'spread' && this.canvas) {
        return {
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          width: this.canvas.width,
          height: this.canvas.height
        };
      }
      return {};
    },

  });
})(typeof exports !== 'undefined' ? exports : this);
