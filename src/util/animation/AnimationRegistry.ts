import { fabric } from '../../../HEADER';
import { Canvas, TObject } from '../../__types__';
import { AnimationBase } from './AnimationBase';

/**
 * Array holding all running animations
 */
class AnimationRegistry<T extends AnimationBase<any>> extends Array<T> {
  remove(context: T) {
    const index = this.indexOf(context);
    index > -1 && this.splice(index, 1);
  }

  /**
   * cancel all running animations at the next requestAnimFrame
   */
  cancelAll() {
    const animations = this.splice(0);
    animations.forEach((animation) => animation.abort());
    return animations;
  }

  /**
   * cancel all running animations attached to canvas at the next requestAnimFrame
   */
  cancelByCanvas(canvas: Canvas) {
    if (!canvas) {
      return [];
    }
    const animations = this.filter(
      (animation) =>
        typeof animation.target === 'object' &&
        (animation.target as TObject)?.canvas === canvas
    );
    animations.forEach((animation) => animation.abort());
    return animations;
  }

  /**
   * cancel all running animations for target at the next requestAnimFrame
   */
  cancelByTarget(target: T['target']) {
    if (!target) {
      return [];
    }
    const animations = this.filter((animation) => animation.target === target);
    animations.forEach((animation) => animation.abort());
    return animations;
  }
}

export const runningAnimations = new AnimationRegistry();

fabric.runningAnimations = runningAnimations;
