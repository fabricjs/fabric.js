(function(global) {

  'use strict';

  var fabric  = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  /**
   * Color Matrix filter class
   * @class fabric.Image.filters.ColorMatrix
   * @memberOf fabric.Image.filters
   * @extends fabric.Image.filters.BaseFilter
   * @see {@link fabric.Image.filters.ColorMatrix#initialize} for constructor definition
   * @see {@link http://fabricjs.com/image-filters|ImageFilters demo}
   * @see {@Link http://www.webwasp.co.uk/tutorials/219/Color_Matrix_Filter.php}
   * @see {@Link http://phoboslab.org/log/2013/11/fast-image-filters-with-webgl}
   * @example <caption>Kodachrome filter</caption>
   * var filter = new fabric.Image.filters.ColorMatrix({
   *  matrix: [
       1.1285582396593525, -0.3967382283601348, -0.03992559172921793, 0, 63.72958762196502,
       -0.16404339962244616, 1.0835251566291304, -0.05498805115633132, 0, 24.732407896706203,
       -0.16786010706155763, -0.5603416277695248, 1.6014850761964943, 0, 35.62982807460946,
       0, 0, 0, 1, 0
      ]
   * });
   * object.filters.push(filter);
   * object.applyFilters(canvas.renderAll.bind(canvas));
   */
  fabric.Image.filters.ColorMatrix = fabric.util.createClass(fabric.Image.filters.BaseFilter, /** @lends fabric.Image.filters.ColorMatrix.prototype */ {

    /**
     * Filter type
     * @param {String} type
     * @default
     */
    type: 'ColorMatrix',

    /**
     * Constructor
     * @memberOf fabric.Image.filters.ColorMatrix.prototype
     * @param {Object} [options] Options object
     * @param {Array} [options.matrix] Color Matrix to modify the image data with
     */
    initialize: function( options ) {
      options || ( options = {} );
      this.matrix = options.matrix || [
          1, 0, 0, 0, 0,
          0, 1, 0, 0, 0,
          0, 0, 1, 0, 0,
          0, 0, 0, 1, 0
        ];
    },

    /**
     * Applies filter to canvas element
     * @param {Object} canvasEl Canvas element to apply filter to
     */
    applyTo: function( canvasEl ) {
      var context = canvasEl.getContext( '2d' ),
        imageData = context.getImageData( 0, 0, canvasEl.width, canvasEl.height ),
        data = imageData.data,
        iLen = data.length,
        i,
        r,
        g,
        b,
        a,
        m = this.matrix;

      for ( i = 0; i < iLen; i += 4 ) {
        r = data[ i ];
        g = data[ i + 1 ];
        b = data[ i + 2 ];
        a = data[ i + 3 ];

        data[ i ] = r * m[ 0 ] + g * m[ 1 ] + b * m[ 2 ] + a * m[ 3 ] + m[ 4 ];
        data[ i + 1 ] = r * m[ 5 ] + g * m[ 6 ] + b * m[ 7 ] + a * m[ 8 ] + m[ 9 ];
        data[ i + 2 ] = r * m[ 10 ] + g * m[ 11 ] + b * m[ 12 ] + a * m[ 13 ] + m[ 14 ];
        data[ i + 3 ] = r * m[ 15 ] + g * m[ 16 ] + b * m[ 17 ] + a * m[ 18 ] + m[ 19 ];
      }

      context.putImageData( imageData, 0, 0 );
    },

    /**
     * Returns object representation of an instance
     * @return {Object} Object representation of an instance
     */
    toObject: function() {
      return extend(this.callSuper('toObject'), {
        type: this.type,
        matrix: this.matrix
      });
    }
  });

  /**
   * Returns filter instance from an object representation
   * @static
   * @param {Object} object Object to create an instance from
   * @return {fabric.Image.filters.ColorMatrix} Instance of fabric.Image.filters.ColorMatrix
   */
  fabric.Image.filters.ColorMatrix.fromObject = function( object ) {
    return new fabric.Image.filters.ColorMatrix( object );
  };

})(typeof exports !== 'undefined' ? exports : this);
