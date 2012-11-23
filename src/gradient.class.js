(function() {

  function getColorStopFromStyle(el) {
    var style = el.getAttribute('style');

    if (style) {
      var keyValuePairs = style.split(/\s*;\s*/);

      if (keyValuePairs[keyValuePairs.length-1] === '') {
        keyValuePairs.pop();
      }

      for (var i = keyValuePairs.length; i--; ) {

        var split = keyValuePairs[i].split(/\s*:\s*/),
            key = split[0].trim(),
            value = split[1].trim();

        if (key === 'stop-color') {
          return value;
        }
      }
    }
  }

  /**
   * @class Gradient
   * @memberOf fabric
   */
  fabric.Gradient = fabric.util.createClass(/** @scope fabric.Gradient.prototype */ {

    /**
     * @method initialize
     * @param options optional Options with x1, y1, x2, y2 and colorStops
     */
    initialize: function(options) {

      options || (options = { });

      this.x1 = options.x1 || 0;
      this.y1 = options.y1 || 0;
      this.x2 = options.x2 || 0;
      this.y2 = options.y2 || 0;

      this.colorStops = options.colorStops;
    },

    /**
     * Returns object representation of a gradient
     * @method toObject
     */
    toObject: function() {
      return {
        x1: this.x1,
        x2: this.x2,
        y1: this.y1,
        y2: this.y2,
        colorStops: this.colorStops
      };
    },

    /**
     * Returns an instance of CanvasGradient
     * @method toLiveGradient
     * @param ctx
     */
    toLiveGradient: function(ctx) {
      var gradient = ctx.createLinearGradient(
        this.x1, this.y1, this.x2 || ctx.canvas.width, this.y2);

      for (var position in this.colorStops) {
        var colorValue = this.colorStops[position];
        gradient.addColorStop(parseFloat(position), colorValue);
      }

      return gradient;
    }
  });

  fabric.util.object.extend(fabric.Gradient, {

    /**
     * @method fromElement
     * @static
     * @memberof fabric.Gradient
     * @see http://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
     */
    fromElement: function(el, instance) {

      /**
       *  @example:
       *
       *  <linearGradient id="grad1">
       *    <stop offset="0%" stop-color="white"/>
       *    <stop offset="100%" stop-color="black"/>
       *  </linearGradient>
       *
       *  OR
       *
       *  <linearGradient id="grad1">
       *    <stop offset="0%" style="stop-color:rgb(255,255,255)"/>
       *    <stop offset="100%" style="stop-color:rgb(0,0,0)"/>
       *  </linearGradient>
       *
       */

      var colorStopEls = el.getElementsByTagName('stop'),
          offset,
          colorStops = { },
          coords = {
            x1: el.getAttribute('x1') || 0,
            y1: el.getAttribute('y1') || 0,
            x2: el.getAttribute('x2') || '100%',
            y2: el.getAttribute('y2') || 0
          };

      for (var i = colorStopEls.length; i--; ) {
        el = colorStopEls[i];
        offset = el.getAttribute('offset');

        // convert percents to absolute values
        offset = parseFloat(offset) / (/%$/.test(offset) ? 100 : 1);
        colorStops[offset] = getColorStopFromStyle(el) || el.getAttribute('stop-color');
      }

      _convertPercentUnitsToValues(instance, coords);

      return new fabric.Gradient({
        x1: coords.x1,
        y1: coords.y1,
        x2: coords.x2,
        y2: coords.y2,
        colorStops: colorStops
      });
    },

    /**
     * @method forObject
     * @static
     * @memberof fabric.Gradient
     */
    forObject: function(obj, options) {
      options || (options = { });
      _convertPercentUnitsToValues(obj, options);
      return new fabric.Gradient(options);
    }
  });

  function _convertPercentUnitsToValues(object, options) {
    for (var prop in options) {
      if (typeof options[prop] === 'string' && /^\d+%$/.test(options[prop])) {
        var percents = parseFloat(options[prop], 10);
        if (prop === 'x1' || prop === 'x2') {
          options[prop] = object.width * percents / 100;
        }
        else if (prop === 'y1' || prop === 'y2') {
          options[prop] = object.height * percents / 100;
        }
      }
      // normalize rendering point (should be from top/left corner rather than center of the shape)
      if (prop === 'x1' || prop === 'x2') {
        options[prop] -= object.width / 2;
      }
      else if (prop === 'y1' || prop === 'y2') {
        options[prop] -= object.height / 2;
      }
    }
  }

  /**
   * Parses an SVG document, returning all of the gradient declarations found in it
   * @static
   * @function
   * @memberOf fabric
   * @method getGradientDefs
   * @param {SVGDocument} doc SVG document to parse
   * @return {Object} Gradient definitions; key corresponds to element id, value -- to gradient definition element
   */
  function getGradientDefs(doc) {
    var linearGradientEls = doc.getElementsByTagName('linearGradient'),
        radialGradientEls = doc.getElementsByTagName('radialGradient'),
        el, i,
        gradientDefs = { };

    i = linearGradientEls.length;
    for (; i--; ) {
      el = linearGradientEls[i];
      gradientDefs[el.getAttribute('id')] = el;
    }

    i = radialGradientEls.length;
    for (; i--; ) {
      el = radialGradientEls[i];
      gradientDefs[el.getAttribute('id')] = el;
    }

    return gradientDefs;
  }

  fabric.getGradientDefs = getGradientDefs;

})();