//= require "object.class"

(function(){
  
  var fabric = this.fabric || (this.fabric = { }),
      min = fabric.util.array.min,
      max = fabric.util.array.max,
      extend = fabric.util.object.extend;
  
  if (fabric.Path) {
    fabric.warn('fabric.Path is already defined');
    return;
  }
  if (!fabric.Object) {
    fabric.warn('fabric.Path requires fabric.Object');
    return;
  }
  
  /**
   * @private
   */
  function getX(item) {
    if (item[0] === 'H') {
      return item[1];
    }
    return item[item.length - 2];
  }
  
  /**
   * @private
   */
  function getY(item) {
    if (item[0] === 'V') {
      return item[1];
    }
    return item[item.length - 1];
  }
  
  /** 
   * @class Path
   * @extends fabric.Object
   */
  fabric.Path = fabric.util.createClass(fabric.Object, /** @scope fabric.Path.prototype */ {
    
    /** @property */
    type: 'path',
    
    /**
     * Constructor
     * @method initialize
     * @param {Array|String} path Path data (sequence of coordinates and corresponding "command" tokens)
     * @param {Object} [options] Options object
     */
    initialize: function(path, options) {
      options = options || { };
      
      this.setOptions(options);
      this._importProperties();
      
      this.originalState = { };
      
      if (!path) {
        throw Error('`path` argument is required');
      }
      
      var fromArray = Object.prototype.toString.call(path) === '[object Array]';
      
      this.path = fromArray
        ? path
        : path.match && path.match(/[a-zA-Z][^a-zA-Z]*/g);
        
      if (!this.path) return;
      
      // TODO (kangax): rewrite this idiocracy
      if (!fromArray) {
        this._initializeFromArray(options);
      };
      
      this.setCoords();
      
      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },
    
    _initializeFromArray: function(options) {
      var isWidthSet = 'width' in options,
          isHeightSet = 'height' in options;
          
      this.path = this._parsePath();
      
      if (!isWidthSet || !isHeightSet) {
        extend(this, this._parseDimensions());
        if (isWidthSet) {
          this.width = this.options.width;
        }
        if (isHeightSet) {
          this.height = this.options.height;
        }
      }
    },
    
    _render: function(ctx) {
      var current, // current instruction 
          x = 0, // current x 
          y = 0, // current y
          controlX = 0, // current control point x
          controlY = 0, // current control point y
          tempX, 
          tempY,
          l = -(this.width / 2),
          t = -(this.height / 2);
          
      for (var i = 0, len = this.path.length; i < len; ++i) {
        
        current = this.path[i];
        
        switch (current[0]) { // first letter
          
          case 'l': // lineto, relative
            x += current[1];
            y += current[2];
            ctx.lineTo(x + l, y + t);
            break;
            
          case 'L': // lineto, absolute
            x = current[1];
            y = current[2];
            ctx.lineTo(x + l, y + t);
            break;
            
          case 'h': // horizontal lineto, relative
            x += current[1];
            ctx.lineTo(x + l, y + t);
            break;
            
          case 'H': // horizontal lineto, absolute
            x = current[1];
            ctx.lineTo(x + l, y + t);
            break;
            
          case 'v': // vertical lineto, relative
            y += current[1];
            ctx.lineTo(x + l, y + t);
            break;
            
          case 'V': // verical lineto, absolute
            y = current[1];
            ctx.lineTo(x + l, y + t);
            break;
            
          case 'm': // moveTo, relative
            x += current[1];
            y += current[2];
            ctx.moveTo(x + l, y + t);
            break;
          
          case 'M': // moveTo, absolute
            x = current[1];
            y = current[2];
            ctx.moveTo(x + l, y + t);
            break;
            
          case 'c': // bezierCurveTo, relative
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
            
          case 'C': // bezierCurveTo, absolute
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
          
          case 's': // shorthand cubic bezierCurveTo, relative
            // transform to absolute x,y
            tempX = x + current[3];
            tempY = y + current[4];
            // calculate reflection of previous control points            
            controlX = 2 * x - controlX;
            controlY = 2 * y - controlY;
            ctx.bezierCurveTo(
              controlX + l,
              controlY + t,
              x + current[1] + l,
              y + current[2] + t,
              tempX + l,
              tempY + t
            );
            x = tempX;
            y = tempY;
            break;
            
          case 'S': // shorthand cubic bezierCurveTo, absolute
            tempX = current[3];
            tempY = current[4];
            // calculate reflection of previous control points            
            controlX = 2*x - controlX;
            controlY = 2*y - controlY;
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
            break;
            
          case 'q': // quadraticCurveTo, relative
            x += current[3];
            y += current[4];
            ctx.quadraticCurveTo(
              current[1] + l, 
              current[2] + t, 
              x + l, 
              y + t
            );
            break;
            
          case 'Q': // quadraticCurveTo, absolute
            x = current[3];
            y = current[4];
            controlX = current[1];
            controlY = current[2];
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              x + l,
              y + t
            );
            break;
          
          case 'T':
            tempX = x;
            tempY = y;
            x = current[1];
            y = current[2];
            // calculate reflection of previous control points
            controlX = -controlX + 2 * tempX;
            controlY = -controlY + 2 * tempY;
            ctx.quadraticCurveTo(
              controlX + l,
              controlY + t,
              x + l, 
              y + t
            );
            break;
            
          case 'a':
            // TODO (kangax): implement arc (relative)
            break;
          
          case 'A':
            // TODO (kangax): implement arc (absolute)
            break;
          
          case 'z':
          case 'Z':
            ctx.closePath();
            break;
        }
      }
    },
    
    render: function(ctx, noTransform) {
      ctx.save();
      var m = this.transformMatrix;
      if (m) {
        ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
      }
      if (!noTransform) {
        this.transform(ctx);
      }
      // ctx.globalCompositeOperation = this.fillRule;

      if (this.overlayFill) {
        ctx.fillStyle = this.overlayFill;
      }
      else if (this.fill) {
        ctx.fillStyle = this.fill;
      }
      
      if (this.stroke) {
        ctx.strokeStyle = this.stroke;
      }
      ctx.beginPath();
      
      this._render(ctx);
      
      if (this.fill) {
        ctx.fill();
      }
      if (this.stroke) {
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = ctx.lineJoin = 'round';
        ctx.stroke();
      }
      if (!noTransform && this.active) {
        this.drawBorders(ctx);
        this.hideCorners || this.drawCorners(ctx);
      }
      ctx.restore();
    },
    
    /**
     * Returns string representation of an instance
     * @method toString
     * @return {String} string representation of an instance
     */
    toString: function() {
      return '#<fabric.Path ('+ this.complexity() +'): ' + 
        JSON.stringify({ top: this.top, left: this.left }) +'>';
    },
    
    /**
     * @method toObject
     * @return {Object}
     */
    toObject: function() {
      var o = extend(this.callSuper('toObject'), {
        path: this.path
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
     * @method toDatalessObject
     * @return {Object}
     */
    toDatalessObject: function() {
      var o = this.toObject();
      if (this.sourcePath) {
        o.path = this.sourcePath;
      }
      delete o.sourcePath;
      return o;
    },
    
    /**
     * Returns number representation of an instance complexity
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.path.length;
    },
    
    set: function(prop, value) {
      return this.callSuper('set', prop, value);
    },
    
    _parsePath: function() {
      
      var result = [],
          currentPath, 
          chunks;
      
      // use plain loop for perf.
      for (var i = 0, len = this.path.length; i < len; i++) {
        currentPath = this.path[i];
        chunks = currentPath.slice(1).trim().replace(/(\d)-/g, '$1###-').split(/\s|,|###/);
        result.push([currentPath.charAt(0)].concat(chunks.map(parseFloat)));
      }
      return result;
    },
    
    /**
     * @method _parseDimensions
     */
    _parseDimensions: function() {
      var aX = [], 
          aY = [], 
          previousX, 
          previousY, 
          isLowerCase = false, 
          x, 
          y;
      
      this.path.forEach(function(item, i) {
        if (item[0] !== 'H') {
          previousX = (i === 0) ? getX(item) : getX(this.path[i-1]);
        }
        if (item[0] !== 'V') {
          previousY = (i === 0) ? getY(item) : getY(this.path[i-1]);
        }
        
        // lowercased letter denotes relative position; 
        // transform to absolute
        if (item[0] === item[0].toLowerCase()) {
          isLowerCase = true;
        }
        
        // last 2 items in an array of coordinates are the actualy x/y (except H/V);
        // collect them
        
        // TODO (kangax): support relative h/v commands
            
        x = isLowerCase
          ? previousX + getX(item)
          : item[0] === 'V' 
            ? previousX 
            : getX(item);
            
        y = isLowerCase
          ? previousY + getY(item)
          : item[0] === 'H' 
            ? previousY 
            : getY(item);
        
        var val = parseInt(x, 10);
        if (!isNaN(val)) aX.push(val);
        
        val = parseInt(y, 10);
        if (!isNaN(val)) aY.push(val);
        
      }, this);
      
      var minX = min(aX), 
          minY = min(aY), 
          deltaX = deltaY = 0;
      
      var o = {
        top: minY - deltaY,
        left: minX - deltaX,
        bottom: max(aY) - deltaY,
        right: max(aX) - deltaX
      };
      
      o.width = o.right - o.left;
      o.height = o.bottom - o.top;
      
      return o;
    }
  });
  
  /**
   * Creates an instance of fabric.Path from an object
   * @static
   * @method fabric.Path.fromObject
   * @return {fabric.Path} Instance of fabric.Path
   */
  fabric.Path.fromObject = function(object) {
    return new fabric.Path(object.path, object);
  };
  
  var ATTRIBUTE_NAMES = fabric.Path.ATTRIBUTE_NAMES = 'd fill fill-opacity fill-rule stroke stroke-width transform'.split(' ');
  
  /**
   * Creates an instance of fabric.Path from an SVG <PATH> element
   * @static
   * @method fabric.Path.fromElement
   * @param {SVGElement} element to parse
   * @param {Object} options object
   * @return {fabric.Path} Instance of fabric.Path
   */
  fabric.Path.fromElement = function(element, options) {
    var parsedAttributes = fabric.parseAttributes(element, ATTRIBUTE_NAMES),
        path = parsedAttributes.d;
    delete parsedAttributes.d;
    return new fabric.Path(path, extend(parsedAttributes, options));
  };
})();