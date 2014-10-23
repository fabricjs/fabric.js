   (function() {

     var degreesToRadians = fabric.util.degreesToRadians,
             radiansToDegrees = fabric.util.radiansToDegrees;

     fabric.util.object.extend(fabric.Canvas.prototype, /** @lends fabric.Canvas.prototype */ {
       /**
        * Method that defines actions when an Event.js gesture is detected on an object. Currently only supports
        * 2 finger gestures.
        *
        * @param e Event object by Event.js
        * @param self Event proxy object by Event.js
        */
       __onTransformGesture: function(e, self) {

//            console.log('__onTransformGesture', new Date().getTime(), e);
         if (this.isDrawingMode || !e.touches || e.touches.length !== 2 || 'gesture' !== self.gesture) {
           return;
         }

         var target = this.findTarget(e);
         if ('undefined' !== typeof target) {
           this.__gesturesParams = {
             'e': e,
             'self': self,
             'target': target
           };

//           console.log(target);
           this.__gesturesRenderer();
//           this.__gesturesInterval(e, self, target);
         }

         this.fire('touch:gesture', {target: target, e: e, self: self});
       },
       // unused
       __gesturesIntervalTimer: null,
       __gesturesParams: null,
       // unused
       __gesturesInterval: function(e, self, target) {
         this.__gesturesParams = {
           'e': e,
           'self': self,
           'target': target
         };

         var that = this;
         if (this.__gesturesIntervalTimer === null) {
           console.log('STARTING INTERVAL');
           this.__gesturesIntervalTimer = setInterval(function() {
             that.__gesturesRenderer();
           }, 15);

           // testing
           setTimeout(function() {
             console.log('INTERVAL CLEARED');
             clearInterval(that.__gesturesIntervalTimer);
           }, 25000);
         }
       },
       __gesturesRenderer: function() {

         if (this.__gesturesParams === null || this._currentTransform === null) {
           return;
         }

         var e = this.__gesturesParams.e;
         var self = this.__gesturesParams.self;
         var target = this.__gesturesParams.target;

//            console.log('__gesturesRenderer', new Date().getTime(), this._currentTransform, e, target);

         var t = this._currentTransform;
         t.action = 'scale';
//            if(this._shouldCenterTransform(e, target)) {
         t.originX = t.originY = 'center';
         this._setOriginToCenter(t.target);
//            }

         this._scaleObjectBy(self.scale);

         if (self.rotation !== 0) {
           t.action = 'rotate';
           this._rotateObjectByAngle(self.rotation);
         }

         this.renderAll();
         t.action = 'drag';

         //this.__gesturesParams = null;
       },
       /**
        * Method that defines actions when an Event.js drag is detected.
        *
        * @param e Event object by Event.js
        * @param self Event proxy object by Event.js
        */
       __onDrag: function(e, self) {
         this.fire('touch:drag', {e: e, self: self});
       },
       /**
        * Method that defines actions when an Event.js orientation event is detected.
        *
        * @param e Event object by Event.js
        * @param self Event proxy object by Event.js
        */
       __onOrientationChange: function(e, self) {
         this.fire('touch:orientation', {e: e, self: self});
       },
       /**
        * Method that defines actions when an Event.js shake event is detected.
        *
        * @param e Event object by Event.js
        * @param self Event proxy object by Event.js
        */
       __onShake: function(e, self) {
         this.fire('touch:shake', {e: e, self: self});
       },
       /**
        * Scales an object by a factor
        * @param s {Number} The scale factor to apply to the current scale level
        * @param by {String} Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
        *                    When not provided, an object is scaled by both dimensions equally
        */
       _scaleObjectBy: function(s, by) {
         var t = this._currentTransform,
                 target = t.target,
                 lockScalingX = target.get('lockScalingX'),
                 lockScalingY = target.get('lockScalingY');

         if (lockScalingX && lockScalingY)
           return;

         target._scaling = true;

         var constraintPosition = target.translateToOriginPoint(target.getCenterPoint(), t.originX, t.originY);

         if (!by) {
           t.newScaleX = t.scaleX * s;
           t.newScaleY = t.scaleY * s;
           if (!lockScalingX) {
             target.set('scaleX', t.scaleX * s);
           }
           if (!lockScalingY) {
             target.set('scaleY', t.scaleY * s);
           }
         }
//            else if (by === 'x' && !target.get('lockUniScaling')) {
//                lockScalingX || target.set('scaleX', t.scaleX * s);
//            }
//            else if (by === 'y' && !target.get('lockUniScaling')) {
//                lockScalingY || target.set('scaleY', t.scaleY * s);
//            }

         target.setPositionByOrigin(constraintPosition, t.originX, t.originY);
       },
       /**
        * Rotates object by an angle
        * @param curAngle {Number} the angle of rotation in degrees
        */
       _rotateObjectByAngle: function(curAngle) {
         var t = this._currentTransform;

         if (t.target.get('lockRotation'))
           return;
         t.target.angle = radiansToDegrees(degreesToRadians(curAngle) + t.theta);
       }
     });
   })();