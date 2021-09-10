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
     * unique key - used for now just to confirm play/pause for specific tokens
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
     * Indicates where audio playback is currently (in ms) //not used yet
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

    canBeActiveAndIndicated: true,

    /**
     * Special rendering (like grayscale filter) for not active objects
     * @type boolean
     * @default false
     */
    isGrayScaleEnabled: false,

    /**
     * extra space taken up on the left by delete controls (used for collision detection)
     * @type Number
     * @default
     */
    leftMargin: 44,

    /**
     * Size in pixels of the (before any scaling) touch area of the delete control
     * @type Number
     * @default
     */
    deleteControlSize: 36,

    /**
     * Size in pixels of the (before any scaling) touch area of the play control
     * @type Number
     * @default
     */
    playControlSize: 64,

    /**
     * Distance in pixels (before any scaling) of the x-offset of the play control from parent's x
     * @type Number
     * @default
     */
    playControlXOffset: -20,

    /**
     * Distance in pixels (before any scaling) of the y-offset of the play control from parent's y
     * @type Number
     * @default
     */
    playControlYOffset: 0,

    /**
     * List of properties to consider when checking if
     * state of an object is changed ({@link fabric.Object#hasStateChanged})
     * @type Array
     */
    stateProperties: fabric.Object.prototype.stateProperties.concat('isPlaying', 'isPaused'),

    /**
     * Constructor
     * @param {Object} [options] Options object
     * @return {fabric.Audio_token} thisArg
     */
    initialize: function(mediaID, options) {
      options || (options = { });
      this.filters = [];
      this.mediaID = mediaID;
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
      return this.canvas && this.canvas.getActiveObject() === this;
    },

    initImages: function() {
      this.idleImage.src = fabric.Audio_token.prototype.idleImageSrc;
      this.selectedImage.src = fabric.Audio_token.prototype.selectedImageSrc;
      this.pauseControlImage.src = fabric.Audio_token.prototype.pauseControlImageSrc;
      this.playControlImage.src = fabric.Audio_token.prototype.playControlImageSrc;
      this.hoveredPlayControlImage.src = fabric.Audio_token.prototype.hoveredPlayControlImageSrc;
      this.hoveredPauseControlImage.src = fabric.Audio_token.prototype.hoveredPauseControlImageSrc;
      this.clickedPlayControlImage.src = fabric.Audio_token.prototype.clickedPlayControlImageSrc;
      this.clickedPauseControlImage.src = fabric.Audio_token.prototype.clickedPauseControlImageSrc;
      this.grayScaleIdleImage.src = fabric.Audio_token.prototype.grayScaleIdleImageSrc;
      this.grayScalePlayControlImage.src = fabric.Audio_token.prototype.grayScalePlayControlImageSrc;
    },

    /**
     * Returns object representation of an instance
     * @method toObject
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      return this.callSuper('toObject', ['mediaID'].concat(propertiesToInclude));
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
      var image = null;
      if (this._isSelected() && this.selectedImage) {
        image = this.selectedImage;
      } else if (!this._isSelected() && (this.idleImage || this.grayScaleIdleImage)) {
        image = this.isGrayScaleEnabled ? this.grayScaleIdleImage : this.idleImage;
      }
      var dim = this._getNonTransformedDimensions();
      if (image) {
        ctx.save();
        ctx.drawImage(image,  -dim.x / 2, -dim.y / 2, dim.x, dim.y);
        ctx.restore();
      }
      // most fabric controls only draw when the object is active, but we want this one as well
      this._renderPlayControls(ctx);
    },

    _renderPlayControls: function(ctx) {
      if (this.controls.playControl) {
        this.controls.playControl.render(ctx, this.playControlXOffset, this.playControlYOffset, '', this, true);
      }
    },
    // override a base 'drawIndication' in the object_interactivity.mixin.js that is currently used to draw borders
    drawIndication: function(/* ctx */) {
      return;
    },

    idleImageSrc: idleImageSrc,
    selectedImageSrc: selectedImageSrc,
    playControlImageSrc: playControlImageSrc,
    pauseControlImageSrc: pauseControlImageSrc,
    hoveredPlayControlImageSrc: hoveredPlayControlImageSrc,
    hoveredPauseControlImageSrc: hoveredPauseControlImageSrc,
    clickedPlayControlImageSrc: clickedPlayControlImageSrc,
    clickedPauseControlImageSrc: clickedPauseControlImageSrc,
    grayScaleIdleImageSrc: grayScaleIdleImageSrc,
    grayScalePlayControlImageSrc: grayScalePlayControlImageSrc,
    idleImage: document.createElement('img'),
    selectedImage: document.createElement('img'),
    pauseControlImage: document.createElement('img'),
    playControlImage: document.createElement('img'),
    hoveredPlayControlImage: document.createElement('img'),
    hoveredPauseControlImage: document.createElement('img'),
    clickedPlayControlImage: document.createElement('img'),
    clickedPauseControlImage: document.createElement('img'),
    grayScaleIdleImage: document.createElement('img'),
    grayScalePlayControlImage: document.createElement('img')
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
