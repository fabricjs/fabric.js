import { getEnv } from '../../env';

let _requestAnimFrame: AnimationFrameProvider['requestAnimationFrame'];
let _cancelAnimFrame: AnimationFrameProvider['cancelAnimationFrame'];

/**
 * requestAnimationFrame polyfill based on http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * In order to get a precise start time, `requestAnimFrame` should be called as an entry into the method
 * @param {Function} callback Callback to invoke
 */
export function requestAnimFrame(callback: FrameRequestCallback): number {
  if (!_requestAnimFrame) {
    _requestAnimFrame =
      getEnv().window.requestAnimationFrame ||
      function requestAnimationFramePolyfill(callback: FrameRequestCallback) {
        return getEnv().window.setTimeout(callback, 1000 / 60);
      };
  }
  return _requestAnimFrame.call(getEnv().window, callback);
}

export function cancelAnimFrame(handle: number): void {
  if (!_cancelAnimFrame) {
    _cancelAnimFrame =
      getEnv().window.cancelAnimationFrame || getEnv().window.clearTimeout;
  }
  return _cancelAnimFrame.call(getEnv().window, handle);
}
