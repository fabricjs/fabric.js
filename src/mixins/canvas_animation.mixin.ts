//@ts-nocheck
import { animate } from "../util";


export function CanvasAnimationMixinGenerator(Klass) {
    return class CanvasAnimationMixin extends Klass {

        /**
         * Animation duration (in ms) for fx* methods
         * @type Number
         * @default
         */
        FX_DURATION = 500;

        /**
         * Centers object horizontally with animation.
         * @param {FabricObject} object Object to center
         * @param {Object} [callbacks] Callbacks object with optional "onComplete" and/or "onChange" properties
         * @param {Function} [callbacks.onComplete] Invoked on completion
         * @param {Function} [callbacks.onChange] Invoked on every step of animation
         * @return {fabric.AnimationContext} context
         */
        fxCenterObjectH(object, callbacks) {
            callbacks = callbacks || {};

            var empty = function () { }, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;

            return animate({
                target: this,
                startValue: object.getX(),
                endValue: this.getCenterPoint().x,
                duration: this.FX_DURATION,
                onChange: function (value) {
                    object.setX(value);
                    _this.requestRenderAll();
                    onChange();
                },
                onComplete: function () {
                    object.setCoords();
                    onComplete();
                }
            });
        }

        /**
         * Centers object vertically with animation.
         * @param {FabricObject} object Object to center
         * @param {Object} [callbacks] Callbacks object with optional "onComplete" and/or "onChange" properties
         * @param {Function} [callbacks.onComplete] Invoked on completion
         * @param {Function} [callbacks.onChange] Invoked on every step of animation
         * @return {fabric.AnimationContext} context
         */
        fxCenterObjectV(object, callbacks) {
            callbacks = callbacks || {};

            var empty = function () { }, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;

            return animate({
                target: this,
                startValue: object.getY(),
                endValue: this.getCenterPoint().y,
                duration: this.FX_DURATION,
                onChange: function (value) {
                    object.setY(value);
                    _this.requestRenderAll();
                    onChange();
                },
                onComplete: function () {
                    object.setCoords();
                    onComplete();
                }
            });
        }

        /**
         * Same as `fabric.Canvas#remove` but animated
         * @param {FabricObject} object Object to remove
         * @param {Object} [callbacks] Callbacks object with optional "onComplete" and/or "onChange" properties
         * @param {Function} [callbacks.onComplete] Invoked on completion
         * @param {Function} [callbacks.onChange] Invoked on every step of animation
         * @return {fabric.AnimationContext} context
         */
        fxRemove(object, callbacks) {
            callbacks = callbacks || {};

            var empty = function () { }, onComplete = callbacks.onComplete || empty, onChange = callbacks.onChange || empty, _this = this;

            return animate({
                target: this,
                startValue: object.opacity,
                endValue: 0,
                duration: this.FX_DURATION,
                onChange: function (value) {
                    object.set('opacity', value);
                    _this.requestRenderAll();
                    onChange();
                },
                onComplete: function () {
                    _this.remove(object);
                    onComplete();
                }
            });
        }
    };
}
