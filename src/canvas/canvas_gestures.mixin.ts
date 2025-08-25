// @ts-nocheck

import { scalingEqually } from '../controls/scale';
import { fireEvent } from '../controls/fireEvent';
import {
  degreesToRadians,
  radiansToDegrees,
} from '../util/misc/radiansDegreesConversion';
import { Canvas } from './Canvas';
import { CENTER, ROTATING, ROTATE, SCALE } from '../constants';

/**
 * Adds support for multi-touch gestures using the Event.js library.
 * Fires the following custom events:
 * - touch:gesture
 * - touch:drag
 * - touch:orientation
 * - touch:shake
 * - touch:longpress
 */
Object.assign(Canvas.prototype, {
  /**
   * Method that defines actions when an Event.js gesture is detected on an object. Currently only supports
   * 2 finger gestures.
   * @param {Event} e Event object by Event.js
   * @param {Event} self Event proxy object by Event.js
   */
  __onTransformGesture: function (e, self) {
    if (
      this.isDrawingMode ||
      !e.touches ||
      e.touches.length !== 2 ||
      'gesture' !== self.gesture
    ) {
      return;
    }

    const { target } = this.findTarget(e);
    if ('undefined' !== typeof target) {
      this.__gesturesParams = {
        e: e,
        self: self,
        target: target,
      };

      this.__gesturesRenderer();
    }

    this.fire('touch:gesture', {
      target: target,
      e: e,
      self: self,
    });
  },
  __gesturesParams: null,
  __gesturesRenderer: function () {
    if (this.__gesturesParams === null || this._currentTransform === null) {
      return;
    }

    const self = this.__gesturesParams.self;
    const t = this._currentTransform;
    const e = this.__gesturesParams.e;

    t.action = SCALE;
    t.originX = t.originY = CENTER;

    this._scaleObjectBy(self.scale, e);

    if (self.rotation !== 0) {
      t.action = ROTATE;
      this._rotateObjectByAngle(self.rotation, e);
    }

    this.requestRenderAll();

    t.action = 'drag';
  },

  /**
   * Method that defines actions when an Event.js drag is detected.
   *
   * @param {Event} e Event object by Event.js
   * @param {Event} self Event proxy object by Event.js
   */
  __onDrag: function (e, self) {
    this.fire('touch:drag', {
      e: e,
      self: self,
    });
  },

  /**
   * Method that defines actions when an Event.js orientation event is detected.
   *
   * @param {Event} e Event object by Event.js
   * @param {Event} self Event proxy object by Event.js
   */
  __onOrientationChange: function (e, self) {
    this.fire('touch:orientation', {
      e: e,
      self: self,
    });
  },

  /**
   * Method that defines actions when an Event.js shake event is detected.
   *
   * @param {Event} e Event object by Event.js
   * @param {Event} self Event proxy object by Event.js
   */
  __onShake: function (e, self) {
    this.fire('touch:shake', {
      e: e,
      self: self,
    });
  },

  /**
   * Method that defines actions when an Event.js longpress event is detected.
   *
   * @param {Event} e Event object by Event.js
   * @param {Event} self Event proxy object by Event.js
   */
  __onLongPress: function (e, self) {
    this.fire('touch:longpress', {
      e: e,
      self: self,
    });
  },

  /**
   * @private
   * @param {Event} [e] Event object fired on Event.js gesture
   * @param {Event} [self] Inner Event object
   */
  _onGesture: function (e, self) {
    this.__onTransformGesture(e, self);
  },

  /**
   * @private
   * @param {Event} [e] Event object fired on Event.js drag
   * @param {Event} [self] Inner Event object
   */
  _onDrag: function (e, self) {
    this.__onDrag(e, self);
  },

  /**
   * Scales an object by a factor
   * @param {Number} s The scale factor to apply to the current scale level
   * @param {Event} e Event object by Event.js
   */
  _scaleObjectBy: function (s, e) {
    const t = this._currentTransform;
    const target = t.target;
    t.gestureScale = s;
    target._scaling = true;
    return scalingEqually(e, t, 0, 0);
  },

  /**
   * Rotates object by an angle
   * @param {Number} curAngle The angle of rotation in degrees
   * @param {Event} e Event object by Event.js
   */
  _rotateObjectByAngle: function (curAngle, e) {
    const t = this._currentTransform;

    if (t.target.get('lockRotation')) {
      return;
    }
    t.target.rotate(radiansToDegrees(degreesToRadians(curAngle) + t.theta));
    fireEvent(ROTATING, {
      target: t.target,
      e: e,
      transform: t,
    });
  },

  /**
   * @private
   * @param {Event} [e] Event object fired on Event.js orientation change
   * @param {Event} [self] Inner Event object
   */
  _onOrientationChange: function (e, self) {
    this.__onOrientationChange(e, self);
  },

  /**
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   * @param {Event} [self] Inner Event object
   */
  _onShake: function (e, self) {
    this.__onShake(e, self);
  },

  /**
   * @private
   * @param {Event} [e] Event object fired on Event.js shake
   * @param {Event} [self] Inner Event object
   */
  _onLongPress: function (e, self) {
    this.__onLongPress(e, self);
  },
});
