import { defineProperty as _defineProperty } from '../../../_virtual/_rollupPluginBabelHelpers.mjs';
import { noop } from '../../constants.mjs';
import { requestAnimFrame } from './AnimationFrameProvider.mjs';
import { runningAnimations } from './AnimationRegistry.mjs';
import { defaultEasing } from './easing.mjs';

const defaultAbort = () => false;
class AnimationBase {
  /**
   * Current value
   */

  /**
   * Animation start time ms
   */

  constructor(_ref) {
    let {
      startValue,
      byValue,
      duration = 500,
      delay = 0,
      easing = defaultEasing,
      onStart = noop,
      onChange = noop,
      onComplete = noop,
      abort = defaultAbort,
      target
    } = _ref;
    /**
     * Used to register the animation to a target object
     * so that it can be cancelled within the object context
     */
    _defineProperty(this, "_state", 'pending');
    /**
     * Time %, or the ratio of `timeElapsed / duration`
     * @see tick
     */
    _defineProperty(this, "durationProgress", 0);
    /**
     * Value %, or the ratio of `(currentValue - startValue) / (endValue - startValue)`
     */
    _defineProperty(this, "valueProgress", 0);
    this.tick = this.tick.bind(this);
    this.duration = duration;
    this.delay = delay;
    this.easing = easing;
    this._onStart = onStart;
    this._onChange = onChange;
    this._onComplete = onComplete;
    this._abort = abort;
    this.target = target;
    this.startValue = startValue;
    this.byValue = byValue;
    this.value = this.startValue;
    this.endValue = Object.freeze(this.calculate(this.duration).value);
  }
  get state() {
    return this._state;
  }
  isDone() {
    return this._state === 'aborted' || this._state === 'completed';
  }

  /**
   * Calculate the current value based on the easing parameters
   * @param timeElapsed in ms
   * @protected
   */

  start() {
    const firstTick = timestamp => {
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
  tick(t) {
    const durationMs = (t || +new Date()) - this.startTime;
    const boundDurationMs = Math.min(durationMs, this.duration);
    this.durationProgress = boundDurationMs / this.duration;
    const {
      value,
      valueProgress
    } = this.calculate(boundDurationMs);
    this.value = Object.freeze(value);
    this.valueProgress = valueProgress;
    if (this._state === 'aborted') {
      return;
    } else if (this._abort(this.value, this.valueProgress, this.durationProgress)) {
      this._state = 'aborted';
      this.unregister();
    } else if (durationMs >= this.duration) {
      this.durationProgress = this.valueProgress = 1;
      this._onChange(this.endValue, this.valueProgress, this.durationProgress);
      this._state = 'completed';
      this._onComplete(this.endValue, this.valueProgress, this.durationProgress);
      this.unregister();
    } else {
      this._onChange(this.value, this.valueProgress, this.durationProgress);
      requestAnimFrame(this.tick);
    }
  }
  register() {
    runningAnimations.push(this);
  }
  unregister() {
    runningAnimations.remove(this);
  }
  abort() {
    this._state = 'aborted';
    this.unregister();
  }
}

export { AnimationBase };
//# sourceMappingURL=AnimationBase.mjs.map
