//@ts-nocheck
import { fabric } from '../../HEADER';

/**
 * Array holding all running animations
 * @memberof fabric
 * @type {AnimationContext[]}
 */
class RunningAnimations extends Array {
  /**
   * cancel all running animations at the next requestAnimFrame
   * @returns {AnimationContext[]}
   */
  cancelAll(): any[] {
    const animations = this.splice(0);
    animations.forEach((animation) => animation.cancel());
    return animations;
  }

  /**
   * cancel all running animations attached to canvas at the next requestAnimFrame
   * @param {fabric.Canvas} canvas
   * @returns {AnimationContext[]}
   */
  cancelByCanvas(canvas: any) {
    if (!canvas) {
      return [];
    }
    const cancelled = this.filter(
      (animation) => typeof animation.target === 'object' && animation.target.canvas === canvas
    );
    cancelled.forEach((animation) => animation.cancel());
    return cancelled;
  }

  /**
   * cancel all running animations for target at the next requestAnimFrame
   * @param {*} target
   * @returns {AnimationContext[]}
   */
  cancelByTarget(target) {
    const cancelled = this.findAnimationsByTarget(target);
    cancelled.forEach((animation) => animation.cancel());
    return cancelled;
  }

  /**
   *
   * @param {CancelFunction} cancelFunc the function returned by animate
   * @returns {number}
   */
  findAnimationIndex(cancelFunc) {
    return this.indexOf(this.findAnimation(cancelFunc));
  }

  /**
   *
   * @param {CancelFunction} cancelFunc the function returned by animate
   * @returns {AnimationContext | undefined} animation's options object
   */
  findAnimation(cancelFunc) {
    return this.find((animation) => animation.cancel === cancelFunc);
  }

  /**
   *
   * @param {*} target the object that is assigned to the target property of the animation context
   * @returns {AnimationContext[]} array of animation options object associated with target
   */
  findAnimationsByTarget(target) {
    if (!target) {
      return [];
    }
    return this.filter((animation) => animation.target === target);
  }
}

export const runningAnimations = new RunningAnimations();

fabric.runningAnimations = runningAnimations;

