(function(global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = { }),
      min = fabric.util.array.min,
      max = fabric.util.array.max,
      extend = fabric.util.object.extend,
      _toString = Object.prototype.toString,
      drawArc = fabric.util.drawArc,
      commandLengths = {
        m: 2,
        l: 2,
        h: 1,
        v: 1,
        c: 6,
        s: 4,
        q: 4,
        t: 2,
        a: 7
      },
      repeatedCommands = {
        m: 'l',
        M: 'L'
      };

  if (fabric.Path) {
    fabric.warn('fabric.Path is already defined');
    return;
  }

  /**
   * Path class
   * @class fabric.Path
   * @extends fabric.Object
   * @tutorial {@link http://fabricjs.com/fabric-intro-part-1/#path_and_pathgroup}
   * @see {@link fabric.Path#initialize} for constructor definition
   */
  fabric.Path = fabric.util.createClass(fabric.Object, /** @lends fabric.Path.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'path',

    /**
     * Array of path points
     * @type Array
     * @default
     */
    path: null,

    /**
     * Minimum X from points values, necessary to offset points
     * @type Number
     * @default
     */
    minX: 0,

    /**
     * Minimum Y from points values, necessary to offset points
     * @type Number
     * @default
     */
    minY: 0,

    /**
     * Constructor
     * @param {Array|String} path Path data (sequence of coordinates and corresponding "command" tokens)
     * @param {Object} [options] Options object
     * @return {fabric.Path} thisArg
     */
    initialize: function(path, options) {
      options = options || { };

      this.setOptions(options);

      if (!path) {
        throw new Error('`path` argument is required');
      }

      var fromArray = _toString.call(path) === '[object Array]';

      this.path = fromArray
        ? path
        // one of commands (m,M,l,L,q,Q,c,C,etc.) followed by non-command characters (i.e. command values)
        : path.match && path.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);

      if (!this.path) {
        return;
      }

      if (!fromArray) {
        this.path = this._parsePath();
      }

      var calcDim = this._parseDimensions();
      this.minX = calcDim.left;
      this.minY = calcDim.top;
      this.width = calcDim.width;
      this.height = calcDim.height;
      this.top = this.top || this.minY;
      this.left = this.left || this.minX;
      this.pathOffset = this.pathOffset || {
        x: this.minX + this.width / 2,
        y: this.minY + this.height / 2
      };

      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx context to render path on
     * @param {Boolean} [noTransform] When true, context is not transformed
     * @param {Array} path array of points
     */
    _render: function(ctx, noTransform, path) {
      var current, // current instruction
          previous = null,
          subpathStartX = 0,
          subpathStartY = 0,
          x = 0, // current x
          y = 0, // current y
          controlX = 0, // current control point x
          controlY = 0, // current control point y
          tempX,
          tempY,
          tempControlX,
          tempControlY,
          l = -this.pathOffset.x,
          t = -this.pathOffset.y;

      if (this.group && this.group.type === 'path-group') {
        l = 0;
        t = 0;
      }
      ctx.beginPath();
      // Iterate over the path commands, issuing context commands as necessary.
      for (var i = 0, len = path.length; i < len; ++i) {
        current = path[i];
        switch (current[0]) { // first letter
          // Line-To, relative.
          case 'l': 
            x += current[1];
            y += current[2];
            ctx.lineTo(x + l, y + t);
            break;
          // Line-To, absolute.
          case 'L': 
            x = current[1];
            y = current[2];
            ctx.lineTo(x + l, y + t);
            break;
          // Horizontal Line-To, relative.
          case 'h': 
            x += current[1];
            ctx.lineTo(x + l, y + t);
            break;
          // Horizontal Line-To, absolute.
          case 'H': 
            x = current[1];
            ctx.lineTo(x + l, y + t);
            break;
          // Vertical Line-To, relative.
          case 'v': 
            y += current[1];
            ctx.lineTo(x + l, y + t);
            break;
          // Vertical Line-To, absolute.
          case 'V': 
            y = current[1];
            ctx.lineTo(x + l, y + t);
            break;
          // Move-To, relative.
          case 'm': 
            x += current[1];
            y += current[2];
            subpathStartX = x;
            subpathStartY = y;
            ctx.moveTo(x + l, y + t);
            break;
          // Move-To, absolute.
          case 'M': 
            x = current[1];
            y = current[2];
            subpathStartX = x;
            subpathStartY = y;
            ctx.moveTo(x + l, y + t);
            break;
          // BezierCurve-To, relative.
          case 'c': 
            tempX = x + current[5];
            tempY = y + current[6];
            controlX = x + current[3];
            controlY = y + current[4];
            ctx.bezierCurveTo(
              x + current[1] + l, // x1
              y + current[2] + t, // y1
              controlX + l, // x2
              controlY + t, // y2
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;
          // BezierCurve-To, absolute.
          case 'C': 
            x = current[5];
            y = current[6];
            controlX = current[3];
            controlY = current[4];
            ctx.bezierCurveTo(
              current[1] + l,
              current[2] + t,
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;
          // Shorthand: CubicBezierCurve-To, relative.
          case 's': 
            // Transform to absolute x, y.
            tempX = x + current[3];
            tempY = y + current[4];
            // Calculate reflection of previous control points.
            controlX = controlX ? (2 * x - controlX) : x;
            controlY = controlY ? (2 * y - controlY) : y;
            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              x + current[1] + l,
              y + current[2] + t,
              tempX + l,
              tempY + t
            );
            // Set control point to 2nd one of this command, based on: "... the first control point is assumed to be the reflection of the second control point on the previous command relative to the current point."
            controlX = x + current[1];
            controlY = y + current[2];
            x = tempX;
            y = tempY;
            break;
          // Shorthand: CubicBezierCurve-To, absolute.
          case 'S': 
            tempX = current[3];
            tempY = current[4];
            // Calculate reflection of previous control points.
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              current[1] + l,
              current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            // Set control point to 2nd one of this command, based on: "... the first control point is assumed to be the reflection of the second control point on the previous command relative to the current point."
            controlX = current[1];
            controlY = current[2];
            break;
          // QuadraticCurve-To, relative.
          case 'q':
            // Transform to absolute x,y.
            tempX = x + current[3];
            tempY = y + current[4];
            controlX = x + current[1];
            controlY = y + current[2];
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;
          // QuadraticCurve-To, absolute.
          case 'Q':
            tempX = current[3];
            tempY = current[4];
            ctx.quadraticCurveTo(
              current[1] + l,
              current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            controlX = current[1];
            controlY = current[2];
            break;
          // Shorthand: QuadraticCurve-To, relative.
          case 't': 
            // Transform to absolute x, y.
            tempX = x + current[1];
            tempY = y + current[2];
            // If there is no previous command or if the previous command was not a Q, q, T or t, assume the control point is coincident with the current point.
            if (previous[0].match(/[QqTt]/) === null) {
              controlX = x;
              controlY = y;
            }
            // Calculate reflection of previous control points for t.
            else if (previous[0] === 't') {
              controlX = 2 * x - tempControlX;
              controlY = 2 * y - tempControlY;
            }
            // Calculate reflection of previous control points for q.
            else if (previous[0] === 'q') {
              controlX = 2 * x - controlX;
              controlY = 2 * y - controlY;
            }
            tempControlX = controlX;
            tempControlY = controlY;
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            controlX = x + current[1];
            controlY = y + current[2];
            break;
          // Shorthand: QuadraticBezierCurve-To, absolute.
          case 'T':
            tempX = current[1];
            tempY = current[2];
            // Calculate reflection of previous control points.
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;
          // Elliptical Arc, relative.
          case 'a':
            // TODO: optimize this.
            drawArc(ctx, x + l, y + t, [
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6] + x + l,
              current[7] + y + t
            ]);
            x += current[6];
            y += current[7];
            break;
          // Elliptical Arc, absolute.
          case 'A':
            // TODO: optimize this.
            drawArc(ctx, x + l, y + t, [
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6] + l,
              current[7] + t
            ]);
            x = current[6];
            y = current[7];
            break;
          // Close path.
          case 'z':
          case 'Z':
            x = subpathStartX;
            y = subpathStartY;
            ctx.closePath();
            break;
        }
        previous = current;
      }
      this._renderFill(ctx);
      this._renderStroke(ctx);
    },

    /**
     * Renders path on a specified context
     * @param {CanvasRenderingContext2D} ctx context to render path on
     * @param {Boolean} [noTransform] When true, context is not transformed
     */
    render: function(ctx, noTransform) {
      // Do not render if either of the dimensions are zero or the object is not visible.
      if (this.width === 0 || this.height === 0 || !this.visible) {
        return;
      }
      ctx.save();
      if (!noTransform) {
        this.transform(ctx);
      }
      if (this.group && this.group.type === 'path-group') {
        ctx.translate(-this.group.width / 2, -this.group.height / 2);
      }
      if (this.transformMatrix) {
        ctx.transform.apply(ctx, this.transformMatrix);
      }
      this._setStrokeStyles(ctx);
      this._setFillStyles(ctx);
      this._setShadow(ctx);
      this.clipTo && fabric.util.clipContext(this, ctx);
      ctx.globalAlpha = this.group ? (ctx.globalAlpha * this.opacity) : this.opacity;
      // If no approximation is requested, render the path normally. Otherwise, approximate it to the number of points specified in wantApproximationDetail.
      if (!this.wantApproximationDetail) {
        this._render(ctx, noTransform, this.path);
      } else {
        this._render(ctx, noTransform, this._getApproximatedPath());
      }
      this.clipTo && ctx.restore();
      this._removeShadow(ctx);
      ctx.restore();
    },

    /**
     * Returns string representation of an instance
     * @return {String} string representation of an instance
     */
    toString: function() {
      return '#<fabric.Path (' + this.complexity() +
        '): { "top": ' + this.top + ', "left": ' + this.left + ' }>';
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject: function(propertiesToInclude) {
      var o = extend(this.callSuper('toObject', propertiesToInclude), {
        path: this.path.map(function(item) { return item.slice() }),
        pathOffset: this.pathOffset
      });
      if (this.sourcePath) {
        o.sourcePath = this.sourcePath;
      }
      if (this.transformMatrix) {
        o.transformMatrix = this.transformMatrix;
      }
      return o;
    },

    /**
     * Returns dataless object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toDatalessObject: function(propertiesToInclude) {
      var o = this.toObject(propertiesToInclude);
      if (this.sourcePath) {
        o.path = this.sourcePath;
      }
      delete o.sourcePath;
      return o;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
      var chunks = [],
          markup = this._createBaseSVGMarkup(),
          addTransform = '';

      for (var i = 0, len = this.path.length; i < len; i++) {
        chunks.push(this.path[i].join(' '));
      }
      var path = chunks.join(' ');

      if (!(this.group && this.group.type === 'path-group')) {
        addTransform = 'translate(' + (-this.pathOffset.x) + ', ' + (-this.pathOffset.y) + ')';
      }
      markup.push(
        //jscs:disable validateIndentation
        '<path ',
          'd="', path,
          '" style="', this.getSvgStyles(),
          '" transform="', this.getSvgTransform(), addTransform,
          this.getSvgTransformMatrix(), '" stroke-linecap="round" ',
        '/>\n'
        //jscs:enable validateIndentation
      );

      return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns number representation of an instance complexity
     * @return {Number} complexity of this instance
     */
    complexity: function() {
      return this.path.length;
    },

    /**
     * @private
     */
    _parsePath: function() {
      var result = [ ],
          coords = [ ],
          currentPath,
          parsed,
          re = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/ig,
          match,
          coordsStr;

      for (var i = 0, coordsParsed, len = this.path.length; i < len; i++) {
        currentPath = this.path[i];

        coordsStr = currentPath.slice(1).trim();
        coords.length = 0;

        while ((match = re.exec(coordsStr))) {
          coords.push(match[0]);
        }

        coordsParsed = [ currentPath.charAt(0) ];

        for (var j = 0, jlen = coords.length; j < jlen; j++) {
          parsed = parseFloat(coords[j]);
          if (!isNaN(parsed)) {
            coordsParsed.push(parsed);
          }
        }

        var command = coordsParsed[0],
            commandLength = commandLengths[command.toLowerCase()],
            repeatedCommand = repeatedCommands[command] || command;

        if (coordsParsed.length - 1 > commandLength) {
          for (var k = 1, klen = coordsParsed.length; k < klen; k += commandLength) {
            result.push([ command ].concat(coordsParsed.slice(k, k + commandLength)));
            command = repeatedCommand;
          }
        }
        else {
          result.push(coordsParsed);
        }
      }

      return result;
    },

    /**
     * @private
     */
    _parseDimensions: function() {
      var aX = [],
          aY = [],
          current, // current instruction
          previous = null,
          subpathStartX = 0,
          subpathStartY = 0,
          x = 0, // current x
          y = 0, // current y
          controlX = 0, // current control point x
          controlY = 0, // current control point y
          tempX,
          tempY,
          tempControlX,
          tempControlY,
          bounds;

      for (var i = 0, len = this.path.length; i < len; ++i) {

        current = this.path[i];

        switch (current[0]) { // first letter

          case 'l': // lineto, relative
            x += current[1];
            y += current[2];
            bounds = [ ];
            break;

          case 'L': // lineto, absolute
            x = current[1];
            y = current[2];
            bounds = [ ];
            break;

          case 'h': // horizontal lineto, relative
            x += current[1];
            bounds = [ ];
            break;

          case 'H': // horizontal lineto, absolute
            x = current[1];
            bounds = [ ];
            break;

          case 'v': // vertical lineto, relative
            y += current[1];
            bounds = [ ];
            break;

          case 'V': // verical lineto, absolute
            y = current[1];
            bounds = [ ];
            break;

          case 'm': // moveTo, relative
            x += current[1];
            y += current[2];
            subpathStartX = x;
            subpathStartY = y;
            bounds = [ ];
            break;

          case 'M': // moveTo, absolute
            x = current[1];
            y = current[2];
            subpathStartX = x;
            subpathStartY = y;
            bounds = [ ];
            break;

          case 'c': // bezierCurveTo, relative
            tempX = x + current[5];
            tempY = y + current[6];
            controlX = x + current[3];
            controlY = y + current[4];
            bounds = fabric.util.getBoundsOfCurve(x, y,
              x + current[1], // x1
              y + current[2], // y1
              controlX, // x2
              controlY, // y2
              tempX,
              tempY
            );
            x = tempX;
            y = tempY;
            break;

          case 'C': // bezierCurveTo, absolute
            x = current[5];
            y = current[6];
            controlX = current[3];
            controlY = current[4];
            bounds = fabric.util.getBoundsOfCurve(x, y,
              current[1],
              current[2],
              controlX,
              controlY,
              x,
              y
            );
            break;

          case 's': // shorthand cubic bezierCurveTo, relative

            // transform to absolute x,y
            tempX = x + current[3];
            tempY = y + current[4];

            // calculate reflection of previous control points
            controlX = controlX ? (2 * x - controlX) : x;
            controlY = controlY ? (2 * y - controlY) : y;

            bounds = fabric.util.getBoundsOfCurve(x, y,
              controlX,
              controlY,
              x + current[1],
              y + current[2],
              tempX,
              tempY
            );
            // set control point to 2nd one of this command
            // "... the first control point is assumed to be
            // the reflection of the second control point on
            // the previous command relative to the current point."
            controlX = x + current[1];
            controlY = y + current[2];
            x = tempX;
            y = tempY;
            break;

          case 'S': // shorthand cubic bezierCurveTo, absolute
            tempX = current[3];
            tempY = current[4];
            // calculate reflection of previous control points
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            bounds = fabric.util.getBoundsOfCurve(x, y,
              controlX,
              controlY,
              current[1],
              current[2],
              tempX,
              tempY
            );
            x = tempX;
            y = tempY;
            // set control point to 2nd one of this command
            // "... the first control point is assumed to be
            // the reflection of the second control point on
            // the previous command relative to the current point."
            controlX = current[1];
            controlY = current[2];
            break;

          case 'q': // quadraticCurveTo, relative
            // transform to absolute x,y
            tempX = x + current[3];
            tempY = y + current[4];
            controlX = x + current[1];
            controlY = y + current[2];
            bounds = fabric.util.getBoundsOfCurve(x, y,
              controlX,
              controlY,
              controlX,
              controlY,
              tempX,
              tempY
            );
            x = tempX;
            y = tempY;
            break;

          case 'Q': // quadraticCurveTo, absolute
            controlX = current[1];
            controlY = current[2];
            bounds = fabric.util.getBoundsOfCurve(x, y,
              controlX,
              controlY,
              controlX,
              controlY,
              current[3],
              current[4]
            );
            x = current[3];
            y = current[4];
            break;

          case 't': // shorthand quadraticCurveTo, relative
            // transform to absolute x,y
            tempX = x + current[1];
            tempY = y + current[2];
            if (previous[0].match(/[QqTt]/) === null) {
              // If there is no previous command or if the previous command was not a Q, q, T or t,
              // assume the control point is coincident with the current point
              controlX = x;
              controlY = y;
            }
            else if (previous[0] === 't') {
              // calculate reflection of previous control points for t
              controlX = 2 * x - tempControlX;
              controlY = 2 * y - tempControlY;
            }
            else if (previous[0] === 'q') {
              // calculate reflection of previous control points for q
              controlX = 2 * x - controlX;
              controlY = 2 * y - controlY;
            }

            tempControlX = controlX;
            tempControlY = controlY;

            bounds = fabric.util.getBoundsOfCurve(x, y,
              controlX,
              controlY,
              controlX,
              controlY,
              tempX,
              tempY
            );
            x = tempX;
            y = tempY;
            controlX = x + current[1];
            controlY = y + current[2];
            break;

          case 'T':
            tempX = current[1];
            tempY = current[2];
            // calculate reflection of previous control points
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            bounds = fabric.util.getBoundsOfCurve(x, y,
              controlX,
              controlY,
              controlX,
              controlY,
              tempX,
              tempY
            );
            x = tempX;
            y = tempY;
            break;

          case 'a':
            // TODO: optimize this
            bounds = fabric.util.getBoundsOfArc(x, y,
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6] + x,
              current[7] + y
            );
            x += current[6];
            y += current[7];
            break;

          case 'A':
            // TODO: optimize this
            bounds = fabric.util.getBoundsOfArc(x, y,
              current[1],
              current[2],
              current[3],
              current[4],
              current[5],
              current[6],
              current[7]
            );
            x = current[6];
            y = current[7];
            break;

          case 'z':
          case 'Z':
            x = subpathStartX;
            y = subpathStartY;
            break;
        }
        previous = current;
        bounds.forEach(function (point) {
          aX.push(point.x);
          aY.push(point.y);
        });
        aX.push(x);
        aY.push(y);
      }

      var minX = min(aX),
          minY = min(aY),
          maxX = max(aX),
          maxY = max(aY),
          deltaX = maxX - minX,
          deltaY = maxY - minY,

          o = {
            left: minX,
            top: minY,
            width: deltaX,
            height: deltaY
          };

      return o;
    },

    /**
     * Get an array of commands representative of the commands of an SVG:PATH
     * @private
     * @return {Array} points in format like: [["M", 0, 0], ["L", 100, 100],].
     */
    _getApproximatedPath: function() {
      var detail = this.wantApproximationDetail || 2,
          adjustForCanvas = false,
          // Ensure that the underlying path is used (as opposed to a cached version of the simpler version).
          svgPath = this._getSVGPathElement(),
          // Get the path approximation of distance 0 to path length, ignoring the cache of SVG:PATH.
          approximatedPoints = this.getSampledPoints(detail, adjustForCanvas, 0, undefined, svgPath),
          // Prepare to store the path.
          approximatedPath = [];

      // Iterate the approximated points, turning them into SVG:PATH data commands.
      for (var i = 0, len = approximatedPoints.length; i < len; i++) {
        // Pick move-to (absolute) if first command; otherwise, pick line-to (absolute).
        var command = (i == 0) ? "M" : "L",
            point = approximatedPoints[i];

        approximatedPath.push([command, point.x, point.y]);
      }
      // Yield something like: [M, 0, 0], [L, 100, 100]
      return approximatedPath;
    },

    /**
     * Get a string of data approximately representative of the commands of the "data" attribute of an SVG:PATH
     * @private
     * @return {String} Points in format like: "M 0 0 L 100 100".
     */
    _getApproximatedSVGData: function() {
      return this._getSVGData(this._getApproximatedPath());
    },

    /**
     * Get a string of data approximately representative of the commands of the "data" attribute of an SVG:PATH
     * @private
     * @param {Array} path Points representative of an SVG:PATH, like [["M", 0, 0], ["L", 100, 100],].
     * @return {String} Points in format like: "M 0 0 L 100 100".
     */
    _getSVGData: function(path) {
      var chunks = [];

      path = (path != null) ? path : this.path;
      for (var i = 0, len = path.length; i < len; i++) {
        chunks.push(path[i].join(' '));
      }
      // Yield something like: M 0 0 L 100 100
      return chunks.join(' ');
    },

    /**
     * Get a string of data representative of the commands of the "data" attribute of an SVG:PATH, which may include caching and approximation
     * @private
     * @return {String} Points in format like: "M 0 0 L 100 100".
     */
    getSVGData: function() {
      // If caching is enabled, get the cached data. Otherwise, get recalculate and return the SVG data (ex. "M 0 0 L 100 100").
      if (this.wantSVGPathCaching) {
        // If there is no cached path array or if there is no cached SVG data string or if the cache and the current path array are not equivalent, refresh the cache.
        if (!this._cachedPathArray || !this._cachedSVGData || !this.__arrayEqualsCurrentPathArray(this._cachedPathArray)) {
          this._cachedPathArray = this.path;
          this._cachedSVGData = (this.wantApproximationDetail) ? this._getApproximatedSVGData() : this._getSVGData();
        }
        // Return the cached SVG data (ex. "M 0 0 L 100 100").
        return this._cachedSVGData;
      } else {
        return this._getSVGData();
      }
    },

    /**
     * Convenience method to compare equivalence of fabric.Path#path array to another one
     * @private
     * @return {Boolean} If same length and same items, true. Otherwise, false.
     */
    __arrayEqualsCurrentPathArray: function(that) {
      var sameLength = (that.length == this.path.length) ? true : false,
          sameItems = (that.every(this.__itemEqualsItemInArray, this)) ? true : false;

      return (sameLength && sameItems) ? true : false;
    },

    /**
     * Convenience method to compare per-item equivalence of fabric.Path#path array to another one, for special use with Array.every
     * @private
     * @param {Object} arrayItem The array item from the other array.
     * @param {Object} index The index of arrayItem in the other array.
     * @param {Array} thatArray The other array.
     * @return {Boolean} If both items are equivalent, true. Otherwise, false.
     */
    __itemEqualsItemInArray: function(arrayItem, index, thatArray) {
      return arrayItem === this.path[index];
    },

    /**
     * Gets an SVGPathElement DOM element that represents the current fabric.Path
     * @private
     * @return {SVGPathElement}
     */
    _getSVGPathElement: function() {
      // Obtain the data of the path element (ex: "M 0 0 L 100 100").
      var svgCommands = this._getSVGData(),
          // Create an SVGPathElement.
          svgPath = fabric.document.createElementNS('http://www.w3.org/2000/svg', 'path');

      // Add the data.
      svgPath.setAttribute("d", svgCommands);
      // Add the presentation styles.
      svgPath.setAttribute("style", this.getSvgStyles());
      // Add the transformation.
      svgPath.setAttribute("transform", this.getSvgTransform() + this.getSvgTransformMatrix());
      // Add the line cap.
      svgPath.setAttribute("stroke-linecap", "round");
      // Send it back.
      return svgPath;
    },

    /**
     * Gets an SVGPathElement DOM element that represents the current fabric.Path, may include caching
     * @public
     * @return {SVGPathElement}
     */
    getSVGPathElement: function() {
      if (this.wantSVGPathCaching) {
        if (!this._cachedSVGPathElement) {
          this._cachedSVGPathElement = this._getSVGPathElement();
        } else {
          var currentSVGData = this.getSVGData();
          if (this._cachedSVGPathElement.getAttribute("d") != currentSVGData) {
            this._cachedSVGPathElement.setAttribute("d", currentSVGData);
          }
        }
        return this._cachedSVGPathElement;
      } else
        return this._getSVGPathElement();
    },

    /**
     * Gets a fabric.Point at a parametric distance along the current fabric.Path
     * @public
     * @param {Number} distance Parametric distance along the path created by the fabric.Path.
     * @param {Boolean} adjustForCanvas Adjust the position so that it means something to the canvas. Default: true.
     * @param {SVGPathElement} svgPath SVGPathElement that represents the current fabric.Path.
     * @return {fabric.Point} Represents point on line. Includes an extra property, "distance", which is the distance along the line the point exists at.
     */
    getPointAtLength: function(distance, adjustForCanvas, svgPath) {
      var point = new fabric.Point(0, 0);
      adjustForCanvas = (adjustForCanvas != null) ? adjustForCanvas : true;
      point.distance = 0;
      try {
        // Get SVGPathElement from SVG:PATH element.
        if (!svgPath) {
          svgPath = this.getSVGPathElement();
        }
        // Get point with (x, y).
        var svgPoint = svgPath.getPointAtLength(distance),
            offset = new fabric.Point(0, 0);

        if (adjustForCanvas) {
          var zeroPoint = (distance == 0) ? svgPoint : svgPath.getPointAtLength(0);
          offset.setXY(this.left - zeroPoint.x, this.top - zeroPoint.y);
        }
        // Abstract the point with the distance it represents along the line.
        point.setXY(svgPoint.x + offset.x, svgPoint.y + offset.y);
        point.distance = distance;
        // Send the point back.
        return point;
      } catch(e) {}
      return point;
    },

    /**
     * Gets the total parametric distance traced by the current fabric.Path
     * @public
     * @param {SVGPathElement} svgPath SVGPathElement that represents the current fabric.Path.
     * @return {Number} Represents the total distance traced by the current fabric.Path.
     */
    pathLength: function(svgPath) {
      var length = 0;

      try {
        // Get SVGPathElement from SVG:PATH element.
        if (!svgPath) {
          svgPath = this.getSVGPathElement();
        }
        // Calls SVGPathElement.getTotalLength to obtain length of path.
        length = svgPath.getTotalLength();
      } catch(e) {}
      return length;
    },

    /**
     * Gets an array of fabric.Point objects that represent the current fabric.Path
     * @public
     * @param {Number} sampleCount Points to sample from the SVGPathElement that represents the current fabric.Path. Default: 2 (just the endpoints).
     * @param {Boolean} adjustForCanvas Adjust the position so that it means something to the canvas. Default: true.
     * @param {Number} startDistance Parametric distance along the path to start sampling points from. Default: 0 (start of path).
     * @param {Number} endDistance Parametric distance along the path to end sampling points at. Default: n (end of path).
     * @param {SVGPathElement} svgPath SVGPathElement that represents the current fabric.Path.
     * @return {Array} Array of fabric.Point objects.
     */
    getSampledPoints: function(sampleCount, adjustForCanvas, startDistance, endDistance, svgPath) {
      // Sanitize input.
      if (!sampleCount) {
        sampleCount = 2;
      }
      if (startDistance == null) {
        startDistance = 0;
      }
      if (endDistance == null) {
        endDistance = this.pathLength(svgPath);
      }

      // Get number of points to sample. Default to first and last.
      sampleCount = Math.max(2, sampleCount);
      // Get the SVGPathElement from the underlying SVG:PATH element (may be cached).
      if (!svgPath) {
        svgPath = this.getSVGPathElement();
      }

      // Prepare a place to store the sampled points.
      var samples = [],
          len = endDistance - startDistance,
          step = len / (sampleCount - 1);

      // Run through f(x), adding a point at each step.
      for (var x = startDistance; x <= endDistance; x += step) {
        var p = this.getPointAtLength(x, adjustForCanvas, svgPath);
        if (p) {
          samples.push(p);
        }
      }
      // Return a list of points that represent the line.
      return samples;
    },

    /**
     * Gets a fabric.Point object along the current fabric.Path that represents the closest point along the path to the specified fabric.Point
     * @public
     * @param {fabric.Point} point Point to find in the sampled points.
     * @param {Number} sampleCount Points to sample from the SVGPathElement that represents the current fabric.Path. Default: 2 (just the endpoints, defined in fabric.Path#getSampledPoints).
     * @param {Boolean} adjustForCanvas Adjust the position so that it means something to the canvas. Default: true (defined in fabric.Path#getSampledPoints).
     * @param {Number} startDistance Parametric distance along the path to start sampling points from. Default: 0 (start of path, defined in fabric.Path#getSampledPoints).
     * @param {Number} endDistance Parametric distance along the path to end sampling points at. Default: n (end of path, defined in fabric.Path#getSampledPoints).
     * @param {SVGPathElement} svgPath SVGPathElement that represents the current fabric.Path.
     * @return {Array} Array of fabric.Point objects.
     */
    getClosestPoint: function(point, sampleCount, adjustForCanvas, startDistance, endDistance, svgPath) {
      // Get the points that will act as a proxy for the fabric.Path. Track best matches.
      var samples = this.getSampledPoints(sampleCount, adjustForCanvas, startDistance, endDistance, svgPath),
          runningBestMatch,
          runningBestMatchDistance;

      // If the point actually exists, find the closest point along the path.
      if (point != null) {
        for (var i = 0, len = samples.length; i < len; i++) {
          // Get sampled fabric.Point. Calculate distance to that point.
          var thisPoint = samples[i],
              thisDistance = point.distanceFrom(thisPoint);

          // Perform running minimum distance check.
          if (runningBestMatch == null || (thisDistance < runningBestMatchDistance)) {
            runningBestMatch = thisPoint;
            runningBestMatchDistance = thisDistance;
          }
          // If the distance is 0, this is the correct point.
          if (thisDistance == 0) {
            return runningBestMatch;
          }
        }
      }
      // Return an approximately correct point.
      return runningBestMatch;
    },

    /**
     * Gets a fabric.Point object along the current fabric.Path that represents the closest point along the path to the specified planar distance from the specified fabric.Point
     * @public
     * @param {fabric.Point} point Point to check distance against the sampled points.
     * @param {Number} targetDistance Distance away from the reference point to look for along the current fabric.Path.
     * @param {Number} sampleCount Points to sample from the SVGPathElement that represents the current fabric.Path. Default: 2 (just the endpoints, defined in fabric.Path#getSampledPoints).
     * @param {Boolean} adjustForCanvas Adjust the position so that it means something to the canvas. Default: true (defined in fabric.Path#getSampledPoints).
     * @param {Number} startDistance Parametric distance along the path to start sampling points from. Default: 0 (start of path, defined in fabric.Path#getSampledPoints).
     * @param {Number} endDistance Parametric distance along the path to end sampling points at. Default: n (end of path, defined in fabric.Path#getSampledPoints).
     * @param {SVGPathElement} svgPath SVGPathElement that represents the current fabric.Path.
     * @return {fabric.Point} fabric.Point object representing the point on the line.
     */
    getFirstPointWithPlanarDistanceFromPoint: function(point, targetDistance, sampleCount, adjustForCanvas, startDistance, endDistance, svgPath) {
      var samples = this.getSampledPoints(sampleCount, adjustForCanvas, startDistance, endDistance, svgPath);

      // If the point actually exists, find the closest point at non-parametric target distance along the path.
      if (point != null) {
        for (var i = 0, len = samples.length; i < len; i++) {
          // Get sampled fabric.Point. Calculate distance to that point.
          var thisPoint = samples[i],
              thisDistance = point.distanceFrom(thisPoint);

          // Perform running minimum distance check.
          if (thisDistance >= targetDistance) {
            return thisPoint;
          }
        }
      }
      // Return nothing.
      return null;
    }
  });

  /**
   * Creates an instance of fabric.Path from an object
   * @static
   * @memberOf fabric.Path
   * @param {Object} object
   * @param {Function} callback Callback to invoke when an fabric.Path instance is created
   */
  fabric.Path.fromObject = function(object, callback) {
    if (typeof object.path === 'string') {
      fabric.loadSVGFromURL(object.path, function (elements) {
        var path = elements[0],
            pathUrl = object.path;

        delete object.path;

        fabric.util.object.extend(path, object);
        path.setSourcePath(pathUrl);

        callback(path);
      });
    }
    else {
      callback(new fabric.Path(object.path, object));
    }
  };

  /* _FROM_SVG_START_ */
  /**
   * List of attribute names to account for when parsing SVG element (used by `fabric.Path.fromElement`)
   * @static
   * @memberOf fabric.Path
   * @see http://www.w3.org/TR/SVG/paths.html#PathElement
   */
  fabric.Path.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat(['d']);

  /**
   * Creates an instance of fabric.Path from an SVG <path> element
   * @static
   * @memberOf fabric.Path
   * @param {SVGElement} element to parse
   * @param {Function} callback Callback to invoke when an fabric.Path instance is created
   * @param {Object} [options] Options object
   */
  fabric.Path.fromElement = function(element, callback, options) {
    var parsedAttributes = fabric.parseAttributes(element, fabric.Path.ATTRIBUTE_NAMES);
    callback && callback(new fabric.Path(parsedAttributes.d, extend(parsedAttributes, options)));
  };
  /* _FROM_SVG_END_ */

  /**
   * Indicates that instances of this type are async
   * @static
   * @memberOf fabric.Path
   * @type Boolean
   * @default
   */
  fabric.Path.async = true;

})(typeof exports !== 'undefined' ? exports : this);
