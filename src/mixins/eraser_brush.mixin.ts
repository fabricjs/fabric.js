import { fabric } from '../../HEADER';
import { Point } from '../point.class';
import { FabricObject } from '../shapes/fabricObject.class';
import { uid } from '../util/internals/uid';

/** ERASER_START */

var __drawClipPath = FabricObject.prototype._drawClipPath;
var _needsItsOwnCache = FabricObject.prototype.needsItsOwnCache;
var _toObject = FabricObject.prototype.toObject;
var _getSvgCommons = FabricObject.prototype.getSvgCommons;
var __createBaseClipPathSVGMarkup =
  FabricObject.prototype._createBaseClipPathSVGMarkup;
var __createBaseSVGMarkup = FabricObject.prototype._createBaseSVGMarkup;

FabricObject.prototype.cacheProperties.push('eraser');
FabricObject.prototype.stateProperties.push('eraser');

/**
 * @fires erasing:end
 */
fabric.util.object.extend(FabricObject.prototype, {
  /**
   * Indicates whether this object can be erased by {@link fabric.EraserBrush}
   * The `deep` option introduces fine grained control over a group's `erasable` property.
   * When set to `deep` the eraser will erase nested objects if they are erasable, leaving the group and the other objects untouched.
   * When set to `true` the eraser will erase the entire group. Once the group changes the eraser is propagated to its children for proper functionality.
   * When set to `false` the eraser will leave all objects including the group untouched.
   * @tutorial {@link http://fabricjs.com/erasing#erasable_property}
   * @type boolean | 'deep'
   * @default true
   */
  erasable: true,

  /**
   * @tutorial {@link http://fabricjs.com/erasing#eraser}
   * @type fabric.Eraser
   */
  eraser: undefined,

  /**
   * @override
   * @returns Boolean
   */
  needsItsOwnCache: function () {
    return _needsItsOwnCache.call(this) || !!this.eraser;
  },

  /**
   * draw eraser above clip path
   * @override
   * @private
   * @param {CanvasRenderingContext2D} ctx
   * @param {FabricObject} clipPath
   */
  _drawClipPath: function (ctx, clipPath) {
    __drawClipPath.call(this, ctx, clipPath);
    if (this.eraser) {
      //  update eraser size to match instance
      var size = this._getNonTransformedDimensions();
      this.eraser.isType('eraser') &&
        this.eraser.set({
          width: size.x,
          height: size.y,
        });
      __drawClipPath.call(this, ctx, this.eraser);
    }
  },

  /**
   * Returns an object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} Object representation of an instance
   */
  toObject: function (propertiesToInclude) {
    var object = _toObject.call(this, ['erasable'].concat(propertiesToInclude));
    if (this.eraser && !this.eraser.excludeFromExport) {
      object.eraser = this.eraser.toObject(propertiesToInclude);
    }
    return object;
  },

  /* _TO_SVG_START_ */
  /**
   * Returns id attribute for svg output
   * @override
   * @return {String}
   */
  getSvgCommons: function () {
    return (
      _getSvgCommons.call(this) +
      (this.eraser ? 'mask="url(#' + this.eraser.clipPathId + ')" ' : '')
    );
  },

  /**
   * create svg markup for eraser
   * use <mask> to achieve erasing for svg, credit: https://travishorn.com/removing-parts-of-shapes-in-svg-b539a89e5649
   * must be called before object markup creation as it relies on the `clipPathId` property of the mask
   * @param {Function} [reviver]
   * @returns
   */
  _createEraserSVGMarkup: function (reviver) {
    if (this.eraser) {
      this.eraser.clipPathId = 'MASK_' + uid();
      return [
        '<mask id="',
        this.eraser.clipPathId,
        '" >',
        this.eraser.toSVG(reviver),
        '</mask>',
        '\n',
      ].join('');
    }
    return '';
  },

  /**
   * @private
   */
  _createBaseClipPathSVGMarkup: function (objectMarkup, options) {
    return [
      this._createEraserSVGMarkup(options && options.reviver),
      __createBaseClipPathSVGMarkup.call(this, objectMarkup, options),
    ].join('');
  },

  /**
   * @private
   */
  _createBaseSVGMarkup: function (objectMarkup, options) {
    return [
      this._createEraserSVGMarkup(options && options.reviver),
      __createBaseSVGMarkup.call(this, objectMarkup, options),
    ].join('');
  },
  /* _TO_SVG_END_ */
});

fabric.util.object.extend(fabric.Group.prototype, {
  /**
   * @private
   * @param {fabric.Path} path
   * @returns {Promise<fabric.Path[]>}
   */
  _addEraserPathToObjects: function (path) {
    return Promise.all(
      this._objects.map(function (object) {
        return fabric.EraserBrush.prototype._addPathToObjectEraser.call(
          fabric.EraserBrush.prototype,
          object,
          path
        );
      })
    );
  },

  /**
   * Applies the group's eraser to its objects
   * @tutorial {@link http://fabricjs.com/erasing#erasable_property}
   * @returns {Promise<fabric.Path[]|fabric.Path[][]|void>}
   */
  applyEraserToObjects: function () {
    var _this = this,
      eraser = this.eraser;
    return Promise.resolve().then(function () {
      if (eraser) {
        delete _this.eraser;
        var transform = _this.calcTransformMatrix();
        return eraser.clone().then(function (eraser) {
          var clipPath = _this.clipPath;
          return Promise.all(
            eraser.getObjects('path').map(function (path) {
              //  first we transform the path from the group's coordinate system to the canvas'
              var originalTransform = fabric.util.multiplyTransformMatrices(
                transform,
                path.calcTransformMatrix()
              );
              fabric.util.applyTransformToObject(path, originalTransform);
              return clipPath
                ? clipPath.clone().then(
                    function (_clipPath) {
                      var eraserPath =
                        fabric.EraserBrush.prototype.applyClipPathToPath.call(
                          fabric.EraserBrush.prototype,
                          path,
                          _clipPath,
                          transform
                        );
                      return _this._addEraserPathToObjects(eraserPath);
                    },
                    ['absolutePositioned', 'inverted']
                  )
                : _this._addEraserPathToObjects(path);
            })
          );
        });
      }
    });
  },
});
