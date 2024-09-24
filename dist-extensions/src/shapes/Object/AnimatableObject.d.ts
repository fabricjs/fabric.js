import type { TColorArg } from '../../color/typedefs';
import type { ObjectEvents } from '../../EventTypeDefs';
import type { TAnimation } from '../../util/animation/animate';
import type { AnimationOptions } from '../../util/animation/types';
import { StackedObject } from './StackedObject';
export declare abstract class AnimatableObject<EventSpec extends ObjectEvents = ObjectEvents> extends StackedObject<EventSpec> {
    /**
     * List of properties to consider for animating colors.
     * @type String[]
     */
    static colorProperties: string[];
    /**
     * Animates object's properties
     * @param {Record<string, number | number[] | TColorArg>} animatable map of keys and end values
     * @param {Partial<AnimationOptions<T>>} options
     * @tutorial {@link http://fabricjs.com/fabric-intro-part-2#animation}
     * @return {Record<string, TAnimation<T>>} map of animation contexts
     *
     * As object — multiple properties
     *
     * object.animate({ left: ..., top: ... });
     * object.animate({ left: ..., top: ... }, { duration: ... });
     */
    animate<T extends number | number[] | TColorArg>(animatable: Record<string, T>, options?: Partial<AnimationOptions<T>>): Record<string, TAnimation<T>>;
    /**
     * @private
     * @param {String} key Property to animate
     * @param {String} to Value to animate to
     * @param {Object} [options] Options object
     */
    _animate<T extends number | number[] | TColorArg>(key: string, endValue: T, options?: Partial<AnimationOptions<T>>): TAnimation<T>;
}
//# sourceMappingURL=AnimatableObject.d.ts.map