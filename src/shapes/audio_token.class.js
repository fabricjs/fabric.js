(function(global) {

  'use strict';

  if (!global.fabric) {
    global.fabric = { };
  }

  if (global.fabric.Audio_token) {
    fabric.warn('fabric.Audio_token is already defined.');
    return;
  }

  /**
   * Audio_token class
   * @class fabric.Audio_token
   * @extends fabric.Object
   * @see {@link fabric.Audio_token#initialize} for constructor definition
   */
  fabric.Audio_token = fabric.util.createClass(fabric.Object, /** @lends fabric.Audio_token.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'audio_token',

    /**
     * key used to retrieve the audio //not sure how this will work yet
     * @since 2.0.0
     * @type String
     * @default
     */
    cacheKey: '',

    /**
     * Indicates whether audio is in 'play' mode
     * @type Boolean
     * @default
     */
    isPlaying: false,

    /**
     * Indicates whether audio is in 'paused' mode
     * @type Boolean
     * @default
     */
    isPaused: false,

    /**
     * Indicates where audio playback is currently (in ms)
     * @type number
     * @default
     */
    playbackMS: 0,

    /**
     * Audio URL? WIP - not sure how this will be used
     * @type string
     * @default
     */
    audioUrl: '',

    //temp
    idleColor: '#ffffff',
    playingColor: '#ffffff',
    pausedColor: '#ffffff',
    selectedColor: '#ffffff',


    /**
     * List of properties to consider when checking if
     * state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties: fabric.Object.prototype.stateProperties.concat('isPlaying', 'isPaused'),

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {fabric.Audio_token} thisArg
     */
    initialize: function(audioURL ,options) {
      options || (options = { });
      this.filters = [];
      this.audioURL = audioURL;
      this.cacheKey = 'audio_token' + fabric.Object.__uid++;
      this.callSuper('initialize', options);
      this.initBehavior();
    },

    /**
     * Draws a background for the object big as its untransformed dimensions
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderBackground: function(ctx) {
      if (!this.backgroundColor) {
        return;
      }
      var dim = this._getNonTransformedDimensions();
      if (this.isPlaying) {
        ctx.fillStyle = this.playingColor;
      }
      else if (this.isPaused) {
        ctx.fillStyle = this.pausedColor;
      }
      else if (this.isSelected) {
        ctx.fillStyle = this.selectedColor;
      }
      else {
        ctx.fillStyle = this.idleColor;
      }

      ctx.fillRect(
        -dim.x / 2,
        -dim.y / 2,
        dim.x,
        dim.y
      );
      // if there is background color no other shadows
      // should be casted
      this._removeShadow(ctx);
    },


    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _stroke: function(ctx) {//this is all going to change
      if (this.strokeWidth === 0) {
        return;
      }
      var w = this.width / 2, h = this.height / 2;
      ctx.beginPath();
      ctx.moveTo(-w, -h);
      ctx.lineTo(w, -h);
      ctx.lineTo(w, h);
      ctx.lineTo(-w, h);
      ctx.lineTo(-w, -h);
      ctx.closePath();
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return this.callSuper('toObject', ['playState'].concat(propertiesToInclude));
    },


    /**
     * Returns string representation of an instance
     * @return {String} String representation of an instance
     */
    toString: function() {
      return '#<fabric.Audio_token: { id: "' + this.cacheKey + '" }>';
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function(ctx) {
      this._stroke(ctx);
    },

    // I think I will want something like this to draw the audio token
    _renderFill: function(ctx) {
      var elementToDraw = this._element;
      if (!elementToDraw) {
        return;
      }
      var scaleX = this._filterScalingX, scaleY = this._filterScalingY,
          w = this.width, h = this.height, min = Math.min, max = Math.max,
          // crop values cannot be lesser than 0.
          cropX = max(this.cropX, 0), cropY = max(this.cropY, 0),
          elWidth = elementToDraw.naturalWidth || elementToDraw.width,
          elHeight = elementToDraw.naturalHeight || elementToDraw.height,
          sX = cropX * scaleX,
          sY = cropY * scaleY,
          // the width height cannot exceed element width/height, starting from the crop offset.
          sW = min(w * scaleX, elWidth - sX),
          sH = min(h * scaleY, elHeight - sY),
          x = -w / 2, y = -h / 2,
          maxDestW = min(w, elWidth / scaleX - cropX),
          maxDestH = min(h, elHeight / scaleX - cropY);

      elementToDraw && ctx.drawImage(elementToDraw, sX, sY, sW, sH, x, y, maxDestW, maxDestH);
    },
  });

  /**
   * Returns fabric.Audio_token instance from an object representation
   * @static
   * @memberOf fabric.Audio_token
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.Audio_token instance is created
   */
  fabric.Audio_token.fromObject = function(object, callback) {
    return fabric.Object._fromObject('Audio_token', object, callback, 'audio_token');
  };
})(typeof exports !== 'undefined' ? exports : this);
