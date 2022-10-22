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

  protected abstract calculate(currentTime: number): {
    value: T;
    changeRate: number;
  };

  start() {
    const firstTick: FrameRequestCallback = (timestamp) => {
      this.startTime = timestamp;
      this.state = 'running';
      this._onStart();
      this.tick(timestamp);
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
    runningAnimations.push(this);
  }

  private unregister() {
    runningAnimations.remove(this);
  }

  abort() {
    this.state = 'aborted';
    this.unregister();
  }
}
