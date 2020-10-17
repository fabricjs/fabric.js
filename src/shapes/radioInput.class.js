(function (global) {
  "use strict";

  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend,
    min = fabric.util.array.min,
    max = fabric.util.array.max,
    toFixed = fabric.util.toFixed;

  if (fabric.RadioInput) {
    fabric.warn("fabric.RadioInput is already defined");
    return;
  }

  /**
   * RadioInput class
   * @class fabric.RadioInput
   * @extends fabric.Object
   * @see {@link fabric.RadioInput#initialize} for constructor definition
   */
  fabric.RadioInput = fabric.util.createClass(
    fabric.Circle,
    /** @lends fabric.RadioInput.prototype */ {
      /**
       * Type of an object
       * @type String
       * @default
       */
      type: "RadioInput",

      /**
       * Points array
       * @type Array
       * @default
       */
      checked: undefined,
      /**
       * Points array
       * @type Array
       * @default
       */
      onChange: undefined,
      /**
       * Points array
       * @type Array
       * @default
       */
      onCheckCallback: undefined,
      /**
       * Points array
       * @type Array
       * @default
       */
      onUnCheckCallback: undefined,

      /**
       * Constructor
       * @param {Array} points Array of points (where each point is an object with x and y)
       * @param {Object} [options] Options object
       * @return {fabric.RadioInput} thisArg
       * @example
       * var poly = new fabric.RadioInput([
       *     { x: 10, y: 10 },
       *     { x: 50, y: 30 },
       *     { x: 40, y: 70 },
       *     { x: 60, y: 50 },
       *     { x: 100, y: 150 },
       *     { x: 40, y: 100 }
       *   ], {
       *   stroke: 'red',
       *   left: 100,
       *   top: 100
       * });
       */

      onCheckChange: function () {
        if (this.isChecked() === true) {
          this.set("fill", "transparent");
          if (typeof this.onUnCheckCallback === "function") {
            this.onUnCheckCallback(this);
          }
        } else {
          this.set("fill", this.onCheckFillColor);
          if (typeof this.onCheckCallback === "function") {
            this.onCheckCallback(this);
          }
        }
        if (typeof this.onChange === "function") {
          this.onChange(this, this.checked);
        }
        this.canvas.renderAll();
      },

      onMouseDown: function (e) {
        if (e.target === this) {
          this.onCheckChange();
          this.checked = !this.checked;
        }
      },
      isChecked: function () {
        return this.checked;
      },

      initialize: function (element, options) {
        options = options || {};
        var _this = this;
        if (element.checked === true) {
          element.fill = element.onCheckFillColor;
        } else {
          element.fill = "transparent";
          element.checked = false;
        }
        this.callSuper("initialize", element, options);

        this.on("added", function () {
          this.canvas.on("mouse:down", function (e) {
            _this.onMouseDown(e);
          });
        });
      },

      /**
       * Returns object representation of an instance
       * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
       * @return {Object} Object representation of an instance
       */
      toObject: function (propertiesToInclude) {
        return fabric.util.object.extend(
          this.callSuper(
            "toObject",
            [
              "checked",
              "onCheckFillColor",
              "onChange",
              "onCheckCallback",
              "onUnCheckCallback",
            ].concat(propertiesToInclude)
          )
        );
      },

      /**
       * @private
       * @param {CanvasRenderingContext2D} ctx Context to render on
       */
      _render: function (ctx) {
        this.callSuper("_render", ctx);
      },
    }
  );
  /**
   * Returns fabric.RadioInput instance from an object representation
   * @static
   * @memberOf fabric.RadioInput
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.Path instance is created
   */
  fabric.RadioInput.fromObject = function (object, callback) {
    callback && callback(new fabric.RadioInput(object));
  };
  fabric.RadioInput.async = true;
})(typeof exports !== "undefined" ? exports : this);
