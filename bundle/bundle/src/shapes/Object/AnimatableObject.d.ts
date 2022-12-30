import { TColorArg } from '../../color/color.class';
import { ObjectEvents } from '../../EventTypeDefs';
import { TDegree } from '../../typedefs';
import { AnimationOptions, ColorAnimationOptions } from '../../util/animation';
import type { ColorAnimation } from '../../util/animation/ColorAnimation';
import type { ValueAnimation } from '../../util/animation/ValueAnimation';
import { StackedObject } from './StackedObject';
type TAnimationOptions<T extends number | TColorArg> = T extends number ? AnimationOptions : ColorAnimationOptions;
export declare abstract class AnimatableObject<EventSpec extends ObjectEvents = ObjectEvents> extends StackedObject<EventSpec> {
    /**
     * Animation duration (in ms) for fx* methods
     * @type Number
     * @default
     */
    FX_DURATION: number;
    /**
     * List of properties to consider for animating colors.
     * @type String[]
     */
    colorProperties: string[];
    abstract rotate(deg: TDegree): void;
    /**
     * Animates object's properties
     * @param {String|Object} property Property to animate (if string) or properties to animate (if object)
     * @param {Number|Object} value Value to animate property to (if string was given first) or options object
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#animation}
     * @return {(ColorAnimation | ValueAnimation)[]} animation context (or an array if passed multiple properties)
     *
     * As object — multiple properties
     *
     * object.animate({ left: ..., top: ... });
     * object.animate({ left: ..., top: ... }, { duration: ... });
     *
     * As string — one property
     * Supports +=N and -=N for animating N units in a given direction
     *
     * object.animate('left', ...);
     * object.animate('left', ..., { duration: ... });
     *
     * Example of +=/-=
     * object.animate('right', '-=50');
     * object.animate('top', '+=50', { duration: ... });
     */
    animate<T extends number | TColorArg>(key: string, toValue: T, options?: Partial<TAnimationOptions<T>>): (ColorAnimation | ValueAnimation)[];
    animate<T extends number | TColorArg>(animatable: Record<string, T>, options?: Partial<TAnimationOptions<T>>): (ColorAnimation | ValueAnimation)[];
    /**
     * @private
     * @param {String} key Property to animate
     * @param {String} to Value to animate to
     * @param {Object} [options] Options object
     */
    _animate<T extends number | TColorArg>(key: string, to: T, options?: Partial<TAnimationOptions<T>>): ColorAnimation | ValueAnimation;
    /**
     * @private
     * @return {Number} angle value
     */
    protected _getAngleValueForStraighten(): number;
    /**
     * Straightens an object (rotating it from current angle to one of 0, 90, 180, 270, etc. depending on which is closer)
     */
    straighten(): void;
    /**
     * Same as {@link straighten} but with animation
     * @param {Object} callbacks Object with callback functions
     * @param {Function} [callbacks.onComplete] Invoked on completion
     * @param {Function} [callbacks.onChange] Invoked on every step of animation
     */
    fxStraighten(callbacks?: {
        onChange?(value: TDegree): any;
        onComplete?(): any;
    }): ValueAnimation;
}
export {};
//# sourceMappingURL=AnimatableObject.d.ts.map