import type { StaticCanvas } from '../../canvas/StaticCanvas';
import type { AnimationBase } from './AnimationBase';
/**
 * Array holding all running animations
 */
declare class AnimationRegistry extends Array<AnimationBase> {
    /**
     * Remove a single animation using an animation context
     * @param {AnimationBase} context
     */
    remove(context: AnimationBase): void;
    /**
     * Cancel all running animations on the next frame
     */
    cancelAll(): AnimationBase<number | number[]>[];
    /**
     * Cancel all running animations attached to a canvas on the next frame
     * @param {StaticCanvas} canvas
     */
    cancelByCanvas(canvas: StaticCanvas): AnimationBase<number | number[]>[];
    /**
     * Cancel all running animations for target on the next frame
     * @param target
     */
    cancelByTarget(target: AnimationBase['target']): AnimationBase<number | number[]>[];
}
export declare const runningAnimations: AnimationRegistry;
export {};
//# sourceMappingURL=AnimationRegistry.d.ts.map