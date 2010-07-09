//= require "canvas_path.class"

(function(){
  
  var Canvas = this.Canvas || (this.Canvas = { });
  if (Canvas.PathGroup) {
    console.warn('Canvas.PathGroup is already defined');
    return;
  }
  
  Canvas.PathGroup = Canvas.base.createClass(Canvas.Path, Canvas.IStub, {
    
    type: 'path-group',
    forceFillOverwrite: false,
    
    initialize: function(paths, options) {
      
      options = options || { };
      
      this.originalState = { };
      this.paths = paths;
      
      this.setOptions(options);
      this.initProperties();
      
      this.setCoords();
      
      if (options.sourcePath) {
        this.setSourcePath(options.sourcePath);
      }
    },
    
    initProperties: function() {
      this.stateProperties.forEach(function(prop) {
        if (prop === 'fill') {
          this.set(prop, this.options[prop]);
        }
        else if (prop === 'angle') {
          this.setAngle(this.options[prop]);
        }
        else {
          this[prop] = this.options[prop];
        }
      }, this);
    },
    
    render: function(ctx) {
      if (this.stub) {
        // fast-path, rendering image stub
        ctx.save();
        
        this.transform(ctx);
        this.stub.render(ctx, false /* no transform */);
        if (this.active) {
          this.drawBorders(ctx);
          this.drawCorners(ctx);
        }
        ctx.restore();
      }
      else {
        ctx.save();
        
        var m = this.transformMatrix;
        if (m) {
          ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        
        this.transform(ctx);
        for (var i = 0, l = this.paths.length; i < l; ++i) {
          this.paths[i].render(ctx, true);
        }
        if (this.active) {
          this.drawBorders(ctx);
          this.hideCorners || this.drawCorners(ctx);
        }
        ctx.restore();
      }
    },
    
    /**
     * @method set
     * @param {String} prop
     * @param {Any} value
     * @return {Canvas.PathGroup} thisArg
     */
    set: function(prop, value) {
      if ((prop === 'fill' || prop === 'overlayFill') && this.isSameColor()) {
        this[prop] = value;
        var i = this.paths.length;
        while (i--) {
          this.paths[i].set(prop, value);
        }
      }
      else {
        // skipping parent "class" - Canvas.Path
        Canvas.Object.prototype.set.call(this, prop, value);
      }
      return this;
    },
    
    /**
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      var _super = Canvas.Object.prototype.toObject;
      return Canvas.base.object.extend(_super.call(this), {
        paths: Canvas.base.array.invoke(this.getObjects(), 'clone'),
        sourcePath: this.sourcePath
      });
    },
    
    /**
     * @method toDatalessObject
     * @return {Object} dataless object representation of an instance
     */
    toDatalessObject: function() {
      var o = this.toObject();
      if (this.sourcePath) {
        o.paths = this.sourcePath;
      }
      return o;
    },
    
     /**
      * Returns a string representation of an object
      * @method toString
      * @return {String} string representation of an object
      */
    toString: function() {
      return '#<Canvas.PathGroup (' + this.complexity() + 
        '): { top: ' + this.top + ', left: ' + this.left + ' }>';
    },
    
    /**
     * @method isSameColor
     * @return {Boolean} true if all paths are of the same color (`fill`)
     */
    isSameColor: function() {
      var firstPathFill = this.getObjects()[0].get('fill');
      return this.getObjects().every(function(path) {
        return path.get('fill') === firstPathFill;
      });
    },
    
    /**
      * Returns number representation of object's complexity
      * @method complexity
      * @return {Number} complexity
      */
    complexity: function() {
      return this.paths.reduce(function(total, path) {
        return total + ((path && path.complexity) ? path.complexity() : 0);
      }, 0);
    },
    
    /**
      * Makes path group grayscale
      * @method toGrayscale
      * @return {Canvas.PathGroup} thisArg
      */
    toGrayscale: function() {
      var i = this.paths.length;
      while (i--) {
        this.paths[i].toGrayscale();
      }
      return this;
    },
    
    /**
     * @method getObjects
     * @return {Array} array of path objects included in this path group
     */
    getObjects: function() {
      return this.paths;
    }
  });
  
  /**
   * @private
   * @method instantiatePaths
   */
  function instantiatePaths(paths) {
    for (var i = 0, len = paths.length; i < len; i++) {
      if (!(paths[i] instanceof Canvas.Object)) {
        var klassName = paths[i].type.camelize().capitalize();
        paths[i] = Canvas[klassName].fromObject(paths[i]);
      }
    }
    return paths;
  }
  
  /**
   * @static
   * @method Canvas.PathGroup.fromObject
   * @param {Object}
   * @return {Canvas.PathGroup}
   */
  Canvas.PathGroup.fromObject = function(object) {
    var paths = instantiatePaths(object.paths);
    return new Canvas.PathGroup(paths, object);
  }
})();