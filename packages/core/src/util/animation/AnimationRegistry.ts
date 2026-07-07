import type { StaticCanvas } from '../../canvas/StaticCanvas';
import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { AnimationBase } from './AnimationBase';

/**
 * Array holding all running animations
 */
class AnimationRegistry extends Array<AnimationBase> {
  /**
   * Remove a single animation using an animation context
   * @param {AnimationBase} context
   */
  remove(context: AnimationBase) {
    const index = this.indexOf(context);
    index > -1 && this.splice(index, 1);
  }

  /**
   * Cancel all running animations on the next frame
   */
  cancelAll() {
    const animations = this.splice(0);
    animations.forEach((animation) => animation.abort());
    return animations;
  }

  /**
   * Cancel all running animations attached to a canvas on the next frame
   * @param {StaticCanvas} canvas
   */
  cancelByCanvas(canvas: StaticCanvas) {
    if (!canvas) {
      return [];
    }
    const animations = this.filter(
      (animation) =>
        animation.target === canvas ||
        (typeof animation.target === 'object' &&
          (animation.target as FabricObject)?.canvas === canvas),
    );
    animations.forEach((animation) => animation.abort());
    return animations;
  }

  /**
   * Cancel all running animations for target on the next frame
   * @param target
   */
  cancelByTarget(target: AnimationBase['target']) {
    if (!target) {
      return [];
    }
    const animations = this.filter((animation) => animation.target === target);
    animations.forEach((animation) => animation.abort());
    return animations;
  }
}

export const runningAnimations = new AnimationRegistry();
