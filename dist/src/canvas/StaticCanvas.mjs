import { defineProperty as _defineProperty, objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { config } from '../config.mjs';
import { CENTER, VERSION } from '../constants.mjs';
import { createCollectionMixin, isCollection } from '../Collection.mjs';
import { CommonMethods } from '../CommonMethods.mjs';
import { Point } from '../Point.mjs';
import { requestAnimFrame, cancelAnimFrame } from '../util/animation/AnimationFrameProvider.mjs';
import { runningAnimations } from '../util/animation/AnimationRegistry.mjs';
import { uid } from '../util/internals/uid.mjs';
import { createCanvasElement, toDataURL } from '../util/misc/dom.mjs';
import { transformPoint, invertTransform } from '../util/misc/matrix.mjs';
import { enlivenObjects, enlivenObjectEnlivables } from '../util/misc/objectEnlive.mjs';
import { pick } from '../util/misc/pick.mjs';
import { matrixToSVG } from '../util/misc/svgParsing.mjs';
import { toFixed } from '../util/misc/toFixed.mjs';
import { isFiller, isTextObject, isPattern } from '../util/typeAssertions.mjs';
import { StaticCanvasDOMManager } from './DOMManagers/StaticCanvasDOMManager.mjs';
import { staticCanvasDefaults } from './StaticCanvasOptions.mjs';
import { log, FabricError } from '../util/internals/console.mjs';
import { getDevicePixelRatio } from '../env/index.mjs';

/**
 * Having both options in TCanvasSizeOptions set to true transform the call in a calcOffset
 * Better try to restrict with types to avoid confusion.
 */

/**
 * Static canvas class
 * @see {@link http://fabricjs.com/static_canvas|StaticCanvas demo}
 * @fires before:render
 * @fires after:render
 * @fires canvas:cleared
 * @fires object:added
 * @fires object:removed
 */
// TODO: fix `EventSpec` inheritance https://github.com/microsoft/TypeScript/issues/26154#issuecomment-1366616260
class StaticCanvas extends createCollectionMixin(CommonMethods) {
  // background

  // overlay

  // rendering config

  /**
   * @todo move to Canvas
   */

  /**
   * @todo move to Canvas
   */

  /**
   * The viewport bounding box in scene plane coordinates, see {@link calcViewportBoundaries}
   */

  /**
   * A reference to the canvas actual HTMLCanvasElement.
   * Can be use to read the raw pixels, but never write or manipulate
   * @type HTMLCanvasElement
   */
  get lowerCanvasEl() {
    var _this$elements$lower;
    return (_this$elements$lower = this.elements.lower) === null || _this$elements$lower === void 0 ? void 0 : _this$elements$lower.el;
  }
  get contextContainer() {
    var _this$elements$lower2;
    return (_this$elements$lower2 = this.elements.lower) === null || _this$elements$lower2 === void 0 ? void 0 : _this$elements$lower2.ctx;
  }

  /**
   * If true the Canvas is in the process or has been disposed/destroyed.
   * No more rendering operation will be executed on this canvas.
   * @type boolean
   */

  /**
   * Started the process of disposing but not done yet.
   * WIll likely complete the render cycle already scheduled but stopping adding more.
   * @type boolean
   */

  /**
   * When true control drawing is skipped.
   * This boolean is used to avoid toDataURL to export controls.
   * Usage of this boolean to build up other flows and features is not supported
   * @type Boolean
   * @default false
   */

  // reference to

  static getDefaults() {
    return StaticCanvas.ownDefaults;
  }
  constructor(el) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super();
    Object.assign(this, this.constructor.getDefaults());
    this.set(options);
    this.initElements(el);
    this._setDimensionsImpl({
      width: this.width || this.elements.lower.el.width || 0,
      height: this.height || this.elements.lower.el.height || 0
    });
    this.skipControlsDrawing = false;
    this.viewportTransform = [...this.viewportTransform];
    this.calcViewportBoundaries();
  }
  initElements(el) {
    this.elements = new StaticCanvasDOMManager(el);
  }
  add() {
    const size = super.add(...arguments);
    arguments.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return size;
  }
  insertAt(index) {
    for (var _len = arguments.length, objects = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      objects[_key - 1] = arguments[_key];
    }
    const size = super.insertAt(index, ...objects);
    objects.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return size;
  }
  remove() {
    const removed = super.remove(...arguments);
    removed.length > 0 && this.renderOnAddRemove && this.requestRenderAll();
    return removed;
  }
  _onObjectAdded(obj) {
    if (obj.canvas && obj.canvas !== this) {
      log('warn', 'Canvas is trying to add an object that belongs to a different canvas.\n' + 'Resulting to default behavior: removing object from previous canvas and adding to new canvas');
      obj.canvas.remove(obj);
    }
    obj._set('canvas', this);
    obj.setCoords();
    this.fire('object:added', {
      target: obj
    });
    obj.fire('added', {
      target: this
    });
  }
  _onObjectRemoved(obj) {
    obj._set('canvas', undefined);
    this.fire('object:removed', {
      target: obj
    });
    obj.fire('removed', {
      target: this
    });
  }
  _onStackOrderChanged() {
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * @private
   * @see https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/HTML-canvas-guide/SettingUptheCanvas/SettingUptheCanvas.html
   * @return {Number} retinaScaling if applied, otherwise 1;
   */
  getRetinaScaling() {
    return this.enableRetinaScaling ? getDevicePixelRatio() : 1;
  }

  /**
   * Calculates canvas element offset relative to the document
   * This method is also attached as "resize" event handler of window
   */
  calcOffset() {
    return this._offset = this.elements.calcOffset();
  }

  /**
   * Returns canvas width (in px)
   * @return {Number}
   */
  getWidth() {
    return this.width;
  }

  /**
   * Returns canvas height (in px)
   * @return {Number}
   */
  getHeight() {
    return this.height;
  }

  /**
   * Sets width of this canvas instance
   * @param {Number|String} value                         Value to set width to
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   * @deprecated will be removed in 7.0
   */

  setWidth(value, options) {
    return this.setDimensions({
      width: value
    }, options);
  }

  /**s
   * Sets height of this canvas instance
   * @param {Number|String} value                         Value to set height to
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   * @deprecated will be removed in 7.0
   */

  setHeight(value, options) {
    return this.setDimensions({
      height: value
    }, options);
  }

  /**
   * Internal use only
   * @protected
   */
  _setDimensionsImpl(dimensions) {
    let {
      cssOnly = false,
      backstoreOnly = false
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!cssOnly) {
      const size = _objectSpread2({
        width: this.width,
        height: this.height
      }, dimensions);
      this.elements.setDimensions(size, this.getRetinaScaling());
      this.hasLostContext = true;
      this.width = size.width;
      this.height = size.height;
    }
    if (!backstoreOnly) {
      this.elements.setCSSDimensions(dimensions);
    }
    this.calcOffset();
  }

  /**
   * Sets dimensions (width, height) of this canvas instance. when options.cssOnly flag active you should also supply the unit of measure (px/%/em)
   * @param {Object}        dimensions                    Object with width/height properties
   * @param {Number|String} [dimensions.width]            Width of canvas element
   * @param {Number|String} [dimensions.height]           Height of canvas element
   * @param {Object}        [options]                     Options object
   * @param {Boolean}       [options.backstoreOnly=false] Set the given dimensions only as canvas backstore dimensions
   * @param {Boolean}       [options.cssOnly=false]       Set the given dimensions only as css dimensions
   */

  setDimensions(dimensions, options) {
    this._setDimensionsImpl(dimensions, options);
    if (!options || !options.cssOnly) {
      this.requestRenderAll();
    }
  }

  /**
   * Returns canvas zoom level
   * @return {Number}
   */
  getZoom() {
    return this.viewportTransform[0];
  }

  /**
   * Sets viewport transformation of this canvas instance
   * @param {Array} vpt a Canvas 2D API transform matrix
   */
  setViewportTransform(vpt) {
    this.viewportTransform = vpt;
    this.calcViewportBoundaries();
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Sets zoom level of this canvas instance, the zoom centered around point
   * meaning that following zoom to point with the same point will have the visual
   * effect of the zoom originating from that point. The point won't move.
   * It has nothing to do with canvas center or visual center of the viewport.
   * @param {Point} point to zoom with respect to
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  zoomToPoint(point, value) {
    // TODO: just change the scale, preserve other transformations
    const before = point,
      vpt = [...this.viewportTransform];
    const newPoint = transformPoint(point, invertTransform(vpt));
    vpt[0] = value;
    vpt[3] = value;
    const after = transformPoint(newPoint, vpt);
    vpt[4] += before.x - after.x;
    vpt[5] += before.y - after.y;
    this.setViewportTransform(vpt);
  }

  /**
   * Sets zoom level of this canvas instance
   * @param {Number} value to set zoom to, less than 1 zooms out
   */
  setZoom(value) {
    this.zoomToPoint(new Point(0, 0), value);
  }

  /**
   * Pan viewport so as to place point at top left corner of canvas
   * @param {Point} point to move to
   */
  absolutePan(point) {
    const vpt = [...this.viewportTransform];
    vpt[4] = -point.x;
    vpt[5] = -point.y;
    return this.setViewportTransform(vpt);
  }

  /**
   * Pans viewpoint relatively
   * @param {Point} point (position vector) to move by
   */
  relativePan(point) {
    return this.absolutePan(new Point(-point.x - this.viewportTransform[4], -point.y - this.viewportTransform[5]));
  }

  /**
   * Returns &lt;canvas> element corresponding to this instance
   * @return {HTMLCanvasElement}
   */
  getElement() {
    return this.elements.lower.el;
  }

  /**
   * Clears specified context of canvas element
   * @param {CanvasRenderingContext2D} ctx Context to clear
   */
  clearContext(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Returns context of canvas where objects are drawn
   * @return {CanvasRenderingContext2D}
   */
  getContext() {
    return this.elements.lower.ctx;
  }

  /**
   * Clears all contexts (background, main, top) of an instance
   */
  clear() {
    this.remove(...this.getObjects());
    this.backgroundImage = undefined;
    this.overlayImage = undefined;
    this.backgroundColor = '';
    this.overlayColor = '';
    this.clearContext(this.getContext());
    this.fire('canvas:cleared');
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Renders the canvas
   */
  renderAll() {
    this.cancelRequestedRender();
    if (this.destroyed) {
      return;
    }
    this.renderCanvas(this.getContext(), this._objects);
  }

  /**
   * Function created to be instance bound at initialization
   * used in requestAnimationFrame rendering
   * Let the fabricJS call it. If you call it manually you could have more
   * animationFrame stacking on to of each other
   * for an imperative rendering, use canvas.renderAll
   * @private
   */
  renderAndReset() {
    this.nextRenderHandle = 0;
    this.renderAll();
  }

  /**
   * Append a renderAll request to next animation frame.
   * unless one is already in progress, in that case nothing is done
   * a boolean flag will avoid appending more.
   */
  requestRenderAll() {
    if (!this.nextRenderHandle && !this.disposed && !this.destroyed) {
      this.nextRenderHandle = requestAnimFrame(() => this.renderAndReset());
    }
  }

  /**
   * Calculate the position of the 4 corner of canvas with current viewportTransform.
   * helps to determinate when an object is in the current rendering viewport
   */
  calcViewportBoundaries() {
    const width = this.width,
      height = this.height,
      iVpt = invertTransform(this.viewportTransform),
      a = transformPoint({
        x: 0,
        y: 0
      }, iVpt),
      b = transformPoint({
        x: width,
        y: height
      }, iVpt),
      // we don't support vpt flipping
      // but the code is robust enough to mostly work with flipping
      min = a.min(b),
      max = a.max(b);
    return this.vptCoords = {
      tl: min,
      tr: new Point(max.x, min.y),
      bl: new Point(min.x, max.y),
      br: max
    };
  }
  cancelRequestedRender() {
    if (this.nextRenderHandle) {
      cancelAnimFrame(this.nextRenderHandle);
      this.nextRenderHandle = 0;
    }
  }
  drawControls(_ctx) {
    // Static canvas has no controls
  }

  /**
   * Renders background, objects, overlay and controls.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Array} objects to render
   */
  renderCanvas(ctx, objects) {
    if (this.destroyed) {
      return;
    }
    const v = this.viewportTransform,
      path = this.clipPath;
    this.calcViewportBoundaries();
    this.clearContext(ctx);
    ctx.imageSmoothingEnabled = this.imageSmoothingEnabled;
    // @ts-expect-error node-canvas stuff
    ctx.patternQuality = 'best';
    this.fire('before:render', {
      ctx
    });
    this._renderBackground(ctx);
    ctx.save();
    //apply viewport transform once for all rendering process
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);
    this._renderObjects(ctx, objects);
    ctx.restore();
    if (!this.controlsAboveOverlay && !this.skipControlsDrawing) {
      this.drawControls(ctx);
    }
    if (path) {
      path._set('canvas', this);
      // needed to setup a couple of variables
      path.shouldCache();
      path._transformDone = true;
      path.renderCache({
        forClipping: true
      });
      this.drawClipPathOnCanvas(ctx, path);
    }
    this._renderOverlay(ctx);
    if (this.controlsAboveOverlay && !this.skipControlsDrawing) {
      this.drawControls(ctx);
    }
    this.fire('after:render', {
      ctx
    });
    if (this.__cleanupTask) {
      this.__cleanupTask();
      this.__cleanupTask = undefined;
    }
  }

  /**
   * Paint the cached clipPath on the lowerCanvasEl
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  drawClipPathOnCanvas(ctx, clipPath) {
    const v = this.viewportTransform;
    ctx.save();
    ctx.transform(...v);
    // DEBUG: uncomment this line, comment the following
    // ctx.globalAlpha = 0.4;
    ctx.globalCompositeOperation = 'destination-in';
    clipPath.transform(ctx);
    ctx.scale(1 / clipPath.zoomX, 1 / clipPath.zoomY);
    ctx.drawImage(clipPath._cacheCanvas, -clipPath.cacheTranslationX, -clipPath.cacheTranslationY);
    ctx.restore();
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {Array} objects to render
   */
  _renderObjects(ctx, objects) {
    for (let i = 0, len = objects.length; i < len; ++i) {
      objects[i] && objects[i].render(ctx);
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @param {string} property 'background' or 'overlay'
   */
  _renderBackgroundOrOverlay(ctx, property) {
    const fill = this["".concat(property, "Color")],
      object = this["".concat(property, "Image")],
      v = this.viewportTransform,
      needsVpt = this["".concat(property, "Vpt")];
    if (!fill && !object) {
      return;
    }
    const isAFiller = isFiller(fill);
    if (fill) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.width, 0);
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(0, this.height);
      ctx.closePath();
      ctx.fillStyle = isAFiller ? fill.toLive(ctx /* this */) : fill;
      if (needsVpt) {
        ctx.transform(...v);
      }
      if (isAFiller) {
        ctx.transform(1, 0, 0, 1, fill.offsetX || 0, fill.offsetY || 0);
        const m = fill.gradientTransform || fill.patternTransform;
        m && ctx.transform(...m);
      }
      ctx.fill();
      ctx.restore();
    }
    if (object) {
      ctx.save();
      const {
        skipOffscreen
      } = this;
      // if the object doesn't move with the viewport,
      // the offscreen concept does not apply;
      this.skipOffscreen = needsVpt;
      if (needsVpt) {
        ctx.transform(...v);
      }
      object.render(ctx);
      this.skipOffscreen = skipOffscreen;
      ctx.restore();
    }
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderBackground(ctx) {
    this._renderBackgroundOrOverlay(ctx, 'background');
  }

  /**
   * @private
   * @param {CanvasRenderingContext2D} ctx Context to render on
   */
  _renderOverlay(ctx) {
    this._renderBackgroundOrOverlay(ctx, 'overlay');
  }

  /**
   * Returns coordinates of a center of canvas.
   * Returned value is an object with top and left properties
   * @return {Object} object with "top" and "left" number values
   * @deprecated migrate to `getCenterPoint`
   */
  getCenter() {
    return {
      top: this.height / 2,
      left: this.width / 2
    };
  }

  /**
   * Returns coordinates of a center of canvas.
   * @return {Point}
   */
  getCenterPoint() {
    return new Point(this.width / 2, this.height / 2);
  }

  /**
   * Centers object horizontally in the canvas
   */
  centerObjectH(object) {
    return this._centerObject(object, new Point(this.getCenterPoint().x, object.getCenterPoint().y));
  }

  /**
   * Centers object vertically in the canvas
   * @param {FabricObject} object Object to center vertically
   */
  centerObjectV(object) {
    return this._centerObject(object, new Point(object.getCenterPoint().x, this.getCenterPoint().y));
  }

  /**
   * Centers object vertically and horizontally in the canvas
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  centerObject(object) {
    return this._centerObject(object, this.getCenterPoint());
  }

  /**
   * Centers object vertically and horizontally in the viewport
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObject(object) {
    return this._centerObject(object, this.getVpCenter());
  }

  /**
   * Centers object horizontally in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObjectH(object) {
    return this._centerObject(object, new Point(this.getVpCenter().x, object.getCenterPoint().y));
  }

  /**
   * Centers object Vertically in the viewport, object.top is unchanged
   * @param {FabricObject} object Object to center vertically and horizontally
   */
  viewportCenterObjectV(object) {
    return this._centerObject(object, new Point(object.getCenterPoint().x, this.getVpCenter().y));
  }

  /**
   * Calculate the point in canvas that correspond to the center of actual viewport.
   * @return {Point} vpCenter, viewport center
   */
  getVpCenter() {
    return transformPoint(this.getCenterPoint(), invertTransform(this.viewportTransform));
  }

  /**
   * @private
   * @param {FabricObject} object Object to center
   * @param {Point} center Center point
   */
  _centerObject(object, center) {
    object.setXY(center, CENTER, CENTER);
    object.setCoords();
    this.renderOnAddRemove && this.requestRenderAll();
  }

  /**
   * Returns dataless JSON representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {String} json string
   */
  toDatalessJSON(propertiesToInclude) {
    return this.toDatalessObject(propertiesToInclude);
  }

  /**
   * Returns object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude) {
    return this._toObjectMethod('toObject', propertiesToInclude);
  }

  /**
   * Returns Object representation of canvas
   * this alias is provided because if you call JSON.stringify on an instance,
   * the toJSON object will be invoked if it exists.
   * Having a toJSON method means you can do JSON.stringify(myCanvas)
   * @return {Object} JSON compatible object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/pec86/|jsFiddle demo}
   * @example <caption>JSON without additional properties</caption>
   * var json = canvas.toJSON();
   * @example <caption>JSON with additional properties included</caption>
   * var json = canvas.toJSON(['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY']);
   * @example <caption>JSON without default values</caption>
   * var json = canvas.toJSON();
   */
  toJSON() {
    return this.toObject();
  }

  /**
   * Returns dataless object representation of canvas
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toDatalessObject(propertiesToInclude) {
    return this._toObjectMethod('toDatalessObject', propertiesToInclude);
  }

  /**
   * @private
   */
  _toObjectMethod(methodName, propertiesToInclude) {
    const clipPath = this.clipPath;
    const clipPathData = clipPath && !clipPath.excludeFromExport ? this._toObject(clipPath, methodName, propertiesToInclude) : null;
    return _objectSpread2(_objectSpread2(_objectSpread2({
      version: VERSION
    }, pick(this, propertiesToInclude)), {}, {
      objects: this._objects.filter(object => !object.excludeFromExport).map(instance => this._toObject(instance, methodName, propertiesToInclude))
    }, this.__serializeBgOverlay(methodName, propertiesToInclude)), clipPathData ? {
      clipPath: clipPathData
    } : null);
  }

  /**
   * @private
   */
  _toObject(instance, methodName, propertiesToInclude) {
    let originalValue;
    if (!this.includeDefaultValues) {
      originalValue = instance.includeDefaultValues;
      instance.includeDefaultValues = false;
    }
    const object = instance[methodName](propertiesToInclude);
    if (!this.includeDefaultValues) {
      instance.includeDefaultValues = !!originalValue;
    }
    return object;
  }

  /**
   * @private
   */
  __serializeBgOverlay(methodName, propertiesToInclude) {
    const data = {},
      bgImage = this.backgroundImage,
      overlayImage = this.overlayImage,
      bgColor = this.backgroundColor,
      overlayColor = this.overlayColor;
    if (isFiller(bgColor)) {
      if (!bgColor.excludeFromExport) {
        data.background = bgColor.toObject(propertiesToInclude);
      }
    } else if (bgColor) {
      data.background = bgColor;
    }
    if (isFiller(overlayColor)) {
      if (!overlayColor.excludeFromExport) {
        data.overlay = overlayColor.toObject(propertiesToInclude);
      }
    } else if (overlayColor) {
      data.overlay = overlayColor;
    }
    if (bgImage && !bgImage.excludeFromExport) {
      data.backgroundImage = this._toObject(bgImage, methodName, propertiesToInclude);
    }
    if (overlayImage && !overlayImage.excludeFromExport) {
      data.overlayImage = this._toObject(overlayImage, methodName, propertiesToInclude);
    }
    return data;
  }

  /* _TO_SVG_START_ */

  /**
   * Returns SVG representation of canvas
   * @function
   * @param {Object} [options] Options object for SVG output
   * @param {Boolean} [options.suppressPreamble=false] If true xml tag is not included
   * @param {Object} [options.viewBox] SVG viewbox object
   * @param {Number} [options.viewBox.x] x-coordinate of viewbox
   * @param {Number} [options.viewBox.y] y-coordinate of viewbox
   * @param {Number} [options.viewBox.width] Width of viewbox
   * @param {Number} [options.viewBox.height] Height of viewbox
   * @param {String} [options.encoding=UTF-8] Encoding of SVG output
   * @param {String} [options.width] desired width of svg with or without units
   * @param {String} [options.height] desired height of svg with or without units
   * @param {Function} [reviver] Method for further parsing of svg elements, called after each fabric object converted into svg representation.
   * @return {String} SVG string
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#serialization}
   * @see {@link http://jsfiddle.net/fabricjs/jQ3ZZ/|jsFiddle demo}
   * @example <caption>Normal SVG output</caption>
   * var svg = canvas.toSVG();
   * @example <caption>SVG output without preamble (without &lt;?xml ../>)</caption>
   * var svg = canvas.toSVG({suppressPreamble: true});
   * @example <caption>SVG output with viewBox attribute</caption>
   * var svg = canvas.toSVG({
   *   viewBox: {
   *     x: 100,
   *     y: 100,
   *     width: 200,
   *     height: 300
   *   }
   * });
   * @example <caption>SVG output with different encoding (default: UTF-8)</caption>
   * var svg = canvas.toSVG({encoding: 'ISO-8859-1'});
   * @example <caption>Modify SVG output with reviver function</caption>
   * var svg = canvas.toSVG(null, function(svg) {
   *   return svg.replace('stroke-dasharray: ; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; ', '');
   * });
   */
  toSVG() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let reviver = arguments.length > 1 ? arguments[1] : undefined;
    options.reviver = reviver;
    const markup = [];
    this._setSVGPreamble(markup, options);
    this._setSVGHeader(markup, options);
    if (this.clipPath) {
      markup.push("<g clip-path=\"url(#".concat(this.clipPath.clipPathId, ")\" >\n"));
    }
    this._setSVGBgOverlayColor(markup, 'background');
    this._setSVGBgOverlayImage(markup, 'backgroundImage', reviver);
    this._setSVGObjects(markup, reviver);
    if (this.clipPath) {
      markup.push('</g>\n');
    }
    this._setSVGBgOverlayColor(markup, 'overlay');
    this._setSVGBgOverlayImage(markup, 'overlayImage', reviver);
    markup.push('</svg>');
    return markup.join('');
  }

  /**
   * @private
   */
  _setSVGPreamble(markup, options) {
    if (options.suppressPreamble) {
      return;
    }
    markup.push('<?xml version="1.0" encoding="', options.encoding || 'UTF-8', '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n');
  }

  /**
   * @private
   */
  _setSVGHeader(markup, options) {
    const width = options.width || "".concat(this.width),
      height = options.height || "".concat(this.height),
      NUM_FRACTION_DIGITS = config.NUM_FRACTION_DIGITS,
      optViewBox = options.viewBox;
    let viewBox;
    if (optViewBox) {
      viewBox = "viewBox=\"".concat(optViewBox.x, " ").concat(optViewBox.y, " ").concat(optViewBox.width, " ").concat(optViewBox.height, "\" ");
    } else if (this.svgViewportTransformation) {
      const vpt = this.viewportTransform;
      viewBox = "viewBox=\"".concat(toFixed(-vpt[4] / vpt[0], NUM_FRACTION_DIGITS), " ").concat(toFixed(-vpt[5] / vpt[3], NUM_FRACTION_DIGITS), " ").concat(toFixed(this.width / vpt[0], NUM_FRACTION_DIGITS), " ").concat(toFixed(this.height / vpt[3], NUM_FRACTION_DIGITS), "\" ");
    } else {
      viewBox = "viewBox=\"0 0 ".concat(this.width, " ").concat(this.height, "\" ");
    }
    markup.push('<svg ', 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', width, '" ', 'height="', height, '" ', viewBox, 'xml:space="preserve">\n', '<desc>Created with Fabric.js ', VERSION, '</desc>\n', '<defs>\n', this.createSVGFontFacesMarkup(), this.createSVGRefElementsMarkup(), this.createSVGClipPathMarkup(options), '</defs>\n');
  }
  createSVGClipPathMarkup(options) {
    const clipPath = this.clipPath;
    if (clipPath) {
      clipPath.clipPathId = "CLIPPATH_".concat(uid());
      return "<clipPath id=\"".concat(clipPath.clipPathId, "\" >\n").concat(clipPath.toClipPathSVG(options.reviver), "</clipPath>\n");
    }
    return '';
  }

  /**
   * Creates markup containing SVG referenced elements like patterns, gradients etc.
   * @return {String}
   */
  createSVGRefElementsMarkup() {
    return ['background', 'overlay'].map(prop => {
      const fill = this["".concat(prop, "Color")];
      if (isFiller(fill)) {
        const shouldTransform = this["".concat(prop, "Vpt")],
          vpt = this.viewportTransform,
          object = {
            // otherwise circular dependency
            isType: () => false,
            width: this.width / (shouldTransform ? vpt[0] : 1),
            height: this.height / (shouldTransform ? vpt[3] : 1)
          };
        return fill.toSVG(object, {
          additionalTransform: shouldTransform ? matrixToSVG(vpt) : ''
        });
      }
    }).join('');
  }

  /**
   * Creates markup containing SVG font faces,
   * font URLs for font faces must be collected by developers
   * and are not extracted from the DOM by fabricjs
   * @param {Array} objects Array of fabric objects
   * @return {String}
   */
  createSVGFontFacesMarkup() {
    const objects = [],
      fontList = {},
      fontPaths = config.fontPaths;
    this._objects.forEach(function add(object) {
      objects.push(object);
      if (isCollection(object)) {
        object._objects.forEach(add);
      }
    });
    objects.forEach(obj => {
      if (!isTextObject(obj)) {
        return;
      }
      const {
        styles,
        fontFamily
      } = obj;
      if (fontList[fontFamily] || !fontPaths[fontFamily]) {
        return;
      }
      fontList[fontFamily] = true;
      if (!styles) {
        return;
      }
      Object.values(styles).forEach(styleRow => {
        Object.values(styleRow).forEach(_ref => {
          let {
            fontFamily = ''
          } = _ref;
          if (!fontList[fontFamily] && fontPaths[fontFamily]) {
            fontList[fontFamily] = true;
          }
        });
      });
    });
    const fontListMarkup = Object.keys(fontList).map(fontFamily => "\t\t@font-face {\n\t\t\tfont-family: '".concat(fontFamily, "';\n\t\t\tsrc: url('").concat(fontPaths[fontFamily], "');\n\t\t}\n")).join('');
    if (fontListMarkup) {
      return "\t<style type=\"text/css\"><![CDATA[\n".concat(fontListMarkup, "]]></style>\n");
    }
    return '';
  }

  /**
   * @private
   */
  _setSVGObjects(markup, reviver) {
    this.forEachObject(fabricObject => {
      if (fabricObject.excludeFromExport) {
        return;
      }
      this._setSVGObject(markup, fabricObject, reviver);
    });
  }

  /**
   * This is its own function because the Canvas ( non static ) requires extra code here
   * @private
   */
  _setSVGObject(markup, instance, reviver) {
    markup.push(instance.toSVG(reviver));
  }

  /**
   * @private
   */
  _setSVGBgOverlayImage(markup, property, reviver) {
    const bgOrOverlay = this[property];
    if (bgOrOverlay && !bgOrOverlay.excludeFromExport && bgOrOverlay.toSVG) {
      markup.push(bgOrOverlay.toSVG(reviver));
    }
  }

  /**
   * @TODO this seems to handle patterns but fail at gradients.
   * @private
   */
  _setSVGBgOverlayColor(markup, property) {
    const filler = this["".concat(property, "Color")];
    if (!filler) {
      return;
    }
    if (isFiller(filler)) {
      const repeat = filler.repeat || '',
        finalWidth = this.width,
        finalHeight = this.height,
        shouldInvert = this["".concat(property, "Vpt")],
        additionalTransform = shouldInvert ? matrixToSVG(invertTransform(this.viewportTransform)) : '';
      markup.push("<rect transform=\"".concat(additionalTransform, " translate(").concat(finalWidth / 2, ",").concat(finalHeight / 2, ")\" x=\"").concat(filler.offsetX - finalWidth / 2, "\" y=\"").concat(filler.offsetY - finalHeight / 2, "\" width=\"").concat((repeat === 'repeat-y' || repeat === 'no-repeat') && isPattern(filler) ? filler.source.width : finalWidth, "\" height=\"").concat((repeat === 'repeat-x' || repeat === 'no-repeat') && isPattern(filler) ? filler.source.height : finalHeight, "\" fill=\"url(#SVGID_").concat(filler.id, ")\"></rect>\n"));
    } else {
      markup.push('<rect x="0" y="0" width="100%" height="100%" ', 'fill="', filler, '"', '></rect>\n');
    }
  }
  /* _TO_SVG_END_ */

  /**
   * Populates canvas with data from the specified JSON.
   * JSON format must conform to the one of {@link fabric.Canvas#toJSON}
   *
   * **IMPORTANT**: It is recommended to abort loading tasks before calling this method to prevent race conditions and unnecessary networking
   *
   * @param {String|Object} json JSON string or object
   * @param {Function} [reviver] Method for further parsing of JSON elements, called after each fabric object created.
   * @param {Object} [options] options
   * @param {AbortSignal} [options.signal] see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   * @return {Promise<Canvas | StaticCanvas>} instance
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-3#deserialization}
   * @see {@link http://jsfiddle.net/fabricjs/fmgXt/|jsFiddle demo}
   * @example <caption>loadFromJSON</caption>
   * canvas.loadFromJSON(json).then((canvas) => canvas.requestRenderAll());
   * @example <caption>loadFromJSON with reviver</caption>
   * canvas.loadFromJSON(json, function(o, object) {
   *   // `o` = json object
   *   // `object` = fabric.Object instance
   *   // ... do some stuff ...
   * }).then((canvas) => {
   *   ... canvas is restored, add your code.
   * });
   *
   */
  loadFromJSON(json, reviver) {
    let {
      signal
    } = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!json) {
      return Promise.reject(new FabricError('`json` is undefined'));
    }

    // parse json if it wasn't already
    const serialized = typeof json === 'string' ? JSON.parse(json) : json;
    const {
      objects = [],
      backgroundImage,
      background,
      overlayImage,
      overlay,
      clipPath
    } = serialized;
    const renderOnAddRemove = this.renderOnAddRemove;
    this.renderOnAddRemove = false;
    return Promise.all([enlivenObjects(objects, {
      reviver,
      signal
    }), enlivenObjectEnlivables({
      backgroundImage,
      backgroundColor: background,
      overlayImage,
      overlayColor: overlay,
      clipPath
    }, {
      signal
    })]).then(_ref2 => {
      let [enlived, enlivedMap] = _ref2;
      this.clear();
      this.add(...enlived);
      this.set(serialized);
      this.set(enlivedMap);
      this.renderOnAddRemove = renderOnAddRemove;
      return this;
    });
  }

  /**
   * Clones canvas instance
   * @param {string[]} [properties] Array of properties to include in the cloned canvas and children
   */
  clone(properties) {
    const data = this.toObject(properties);
    const canvas = this.cloneWithoutData();
    return canvas.loadFromJSON(data);
  }

  /**
   * Clones canvas instance without cloning existing data.
   * This essentially copies canvas dimensions since loadFromJSON does not affect canvas size.
   */
  cloneWithoutData() {
    const el = createCanvasElement();
    el.width = this.width;
    el.height = this.height;
    return new this.constructor(el);
  }

  /**
   * Exports canvas element to a dataurl image. Note that when multiplier is used, cropping is scaled appropriately
   * @param {Object} [options] Options object
   * @param {String} [options.format=png] The format of the output image. Either "jpeg" or "png"
   * @param {Number} [options.quality=1] Quality level (0..1). Only used for jpeg.
   * @param {Number} [options.multiplier=1] Multiplier to scale by, to have consistent
   * @param {Number} [options.left] Cropping left offset. Introduced in v1.2.14
   * @param {Number} [options.top] Cropping top offset. Introduced in v1.2.14
   * @param {Number} [options.width] Cropping width. Introduced in v1.2.14
   * @param {Number} [options.height] Cropping height. Introduced in v1.2.14
   * @param {Boolean} [options.enableRetinaScaling] Enable retina scaling for clone image. Introduce in 2.0.0
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   * @return {String} Returns a data: URL containing a representation of the object in the format specified by options.format
   * @see {@link https://jsfiddle.net/xsjua1rd/ demo}
   * @example <caption>Generate jpeg dataURL with lower quality</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'jpeg',
   *   quality: 0.8
   * });
   * @example <caption>Generate cropped png dataURL (clipping of canvas)</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   left: 100,
   *   top: 100,
   *   width: 200,
   *   height: 200
   * });
   * @example <caption>Generate double scaled png dataURL</caption>
   * var dataURL = canvas.toDataURL({
   *   format: 'png',
   *   multiplier: 2
   * });
   * @example <caption>Generate dataURL with objects that overlap a specified object</caption>
   * var myObject;
   * var dataURL = canvas.toDataURL({
   *   filter: (object) => object.isContainedWithinObject(myObject) || object.intersectsWithObject(myObject)
   * });
   */
  toDataURL() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      format = 'png',
      quality = 1,
      multiplier = 1,
      enableRetinaScaling = false
    } = options;
    const finalMultiplier = multiplier * (enableRetinaScaling ? this.getRetinaScaling() : 1);
    return toDataURL(this.toCanvasElement(finalMultiplier, options), format, quality);
  }

  /**
   * Create a new HTMLCanvas element painted with the current canvas content.
   * No need to resize the actual one or repaint it.
   * Will transfer object ownership to a new canvas, paint it, and set everything back.
   * This is an intermediary step used to get to a dataUrl but also it is useful to
   * create quick image copies of a canvas without passing for the dataUrl string
   * @param {Number} [multiplier] a zoom factor.
   * @param {Object} [options] Cropping informations
   * @param {Number} [options.left] Cropping left offset.
   * @param {Number} [options.top] Cropping top offset.
   * @param {Number} [options.width] Cropping width.
   * @param {Number} [options.height] Cropping height.
   * @param {(object: fabric.Object) => boolean} [options.filter] Function to filter objects.
   */
  toCanvasElement() {
    let multiplier = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    let {
      width,
      height,
      left,
      top,
      filter
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const scaledWidth = (width || this.width) * multiplier,
      scaledHeight = (height || this.height) * multiplier,
      zoom = this.getZoom(),
      originalWidth = this.width,
      originalHeight = this.height,
      originalSkipControlsDrawing = this.skipControlsDrawing,
      newZoom = zoom * multiplier,
      vp = this.viewportTransform,
      translateX = (vp[4] - (left || 0)) * multiplier,
      translateY = (vp[5] - (top || 0)) * multiplier,
      newVp = [newZoom, 0, 0, newZoom, translateX, translateY],
      originalRetina = this.enableRetinaScaling,
      canvasEl = createCanvasElement(),
      objectsToRender = filter ? this._objects.filter(obj => filter(obj)) : this._objects;
    canvasEl.width = scaledWidth;
    canvasEl.height = scaledHeight;
    this.enableRetinaScaling = false;
    this.viewportTransform = newVp;
    this.width = scaledWidth;
    this.height = scaledHeight;
    this.skipControlsDrawing = true;
    this.calcViewportBoundaries();
    this.renderCanvas(canvasEl.getContext('2d'), objectsToRender);
    this.viewportTransform = vp;
    this.width = originalWidth;
    this.height = originalHeight;
    this.calcViewportBoundaries();
    this.enableRetinaScaling = originalRetina;
    this.skipControlsDrawing = originalSkipControlsDrawing;
    return canvasEl;
  }

  /**
   * Waits until rendering has settled to destroy the canvas
   * @returns {Promise<boolean>} a promise resolving to `true` once the canvas has been destroyed or to `false` if the canvas has was already destroyed
   * @throws if aborted by a consequent call
   */
  dispose() {
    !this.disposed && this.elements.cleanupDOM({
      width: this.width,
      height: this.height
    });
    runningAnimations.cancelByCanvas(this);
    this.disposed = true;
    return new Promise((resolve, reject) => {
      const task = () => {
        this.destroy();
        resolve(true);
      };
      task.kill = reject;
      if (this.__cleanupTask) {
        this.__cleanupTask.kill('aborted');
      }
      if (this.destroyed) {
        resolve(false);
      } else if (this.nextRenderHandle) {
        this.__cleanupTask = task;
      } else {
        task();
      }
    });
  }

  /**
   * Clears the canvas element, disposes objects and frees resources.
   *
   * Invoked as part of the **async** operation of {@link dispose}.
   *
   * **CAUTION**:
   *
   * This method is **UNSAFE**.
   * You may encounter a race condition using it if there's a requested render.
   * Call this method only if you are sure rendering has settled.
   * Consider using {@link dispose} as it is **SAFE**
   *
   * @private
   */
  destroy() {
    this.destroyed = true;
    this.cancelRequestedRender();
    this.forEachObject(object => object.dispose());
    this._objects = [];
    if (this.backgroundImage) {
      this.backgroundImage.dispose();
    }
    this.backgroundImage = undefined;
    if (this.overlayImage) {
      this.overlayImage.dispose();
    }
    this.overlayImage = undefined;
    this.elements.dispose();
  }

  /**
   * Returns a string representation of an instance
   * @return {String} string representation of an instance
   */
  toString() {
    return "#<Canvas (".concat(this.complexity(), "): { objects: ").concat(this._objects.length, " }>");
  }
}
_defineProperty(StaticCanvas, "ownDefaults", staticCanvasDefaults);

export { StaticCanvas };
//# sourceMappingURL=StaticCanvas.mjs.map
