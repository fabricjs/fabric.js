(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      extend = fabric.util.object.extend;

  if (fabric.PathGroup) {
    fabric.warn('fabric.PathGroup is already defined');
    return;
  }

  /**
   * Path group class
   * @class fabric.PathGroup
   * @extends fabric.Path
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1#path_and_pathgroup}
   * @see {@link fabric.PathGroup#initialize} for constructor definition
   */
  fabric.PathGroup = fabric.util.createClass(fabric.Object, /** @lends fabric.PathGroup.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'path-group',

    /**
     * Fill value
     * @type String
     * @default
     */
    fill: '',

    /**
     * Constructor
     * @param {Array} paths
     * @param {Object} [options] Options object
     * @return {fabric.PathGroup} thisArg
     */
    initialize: function(paths, options) {

      options = options || { };
      this.paths = paths || [];

      for (var i = this.paths.length; i--;) {
        this.paths[i].group = this;
      }

      if (options.toBeParsed) {
        this.parseDimensionsFromPaths(options);
        delete options.toBeParsed;
      }
      this.setOptions(options);
      this.setCoords();
      if (this.objectCaching) {
        this._createCacheCanvas();
      }
    },

    /**
     * Calculate width and height based on paths contained
     */
    parseDimensionsFromPaths: function(options) {
      var points, p, xC = [], yC = [], path, height, width,
          m;
      for (var j = this.paths.length; j--;) {
        path = this.paths[j];
        height = path.height + path.strokeWidth;
        width = path.width + path.strokeWidth;
        points = [
          { x: path.left, y: path.top },
          { x: path.left + width, y: path.top },
          { x: path.left, y: path.top + height },
          { x: path.left + width, y: path.top + height }
        ];
        m = this.paths[j].transformMatrix;
        for (var i = 0; i < points.length; i++) {
          p = points[i];
          if (m) {
            p = fabric.util.transformPoint(p, m, false);
          }
          xC.push(p.x);
          yC.push(p.y);
        }
      }
      options.width = Math.max.apply(null, xC);
      options.height = Math.max.apply(null, yC);
    },

    /**
     * Execute the drawing operation for an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    drawObject: function(ctx) {
      ctx.save();
      ctx.translate(-this.width / 2, -this.height / 2);
      for (var i = 0, l = this.paths.length; i < l; ++i) {
        this.paths[i].render(ctx, true);
      }
      ctx.restore();
    },

    /**
     * Decide if the object should cache or not.
     * objectCaching is a global flag, wins over everything
     * needsItsOwnCache should be used when the object drawing method requires
     * a cache step. None of the fabric classes requires it.
     * Generally you do not cache objects in groups because the group outside is cached.
     * @return {Boolean}
     */
    shouldCache: function() {
      var parentCache = this.objectCaching && (!this.group || this.needsItsOwnCache || !this.group.isCaching());
      this.caching = parentCache;
      if (parentCache) {
        for (var i = 0, len = this.paths.length; i < len; i++) {
          if (this.paths[i].willDrawShadow()) {
            this.caching = false;
            return false;
          }
        }
      }
      return parentCache;
    },

    /**
     * Check if this object or a child object will cast a shadow
     * @return {Boolean}
     */
    willDrawShadow: function() {
      if (this.shadow) {
        return true;
      }
      for (var i = 0, len = this.paths.length; i < len; i++) {
        if (this.paths[i].willDrawShadow()) {
          return true;
        }
      }
      return false;
    },

    /**
     * Check if this group or its parent group are caching, recursively up
     * @return {Boolean}
     */
    isCaching: function() {
      return this.caching || this.group && this.group.isCaching();
    },

    /**
     * Check if cache is dirty
     */
    isCacheDirty: function() {
      if (this.callSuper('isCacheDirty')) {
        return true;
      }
      if (!this.statefullCache) {
        return false;
      }
      for (var i = 0, len = this.paths.length; i < len; i++) {
        if (this.paths[i].isCacheDirty(true)) {
          var dim = this._getNonTransformedDimensions();
          this._cacheContext.clearRect(-dim.x / 2, -dim.y / 2, dim.x, dim.y);
          return true;
        }
      }
      return false;
    },

    /**
     * Sets certain property to a certain value
     * @param {String} prop
     * @param {*} value
     * @return {fabric.PathGroup} thisArg
     */
    _set: function(prop, value) {

      if (prop === 'fill' && value && this.isSameColor()) {
        var i = this.paths.length;
        while (i--) {
          this.paths[i]._set(prop, value);
        }
      }

      return this.callSuper('_set', prop, value);
    },

    /**
     * Returns object representation of this path group
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var pathsToObject = this.paths.map(function(path) {
        var originalDefaults = path.includeDefaultValues;
        path.includeDefaultValues = path.group.includeDefaultValues;
        var obj = path.toObject(propertiesToInclude);
        path.includeDefaultValues = originalDefaults;
        return obj;
      });
      var o = extend(this.callSuper('toObject', ['sourcePath'].concat(propertiesToInclude)), {
        paths: pathsToObject
      });
      return o;
    },

    /**
     * Returns dataless object representation of this path group
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} dataless object representation of an instance
     */
    toDatalessObject: function(propertiesToInclude) {
      var o = this.toObject(propertiesToInclude);
      if (this.sourcePath) {
        o.paths = this.sourcePath;
      }
      return o;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var objects = this.getObjects(),
          p = this.getPointByOrigin('left', 'top'),
          translatePart = 'translate(' + p.x + ' ' + p.y + ')',
          markup = this._createBaseSVGMarkup();
      markup.push(
        '<g ', this.getSvgId(),
        'style="', this.getSvgStyles(), '" ',
        'transform="', this.getSvgTransformMatrix(), translatePart, this.getSvgTransform(), '" ',
        '>\n'
      );

      for (var i = 0, len = objects.length; i < len; i++) {
        markup.push('\t', objects[i].toSVG(reviver));
      }
      markup.push('</g>\n');

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns a string representation of this path group
     * @return {String} string representation of an object
     */
    toString: function() {
      return '#<fabric.PathGroup (' + this.complexity() +
        '): { top: ' + this.top + ', left: ' + this.left + ' }>';
    },

    /**
     * Returns true if all paths in this group are of same color
     * @return {Boolean} true if all paths are of the same color (`fill`)
     */
    isSameColor: function() {
      var firstPathFill = this.getObjects()[0].get('fill') || '';
      if (typeof firstPathFill !== 'string') {
        return false;
      }
      firstPathFill = firstPathFill.toLowerCase();
      return this.getObjects().every(function(path) {
        var pathFill = path.get('fill') || '';
        return typeof pathFill === 'string' && (pathFill).toLowerCase() === firstPathFill;
      });
    },

    /**
     * Returns number representation of object's complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.paths.reduce(function(total, path) {
        return total + ((path && path.complexity) ? path.complexity() : 0);
      }, 0);
    },

    /**
     * Returns all paths in this path group
     * @return {Array} array of path objects included in this path group
     */
    getObjects: function() {
      return this.paths;
    }
  });

  /**
   * Creates fabric.PathGroup instance from an object representation
   * @static
   * @memberOf fabric.PathGroup
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when an fabric.PathGroup instance is created
   */
  fabric.PathGroup.fromObject = function(object, callback) {
    var originalPaths = object.paths;
    delete object.paths;
    if (typeof originalPaths === 'string') {
      fabric.loadSVGFromURL(originalPaths, function (elements) {
        var pathUrl = originalPaths;
        var pathGroup = fabric.util.groupSVGElements(elements, object, pathUrl);
        object.paths = originalPaths;
        callback(pathGroup);
      });
    }
    else {
      fabric.util.enlivenObjects(originalPaths, function(enlivenedObjects) {
        var pathGroup = new fabric.PathGroup(enlivenedObjects, object);
        object.paths = originalPaths;
        callback(pathGroup);
      });
    }
  };

  /**
   * Indicates that instances of this type are async
   * @static
   * @memberOf fabric.PathGroup
   * @type Boolean
   * @default
   */
  fabric.PathGroup.async = true;

})(typeof exports !== 'undefined' ? exports : this);
