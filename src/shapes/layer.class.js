(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
    multiplyTransformMatrices = fabric.util.multiplyTransformMatrices,
    invertTransform = fabric.util.invertTransform,
    applyTransformToObject = fabric.util.applyTransformToObject,
    extend = fabric.util.object.extend,
    clone = fabric.util.object.clone,
    min = fabric.util.array.min,
    max = fabric.util.array.max;

  if (fabric.Layer) {
    fabric.warn('fabric.Layer is already defined');
    return;
  }

  /**
   * Layer class
   * @class fabric.Layer
   * @extends fabric.Object
   * @mixes fabric.Collection
   * @see {@link fabric.Layer#initialize} for constructor definition
   */
  fabric.Layer = fabric.util.createClass(fabric.Object, fabric.Collection, /** @lends fabric.Layer.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'layer',

    layout: 'auto',

    objectCaching: false,

    /**
     * Constructor
     * @param {fabric.Object[]} [objects] layer objects
     * @param {Object} [options] Options object
     * @return {fabric.Layer} thisArg
     */
    initialize: function (objects, options) {
      if (this.layout === 'auto' && Array.isArray(objects)) {
        const box = this.getObjectsBoundingBox(objects);
        box.originX = 'left';
        box.originY = 'top';
        extend(options, box);
      }
      this.callSuper('initialize', options);
      this.callSuper('calcOwnMatrix');
      this._objects = objects || [];
    },

    /**
     * apply options to objects, transforming objects is handled by `calcOwnMatrix`
     * @param {string} key 
     * @param {*} value 
     * @returns true if objects were modified
     */
    _applyOnObjects: function (key, value) {
      var modified = false;
      switch (key) {
        case 'canvas':
          //  pass down
          this.forEachObject(function (object) {
            object._set(key, value);
          });
          break;
        case 'opacity':
          //  multiply
          this.forEachObject(function (object) {
            object._set(key, object[key] * value);
          });
          modified = this.size() > 0;
          break;
      }
      return modified;
    },

    /**
     * @private
     * @param {string} key
     * @param {*} value
     */
    _set: function (key, value) {
      this.callSuper('_set', key, value);
      this._applyOnObjects(key, value);
      if (key === 'layout' && value === 'auto') {
        //  set width and height
      }
      return this;
    },

    calcOwnMatrix: function () {
      var key = this.transformMatrixKey(true), cache = this.ownMatrixCache || (this.ownMatrixCache = {}),
        dirty = cache.key !== key, transform = cache.value || fabric.iMatrix;
      var matrix = this.callSuper('calcOwnMatrix');
      if (dirty) {
        this.forEachObject(function (object) {
          var objectTransform = multiplyTransformMatrices(invertTransform(transform), object.calcTransformMatrix());
          applyTransformToObject(object, multiplyTransformMatrices(matrix, objectTransform));
        });
      }
      return matrix;
    },

    /**
     * 
     * @param {fabric.Object[]} objects 
     * @returns 
     */
    getObjectsBoundingBox: function (objects) {
      var aX = [],
        aY = [],
        o, prop, coords,
        props = ['tr', 'br', 'bl', 'tl'],
        i = 0, iLen = objects.length,
        j, jLen = props.length;

      for (; i < iLen; ++i) {
        o = objects[i];
        coords = o.calcACoords();
        for (j = 0; j < jLen; j++) {
          prop = props[j];
          aX.push(coords[prop].x);
          aY.push(coords[prop].y);
        }
        o.aCoords = coords;
      }
      var minXY = new fabric.Point(min(aX), min(aY)),
        maxXY = new fabric.Point(max(aX), max(aY)),
        top = minXY.y || 0, left = minXY.x || 0,
        width = (maxXY.x - minXY.x) || 0,
        height = (maxXY.y - minXY.y) || 0;
      return {
        left: left,
        top: top,
        width: width,
        height: height
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function (ctx) {
      ctx.save();
      var t = invertTransform(this.calcTransformMatrix());
      ctx.transform.apply(ctx, t);
      console.log('rendering?', t)
      ctx.globalAlpha = 1;
      this.forEachObject(function (object) {
        object.render(ctx);
      });
      ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function (propertiesToInclude) {
      var _includeDefaultValues = this.includeDefaultValues;
      var objsToObject = this._objects
        .filter(function (obj) {
          return !obj.excludeFromExport;
        })
        .map(function (obj) {
          var originalDefaults = obj.includeDefaultValues;
          obj.includeDefaultValues = _includeDefaultValues;
          var _obj = obj.toObject(propertiesToInclude);
          obj.includeDefaultValues = originalDefaults;
          return _obj;
        });
      var obj = fabric.Object.prototype.toObject.call(this, propertiesToInclude);
      obj.objects = objsToObject;
      return obj;
    },

    /**
     * Returns object representation of an instance, in dataless mode.
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject: function (propertiesToInclude) {
      var objsToObject, sourcePath = this.sourcePath;
      if (sourcePath) {
        objsToObject = sourcePath;
      }
      else {
        var _includeDefaultValues = this.includeDefaultValues;
        objsToObject = this._objects.map(function (obj) {
          var originalDefaults = obj.includeDefaultValues;
          obj.includeDefaultValues = _includeDefaultValues;
          var _obj = obj.toDatalessObject(propertiesToInclude);
          obj.includeDefaultValues = originalDefaults;
          return _obj;
        });
      }
      var obj = fabric.Object.prototype.toDatalessObject.call(this, propertiesToInclude);
      obj.objects = objsToObject;
      return obj;
    },

    dispose: function () {
      this.forEachObject(function (object) {
        object.dispose && object.dispose();
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    _toSVG: function (reviver) {
      var svgString = ['<g ', 'COMMON_PARTS', ' >\n'];

      for (var i = 0, len = this._objects.length; i < len; i++) {
        svgString.push('\t\t', this._objects[i].toSVG(reviver));
      }
      svgString.push('</g>\n');
      return svgString;
    },

    /**
     * Returns styles-string for svg-export, specific version for group
     * @return {String}
     */
    getSvgStyles: function () {
      var opacity = typeof this.opacity !== 'undefined' && this.opacity !== 1 ?
        'opacity: ' + this.opacity + ';' : '',
        visibility = this.visible ? '' : ' visibility: hidden;';
      return [
        opacity,
        this.getSvgFilter(),
        visibility
      ].join('');
    },

    /**
     * Returns svg clipPath representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG: function (reviver) {
      var svgString = [];

      for (var i = 0, len = this._objects.length; i < len; i++) {
        svgString.push('\t', this._objects[i].toClipPathSVG(reviver));
      }

      return this._createBaseClipPathSVGMarkup(svgString, { reviver: reviver });
    },
    /* _TO_SVG_END_ */
  });

  /**
   * Returns fabric.Layer instance from an object representation
   * @static
   * @memberOf fabric.Layer
   * @param {Object} object Object to create an instance from
   * @param {function} [callback] invoked with new instance as first argument
   */
  fabric.Layer.fromObject = function (object, callback) {
    var objects = object.objects,
      options = clone(object, true);
    delete options.objects;
    if (typeof objects === 'string') {
      // it has to be an url or something went wrong.
      fabric.loadSVGFromURL(objects, function (elements) {
        var group = fabric.util.groupSVGElements(elements, object, objects);
        group.set(options);
        group._restoreObjectsState();
        callback && callback(new fabric.Layer(group._objects, options));
      });
      return;
    }
    fabric.util.enlivenObjects(objects, function (enlivenedObjects) {
      fabric.util.enlivenObjects([object.clipPath], function (enlivedClipPath) {
        var options = clone(object, true);
        options.clipPath = enlivedClipPath[0];
        delete options.objects;
        callback && callback(new fabric.Layer(enlivenedObjects, options));
      });
    });
  };

})(typeof exports !== 'undefined' ? exports : this);
