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
     * To be determined by: NEWXP-1949, likely passed in as a parameter on creation
     * @type string
     * @default
     */
    audioUrl: '',

    hasBorders: false,

    /**
     * extra space taken up on the left by delete controls
     * @type Number
     * @default
     */
    leftMargin: 44,

    //temp
    idleColor: '#00ffff',
    playingColor: '#ff00ff',
    pausedColor: '#ffff00',
    selectedColor: '#ff0000',

    idleImage: null,
    selectedImage: null,
    playControlImage: null,
    pauseControlImage: null,

    idleImageSrc: undefined,
    selectedImageSrc: undefined,
    playControlImageSrc: undefined,
    pauseControlImageSrc: undefined,

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
      this.initImages();
    },

    /**
     * Draws a background for the object big as its untransformed dimensions
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderBackground: function() {
      return;
    },

    _isSelected: function() {
      return this.canvas && this.canvas._activeObject === this;
    },

    initImages: function() {
      if (this.idleImageSrc) {
        //TODO: will this create multiple images if we have multiple instances? Or is this a property of the prototype?
        this.idleImage = document.createElement('img');
        this.idleImage.src = this.idleImageSrc;
      }
      if (this.selectedImageSrc) {
        this.selectedImage = document.createElement('img');
        this.selectedImage.src = this.selectedImageSrc;
      }
      if (this.pauseControlImageSrc) {
        this.pauseControlImage = document.createElement('img');
        this.pauseControlImage.src = this.pauseControlImageSrc;
      }
      if (this.playControlImageSrc) {
        this.playControlImage = document.createElement('img');
        this.playControlImage.src = this.playControlImageSrc;
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _stroke: function(ctx) {//this is all going to change
      var image = null;
      if (this._isSelected() && this.selectedImage) {
        image = this.selectedImage;
      }
      else if (!this._isSelected() && this.idleImage) {
        image = this.idleImage;
      }
      var dim = this._getNonTransformedDimensions();
      if (image) {
        ctx.save();
        ctx.drawImage(image,  -dim.x / 2, -dim.y / 2, dim.x, dim.y);
        ctx.restore();
      }
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return this.callSuper('toObject', ['playState', 'audioUrl'].concat(propertiesToInclude));
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
      // most fabric controls only draw when the object is active, but we want this one as well
      if (this.canvas._activeObject !== this) {
        this._renderPlayControls(ctx);
      }
    },

    _renderPlayControls: function(ctx) {
      if (this.controls.playControl) {
        this.controls.playControl.render(ctx, -20, 0, '', this);
      }else {
          console.log('this.controls.playControl' + this.controls.playControl)
      }
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
