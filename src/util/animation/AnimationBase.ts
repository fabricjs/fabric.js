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
  AnimationState,
} from './types';

export abstract class AnimationBase<T extends number | number[]> {
  readonly startValue: T;
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

  private _state: AnimationState = 'pending';
  /**
   * time %
   */
  durationRatio = 0;
  /**
   * value %
   */
  valueRatio = 0;
  /**
   * current value
   */
  value: T;
  /**
   * animation start time ms
   */
  private startTime!: number;

  /**
   * since both `byValue` and `endValue` are accepted in subclass options and are populated with defaults if missing,
   * we defer to `byValue` and ignore `endValue` to avoid conflict
   */
  constructor({
    startValue,
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
    Required<Omit<TAnimationValues<T>, 'endValue'>>) {
    this.startValue = startValue;
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

  get endValue() {
    return this.calculate(this.duration).value;
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
    this.durationRatio = boundDurationMs / this.duration;
    const { value, changeRate } = this.calculate(boundDurationMs);
    this.value = Array.isArray(value) ? (value.slice() as T) : value;
    this.valueRatio = changeRate;

    if (this._state === 'aborted') {
      return;
    } else if (this._abort(value, this.valueRatio, this.durationRatio)) {
      this._state = 'aborted';
      this.unregister();
    } else if (durationMs >= this.duration) {
      const endValue = this.endValue;
      this.durationRatio = this.valueRatio = 1;
      this._onChange(
        (Array.isArray(endValue) ? endValue.slice() : endValue) as T,
        this.valueRatio,
        this.durationRatio
      );
      this._state = 'completed';
      this._onComplete(endValue, this.valueRatio, this.durationRatio);
      this.unregister();
    } else {
      this._onChange(value, this.valueRatio, this.durationRatio);
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
