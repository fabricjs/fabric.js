import { fabric } from '../../../HEADER';
import { Canvas, TObject } from '../../__types__';
import {
  AnimationContext,
  AnimationOptions,
  isMulti,
  TCancelFunction,
} from './types';

type TAnimation = AnimationContext<number> | AnimationContext<number[]>;

/**
 * Array holding all running animations
 * @memberof fabric
 * @type {AnimationContext[]}
 */
class RunningAnimations extends Array<TAnimation> {
  register(
    options: Partial<AnimationOptions<number> | AnimationOptions<number[]>>,
    cancel: VoidFunction
  ) {
    cancel = () => {
      cancel();
      this.remove(context);
    };
    let context: AnimationContext<number> | AnimationContext<number[]>;
    if (isMulti(options)) {
      context = {
        ...options,
        currentValue: options.startValue ?? [0],
        completionRate: 0,
        durationRate: 0,
        cancel,
      };
    } else {
      context = {
        ...options,
        currentValue: options.startValue ?? 0,
        completionRate: 0,
        durationRate: 0,
        cancel,
      };
    }
    this.push(context);
    return {
      context,
      remove: () => this.remove(context),
    };
  }

  private remove(context: TAnimation) {
    const index = this.indexOf(context);
    index > -1 && this.splice(index, 1);
  }

  /**
   * cancel all running animations at the next requestAnimFrame
   * @returns {AnimationContext[]}
   */
  cancelAll(): TAnimation[] {
    const animations = this.splice(0);
    animations.forEach((animation) => animation.cancel());
    return animations;
  }

  /**
   * cancel all running animations attached to canvas at the next requestAnimFrame
   * @param {fabric.Canvas} canvas
   * @returns {AnimationContext[]}
   */
  cancelByCanvas(canvas: Canvas): TAnimation[] {
    if (!canvas) {
      return [];
    }
    const cancelled = this.filter(
      (animation) =>
        typeof animation.target === 'object' &&
        (animation.target as TObject)?.canvas === canvas
    );
    cancelled.forEach((animation) => animation.cancel());
    return cancelled;
  }

  /**
   * cancel all running animations for target at the next requestAnimFrame
   * @param {*} target
   * @returns {AnimationContext[]}
   */
  cancelByTarget(target: TAnimation['target']): TAnimation[] {
    const cancelled = this.findAnimationsByTarget(target);
    cancelled.forEach((animation) => animation.cancel());
    return cancelled;
  }

  /**
   *
   * @param {TCancelFunction} cancelFunc the function returned by animate
   * @returns {number}
   */
  findAnimationIndex(cancelFunc: TCancelFunction): number {
    return this.findIndex((animation) => animation.cancel === cancelFunc);
  }

  /**
   *
   * @param {TCancelFunction} cancelFunc the function returned by animate
   * @returns {AnimationContext | undefined} animation's options object
   */
  findAnimation(cancelFunc: TCancelFunction): TAnimation | undefined {
    return this.find((animation) => animation.cancel === cancelFunc);
  }

  /**
   *
   * @param {*} target the object that is assigned to the target property of the animation context
   * @returns {AnimationContext[]} array of animation options object associated with target
   */
  findAnimationsByTarget(target: TAnimation['target']): TAnimation[] {
    if (!target) {
      return [];
    }
    return this.filter((animation) => animation.target === target);
  }
}

export const runningAnimations = new RunningAnimations();

fabric.runningAnimations = runningAnimations;
