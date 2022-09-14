// @ts-ignore

import { Point } from '../point.class';
import { createClass } from '../util/lang_class';
import { clone } from '../util/lang_object';

(function (global) {
  'use strict';

  var fabric = global.fabric;

  /**
   * Layer class
   * @class fabric.Layer
   * @extends fabric.Group
   * @see {@link fabric.Layer#initialize} for constructor definition
   */
  fabric.Layer = createClass(
    fabric.Group,
    /** @lends fabric.Layer.prototype */ {
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
      objectCaching: false,

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
       * @default
       * @override
       */
      originX: 'center',

      /**
       * @default
       * @override
       */
      originY: 'center',

      /**
       * we don't want to int with the layer, only with it's objects
       * this makes group selection possible over a layer
       * @override
       * @default
       */
      selectable: false,

      /**
       * Constructor
       *
       * @param {fabric.Object[]} [objects] instance objects
       * @param {Object} [options] Options object
       * @return {fabric.Group} thisArg
       */
      initialize: function (objects, options) {
        this.callSuper('initialize', objects, options);
        this.__canvasMonitor = this.__canvasMonitor.bind(this);
        this.__groupMonitor = this.__groupMonitor.bind(this);
        this.__onAdded = this._watchParent.bind(this, true);
        this.__onRemoved = this._watchParent.bind(this, false);
        this.on('added:initialized', this.__onAdded);
        this.on('added', this.__onAdded);
        this.on('removed', this.__onRemoved);
        //  trigger layout in case parent is passed in options
        var parent = this.group || this.canvas;
        parent && this.__onAdded({ target: parent });
      },

      /**
       * @override we want instance to fill parent so we disregard transformations
       * @param {CanvasRenderingContext2D} ctx Context
       */
      transform: function (ctx) {
        var m = this.calcTransformMatrix(!this.needsFullTransform(ctx));
        ctx.transform(1, 0, 0, 1, m[4], m[5]);
      },

      /**
       * @override apply instance's transformations on objects
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      drawObject: function (ctx) {
        this._renderBackground(ctx);
        ctx.save();
        var m = this.calcTransformMatrix(!this.needsFullTransform(ctx));
        ctx.transform(m[0], m[1], m[2], m[3], 0, 0);
        for (var i = 0, len = this._objects.length; i < len; i++) {
          this._objects[i].render(ctx);
        }
        ctx.restore();
        this._drawClipPath(ctx, this.clipPath);
      },

      /**
       * @private
       * @override we want instance to fill parent so we disregard transformations
       * @param {Object} [options]
       * @param {Number} [options.width]
       * @param {Number} [options.height]
       * @returns {fabric.Point} dimensions
       */
      _getTransformedDimensions: function (options) {
        options = Object.assign(
          {
            width: this.width,
            height: this.height,
          },
          options || {}
        );
        return new Point(options.width, options.height);
      },

      /**
       * we need to invalidate instance's group if objects have changed
       * @override
       * @private
       */
      __objectMonitor: function (opt) {
        this.group && this.group.__objectMonitor(opt);
      },

      /**
       * @private
       * @param {boolean} watch
       * @param {{target:fabric.Group|fabric.Canvas}} [opt]
       */
      _watchParent: function (watch, opt) {
        var target = opt && opt.target;
        //  make sure we listen only once
        this.canvas && this.canvas.off('resize', this.__canvasMonitor);
        this.group && this.group.off('layout', this.__groupMonitor);
        if (!watch) {
          return;
        } else if (target instanceof fabric.Group) {
          this._applyLayoutStrategy({ type: 'group' });
          this.group.on('layout', this.__groupMonitor);
        } else if (target instanceof fabric.StaticCanvas) {
          this._applyLayoutStrategy({ type: 'canvas' });
          this.canvas.on('resize', this.__canvasMonitor);
        }
      },

      /**
       * @private
       */
      __canvasMonitor: function () {
        this._applyLayoutStrategy({ type: 'canvas_resize' });
      },

      /**
       * @private
       */
      __groupMonitor: function (context) {
        this._applyLayoutStrategy(
          Object.assign({}, context, { type: 'group_layout' })
        );
      },

      /**
       * @private
       * @override we do not want to bubble layout
       */
      _bubbleLayout: function () {
        //  noop
      },

      /**
       * Layer will layout itself once it is added to a canvas/group and by listening to it's parent `resize`/`layout` events respectively
       * Override this method to customize layout
       * @public
       * @param {string} layoutDirective
       * @param {fabric.Object[]} objects
       * @param {object} context object with data regarding what triggered the call
       * @param {'initializion'|'canvas'|'canvas_resize'|'layout_change'} context.type
       * @param {fabric.Object[]} context.path array of objects starting from the object that triggered the call to the current one
       * @returns {Object} options object
       */
      getLayoutStrategyResult: function (layoutDirective, objects, context) {
        // eslint-disable-line no-unused-vars
        if (
          (context.type === 'canvas' || context.type === 'canvas_resize') &&
          this.canvas &&
          !this.group
        ) {
          return {
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2,
            width: this.canvas.width,
            height: this.canvas.height,
          };
        } else if (
          (context.type === 'group' || context.type === 'group_layout') &&
          this.group
        ) {
          var w = this.group.width,
            h = this.group.height;
          return {
            centerX: 0,
            centerY: 0,
            width: w,
            height: h,
          };
        }
      },

      toString: function () {
        return '#<fabric.Layer: (' + this.complexity() + ')>';
      },

      dispose: function () {
        this.off('added:initialized', this.__onAdded);
        this.off('added', this.__onAdded);
        this.off('removed', this.__onRemoved);
        this._watchParent(false);
        return this.callSuper('dispose');
      },
    }
  );

  /**
   * Returns fabric.Layer instance from an object representation
   * @static
   * @memberOf fabric.Layer
   * @param {Object} object Object to create an instance from
   * @returns {Promise<fabric.Layer>}
   */
  fabric.Layer.fromObject = function ({ objects = [], ...rest }) {
    const options = clone(rest, true);
    return Promise.all([
      fabric.util.enlivenObjects(objects),
      fabric.util.enlivenObjectEnlivables(options),
    ]).then(
      ([objects, enlivedMap]) =>
        new fabric.Layer(objects, { ...options, ...enlivedMap }, true)
    );
  };
})(typeof exports !== 'undefined' ? exports : window);
