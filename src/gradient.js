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

  /** @namespace */

  fabric.Gradient = {

    /**
     * @method create
     * @static
     */
    create: function(ctx, options) {
      options || (options = { });

      var x1 = options.x1 || 0,
          y1 = options.y1 || 0,
          x2 = options.x2 || ctx.canvas.width,
          y2 = options.y2 || 0,
          colorStops = options.colorStops;

      var gradient = ctx.createLinearGradient(x1, y1, x2, y2);

      for (var position in colorStops) {
        var colorValue = colorStops[position];
        gradient.addColorStop(parseFloat(position), colorValue);
      }
      return gradient;
    },

    /**
     * @method fromElement
     * @static
     * @see http://www.w3.org/TR/SVG/pservers.html#LinearGradientElement
     */
    fromElement: function(el, ctx, instance) {

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
          el,
          offset,
          colorStops = { },
          colorStopFromStyle,
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

      return fabric.Gradient.create(ctx, {
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
     */
    forObject: function(obj, ctx, options) {
      options || (options = { });

      _convertPercentUnitsToValues(obj, options);

      var gradient = fabric.Gradient.create(ctx, {
        x1: options.x1,
        y1: options.y1,
        x2: options.x2,
        y2: options.y2,
        colorStops: options.colorStops
      });

      return gradient;
    }
  };

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
        el,
        gradientDefs = { };

    for (var i = linearGradientEls.length; i--; ) {
      el = linearGradientEls[i];
      gradientDefs[el.id] = el;
    }

    for (var i = radialGradientEls.length; i--; ) {
      el = radialGradientEls[i];
      gradientDefs[el.id] = el;
    }

    return gradientDefs;
  }

  fabric.getGradientDefs = getGradientDefs;

})();