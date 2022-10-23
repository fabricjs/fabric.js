import { noop } from '../../constants';
import { requestAnimFrame } from './AnimationFrameProvider';
import { runningAnimations } from './AnimationRegistry';
import { defaultEasing } from './easing';
import {
  TAnimationBaseOptions,
  TAnimationValues,
  TAbortCallback,
  TEasingFunction,
  TOnAnimationChangeCallback,
  TAnimationCallbacks,
} from './types';

export abstract class AnimationBase<T extends number | number[]> {
  readonly startValue: T;
  readonly endValue: T;
  readonly byValue: T;
  readonly duration: number;
  readonly delay: number;
  protected readonly easing: TEasingFunction<T>;
  private readonly _onStart: VoidFunction;
  private readonly _onChange: TOnAnimationChangeCallback<T, void>;
  private readonly _onComplete: TOnAnimationChangeCallback<T, void>;
  private readonly _abort: TAbortCallback<T>;
  /**
   * used to register the animation to a target object so it can be cancelled within hte object context
   */
  readonly target?: unknown;

  private _state: 'pending' | 'running' | 'completed' | 'aborted' = 'pending';
  /**
   * time %
   */
  durationRate = 0;
  /**
   * value %
   */
  valueRate = 0;
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
  }: Partial<TAnimationBaseOptions<T> & TAnimationCallbacks<T>> &
    TAnimationValues<T>) {
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

  get state() {
    return this._state;
  }

  protected abstract calculate(currentTime: number): {
    value: T;
    changeRate: number;
  };

  start() {
    const firstTick: FrameRequestCallback = (timestamp) => {
      if (this._state !== 'pending') return;
      this.startTime = timestamp || +new Date();
      this._state = 'running';
      this._onStart();
      this.tick(this.startTime);
    };

    this.register();

    // setTimeout(cb, 0) will run cb on the next frame, causing a delay
    // we don't want that
    if (this.delay > 0) {
      setTimeout(() => requestAnimFrame(firstTick), this.delay);
    } else {
      requestAnimFrame(firstTick);
    }
  }

  private tick: FrameRequestCallback = (t) => {
    const durationMs = (t || +new Date()) - this.startTime;
    const boundDurationMs = Math.min(durationMs, this.duration);
    this.durationRate = boundDurationMs / this.duration;
    const { value, changeRate } = this.calculate(boundDurationMs);
    this.value = Array.isArray(value) ? (value.slice() as T) : value;
    this.valueRate = changeRate;

    if (this._state === 'aborted') {
      return;
    } else if (this._abort(value, this.valueRate, this.durationRate)) {
      this._state = 'aborted';
      this.unregister();
    } else if (durationMs >= this.duration) {
      // since both byValue and endValue are populated with defaults if missing,
      //  we must calculate end value
      // this means that if both byValue and endValue are passed in options endValue will be ignored
      const { value: endValue } = this.calculate(this.duration);
      this.durationRate = this.valueRate = 1;
      this._onChange(
        (Array.isArray(endValue) ? endValue.slice() : endValue) as T,
        this.valueRate,
        this.durationRate
      );
      this._state = 'completed';
      this._onComplete(endValue, this.valueRate, this.durationRate);
      this.unregister();
    } else {
      this._onChange(value, this.valueRate, this.durationRate);
      requestAnimFrame(this.tick);
    }
  };

  private register() {
    runningAnimations.push(this);
  }

  private unregister() {
    runningAnimations.remove(this);
  }

  abort() {
    this._state = 'aborted';
    this.unregister();
  }
}
