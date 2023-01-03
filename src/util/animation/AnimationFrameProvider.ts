import { getEnv } from '../../env';

const _requestAnimFrame: AnimationFrameProvider['requestAnimationFrame'] =
  getEnv().window.requestAnimationFrame ||
  function (callback: FrameRequestCallback) {
    return getEnv().window.setTimeout(callback, 1000 / 60);
  };

const _cancelAnimFrame: AnimationFrameProvider['cancelAnimationFrame'] =
  getEnv().window.cancelAnimationFrame || getEnv().window.clearTimeout;

/**
 * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
 * @param {Function} callback Callback to invoke
 */
export function requestAnimFrame(callback: FrameRequestCallback): number {
  return _requestAnimFrame.call(getEnv().window, callback);
}

export function cancelAnimFrame(handle: number): void {
  return _cancelAnimFrame.call(getEnv().window, handle);
}
