//= require "canvas_object.class"

(function(){
  
  var Canvas = this.Canvas || (this.Canvas = { });
  if (Canvas.Group) {
    return;
  }
  
  Canvas.Group = Class.create(Canvas.Object, {
    
    /**
     * @property type
     */
    type: 'group',
    
    /**
     * @constructor
     * @param {Object} objects Group objects
     * @return {Object} thisArg
     */
    initialize: function(objects, options) {
      this.objects = objects || [];
      this.originalState = { };
      
      this.callSuper('initialize');
      
      this._calcBounds();
      this._updateObjectsCoords();
      
      if (options) {
        Object.extend(this, options);
      }
      this._setOpacityIfSame();
      
      // group is active by default
      this.setCoords(true);
      this.saveCoords();
      
      this.activateAllObjects();
    },
    
    /**
     * @private
     * @method _updateObjectsCoords
     */
    _updateObjectsCoords: function() {
      var groupDeltaX = this.left,
          groupDeltaY = this.top;
      
      this.forEachObject(function(object) {
        
        var objectLeft = object.get('left'),
            objectTop = object.get('top');
        
        object.set('originalLeft', objectLeft);
        object.set('originalTop', objectTop);
        
        object.set('left', objectLeft - groupDeltaX);
        object.set('top', objectTop - groupDeltaY);
        
        object.setCoords();
        
        // do not display corners of objects enclosed in a group
        object.hideCorners = true;
      }, this);
    },
    
    /**
     * @method toString
     * @return {String}
     */
    toString: function() {
      return '#<Canvas.Group: (' + this.complexity() + ')>';
    },
    
    /**
     * @method getObjects
     * @return {Array} group objects
     */
    getObjects: function() {
      return this.objects;
    },
    
    /**
     * Adds an object to a group. Recalculates group's dimension, position.
     * @method add
     * @param {Object} object
     * @return {Object} thisArg
     * @chainable
     */
    add: function(object) {
      this._restoreObjectsState();
      this.objects.push(object);
      object.setActive(true);
      this._calcBounds();
      this._updateObjectsCoords();
      return this;
    },
    
    /**
     * Removes an object from a group. Recalculates group's dimension, position.
     * @param {Object} object
     * @return {Object} thisArg
     * @chainable
     */
    remove: function(object) {
      this._restoreObjectsState();
      Canvas.util.removeFromArray(this.objects, object);
      object.setActive(false);
      this._calcBounds();
      this._updateObjectsCoords();
      return this;
    },
    
    /**
     * Returns a size of a group (i.e. length of an array containing its objects)
     * @return {Number} Group size
     */
    size: function() {
      return this.getObjects().length;
    },
  
    /**
     * Sets property to a given value
     * @method set
     * @param {String} name
     * @param {Object | Function} value
     * @return {Object} thisArg
     * @chainable
     */
    set: function(name, value) {
      if (typeof value == 'function') {
        // recurse
        this.set(name, value(this[name]));
      }
      else {
        if (name === 'fill' || name === 'opacity') {
          var i = this.objects.length;
          this[name] = value;
          while (i--) {
            this.objects[i].set(name, value);
          }
        }
        else {
          this[name] = value;
        }
      }
      return this;
    },
  
    /**
     * Returns true if a group contains an object
     * @method contains
     * @param {Object} object Object to check against
     * @return {Boolean} true if group contains an object
     */
    contains: function(object) {
      return this.objects.include(object);
    },
    
    /**
     * Returns object representation of an instance
     * @method toObject
     * @return {Object} object representation of an instance
     */
    toObject: function() {
      return Object.extend(this.callSuper('toObject'), {
        objects: this.objects.invoke('clone')
      });
    },
    
    /**
     * Renders instance on a given context
     * @method render
     * @param ctx {CanvasRenderingContext2D} context to render instance on
     */
    render: function(ctx) {
      ctx.save();
      this.transform(ctx);
      
      var groupScaleFactor = Math.max(this.scaleX, this.scaleY);
      
      for (var i = 0, len = this.objects.length; i < len; i++) {
        var originalScaleFactor = this.objects[i].borderScaleFactor;
        this.objects[i].borderScaleFactor = groupScaleFactor;
        this.objects[i].render(ctx);
        this.objects[i].borderScaleFactor = originalScaleFactor;
      }
      this.hideBorders || this.drawBorders(ctx);
      this.hideCorners || this.drawCorners(ctx);
      ctx.restore();
      this.setCoords();
    },
    
    /**
     * @method item
     * @param index {Number} index of item to get
     * @return {Canvas.Object}
     */
    item: function(index) {
      return this.getObjects()[index];
    },
    
    /**
     * @method complexity
     * @return {Number} complexity
     */
    complexity: function() {
      return this.getObjects().inject(0, function(total, object) {
        total += (typeof object.complexity == 'function') ? object.complexity() : 0;
        return total;
      });
    },
    
    /**
     * Retores original state of each of group objects
     * @private
     * @method _restoreObjectsState
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    _restoreObjectsState: function() {
      this.objects.each(this._restoreObjectState, this);
      return this;
    },
    
    /**
     * @private
     * @method _restoreObjectState
     * @param {Canvas.Object} object
     */
    _restoreObjectState: function(object) {
      
      var groupLeft = this.get('left'),
          groupTop = this.get('top'),
          groupAngle = this.getAngle() * (Math.PI / 180),
          objectLeft = object.get('originalLeft'),
          objectTop = object.get('originalTop'),
          rotatedTop = Math.cos(groupAngle) * object.get('top') + Math.sin(groupAngle) * object.get('left'),
          rotatedLeft = -Math.sin(groupAngle) * object.get('top') + Math.cos(groupAngle) * object.get('left');
      
      object.setAngle(object.getAngle() + this.getAngle());
      
      object.set('left', groupLeft + rotatedLeft * this.get('scaleX'));
      object.set('top', groupTop + rotatedTop * this.get('scaleY'));
      
      object.set('scaleX', object.get('scaleX') * this.get('scaleX'));
      object.set('scaleY', object.get('scaleY') * this.get('scaleY'));
      
      object.setCoords();
      object.hideCorners = false;
      object.setActive(false);
      object.setCoords();
      
      return this;
    },
    
    /**
     * @method destroy
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    destroy: function() {
      return this._restoreObjectsState();
    },
    
    /**
     * @saveCoords
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    saveCoords: function() {
      this._originalLeft = this.get('left');
      this._originalTop = this.get('top');
      return this;
    },
    
    hasMoved: function() {
      return this._originalLeft !== this.get('left') ||
             this._originalTop !== this.get('top');
    },
    
    /**
     * Sets coordinates of all group objects
     * @method setObjectsCoords
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    setObjectsCoords: function() {
      this.forEachObject(function(object) {
        object.setCoords();
      });
      return this;
    },
    
    /**
     * Activates (makes active) all group objects
     * @method activateAllObjects
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    activateAllObjects: function() {
      return this.setActive(true);
    },
    
    /**
     * @method setActive
     * @param {Boolean} value `true` to activate object, `false` otherwise
     * @return {Canvas.Group} thisArg
     * @chainable
     */
    setActive: function(value) {
      this.forEachObject(function(object) {
        object.setActive(value);
      });
      return this;
    },
    
    /**
     * @method forEachObject
     * @param {Function} callback 
     *                   Callback invoked with current object as first argument, 
     *                   index - as second and an array of all objects - as third.
     *                   Iteration happens in reverse order (for performance reasons).
     *                   Callback is invoked in a context of Global Object (e.g. `window`) 
     *                   when no `context` argument is given
     *
     * @param {Object} context a.k.a. thisObject
     *
     * @return {Canvas.Group}
     * @chainable
     */
    forEachObject: function(callback, context) {
      var objects = this.getObjects(),
          i = objects.length;
      while (i--) {
        callback.call(context, objects[i], i, objects);
      }
      return this;
    },
    
    /**
     * @private
     * @method _setOpacityIfSame
     */
    _setOpacityIfSame: function() {
      var objects = this.getObjects(),
          firstValue = objects[0] ? objects[0].get('opacity') : 1;
          
      var isSameOpacity = objects.all(function(o) {
        return o.get('opacity') === firstValue;
      });
      
      if (isSameOpacity) {
        this.opacity = firstValue;
      }
    },
    
    /**
     * @private
     * @method _calcBounds
     */
    _calcBounds: function() {
      var aX = [], 
          aY = [], 
          minX, minY, maxX, maxY, o, width, height, 
          i = 0,
          len = this.objects.length;

      for (; i < len; ++i) {
        o = this.objects[i];
        o.setCoords();
        for (var prop in o.oCoords) {
          aX.push(o.oCoords[prop].x);
          aY.push(o.oCoords[prop].y);
        }
      };
      
      minX = aX.min();
      maxX = aX.max();
      minY = aY.min();
      maxY = aY.max();
      
      width = maxX - minX;
      height = maxY - minY;
      
      this.width = width;
      this.height = height;
      
      this.left = minX + width / 2;
      this.top = minY + height / 2;
    },
    
    /**
     * @method containsPoint
     * @param {Object} point point with `x` and `y` properties
     * @return {Boolean} true if point is contained within group
     */
    containsPoint: function(point) {
      
      var halfWidth = this.get('width') / 2,
          halfHeight = this.get('height') / 2,
          centerX = this.get('left'),
          centerY = this.get('top');
          
      return  centerX - halfWidth < point.x && 
              centerX + halfWidth > point.x &&
              centerY - halfHeight < point.y &&
              centerY + halfHeight > point.y;
    },
    
    toGrayscale: function() {
      var i = this.objects.length;
      while (i--) {
        this.objects[i].toGrayscale();
      }
    }
  });
  
  /**
   * @static
   * @method Canvas.Group.fromObject
   * @param object {Object} object to create a group from
   * @param options {Object} options object
   * @return {Canvas.Group} an instance of Canvas.Group
   */
  Canvas.Group.fromObject = function(object) {
    return new Canvas.Group(object.objects, object);
  }
})();