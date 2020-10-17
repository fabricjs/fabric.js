(function (global) {
  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend,
    min = fabric.util.array.min,
    max = fabric.util.array.max,
    toFixed = fabric.util.toFixed;

  if (fabric.RadioInput) {
    fabric.warn('fabric.RadioInput is already defined');
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
       */
      type: 'RadioInput',

      /**
       * The checked status
       * @type boolean
       */
      checked: undefined,
      /**
       * The callback when the the checked status change
       * @type function
       */
      onChange: undefined,
      /**
       * The callback when the the input is checked
       * @type function
       */
      onCheckCallback: undefined,
      /**
       * The callback when the the input is unchecked
       * @type function
       */
      onUnCheckCallback: undefined,

      /**
       * Constructor
       * @param {Object} [options] Options object
       * @return {fabric.RadioInput} thisArg
       * @example
            const input = new fabric.RadioInput({
              left: 0,
              top: 0,
              width: 50,
              height: 50,
              stroke: 'blue',
              strokeWidth: 3,
              fillColorOnCheck: 'black',
              checked: false,
              radius: 12,
              onCheckCallback: function (e) {
                console.log('I HAVE BEEN CHECKED');
              },
              onUnCheckCallback: function (e) {
                console.log('I HAVE BEEN UNCHECKED');
              },
              onChange: function (e, check) {
                console.log('I HAVE BEEN CHANGED');
              },
            });
       */

      onCheckChange: function () {
        if (this.isChecked() === true) {
          this.set('fill', 'transparent');
          if (typeof this.onUnCheckCallback === 'function') {
            this.onUnCheckCallback(this);
          }
        } else {
          this.set('fill', this.fillColorOnCheck);
          if (typeof this.onCheckCallback === 'function') {
            this.onCheckCallback(this);
          }
        }
        if (typeof this.onChange === 'function') {
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
          element.fill = element.fillColorOnCheck;
        } else {
          element.fill = 'transparent';
          element.checked = false;
        }
        this.callSuper('initialize', element, options);

        this.on('added', function () {
          this.canvas.on('mouse:down', function (e) {
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
            'toObject',
            ['checked', 'fillColorOnCheck'].concat(propertiesToInclude)
          )
        );
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
})(typeof exports !== 'undefined' ? exports : this);
