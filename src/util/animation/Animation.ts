import { noop } from '../../constants';
import { requestAnimFrame } from './AnimationFrame';
import { runningAnimations } from './animation_registry';
import { defaultEasing } from './easing';
import {
  TAnimationBaseOptions,
  AnimationOptions,
  TAnimationValues,
  ArrayAnimationOptions,
  TAbortCallback,
  TEasingFunction,
  TOnAnimationChangeCallback,
} from './types';

export abstract class AnimationBase<T extends number | number[]> {
  readonly startValue: T;
  readonly endValue: T;
  readonly byValue: T;
  readonly duration: number;
  readonly delay: number;
  protected readonly easing: TEasingFunction;
  private readonly _onStart: VoidFunction;
  private readonly _onChange: TOnAnimationChangeCallback<T, void>;
  private readonly _onComplete: TOnAnimationChangeCallback<T, void>;
  private readonly _abort: TAbortCallback<T>;
  /**
   * used to register the animation to a target object so it can be cancelled within hte object context
   */
  readonly target?: unknown;

  state: 'pending' | 'running' | 'completed' | 'aborted' = 'pending';
  /**
   * time %
   */
  xRate = 0;
  /**
   * value %
   */
  yRate = 0;
  /**
   * current value
   */
  value: T;
  /**
   * animation start time ms
   */
  private startTime!: number;

  constructor({
    startValue,
    endValue,
    byValue,
    duration = 500,
    delay = 0,
    easing = defaultEasing,
    onStart = noop,
    onChange = noop,
    onComplete = noop,
    abort = noop,
    target,
  }: Partial<TAnimationBaseOptions<T>> & TAnimationValues<T>) {
    this.startValue = startValue;
    this.endValue = endValue;
    this.byValue = byValue;
    this.duration = duration;
    this.delay = delay;
    this.easing = easing;
    this._onStart = onStart;
    this._onChange = onChange;
    this._onComplete = onComplete;
    this._abort = abort;
    this.value = this.startValue;
    this.target = target;
  }

  protected abstract calculate(currentTime: number): {
    value: T;
    changeRate: number;
  };

  start() {
    const runner: FrameRequestCallback = (timestamp) => {
      this.startTime = timestamp;
      this.state = 'running';
      this._onStart();
      this.tick(timestamp);
    };

    this.register();

    // setTimeout(cb, 0) will run cb on the next frame, causing a delay
    // we don't want that
    if (this.delay > 0) {
      setTimeout(() => requestAnimFrame(runner), this.delay);
    } else {
      requestAnimFrame(runner);
    }
  }

  private tick: FrameRequestCallback = (t: number) => {
    const durationMs = t - this.startTime;
    const boundDurationMs = Math.min(durationMs, this.duration);
    this.xRate = boundDurationMs / this.duration;
    const { value, changeRate } = this.calculate(boundDurationMs);
    this.value = Array.isArray(value) ? (value.slice() as T) : value;
    this.yRate = changeRate;

    if (this.state === 'aborted') {
      return;
    }
    if (this._abort(value, this.yRate, this.xRate)) {
      this.state = 'aborted';
      this.unregister();
    }
    if (durationMs > boundDurationMs) {
      // TODO this line seems redundant
      this.xRate = this.yRate = 1;
      this._onChange(
        (Array.isArray(this.endValue)
          ? this.endValue.slice()
          : this.endValue) as T,
        this.yRate,
        this.xRate
      );
      this.state = 'completed';
      this._onComplete(this.endValue, this.yRate, this.xRate);
      this.unregister();
    } else {
      this._onChange(value, this.yRate, this.xRate);
      requestAnimFrame(this.tick);
    }
  };

  private register() {
    runningAnimations.push(this as any);
  }

  private unregister() {
    runningAnimations.remove(this as any);
  }

  abort() {
    this.state = 'aborted';
    this.unregister();
  }
}

export class ValueAnimation extends AnimationBase<number> {
  constructor({
    startValue = 0,
    endValue = 100,
    byValue = endValue - startValue,
    ...options
  }: AnimationOptions) {
    super({
      ...options,
      startValue,
      endValue,
      byValue,
    });
  }
  protected calculate(currentTime: number) {
    const value = this.easing(
      currentTime,
      this.startValue,
      this.byValue,
      this.duration
    );
    return {
      value,
      changeRate: Math.abs((value - this.startValue) / this.byValue),
    };
  }
}

export class ArrayAnimation extends AnimationBase<number[]> {
  constructor({
    startValue = [0],
    endValue = [100],
    byValue = endValue.map((value, i) => value - startValue[i]),
    ...options
  }: ArrayAnimationOptions) {
    super({
      ...options,
      startValue,
      endValue,
      byValue,
    });
  }
  protected calculate(currentTime: number) {
    const values = this.startValue.map((value, i) =>
      this.easing(currentTime, value, this.byValue[i], this.duration)
    );
    return {
      value: values,
      changeRate: Math.abs((values[0] - this.startValue[0]) / this.byValue[0]),
    };
  }
}
